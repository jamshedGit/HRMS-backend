const moment = require('moment');
const { format, differenceInDays, addDays } = require('date-fns');
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const modelMapping = require("../models/index");
const { ToWords } = require('to-words');
const { DEFAULT_NUM_TO_WORDS_OPTIONS } = require('./constants');

const getRouteSlugs = (req) => {
  const route = req.originalUrl;
  const params = req.params;

  let arr = route.split("/");

  //If param is available then get the endpoints from the 2 parts before the params
  //else take last two parts as endpoints from url
  if (Object.keys(params).length) {
    return {
      resourceSlug: arr[arr.length - 3],
      rightSlug: arr[arr.length - 2],
    }; // route.substring(route.lastIndexOf('/') + 1);
  }
  return { resourceSlug: arr[arr.length - 2], rightSlug: arr[arr.length - 1] }; // route.substring(route.lastIndexOf('/') + 1);
};

const getDdlItems = (
  columns = { labelField: "", valueField: "", codeField: "", mergeLabel: "", subsidiaryId: "", currencyId: "" },
  data = [],
  mergeLabel = false,
  parentId = null



) => {
  return data.map((i) => ({
    mergeLabel: i[columns.codeField] + " - " + i[columns.labelField],
    label: mergeLabel ? i[columns.codeField] + " - " + i[columns.labelField] : i[columns.labelField],
    value: i[columns.valueField],
    code: i[columns.codeField],
    subsidiaryId: i[columns.subsidiaryId],
    currencyId: i[columns?.currencyId],
    type: i[columns.typeField]



  }));
};

const getAlarmTimesItems = (
  columns = { labelField: "", valueField: "" },
  data = [],
  parentId = null
) => {
  return data.map((i) => ({
    label: i[columns.labelField] + " mins",
    value: i[columns.valueField],
  }));
};

const customPaginate = (page, limit, pipeline) => {
  const dataPagination = [];
  const skip = (page - 1) * limit;
  dataPagination.push({ $skip: skip });
  if (limit) dataPagination.push({ $limit: limit });
  pipeline.push(
    {
      $facet: {
        pagination: [
          { $count: "totalResults" },
          { $addFields: { limit, page } },
        ],
        results: dataPagination,
      },
    },
    {
      $unwind: "$pagination",
    }
  );
};

const paginationFacts = (totalResults, limit, page, rows) => {
  return {
    totalResults,
    limit,
    page: page,
    totalPages: Math.ceil(totalResults / limit),
    rows,
  };
};

const createDatetime = (stringDate) => {
  // Assuming the input date and time string is '23.05.2023 14:38'
  if (stringDate) {
    const inputDateTime = stringDate;

    // Parse the input date and time using the specified format
    const momentObj = moment(inputDateTime, "DD.MM.YYYY HH:mm");
    // const momentObj = moment(inputDateTime, 'MM/DD/YYYY h:mm A');
    // Format the date and time to the desired format
    const outputDateTime = momentObj.format("YYYY-MM-DD HH:mm:ss.SSSZ");


    return outputDateTime;
  }

  return null;
};

const getPathStorageFromUrl = (url) => {
  // url = "https://firebasestorage.googleapis.com/v0/b/eams-test-7f4a7.appspot.com/o/testing%2F1685006218395-5f0911c1-91c2-4153-bd83-d71f35c7e942-CRN.10?alt=media&token=6c7c1fde-4ce1-4941-bca6-a121b80d403c"
  const baseUrl =
    "https://firebasestorage.googleapis.com/v0/b/eams-test-7f4a7.appspot.com/o/";

  let imagePath = url.replace(baseUrl, "");
  const indexOfEndPath = imagePath.indexOf("?");
  imagePath = imagePath.substring(0, indexOfEndPath);
  imagePath = imagePath.replace("%2F", "/");

  return imagePath;
};

/**
 *
 * When we get data from DB where include option is included, It return data of the linked table under the key as name of the table. Example
 * data = {
 *  mainTableKey1: mainTableValue1,
 *  mainTableKey2: mainTableValue2,
 *  linkedTableName: {
 *    linkedTableKey1: linkedTableValue1,
 *    linkedTableKey2: linkedTableValue2,
 *  }
 * }
 *
 * This function moves the nested Data keys to main object for easier handling. It doesn't delete the table key so the values will be copied to main object but table key is still there.
 * data can be array too so will handle that as well for every object of array
 *
 * {
 *  mainTableKey1: mainTableValue1,
 *  mainTableKey2: mainTableValue2,
 *  linkedTableKey1: linkedTableValue1,
 *  linkedTableKey2: linkedTableValue2
 * }
 *
 * @param {Object|Array} data
 * @returns
 */
const handleNestedData = (data) => {
  const sortedData = JSON.parse(JSON.stringify(data))
  if (Array.isArray(sortedData)) {
    sortedData.forEach((el) => {
      Object.keys(el).forEach((keys) => {
        if (el[keys] && typeof el[keys] == 'object') {
          Object.entries(el[keys] || {}).forEach((val) => {
            el[val[0]] = val[1];
          })
        }
      })
    })
    return sortedData;
  }
  else {
    Object.keys(sortedData).forEach((keys) => {
      if (sortedData[keys] && typeof sortedData[keys] == 'object') {
        Object.entries(sortedData[keys] || {}).forEach((val) => {
          sortedData[val[0]] = val[1];
        })
      }
    })
    return sortedData;
  }
};

// Utility function to check for existing ranges with conditional fields

