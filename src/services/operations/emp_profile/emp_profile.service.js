const httpStatus = require("http-status");
const axios = require("axios")
const Emp_profileModel = require("../../../models/index");
const ApiError = require("../../../utils/ApiError");
const sequelize = require("../../../config/db");
const Sequelize = require('sequelize');
const { paginationFacts, formatDates } = require("../../../utils/common");
const https = require('https');
const { XMLParser, XMLBuilder, XMLValidator } = require("fast-xml-parser");
const fns = require('date-fns');
const { getContactById } = require("../contact/contact.service");

const Op = Sequelize.Op;
/**
 * Create a Item
 * @param {Object} Emp_profileBody
 * @returns {Promise<Bank>}
 */
const createEmp_profile = async (req, Emp_profileBody) => {
  Emp_profileBody.createdBy = req.user.id;

  const checkDateOverlap = (startDate1, endDate1, startDate2, endDate2) => {
    return startDate1 <= endDate2 && endDate1 >= startDate2;
  };
  // Now we will check for date overlaps in workExperienceList
  const overlapErrors = [];
  const workExperienceList = Emp_profileBody.workExperienceList;

  // Loop through each experience to check for overlap
  for (let i = 0; i < workExperienceList.length; i++) {
    let currentExperience = workExperienceList[i];
    let currentStartDate = new Date(currentExperience.startDate);
    let currentEndDate = new Date(currentExperience.endDate);

    // Compare current experience with all other experiences for overlap
    for (let j = 0; j < workExperienceList.length; j++) {
      if (i !== j) { // Avoid comparing the same entry with itself
        let otherExperience = workExperienceList[j];
        let otherStartDate = new Date(otherExperience.startDate);
        let otherEndDate = new Date(otherExperience.endDate);

        // Check for overlap
        if (checkDateOverlap(currentStartDate, currentEndDate, otherStartDate, otherEndDate)) {
          overlapErrors.push(`Date overlap detected between experience at index ${i} and ${j}`);
        }
      }
    }
  }
  let addedEmp_profileObj ;
  // If overlaps are detected, return error response
  if (overlapErrors.length > 0) {

    let result = { "message": 'There are date overlaps in the work experience.', "status": "error" }
    return result;
  }

  else{
  
  addedEmp_profileObj = await Emp_profileModel.EmployeeProfileModel.create(Emp_profileBody);
  }


  // For Adding EmployeeId During Creation Record
  for (let i = 0; i < Emp_profileBody.contactList.length; i++) {
    Emp_profileBody.contactList[i].employeeId = addedEmp_profileObj?.dataValues.Id;
  }


  // For Adding EmployeeId During Creation Record
  for (let i = 0; i < Emp_profileBody.workExperienceList.length; i++) {

    Emp_profileBody.workExperienceList[i].employeeId = addedEmp_profileObj?.dataValues.Id;
  }




  // For Adding EmployeeId During Creation Record
  for (let i = 0; i < Emp_profileBody.academicList.length; i++) {

    Emp_profileBody.academicList[i].employeeId = addedEmp_profileObj?.dataValues.Id;
  }


  // For Adding EmployeeId During Creation Record
  for (let i = 0; i < Emp_profileBody.skillsList.length; i++) {

    Emp_profileBody.skillsList[i].employeeId = addedEmp_profileObj?.dataValues.Id;
  }

  // For Adding EmployeeId During Creation Record
  for (let i = 0; i < Emp_profileBody.incidentList.length; i++) {
    Emp_profileBody.incidentList[i].employeeId = addedEmp_profileObj?.dataValues.Id;
  }



  await BUlkInsertEmployeeDetails(Emp_profileBody, addedEmp_profileObj?.dataValues.Id);

  return addedEmp_profileObj;
};

