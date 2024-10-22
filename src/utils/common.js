const moment = require('moment');
const { format, differenceInDays, addDays } = require('date-fns');

const getRouteSlugs = (req) => {
  const route = req.originalUrl
  const params = req.params;
  console.log(route);
  let arr = route.split('/');
  console.log(arr);
  //If param is available then get the endpoints from the 2 parts before the params
  //else take last two parts as endpoints from url
  if (Object.keys(params).length) {
    return { resourceSlug: arr[arr.length - 3], rightSlug: arr[arr.length - 2] }; // route.substring(route.lastIndexOf('/') + 1);
  }
  return { resourceSlug: arr[arr.length - 2], rightSlug: arr[arr.length - 1] }; // route.substring(route.lastIndexOf('/') + 1);
};

const getDdlItems = (columns = { labelField: '', valueField: '' }, data = [], parentId = null) => {
  return data.map((i) => ({
    label: i[columns.labelField],
    value: i[columns.valueField],
  }));
};

const getAlarmTimesItems = (columns = { labelField: '', valueField: '' }, data = [], parentId = null) => {
  return data.map((i) => ({
    label: i[columns.labelField] + ' mins',
    value: i[columns.valueField],
  }));
};

const customPaginate = (page, limit, pipeline) => {
  const dataPagination = [];
  const skip = (page - 1) * limit;
  dataPagination.push({ $skip: skip });
  if (limit)
    dataPagination.push({ $limit: limit });
  pipeline.push({
    '$facet': {
      pagination: [{ $count: "totalResults" }, { $addFields: { limit, page } }],
      results: dataPagination
    },
  }, {
    $unwind: '$pagination'
  });
}


const paginationFacts = (totalResults, limit, page, rows) => {
  return {
    totalResults,
    limit,
    page: page,
    totalPages: Math.ceil(totalResults / limit),
    rows
  };
}

const createDatetime = (stringDate) => {
  // Assuming the input date and time string is '23.05.2023 14:38'
  if (stringDate) {
    const inputDateTime = stringDate;

    // Parse the input date and time using the specified format
    const momentObj = moment(inputDateTime, 'DD.MM.YYYY HH:mm');
    // const momentObj = moment(inputDateTime, 'MM/DD/YYYY h:mm A');
    // Format the date and time to the desired format
    const outputDateTime = momentObj.format('YYYY-MM-DD HH:mm:ss.SSSZ');

    // console.log(outputDateTime); // Output: '2023-05-23 14:38:00.000+00'
    return outputDateTime
  }

  return null

}

const getPathStorageFromUrl = (url) => {

  // url = "https://firebasestorage.googleapis.com/v0/b/eams-test-7f4a7.appspot.com/o/testing%2F1685006218395-5f0911c1-91c2-4153-bd83-d71f35c7e942-CRN.10?alt=media&token=6c7c1fde-4ce1-4941-bca6-a121b80d403c"
  const baseUrl = "https://firebasestorage.googleapis.com/v0/b/eams-test-7f4a7.appspot.com/o/";
  console.log(url)
  let imagePath = url.replace(baseUrl, "");
  const indexOfEndPath = imagePath.indexOf("?");
  imagePath = imagePath.substring(0, indexOfEndPath);
  imagePath = imagePath.replace("%2F", "/");
  // console.log("imagePath", imagePath);
  return imagePath;
}

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
      console.log('::::::data[keys]::::', keys, typeof sortedData[keys]);
      if (sortedData[keys] && typeof sortedData[keys] == 'object') {

        Object.entries(sortedData[keys] || {}).forEach((val) => {
          sortedData[val[0]] = val[1];
        })
      }
    })
    return sortedData;
  }
}

/**
 * 
 * function to return formatted date
 * 
 * @param {Date|String} date 
 * @param {String} dateFormat 
 * @returns 
 */
const formatDates = (date, dateFormat = null) => {
  return format(new Date(date), dateFormat || 'MM/dd/yyyy')
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


module.exports = { handleNestedData, getRouteSlugs, getDdlItems, getAlarmTimesItems, customPaginate, paginationFacts, createDatetime, getPathStorageFromUrl, formatDates, getDateDiffInDays, addDaysInDate };