const check_range_exist = async (
  body,
  table,
  minField,
  maxField,
  fieldMappings = []
) => {
  // Validate that max is greater than min

  if (body[maxField] < body[minField]) {
    return {
      message: "Min value must be less than Max value.",
      status: "error",
    };
  }

  // Start building the where condition
  const whereCondition = {
    [Op.or]: [
      { [minField]: { [Op.between]: [body[minField], body[maxField]] } },
      { [maxField]: { [Op.between]: [body[minField], body[maxField]] } },
      {
        [minField]: { [Op.lte]: body[minField] },
        [maxField]: { [Op.gte]: body[maxField] },
      },
    ],
  };

  // Add required fields from fieldMappings
  Object.keys(fieldMappings).forEach((field) => {
    if (fieldMappings[field] !== undefined) {
      whereCondition[fieldMappings[field]] = body[fieldMappings[field]];
    }
  });

  // Check if fieldMappings is defined and is an array
  if (Array.isArray(fieldMappings) && fieldMappings.length > 0) {
    Object.keys(fieldMappings).forEach((field) => {
      if (fieldMappings[field] !== undefined) {
        whereCondition[fieldMappings[field]] = body[fieldMappings[field]];
      }
    });
  }

  const model = modelMapping[table];
  if (!model) {
    throw new Error(`Model ${table} not found`);
  }
  // Query to check for existing configuration
  const existingConfiguration = await model.findOne({
    where: whereCondition,
  });
  return existingConfiguration
    ? { message: "Record Already exist.", status: "error" }
    : null;
};

/**
 * 
 * function to return formatted date
 * 
 * @param {Date|String} date 
 * @param {String} dateFormat 
 * @returns 
 */
const formatDates = (date, dateFormat = null) => {
  if (!date)
    return null;

  return format(new Date(date), dateFormat || 'dd/MMM/yyyy')
}

/**
 * 
 * Get Diff in days between two provided dates
 * 
 * @param {Date|String} startDate 
 * @param {Date|String} endDate 
 * @returns 
 */
const getDateDiffInDays = (startDate, endDate) => {
  if (startDate && endDate) {
    return differenceInDays(new Date(endDate), new Date(startDate)) + 1;
  }
  return 0;
}

/**
 * 
 * Add provided number of days in provided date
 * 
 * @param {Date|string} startDate 
 * @param {Number} days 
 * @returns 
 */
const addDaysInDate = (startDate, days = 0) => {
  return new Date(addDays(new Date(startDate), days))
}

/**
 * 
 * Create Label for Fiscal Year Dropdown
 * 
 * @param {Date} endDate 
 * @param {Date} startDate 
 * @returns 
 */
const createFiscalYearLabel = (endDate, startDate) => {
  if (!endDate || !startDate) {
    return '';
  }
  return `Year - ${new Date(endDate).getFullYear()} (${formatDates(new Date(startDate), 'dd-MMM-yyyy')} to ${formatDates(new Date(endDate), 'dd-MMM-yyyy')})`
}

/**
 * 
 * Create Label for Employee Shift Dropdown
 * 
 * @param {String} name 
 * @param {Date} endDate 
 * @param {Date} startDate 
 * @returns 
 */
const createEmployeeShiftLabel = (name, endDate, startDate) => {
  if (!endDate || !startDate) {
    return '';
  }
  return `${name}`
}

/**
 * 
 * Create Label for Employee Name Dropdown
 * 
 * @param {Object} employee 
 * @returns 
 */
const createEmployeeNameLabel = (employee) => {
  const nameArray = [];
  employee.firstName && nameArray.push(employee.firstName)
  employee.middleName && nameArray.push(employee.middleName)
  employee.lastName && nameArray.push(employee.lastName)

  return nameArray.join(' ');
}

const createTaxYearSetupLabel = (endDate, startDate, isActive) => {
  if (!endDate || !startDate) {
    return '';
  }
  return `Year - ${new Date(endDate).getFullYear()} (${formatDates(new Date(startDate), 'dd-MMM-yyyy')} to ${formatDates(new Date(endDate), 'dd-MMM-yyyy')}) - ${isActive ? "Active" : "Inactive"}`
}


const digitsToWords = (number, config = null) => {
  const options = config || DEFAULT_NUM_TO_WORDS_OPTIONS;
  const toWords = new ToWords(options)
  return toWords.convert(number)
}

const groupBy = (data, key) => {
  const value = data.reduce((prev, current) => {
    if (prev[current[key]]) {
      prev[current[key]].push(current)
    }
    else {
      prev[current[key]] = [current]
    }
    return prev;
  }, {})
  return value;
}

/**
 * 
 * Map data according to Column names in Array of Objects with key being column name and value being the value in that column
 * 
 * @param {Array} data 
 * @param {Array} keys 
 * @returns 
 */
const formatExcelData = (data, keys) => {
  const result = data.slice(1).map(row => {
    return keys.reduce((obj, key, index) => {
      obj[key] = row[index + 1];
      return obj;
    }, {});
  });

  return result
}



module.exports = { handleNestedData, getRouteSlugs, getDdlItems, getAlarmTimesItems, customPaginate, paginationFacts, createDatetime, getPathStorageFromUrl, formatDates, getDateDiffInDays, addDaysInDate, check_range_exist, createFiscalYearLabel, createEmployeeShiftLabel, createTaxYearSetupLabel, createEmployeeNameLabel, digitsToWords, groupBy, formatExcelData };