const BUlkInsertEmployeeDetails = async (updateBody, employeeId) => {

  

    const deleteContact = await sequelize.query(' delete from t_contact_information where employeeId = ' + employeeId);
    if (updateBody?.contactList?.length) {
    const objContactList = await Emp_profileModel.ContactInformationModel.bulkCreate(updateBody.contactList);
  }

 
    const workObj = await sequelize.query(' delete from t_employee_work_experience where employeeId = ' + employeeId);
    if (updateBody?.workExperienceList?.length) {
    const objExperienceList = await Emp_profileModel.ExperienceModel.bulkCreate(updateBody.workExperienceList);
  }


    const objAcad = await sequelize.query(' delete from t_employee_academic_info where employeeId = ' + employeeId);
    if (updateBody?.academicList?.length) {
    const objAcadList = await Emp_profileModel.AcademicModel.bulkCreate(updateBody.academicList);
  }


   
    const objSkill = await sequelize.query(' delete from t_employee_skills where employeeId = ' + employeeId);
    if (updateBody?.skillsList?.length) {
    const objSkillList = await Emp_profileModel.SkillsModel.bulkCreate(updateBody.skillsList);
  }

 

    const objIncident = await sequelize.query(' delete from t_employee_incident where employeeId = ' + employeeId);
    if (updateBody?.incidentList?.length) {
    const objIncidentList = await Emp_profileModel.IncidentModel.bulkCreate(updateBody.incidentList);
  }
}


