const httpStatus = require("http-status");
const { LeaveApplicationModel, LeaveApplicationDetailModel, EmployeeProfileModel, LeaveTypeModel, LeaveTypePoliciesModel, LeaveManagementConfigurationModel, EmployeeLeaveBalanceModel, FiscalSetupModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, formatDates, addDaysInDate, getDateDiffInDays, handleNestedData } = require("../../../utils/common");
const pick = require("../../../utils/pick");

const Op = Sequelize.Op;

//Attributes required for Leave Application Table view
const leaveApplicationAttributes = [
  'from',
  'to',
  'remarks',
  'leaveType',
  'file',
  'days',
  'Id',
  'isActive'
]

/**
 * Create Leave Application
 * 
 * @param {Object} req 
 * @returns 
 */
const createleaveApplication = async (req) => {
  const body = req.body;
  const employeeData = await EmployeeProfileModel.findByPk(body.employeeId,
    {
      attributes: ['Id', 'employeeTypeId', 'subsidiaryId', 'gradeId', 'gender', 'maritalStatus'],
      include: [
        {
          model: EmployeeLeaveBalanceModel,
          where: {
            leaveType: body.leaveType
          },
          required: false,
          include: [
            {
              model: FiscalSetupModel,
              required: true,    // Ensures LeaveBalance is only included if FiscalSetup with isActive: true exists
              where: {
                isActive: true,
              },
            },
          ],
        }
      ]
    }
  )
  if (!employeeData) {
    throw new ApiError(httpStatus.NOT_FOUND, `No User Found`);
  }
  if (!employeeData.t_employee_leave_balances?.length || (employeeData.t_employee_leave_balances[0].remainingCount < getDateDiffInDays(body.from, body.to))) {
    throw new ApiError(httpStatus.FORBIDDEN, `Remaining Leaves not enough`);
  }
  const oldRecord = await getleaveApplicationData(
    {
      employeeId: body.employeeId,
      isActive: true,
      [Sequelize.Op.or]: [
        {
          from: { [Sequelize.Op.between]: [body.from, body.to] }
        },
        {
          to: { [Sequelize.Op.between]: [body.from, body.to] }
        },
        {
          from: { [Sequelize.Op.lte]: body.from },
          to: { [Sequelize.Op.gte]: body.to }
        }
      ]
    }
  )
  if (oldRecord) {
    throw new ApiError(httpStatus.CONFLICT, `Already have leave present for following dates ${formatDates(oldRecord.from)} - ${formatDates(oldRecord.to)}`);
  }
  if (!body.file) {
    const isFileRequired = await checkAttachmentRequired(employeeData, body)
    if (isFileRequired) {
      throw new ApiError(httpStatus.BAD_REQUEST, `Attachment is required for this Leave type`);
    }
  }
  const payload = {
    ...body,
    createdBy: req.user.id,
    // companyId: 1,
    days: getDateDiffInDays(body.from, body.to)
    // subsidiaryId: employeeData.subsidiaryId,
  };
  const createdData = await LeaveApplicationModel.create(payload);
  if (createdData) {
    const numberOfRecords = createdData.days;
    const detailData = [];
    for (let i = 0; i < numberOfRecords; i++) {
      detailData.push({
        applicationId: createdData.Id,
        date: addDaysInDate(createdData.from, i),
        createdBy: req.user.id
      })
    }

    await LeaveApplicationDetailModel.bulkCreate(detailData)
    employeeData.t_employee_leave_balances[0].availedCount += createdData.days;
    employeeData.t_employee_leave_balances[0].remainingCount -= createdData.days;

    employeeData.t_employee_leave_balances[0].save();
  }
  return await getleaveApplicationData({ Id: createdData.Id }, leaveApplicationAttributes, [{ model: LeaveTypeModel, attributes: ['name'] }], true);
};


/**
 * 
 * Get All Leave Applications with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllleaveApplication = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber', 'employeeId']);
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;
  const { count, rows } = await LeaveApplicationModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      employeeId: options.employeeId,
      isActive: true
    },
    include: [{ model: LeaveTypeModel, attributes: ['name'] }],
    attributes: leaveApplicationAttributes,
    offset: offset,
    limit: limit,
  });

  const updatedRows = handleNestedData(rows);
  //Send paginated data
  return paginationFacts(count, limit, options.pageNumber, updatedRows);
};


/**
 * Get Single Leave Application By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getleaveApplicationById = async (id, attributes = null) => {
  return LeaveApplicationModel.findByPk(id, {
    attributes: attributes || leaveApplicationAttributes,
  });
};


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
 * @returns 
 */
const getleaveApplicationData = async (filters, attributes = null, include = null, handleNested = false) => {
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

  if (handleNested) {
    const data = await LeaveApplicationModel.findOne(options);
    return handleNestedData(data)
  }
  return await LeaveApplicationModel.findOne(options);
};


/**
 * Update Single Leave Application By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateleaveApplicationById = async (body, updatedBy) => {
  const oldRecord = await getleaveApplicationById(body.Id)
  body.updatedBy = updatedBy;
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save({ fields: ['remarks', 'file'] });
  return getleaveApplicationData({ Id: updatedData.Id }, leaveApplicationAttributes, [{ model: LeaveTypeModel, attributes: ['name'] }], true);;
};

/**
 * Delete Single Leave Application Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteleaveApplicationById = async (id) => {
  const oldRecord = await getleaveApplicationById(id, ['Id', 'employeeId', 'leaveType', 'days']);
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  Object.assign(oldRecord, { isActive: false })
  await oldRecord.save({ fields: ['isActive'] });
  await LeaveApplicationDetailModel.update({ isActive: false }, {
    where: {
      applicationId: oldRecord.Id
    }
  })

  const leaveBalance = await EmployeeLeaveBalanceModel.findOne({
    where: {
      employeeId: oldRecord.employeeId,
      leaveType: oldRecord.leaveType,
    },
    include: [
      {
        model: FiscalSetupModel,
        required: true,    // Ensures LeaveBalance is only included if FiscalSetup with isActive: true exists
        where: {
          isActive: true,
        },
        attributes: ['Id']
      },
    ],
  })

  if(leaveBalance && oldRecord.days){
    leaveBalance.availedCount -= oldRecord.days;
    leaveBalance.remainingCount += oldRecord.days;

    leaveBalance.save();
  }


  return oldRecord;
};

const checkAttachmentRequired = async (employeeData, body) => {
  const configurationWithPolicy = await LeaveManagementConfigurationModel.findOne({
    where: {
      employeeTypeId: employeeData.employeeTypeId,
      subsidiaryId: employeeData.subsidiaryId,
      gradeId: employeeData.gradeId,
    },
    include: [
      {
        model: LeaveTypePoliciesModel,
        where: {
          leaveType: body.leaveType,
          [Op.and]: [
            {
              [Op.or]: [
                { gender: employeeData.gender },
                { gender: null }
              ]
            },
            {
              [Op.or]: [
                { maritalStatus: employeeData.maritalStatus },
                { maritalStatus: null }
              ]
            }
          ]
        },
        attributes: ['attachmentRequired'],
        required: false,
      },
    ],
  });

  if (configurationWithPolicy?.t_leave_type_policies?.[0]?.attachmentRequired != null) {
    return configurationWithPolicy?.t_leave_type_policies?.[0]?.attachmentRequired;
  }
  return false;
}

module.exports = {
  getAllleaveApplication,
  getleaveApplicationById,
  updateleaveApplicationById,
  deleteleaveApplicationById,
  createleaveApplication
};
