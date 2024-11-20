const httpStatus = require("http-status");
const { FormModel,SubsidiaryModel,PayrollMonthModel,Payroll_ProcessModel } = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const {
  paginationFacts,
} = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;


const createPayroll_Process = async (req, payroll_processBody) => {
    try {
    console.log("createPayroll_Process1")

      const subsidiaryExists = await Payroll_ProcessModel.findOne({
        where: {
          subsidiaryId: payroll_processBody.subsidiaryId,
          payroll_groupId: payroll_processBody.payroll_groupId,
        },
      });
  
      if (subsidiaryExists) {
        return {
          message: "Subsidiary & payroll group already exist",
          status: "error",
        };
      }
  
      // Set createdBy field
      payroll_processBody.createdBy = req.user.id;
  
 
      const addedPayroll_Process = await Payroll_ProcessModel.create(payroll_processBody);


      return await getPayroll_ProcessById(addedPayroll_Process.Id );
      // return "Done"
  
    } catch (error) {
      
      throw error; // Rethrow or handle the error as needed
    }
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
const queryPayroll_Process = async (filter, options, searchQuery) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    {
      min_year: Sequelize.where(
        Sequelize.fn("", Sequelize.col("t_payroll_process.subsidiaryId")),
        "LIKE",
        "%" + searchQuery + "%"
      ),
    },
  ];

  const { count, rows } = await Payroll_ProcessModel.findAndCountAll({
    order: [["createdAt", "DESC"]],
    order: [
      [Sequelize.col("Subsidiary.name"), "ASC"],   // Order by Subsidiary name
     
    ],
    where: {
      [Op.or]: queryFilters,
      // isActive: true
    },
    offset: offset,
    limit: limit,
    include: [
      {
        model: SubsidiaryModel,
        attributes: ["name"],
        as: "Subsidiary",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "PayrollGroup",
      },
      {
        model: PayrollMonthModel,
        attributes: ["month", "year"],
        as: "PayrollMonth",
      },
    ],
  });

  return paginationFacts(count, limit, options.pageNumber, rows);
};

/**
 * Get Item by id
 * @param {ObjectId} id
 * @returns {Promise<ReceiptModel>}
 */
const getPayroll_ProcessById = async (id) => {
  return Payroll_ProcessModel.findOne({
    where: { Id: id },
    include: [
      {
        model: SubsidiaryModel,
        attributes: ["name"],
        as: "Subsidiary",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "PayrollGroup",
      },
      {
        model: PayrollMonthModel,
        attributes: ["month", "year"],
        as: "PayrollMonth",
      },
    ],
  });


};

/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */

const updatePayroll_ProcessById = async (Id, updateBody, updatedBy) => {
  const Item = await Payroll_ProcessModel.findOne({
    where: { Id: Id },
  });

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Record not found");
  }

  const normalizeDate = (date) => {
    const newDate = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    newDate.setUTCHours(0, 0, 0, 0); // Normalize to midnight UTC
    return newDate;
  };
  
  // Example of adding one day (24 hours) to the date
  const addOneDay = (date) => {
    const newDate = new Date(date);
    newDate.setUTCDate(newDate.getUTCDate()); // Add one day (UTC date)
    return newDate;
  };




  const newStartDate = addOneDay(normalizeDate(new Date(updateBody.from_date)));
  const newEndTDate = addOneDay(normalizeDate(new Date(updateBody.to_date)));


  const isExist=await Payroll_ProcessModel.findOne({
    where:{subsidiaryId:updateBody.subsidiaryId,
      from_date:newStartDate,
    Id: { [Op.ne]: Id} ,// Exclude the current record using its id
    }

  })

  if(isExist){
    throw new ApiError(httpStatus.BAD_REQUEST, "This holiday already exist in current year");

  }


  updateBody.from_date=newStartDate;
  updateBody.to_date=newEndTDate;


    updateBody.updatedBy = updatedBy;
    delete updateBody.id; // Optionally keep this if your model has a primary key

    Object.assign(Item, updateBody);
    await Item.save();
    return Item;
  
};

/**
 * Delete Item by id
 * @param {ObjectId} Id
 * @returns {Promise<ReceiptModel>}
 */

const deletePayroll_ProcessById = async (Id) => {
  const Item = await getPayroll_ProcessById(Id, {});

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  await Item.destroy();
  return Item;
};

module.exports = {
  createPayroll_Process,
  getPayroll_ProcessById,
  updatePayroll_ProcessById,
  deletePayroll_ProcessById,
  queryPayroll_Process,
};