/**
 * Query for Items
 * @param {Object} filter -  Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryEmp_profile = async (filter, options, searchQuery) => {

  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // { isActive: sequelize.where }
    // { Id: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Id')), 'LIKE', '%' + searchQuery + '%') },
    { firstName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('firstName')), 'LIKE', '%' + searchQuery + '%') },
    { lastName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('lastName')), 'LIKE', '%' + searchQuery + '%') },

  ]

  const { count, rows } = await Emp_profileModel.EmployeeProfileModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    offset: offset,
    limit: limit,
    include: [
      {
        model: Emp_profileModel.DeptModel,  // Assuming you have a DepartmentModel
        as: 'department',  // Alias to refer to the department relation
        attributes: ['deptId', 'deptName'],  // Specify the fields you want from the department table
      },
      {
        model: Emp_profileModel.FormModel,  // Assuming you have a DepartmentModel
        as: 'designation',  // Alias to refer to the department relation
        attributes: ['Id', 'formName'],  // Specify the fields you want from the department table
      },
      {
        model: Emp_profileModel.FormModel,  // Assuming you have a DepartmentModel
        as: 'employeeType',  // Alias to refer to the department relation
        attributes: ['Id', 'formName'],  // Specify the fields you want from the department table
      },
    ],
  });

  const updatedRows = rows.map(row => {


    const formattedDateOfJoining = row?.dataValues?.dateOfJoining != 'undefined' ? formatDates(row?.dataValues?.dateOfJoining) : null;

    const fullName = `${row.dataValues.firstName} ${row.dataValues.middleName ? row.dataValues.middleName + ' ' : ''}${row.dataValues.lastName}`;
    return {
      ...row.dataValues,
      fullName: fullName.trim(), // Trim any extra spaces if middleName is empty
      dateOfJoining: formattedDateOfJoining,
    };
  });
  return paginationFacts(count, limit, options.pageNumber, updatedRows);
  // return Items;
};

const queryContactInfo = async () => {

  const queryFilters = [
    // { isActive: sequelize.where }
    // { Id: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Id')), 'LIKE', '%' + searchQuery + '%') },
    { relation: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('relation')), 'LIKE', '%' + 'j' + '%') },
    { relation_name: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('relation_name')), 'LIKE', '%' + 'j' + '%') },

  ]


  const { count, rows } = await Emp_profileModel.ContactInformationModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    // where: {
    //   [Op.or]: queryFilters,
    //   // isActive: true
    // },
    offset: 0,
    limit: 10,
  });


  return paginationFacts(count, 10, 1, rows);
  // return Items;
};


/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getEmp_profileById = async (id) => {
  //return Emp_profileModel.EmployeeProfileModel.findByPk(id);

  const results = await sequelize.query('CALL usp_GetAllEmployeeProfileDetails(:employeeId)', {
    replacements: { employeeId: id || 'null' },
    type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
  });

 

  return results[0]
};

const getContactInfoByEmployeeId = async (id) => {
  const queryFilters = [
    // { isActive: sequelize.where }
    // { Id: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('Id')), 'LIKE', '%' + searchQuery + '%') },
    { employeeId: id },

  ]

  return Emp_profileModel.ContactInformationModel.findAndCountAll({
    order: [
      ['createdAt', 'DESC']
    ],
    where: {
      [Op.or]: queryFilters,
      isActive: true
    },
    offset: 0,
    limit: 10,
  });
};




/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateEmp_profileById = async (Id, updateBody, updatedBy) => {
 
  const Item = await getEmp_profileById(Id);

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }
  const checkDateOverlap = (startDate1, endDate1, startDate2, endDate2) => {
    return startDate1 <= endDate2 && endDate1 >= startDate2;
  };
  // Now we will check for date overlaps in workExperienceList
  const overlapErrors = [];
  const workExperienceList = updateBody?.workExperienceList;

  // Loop through each experience to check for overlap
  for (let i = 0; i < workExperienceList?.length; i++) {
    let currentExperience = workExperienceList[i];
    let currentStartDate = new Date(currentExperience.startDate);
    let currentEndDate = new Date(currentExperience.endDate);

    // Compare current experience with all other experiences for overlap
    for (let j = 0; j < workExperienceList.length; j++) {
      if (i !== j) { // Avoid comparing the same entry with itself
        let otherExperience = workExperienceList[j];
        let otherStartDate = new Date(otherExperience.startDate);
        let otherEndDate = new Date(otherExperience.endDate);

        // Check for overlap
        if (checkDateOverlap(currentStartDate, currentEndDate, otherStartDate, otherEndDate)) {
          overlapErrors.push(`Date overlap detected between experience at index ${i} and ${j}`);
        }
      }
    }
  }

  // If overlaps are detected, return error response
  if (overlapErrors?.length > 0) {

    let result = { "message": 'There are date overlaps in the work experience...', "status": "error" }
    return result;
  }

  BUlkInsertEmployeeDetails(updateBody, updateBody.Id);

  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  //await Emp_profileModel.EmployeeProfileModel.update(Item);

  const updatedItem = await Emp_profileModel.EmployeeProfileModel.update(Item, {
    where: {
      Id: Id, // replace `itemId` with the actual identifier for the record you want to update
    },
  });
  return;
};

const usp_GetAllEmployeeProfileDetails = async (employeeCode) => {
  try {
    const results = await sequelize.query('CALL usp_GetAllEmployeeProfileDetails(:employeeId)', {
      replacements: { employeeId: employeeCode || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    return results
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};


const SP_getContactDetailByEmployeeId = async (employeeId) => {
  try {
    const results = await sequelize.query('CALL SP_getContactDetailByEmployeeId(:employeeId)', {
      replacements: { employeeId: employeeId || 'null' },
      type: Sequelize.QueryTypes.RAW // Use RAW type for executing stored procedures
    });

    return results
  } catch (error) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, error);
  }
};



const updateContactById = async (Id, updateBody, updatedBy) => {
  const Item = await getContactById(Id);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "record not found");
  }

  // updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  await Item.save();




  return;
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */
const deleteEmp_profileById = async (Id) => {
  try {


    const Item = await Emp_profileModel.EmployeeProfileModel.findOne({ employeeId: Id })
  
    if (!Item) {
      throw new ApiError(httpStatus?.NOT_FOUND, "Item not found");
    }
    await Item.destroy();
  } catch (error) {

    throw new ApiError(httpStatus?.NOT_FOUND, error);
  }
  return Item;

};



const getProfileView = async (id) => {
  const [result] = await sequelize.query(`
    SELECT *
    FROM v_employee_profile
    WHERE Id = :id
  `, {
    replacements: { id },
    type: Sequelize.QueryTypes.SELECT
  });

  return result || {};
}

module.exports = {
  createEmp_profile,
  queryEmp_profile,
  getEmp_profileById,
  updateEmp_profileById,
  deleteEmp_profileById,
  queryContactInfo,
  getContactInfoByEmployeeId,
  updateContactById,
  usp_GetAllEmployeeProfileDetails,
  getProfileView,
  SP_getContactDetailByEmployeeId
};
