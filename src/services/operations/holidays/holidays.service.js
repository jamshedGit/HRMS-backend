const httpStatus = require("http-status");
const { HolidaysModel } = require("../../../models/index");
const { FormModel,SubsidiaryModel } = require("../../../models/index");

const ApiError = require("../../../utils/ApiError");
const Sequelize = require("sequelize");
const {
  paginationFacts,
  check_range_exist,
  // update_range_exist,
} = require("../../../utils/common");
const { HttpStatusCodes } = require("../../../utils/constants");

const Op = Sequelize.Op;

const createholidays = async (
  req,
  holidaysBody
) => {
  try {
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


    holidaysBody.createdBy = req.user.id;
  
    const newStartDate = addOneDay(normalizeDate(new Date(holidaysBody.from_date)));
    const newEndTDate = addOneDay(normalizeDate(new Date(holidaysBody.to_date)));

 
    const isExist=await HolidaysModel.findOne({
      where:{subsidiaryId:holidaysBody.subsidiaryId,
        from_date:newStartDate}

    })
   
    if(isExist){
      throw new ApiError(httpStatus.BAD_REQUEST, "This holiday already exist in current year");

    }


    holidaysBody.from_date=newStartDate;
    holidaysBody.to_date=newEndTDate;
    const holidaysObj = await HolidaysModel.create(
      holidaysBody
    );

    //return data
    const result = await HolidaysModel.findByPk(
      holidaysObj.Id,
      {
        include: [
          {
            model: SubsidiaryModel,
            attributes: ["name"],
            as: "Subsidiary",
          },
          {
            model: FormModel,
            attributes: ["formName", "formCode"],
            as: "Religion",
          },
          {
            model: FormModel,
            attributes: ["formName", "formCode"],
            as: "Holiday_type",
          },
      
        ],
      }
    );

    return result;
  } catch (error) {
  throw error
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
const queryholidays = async (filter, options, searchQuery) => {
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;

  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    {
      min_year: Sequelize.where(
        Sequelize.fn("", Sequelize.col("t_holidays.name")),
        "LIKE",
        "%" + searchQuery + "%"
      ),
    },
  ];

  const { count, rows } = await HolidaysModel.findAndCountAll({
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
        as: "Religion",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "Holiday_type",
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
const getholidaysById = async (id) => {
  return HolidaysModel.findOne({
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
        as: "Religion",
      },
      {
        model: FormModel,
        attributes: ["formName", "formCode"],
        as: "Holiday_type",
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

const updateholidaysById = async (Id, updateBody, updatedBy) => {
  const Item = await HolidaysModel.findOne({
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


  const isExist=await HolidaysModel.findOne({
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

const deleteholidaysById = async (Id) => {
  const Item = await getholidaysById(Id, {});

  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }

  await Item.destroy();
  return Item;
};

module.exports = {
  createholidays,
  getholidaysById,
  updateholidaysById,
  deleteholidaysById,
  queryholidays,
};
