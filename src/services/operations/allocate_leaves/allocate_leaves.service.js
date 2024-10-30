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
  return { ...rest, list: data };
};

/**
 * 
 * Get Allocated Leave Data By Filters
 * 
 * @param {Object} req 
 * @returns 
 */
const getAllAllocateLeaves = async (req) => {
  const body = req.body;
  const data = await getallocateLeavesData({ ...body }, allocateLeavesAttributes);
  return { ...body, list: data };
}


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
 * 
 * Get Policy Type Dropdown Data
 * 
 * @returns 
 */
const getDropdownData = () => {
  return Object.keys(POLICY_TYPE).map((type) => {
    return { label: POLICY_TYPE[type], value: Number(type) }
  })
}

module.exports = {
  createallocateLeaves,
  getAllAllocateLeaves,
  getDropdownData
};
