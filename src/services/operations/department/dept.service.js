const httpStatus = require("http-status");
const axios = require("axios")
const {DeptModel,DepartmentSetupAccessModel} = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns')

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} DeptBody
 * @returns {Promise<Bank>}
 */
const createDept = async (req, DeptBody) => {
 
  // DeptBody.slug = DeptBody.name.replace(/ /g, "-").toLowerCase();

  DeptBody.createdBy = req.user.Id;
  DeptBody.companyId=req.user.companyId;

  //DeptBody.parentDept = 1;

  if (DeptBody.parentDept == '') { DeptBody.parentDept = null }

  // const addedDeptObj = await DeptModel.DeptModel.create(DeptBody);
  //authSMSSend(addedDeptObj.dataValues);  // Quick send message at the time of donation


  DeptBody.deptName=DeptBody.deptName.trimStart();
  const addedDeptObj = await DeptModel.create(DeptBody);
  //authSMSSend(addedDeptObj.dataValues);  // Quick send message at the time of donation
 
  if (addedDeptObj) {
      for (const subId of addedDeptObj.subsidiaryId) {
        await DepartmentSetupAccessModel.create({
          DepartmentSetupId: addedDeptObj.deptId,
          subsidiaryId: subId,
        })
      }
    }
  return addedDeptObj;
  
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
const queryDept = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [

    { deptName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('deptName')), 'LIKE', '%' + searchQuery + '%') },
    { deptCode: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('deptCode')), 'LIKE', '%' + searchQuery + '%') },
    

  ]


  const { count, rows } = await DeptModel.findAndCountAll({
    order: [
      ['createdAt', 'ASC']
    ],

    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    offset: offset,
    limit: limit,
  });


  return paginationFacts(count, limit, options.pageNumber, rows);
  // return Items;
};

const queryParentDept = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [

    { parentDept: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('parentDept')), '=', '%' + null + '%') },
    

  ]


  const { count, rows } = await DeptModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    offset: offset,
    limit: limit,
  });


  return paginationFacts(count, limit, options.pageNumber, rows);
  // return Items;
};
/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getDeptById = async (id) => {
  return DeptModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} deptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */


const updateDeptById = async (deptId, updateBody, updatedBy) => {
 
  try {


    const Item = await getDeptById(deptId);

    if (!Item) {
      throw new ApiError(httpStatus.NOT_FOUND, "record not found");
    }

    updateBody.updatedBy = updatedBy;
    delete updateBody.deptId;
    Object.assign(Item, updateBody);

    updatedData= await Item.save();
    if (updatedData) {
    
      // const recordExists = await DepartmentSetupAccessModel.count({
      //   where: { DepartmentSetupId: updatedData.deptId }
      // });
      // if(recordExists.length>0){
        await DepartmentSetupAccessModel.destroy({ where: { DepartmentSetupId: updatedData.deptId } })
      // }
   
      for (const subId of updatedData.subsidiaryId) {
        await DepartmentSetupAccessModel.create({
          DepartmentSetupId: updatedData.deptId,
          subsidiaryId: subId,
        
        })
      }
    }
  } catch (error) {
  
    if (error?.errno === 1062) {
      throw new ApiError(httpStatus.NOT_FOUND, "Duplicate entry not allowed!");
    }
    else {

      throw error;
    }
  }
  return;
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */
const deleteDeptById = async (Id) => {
  const Item = await getDeptById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};



const sp_GetAllDepartments = async (filter, options, searchQuery,req) => {
  try {
   console.log("req.user111",req.user.companyId)
    // const results = await sequelize.query('CALL usp_GetAllDepartments()', {

    //   type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    // });

   const results = await sequelize.query(
      'CALL usp_GetAllDepartments(:p_CompanyId)', {
      replacements: {
        p_CompanyId:req.user?.companyId || null,
     
      },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    let limit = options.pageSize;
    let offset = 0 + (options.pageNumber - 1) * limit;
    searchQuery = searchQuery;
    let searchlist = filterByValue(results, searchQuery);

    let count = searchlist.length;
    const rows = searchlist.slice(offset, offset + limit)
    return paginationFacts(count, limit, options.pageNumber, rows); // 
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};

function filterByValue(array, string) {

  if (!string) {
    return array;
  }
  return array.filter(o => Object.keys(o).some(k => {
    return o['Department'].toLowerCase().includes(string.toLowerCase()) ||
     o['deptCode'].toLowerCase().includes(string.toLowerCase())
    || o['ParentDeptName'] == null ? o['Department'].toLowerCase().includes(string.toLowerCase()) :  o['ParentDeptName'].toLowerCase().includes(string.toLowerCase())
    
  }
  )
  );
} 



module.exports = {
  createDept,
  queryDept,
  getDeptById,
  updateDeptById,
  deleteDeptById,
  queryParentDept,
  sp_GetAllDepartments
};
