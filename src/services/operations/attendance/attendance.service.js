const httpStatus = require("http-status");
const { AttendanceModel, EmployeeProfileModel, CompanyModel, SubsidiaryModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const sequelize = require("../../../config/db");
const { paginationFacts, handleNestedData, getDateDiffInDays, formatDates } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { startOfDay, endOfDay } = require("date-fns");

const Op = Sequelize.Op;

//Attributes required for Attendance Table view
const attendanceAttributes = [
  'employeeId',
  'comments',
  'attDate',
  'attDateIn',
  'attDateOut',
  'timeIn',
  'timeOut',
  'Id',
  'isActive',
  'shiftCode',
  'interShifGap',
  'shiftStartTime',
  'shiftEndTime',
  'shiftWorkingHours',
  'shiftLateIn',
  'shiftEarlyOut',
  'shiftHalfDayStart',
  'shiftHalfDayEnd',
  'isOverTime',
  'isIncludeInterShifGap',
  'lateInHours',
  'overtimeStart',
  'oT',
  'approvedOT'
]

/**
 * Create Attendance
 * 
 * @param {Object} req 
 * @returns 
 */
const createAttendance = async (req) => {
  const body = req.body;
  const oldRecord = await getattendanceData({ employeeId: body.employeeId, attDate: body.attDateIn, isActive: true })
  if (oldRecord) {
    throw new ApiError(httpStatus.CONFLICT, 'Record Already Exists for this date')
  }
  const employeeData = await EmployeeProfileModel.findByPk(body.employeeId, { attributes: ['employeeCode', 'subsidiaryId', 'dateOfJoining', 'Id'] });
  if (!employeeData) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Employee Not Found')
  }
  if (employeeData.dateOfJoining) {
    const diffInDays = getDateDiffInDays(startOfDay(new Date(employeeData.dateOfJoining)), startOfDay(new Date(body.attDateIn)))
    if (diffInDays < 1) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Employee's Joining date is ${formatDates(employeeData.dateOfJoining)}. Cannot set attendance before that`)
    }
  }
  const subsidiaryData = await SubsidiaryModel.findByPk(employeeData.subsidiaryId, {
    attributes: [],
    include: [
      {
        model: CompanyModel,
        attributes: ['Id']
      }
    ]
  });

  const payload = {
    ...body,
    attDateIn: formatDates(body.attDateIn, 'yyyy-MM-dd'),
    attDateOut: formatDates(body.attDateOut, 'yyyy-MM-dd'),
    createdBy: req.user.id,
    subsidiaryId: employeeData.subsidiaryId,
    employeeCode: employeeData.employeeCode,
    attDate: formatDates(body.attDateIn, 'yyyy-MM-dd'),
    companyId: subsidiaryData?.t_company?.Id
  };
  const createdData = await AttendanceModel.create(payload);

  try {
    await sequelize.query('CALL SP_SmartlyProceedAttendance(:p_CompanyId ,:p_SubsidiaryId ,:p_M_EmpId ,:p_FromDate ,:p_ToDate,:p_isSpecial)', {
      replacements: {
        p_CompanyId: payload.companyId,
        p_SubsidiaryId: payload.subsidiaryId,
        p_M_EmpId: payload.employeeId,
        p_FromDate: payload.attDateIn,
        p_ToDate: payload.attDateOut,
        p_isSpecial: 0,
      },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Some Error Occcured.')
  }
  const data = await getAttendanceById(createdData.Id, attendanceAttributes)
  return data;
};


/**
 * 
 * Get All Attendances with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllattendance = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const filter = req?.body?.filter || {};
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;

  //Prepare Employee Table Filters if any
  const employeeFilter = {};

  if (filter.subsidiaryId) employeeFilter.subsidiaryId = filter.subsidiaryId;
  if (filter.departmentId) employeeFilter.departmentId = filter.departmentId;
  if (filter.reportTo) employeeFilter.reportTo = filter.reportTo;
  if (filter.gradeId) employeeFilter.gradeId = filter.gradeId;
  if (filter.designationId) employeeFilter.designationId = filter.designationId;
  if (filter.locationId) employeeFilter.locationId = filter.locationId;
  if (filter.attendanceType) employeeFilter.attendanceType = filter.attendanceType;
  if (filter.employeeId) employeeFilter.Id = filter.employeeId;

  //Prepare Attendance Table Filters if any
  let attendanceFilter = {};

  if (filter.from) {
    if (filter.to) {
      const startOfDayDate = startOfDay(new Date(filter.from));
      const endOfDayDate = endOfDay(new Date(filter.to));
      attendanceFilter = {
        attDateIn: {
          [Op.between]: [startOfDayDate, endOfDayDate],  // Filters between start and end of the day
        }
      }
    }
  }

  //If no filter is present then send back response with no data
  if (!Object.keys(employeeFilter).length && !Object.keys(attendanceFilter).length) {
    return paginationFacts(0, limit, options.pageNumber, []);
  }


  //Get data according to filters
  const { count, rows } = await AttendanceModel.findAndCountAll({
    order: [
      ['attDateIn', 'ASC']
    ],
    where: {
      ...attendanceFilter,
      isActive: true
    },
    include: [
      {
        model: EmployeeProfileModel,
        where: employeeFilter,
        required: true,
        attributes: [[Sequelize.literal(`CONCAT(firstName, ' ', lastName)`), 'fullName'],]
      }
    ],
    attributes: [
      'employeeCode',
      'attDateIn',
      [
        Sequelize.literal(`DATE_FORMAT(attDateIn, '%e-%b-%Y')`),
        'formattedDateIn',
      ],
      [
        Sequelize.literal(`DATE_FORMAT(attDateOut, '%e-%b-%Y')`),
        'formattedDateOut',
      ],
      'timeIn',
      'timeOut',
      'comments'
    ],
    offset: offset,
    limit: limit,
  });

  //Handle nested data that comes with include
  const updatedRows = handleNestedData(rows)

  //Send paginated data
  return paginationFacts(count, limit, options.pageNumber, updatedRows);

};


/**
 * Get Single Attendance By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getAttendanceById = async (id, options = null) => {
  return AttendanceModel.findByPk(id, {
    attributes: options || attendanceAttributes,
  });
};

const getattendanceByFilters = async (req) => {
  const body = req.body;
  const startOfDayDate = startOfDay(new Date(body.attDateIn));
  const endOfDayDate = endOfDay(new Date(body.attDateIn));
  return await getattendanceData({
    employeeId: body.employeeId,
    attDateIn: {
      [Op.between]: [startOfDayDate, endOfDayDate],  // Filters between start and end of the day
    },
  }, attendanceAttributes) || { ...body, attDateOut: body.attDateIn }
}


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
 * @returns 
 */
const getattendanceData = async (filters, attributes = null, include = null) => {
  const options = {};
  if (filters) {
    options.where = filters
  }
  if (attributes) {
    options.attributes = attributes
  }
  if (include) {
    options.include = include
  }

  return await AttendanceModel.findOne(options);
};


/**
 * Update Single Attendance By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateAttendanceById = async (body, updatedBy) => {
  const oldRecordWithId = await getattendanceData({ employeeId: body.employeeId, attDate: body.attDateIn, isActive: true, Id: { [Op.ne]: body.Id } });
  if (oldRecordWithId) {
    throw new ApiError(httpStatus.CONFLICT, 'Record already exists for this Date')
  }
  const oldRecord = await getattendanceData({ Id: body.Id })
  body.updatedBy = updatedBy;
  body.attDateIn = formatDates(body.attDateIn, 'yyyy-MM-dd');
  body.attDateOut = formatDates(body.attDateOut, 'yyyy-MM-dd');
  body.attDate = body.attDateIn;
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save({ fields: ['comments', 'attDate', 'attDateIn', 'attDateOut', 'timeIn', 'timeOut', 'updatedBy'] });

  try {
    await sequelize.query('CALL SP_SmartlyProceedAttendance(:p_CompanyId ,:p_SubsidiaryId ,:p_M_EmpId ,:p_FromDate ,:p_ToDate,:p_isSpecial)', {
      replacements: {
        p_CompanyId: oldRecord.companyId,
        p_SubsidiaryId: oldRecord.subsidiaryId,
        p_M_EmpId: body.employeeId,
        p_FromDate: body.attDateIn,
        p_ToDate: body.attDateOut,
        p_isSpecial: 0,
      },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Some Error Occcured.')
  }

  const data = await getAttendanceById(updatedData.Id, attendanceAttributes)
  return data;
};

/**
 * Delete Single Attendance Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteAttendanceById = async (id) => {
  const oldRecord = await getattendanceData({ Id: id, isActive: true });
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  Object.assign(oldRecord, { isActive: false });
  await oldRecord.save({ fields: ['isActive'] });
  return oldRecord;
};


/**
 * 
 * Process All Attendances
 * 
 * @param {Object} req 
 * @returns 
 */
const processAllAttendance = async (req) => {
  const filter = req?.body || {};

  if (!filter.from || !filter.to) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Please provide date range");
  }

  //Prepare Employee Table Filters if any
  const employeeFilter = {};

  if (filter.subsidiaryId) employeeFilter.subsidiaryId = filter.subsidiaryId;
  if (filter.departmentId) employeeFilter.departmentId = filter.departmentId;
  if (filter.reportTo) employeeFilter.reportTo = filter.reportTo;
  if (filter.gradeId) employeeFilter.gradeId = filter.gradeId;
  if (filter.designationId) employeeFilter.designationId = filter.designationId;
  if (filter.locationId) employeeFilter.locationId = filter.locationId;
  if (filter.attendanceType) employeeFilter.attendanceType = filter.attendanceType;
  if (filter.employeeId) employeeFilter.Id = filter.employeeId;

  const employeeData = await EmployeeProfileModel.findAll({
    where: employeeFilter,
    attributes: ['Id'],
    include: [
      {
        model: SubsidiaryModel,
        attributes: ['Id'],
        include: [
          {
            model: CompanyModel,
            attributes: ['Id']
          }
        ]
      }
    ]
  })

  for (const emp of employeeData) {
    if (emp?.t_subsidiary?.t_company) {
      try {
        await sequelize.query('CALL SP_SmartlyProceedAttendance(:p_CompanyId ,:p_SubsidiaryId ,:p_M_EmpId ,:p_FromDate ,:p_ToDate,:p_isSpecial)', {
          replacements: {
            p_CompanyId: emp.t_subsidiary.t_company.Id,
            p_SubsidiaryId: emp.t_subsidiary.Id,
            p_M_EmpId: emp.Id,
            p_FromDate: formatDates(filter.from, 'yyyy-MM-dd'),
            p_ToDate: formatDates(filter.to, 'yyyy-MM-dd'),
            p_isSpecial: 0,
          },
          type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
        });
      } catch (error) {
        console.log(`'::init::${emp.Id}::'`, error);
      }
    }
  }

  return {};
};

module.exports = {
  getAllattendance,
  getAttendanceById,
  updateAttendanceById,
  deleteAttendanceById,
  createAttendance,
  getattendanceByFilters,
  processAllAttendance
};
