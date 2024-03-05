const moment = require('moment');

const getRouteSlugs = (route) => {
  console.log(route);
  let arr = route.split('/');
  console.log(arr);
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

module.exports = { getRouteSlugs, getDdlItems, getAlarmTimesItems, customPaginate, paginationFacts, createDatetime, getPathStorageFromUrl };
