const httpStatus = require("http-status");
const axios = require("axios")
const  AttendanceConfigurationModel  = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns')
const pick = require("../../../utils/pick");
const { LEAVE_TYPE, FORBIDDEN_CODES } = require("../../../models/operations/leave_type/enum/leave_type.enum");

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} AttendanceConfigurationBody
 * @returns {Promise<AttendanceConfiguration>}
 */
const createAttendanceConfiguration = async (req) => {

  req.body.createdBy = req.user.id;
  const addedAttendanceConfigurationObj = await AttendanceConfigurationModel.Attendance_ConfigurationModel.create(req.body);
  return addedAttendanceConfigurationObj;
};



/**
 * Query for Items
 * @param {Object} filter -  Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryAttendanceConfigurations = async (req) => {
  const options = pick(req.body, ['sortOrder', 'pageSize', 'pageNumber']);
  const searchQuery = req?.body?.filter?.searchQuery?.toLowerCase() || '';  //Get search field value for filtering
  const limit = options.pageSize;
  const offset = 0 + (options.pageNumber - 1) * limit;
  const queryFilters = [
    { Name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('subs.name')), 'LIKE', '%' + searchQuery + '%') },
  ]


  const { count, rows } = await AttendanceConfigurationModel.Attendance_ConfigurationModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    
    include: [
      {
        model: AttendanceConfigurationModel.LeaveTypeModel,
        attributes: ["Id", ["name","leaveTypeName"],"type"],
        as: "leavetype",
      },
      {
        where: {
          [Op.or]: queryFilters,
        
          // isActive: true
        },
        model: AttendanceConfigurationModel.SubsidiaryModel,
        attributes: ["Id", ["name","subsName"]],
        as: "subs"
      }
    ],
    
    offset: offset,
    limit: limit,
  });

  
  return paginationFacts(count, limit, options.pageNumber, rows);
  
};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getAttendanceConfigurationById = async (id) => {
  return AttendanceConfigurationModel.Attendance_ConfigurationModel.findByPk(id,{


    include: [
      {
        model: AttendanceConfigurationModel.LeaveTypeModel,
        attributes: ["Id", ["name","leaveTypeName"],"type"],
        as: "leavetype",
      },
      {
       
        model: AttendanceConfigurationModel.SubsidiaryModel,
        attributes: ["Id", ["name","subsName"]],
        as: "subs"
      }
    ],
  });
 
};


const getAttConfigData = async (filters, attributes = null, include = null) => {
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

  return await AttendanceConfigurationModel.Attendance_ConfigurationModel.findOne(options);
};


/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateAttendanceConfigurationById = async (body, updatedBy) => {
  console.log(":ss1",body);
  let oldRecord = await getAttConfigData({ subsidiaryId: body.subsidiaryId });
  if (oldRecord && oldRecord.Id != body.Id) {
    throw new ApiError(httpStatus.FORBIDDEN, `subsidiary already in use ${body.subs.subsName}. Please use another subsidiary`);
  }
  else {
    oldRecord = await getAttendanceConfigurationById(body.Id)
  }
  body.updatedBy = updatedBy;
  
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save();
  console.log(":ss:",updatedData);
  const data = await getAttendanceConfigurationById(updatedData.Id)
  return data;
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */
  const deleteAttendanceConfigurationById = async (Id) => {

  const Item = await getAttendanceConfigurationById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



module.exports = {
  createAttendanceConfiguration,
  queryAttendanceConfigurations,
  getAttendanceConfigurationById,
  updateAttendanceConfigurationById,
  deleteAttendanceConfigurationById
};
