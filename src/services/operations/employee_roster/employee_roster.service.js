const httpStatus = require("http-status");
const { EmployeeRosterModel, EmployeeRosterDetailModel, EmployeeProfileModel, Employee_ShiftModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts, getDateDiffInDays, addDaysInDate, handleNestedData } = require("../../../utils/common");
const pick = require("../../../utils/pick");

const Op = Sequelize.Op;

//Attributes required for Employee Roster Table view
const employeeRosterAttributes = [
  'employeeId',
  'from',
  'to',
  'shiftId',
  'Id',
  'isActive',
]

/**
 * Create Employee Roster
 * 
 * @param {Object} req 
 * @returns 
 */
const createEmployeeRoster = async (req) => {
  const body = req.body;
  const { list, ...rest } = body;
  const employeeIds = Array.from(new Set(list.map((el) => el.employeeId))); //Get All Employee Ids Uniqued

  const oldRecord = await getemployeeRosterData(
    {
      employeeId: employeeIds,
      isActive: true,
      [Sequelize.Op.or]: [
        {
          from: { [Sequelize.Op.between]: [rest.from, rest.to] }
        },
        {
          to: { [Sequelize.Op.between]: [rest.from, rest.to] }
        },
        {
          from: { [Sequelize.Op.lte]: rest.from },
          to: { [Sequelize.Op.gte]: rest.to }
        }
      ]
    },
    null,
    [{ model: EmployeeProfileModel, attributes: ['firstName'] }, { model: Employee_ShiftModel, attributes: ['name'] }]
  )
  if (oldRecord?.length) {
    const names = Array.from(new Set(oldRecord.map((el) => el.t_employee_profile.firstName)))
    let message = `${names.join(', ')} already have shift assigned within this range`
    throw new ApiError(httpStatus.FORBIDDEN, message);
  }
  const employeeRecords = await EmployeeProfileModel.findAll({
    where: {
      Id: employeeIds,
      dateOfJoining: { [Sequelize.Op.gt]: rest.from }
    },
    attributes: ['dateOfJoining', 'Id']
  })

  employeeIds.forEach(async (empId) => {
    const newEmployee = employeeRecords.find(rec => rec.Id == empId);
    if (!newEmployee || new Date(newEmployee.dateOfJoining).getTime() < new Date(rest.to).getTime()) {
      const payload = {
        ...rest,
        employeeId: empId,
        createdBy: req.user.id,
        from: newEmployee?.dateOfJoining ? new Date(newEmployee.dateOfJoining) : rest.from
      }
      const rosterData = await EmployeeRosterModel.create(payload);
      if (rosterData) {
        const noOfRecords = getDateDiffInDays(rosterData.from, rosterData.to);
        const detailData = [];
        for (let i = 0; i < noOfRecords; i++) {
          detailData.push({
            rosterId: rosterData.Id,
            shiftId: rosterData.shiftId,
            date: addDaysInDate(rosterData.from, i),
            createdBy: req.user.id
          })
        }
        await EmployeeRosterDetailModel.bulkCreate(detailData);
      }
    }
  });

  return []
};


/**
 * 
 * Get All Employee Rosters with Pagination
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllEmployeeRoster = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;

  const { count, rows } = await EmployeeRosterModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      isActive: true
    },
    include: [{ model: EmployeeProfileModel, attributes: ['firstName'] }, { model: Employee_ShiftModel, attributes: ['name'] }],
    attributes: employeeRosterAttributes,
    offset: offset,
    limit: limit,
  });
  const updatedRows = handleNestedData(rows);
  //Send paginated data
  return paginationFacts(count, limit, options.pageNumber, updatedRows);
};


/**
 * Get Single Employee Roster By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getEmployeeRosterById = async (id, options = null) => {
  const rosterData = await getemployeeRosterData({ Id: id, isActive: true }, employeeRosterAttributes)
  if (!rosterData || !rosterData.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  const payload = {
    from: rosterData[0].from,
    to: rosterData[0].to,
    shiftId: rosterData[0].shiftId,
    Id: rosterData[0].Id,
    list: [{ employeeId: rosterData[0].employeeId }]
  }

  return payload
};


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
 * @param {Boolean} handleNested  If include is there then set key of child tables in parent record
 * @returns 
 */
const getemployeeRosterData = async (filters, attributes = null, include = null, handleNested = false) => {
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
    const data = await EmployeeRosterModel.findOne(options);
    return handleNestedData(data)
  }

  return await EmployeeRosterModel.findAll(options);
};


/**
 * Update Single Employee Roster By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateEmployeeRosterById = async (body, updatedBy) => {
  const oldRecord = await getemployeeRosterData({ Id: body.Id, isActive: true })
  if (!oldRecord || !oldRecord.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  body.updatedBy = updatedBy;
  Object.assign(oldRecord[0], body);
  const updatedData = await oldRecord[0].save({ fields: ['shiftId', 'updatedBy'] });
  await EmployeeRosterDetailModel.update({ shiftId: body.shiftId, updatedBy: body.updatedBy }, {
    where: {
      rosterId: oldRecord[0].Id
    }
  })
  const data = await getemployeeRosterData({ Id: updatedData.Id }, employeeRosterAttributes, [{ model: EmployeeProfileModel, attributes: ['firstName'] }, { model: Employee_ShiftModel, attributes: ['name'] }], true)
  return data;
};

/**
 * Delete Single Employee Roster Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteEmployeeRosterById = async (id) => {
  const oldRecord = await getemployeeRosterData({ Id: id, isActive: true })
  if (!oldRecord || !oldRecord.length) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  Object.assign(oldRecord[0], { isActive: false })
  await oldRecord[0].save({ fields: ['isActive'] });

  await EmployeeRosterDetailModel.update({ isActive: false }, {
    where: {
      rosterId: oldRecord[0].Id
    }
  })
  return oldRecord[0];
};

module.exports = {
  getAllEmployeeRoster,
  getEmployeeRosterById,
  updateEmployeeRosterById,
  deleteEmployeeRosterById,
  createEmployeeRoster
};
