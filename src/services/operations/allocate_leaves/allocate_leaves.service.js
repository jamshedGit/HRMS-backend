const httpStatus = require("http-status");
const { AllocateLeavesModel } = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const pick = require("../../../utils/pick");
const { POLICY_TYPE } = require("../../../models/operations/allocate_leaves/enum/allocate_leaves.enum");

const Op = Sequelize.Op;

//Attributes required for Allocate Leaves Table view
const allocateLeavesAttributes = [
  'leaveType',
  'leaveCount',
  'policyType',
  'maxCount',
  'Id',
  'isActive',
]

/**
 * Create Allocate Leaves
 * 
 * @param {Object} req 
 * @returns 
 */
const createallocateLeaves = async (req) => {
  const { list, ...rest } = req.body;
  for (let index = 0; index < list.length; index++) {
    const element = list[index];
    if (!element.Id) {
      const payload = {
        ...rest,
        ...element,
        createdBy: req.user.id
      };
      await AllocateLeavesModel.create(payload);
    }

  }
  const data = await getallocateLeavesData({ ...rest }, allocateLeavesAttributes);
  return { list: data };
};

/**
 * 
 * Get Allocated Leave Data By Filters
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllAllocateLeaves = async (req)=> {
  const body = req.body;
  const data = await getallocateLeavesData({ ...body }, allocateLeavesAttributes);
  return data;
}

/**
 * Get Single Allocate Leaves By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const getallocateLeavesById = async (id, options = null) => {
  return AllocateLeavesModel.findByPk(id, {
    attributes: options || allocateLeavesAttributes,
  });
};


/**
 * 
 * @param {Object} filters filtering Options
 * @param {Array} attributes Keys wanted in return (If null then will return all keys)
 * @param {Array} include  Get data of different table with foreign key relation
 * @returns 
 */
const getallocateLeavesData = async (filters, attributes = null, include = null) => {
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

  return await AllocateLeavesModel.findAll(options);
};


/**
 * Update Single Allocate Leaves By Id
 * 
 * @param {Object} body 
 * @param {Number} updatedBy 
 * @returns 
 */
const updateallocateLeavesById = async (body, updatedBy) => {
  if (FORBIDDEN_CODES.includes(body.code)) {
    throw new ApiError(httpStatus.FORBIDDEN, `This code is forbidden ${body.code}. Please use another code`);
  }
  let oldRecord = await getallocateLeavesData({ code: body.code });
  if (oldRecord && oldRecord.Id != body.Id) {
    throw new ApiError(httpStatus.FORBIDDEN, `Code already in use ${body.code}. Please use another code`);
  }
  else {
    oldRecord = await getallocateLeavesById(body.Id)
  }
  body.updatedBy = updatedBy;
  Object.assign(oldRecord, body);
  const updatedData = await oldRecord.save();
  const data = await getallocateLeavesById(updatedData.Id, allocateLeavesAttributes)
  return data;
};

/**
 * Delete Single Allocate Leaves Record By Id
 * 
 * @param {Number} id 
 * @returns 
 */
const deleteallocateLeavesById = async (id) => {
  const oldRecord = await getallocateLeavesById(id);
  if (!oldRecord) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }
  await oldRecord.destroy();
  return oldRecord;
};

/**
 * 
 * Get Policy Type Dropdown Data
 * 
 * @returns 
 */
const getDropdownData = () => {
  return Object.keys(POLICY_TYPE).map((type)=> {
    return {label: POLICY_TYPE[type], value: Number(type)}
  })
}

module.exports = {
  getallocateLeavesById,
  updateallocateLeavesById,
  deleteallocateLeavesById,
  createallocateLeaves,
  getAllAllocateLeaves,
  getDropdownData
};
