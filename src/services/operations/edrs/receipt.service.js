const httpStatus = require("http-status");
const axios = require("axios")
const { ReceiptModel, DonationReceiptModel } = require("../../../models");
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
 * @param {Object} ReceiptBody
 * @returns {Promise<Receipt>}
 */
const createReceipt = async (req, ReceiptBody) => {

  // ReceiptBody.slug = ReceiptBody.name.replace(/ /g, "-").toLowerCase();
  ReceiptBody.createdBy = req.user.id;
  const addedReceiptObj = await DonationReceiptModel.create(ReceiptBody);
  authSMSSend(addedReceiptObj.dataValues);  // Quick send message at the time of donation
  return addedReceiptObj;
};

const authSMSSend = async (userObj) => {

  // Authentication SMS And Get SMS SessionId 
  const auth_url = 'https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn=923468215637&password=Pakistan1@edhi@karachi';
  var auth_res = await axios.post(auth_url);
  const parser = new XMLParser();
  let parser_res = parser.parse(auth_res.data);
  let sessionId = parser_res.corpsms.data;
  //console.log("api response", parser_res.corpsms.data);
  // ================= END

  // Sending Quick Message After Getting SessionId
  let toMobileNo = userObj.phoneno; //'923228299306'
  let removeFirst = toMobileNo.substring(1); // to remove first zero into number.
  let resMobile = '92' + removeFirst;

  let donorName = userObj.donorName;
  let donationAmount = userObj.amount;
  let donationRecpt = userObj.receiptNo;
  let donationType = userObj.type;
  let msg = `Assalam-u-Alaikum, Mr./Mrs. ${donorName}, your donation Rs.${donationAmount}/=
  has been received, Thanks for your donation against ${donationType}. 
  your donation receipt no is ${donationRecpt}.\n
  JazakAllah Khair \n\n.    
  `;
  const sms_url = `https://telenorcsms.com.pk:27677/corporate_sms2/api/sendsms.jsp?session_id=${sessionId}&to=${resMobile}&text=${msg}&mask=EDHI`;
  var sms_res = await axios.post(sms_url);
  console.log("sms_res", sms_res);

  return sms_res;
};

//   let request_sms_auth = https.post('https://telenorcsms.com.pk:27677/corporate_sms2/api/auth.jsp?msisdn=923468215637&password=Pakistan1@edhi@karachi', (res) => {
//   if (res.statusCode !== 200) {
//     console.error(`Did not get an OK from the server. Code: ${res.statusCode}`);
//     res.resume();
//     return;
//   }
// });

/**
 * Query for Items
 * @param {Object} filter -  Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryReceipts = async (filter, options, searchQuery) => {
  //console.log("get receipts",searchQuery);

  console.log("options receipt", options);
  let limit = options.pageSize;
  let offset = 0 + (options.pageNumber - 1) * limit;
  console.log("receipt offset ", offset)
  searchQuery = searchQuery.toLowerCase();
  const queryFilters = [
    // { isActive: sequelize.where }
    { donorName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('donorName')), 'LIKE', '%' + searchQuery + '%') },
    { receiptNo: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('receiptNo')), 'LIKE', '%' + searchQuery + '%') },
    { bookNo: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('bookNo')), 'LIKE', '%' + searchQuery + '%') },
    { phoneno: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('phoneno')), 'LIKE', '%' + searchQuery + '%') },
    // { center: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('center')), 'LIKE', '%' + searchQuery + '%') },
    //{ phNo: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('phNo')), 'LIKE', '%' + searchQuery + '%') },
    // { 'center.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('center.name')), 'LIKE', '%' + searchQuery + '%') },
    // { 'subcenter.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('subcenter.name')), 'LIKE', '%' + searchQuery + '%') },
    // { 'city.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('city.name')), 'LIKE', '%' + searchQuery + '%') },
    // { 'country.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('country.name')), 'LIKE', '%' + searchQuery + '%') },
    // { 'role.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('role.name')), 'LIKE', '%' + searchQuery + '%') }
    // { firstName: { [Op.like]: '%' + searchQuery + '%' } },
    // { lastName: { [Op.like]: '%' + searchQuery + '%' } },
    // { email: { [Op.like]: '%' + searchQuery + '%' } },
    // { cnic: { [Op.like]: '%' + searchQuery + '%' } },
    // { phNo: { [Op.like]: '%' + searchQuery + '%' } }
  ]


  const { count, rows } = await DonationReceiptModel.findAndCountAll({
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
const getReceiptById = async (id) => {
  //console.log("read receipt by id " + id)
  return DonationReceiptModel.findByPk(id);
};



/**
 * Update Item by id
 * @param {ObjectId} ReceiptId
 * @param {Object} updateBody
 * @returns {Promise<ReceiptModel>}
 */
const updateReceiptById = async (ReceiptId, updateBody, updatedBy) => {
  //console.log("item 12")

  const Item = await getReceiptById(ReceiptId);
  //console.log(item)
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  //console.log("Update Receipt Id" , item);
  // updateBody.slug = updateBody.name.replace(/ /g, "-").toLowerCase()
  updateBody.updatedBy = updatedBy;
  delete updateBody.id;
  Object.assign(Item, updateBody);
  await Item.save();
  return Item;
};

/**
 * Delete Item by id
 * @param {ObjectId} ReceiptId
 * @returns {Promise<ReceiptModel>}
 */
const deleteReceiptById = async (ReceiptId) => {

  const Item = await getReceiptById(ReceiptId);
  if (!Item) {
    throw new ApiError(httpStatus.NOT_FOUND, "Item not found");
  }
  await Item.destroy();
  return Item;
};

const getDonationReceiptReport = async (req) => {
  // console.log(" bookNo from query ", req)
  const dateFrom = fns.format(req.dateFrom, "yyyy-MM-dd");
  let addDay = fns.addDays(req.dateTo, 1);
  const dateTo = fns.format(addDay, "yyyy-MM-dd");

 // console.log("date fnd", dateTo);

  let whereQuery = "";

  if (req.cityId != 0) {
    whereQuery = "AND"
  }
  else {
    whereQuery = "OR"
  }

  let donationReport = await sequelize.query(`
  SELECT *,CT.name AS city,C.name AS center,S.name AS subCenter,
  TO_CHAR(T."createdAt" :: DATE, 'Mon dd, yyyy') as CreatedOn
	FROM public."T_DONATION_TRANSACTION" AS T
	INNER JOIN public."T_CITIES" AS CT ON CT."id" = T."cityId"
	INNER JOIN public."T_CENTERS" AS C ON T."centerId" = C."id"
	INNER JOIN public."T_SUB_CENTERS" AS S ON  T."subCenterId" = S."id"
  where T."bookNo"  =  '${req.bookNo || ''}'  
  AND (T."createdAt" >= '${dateFrom}' AND T."createdAt" <= '${dateTo}') 
  ${whereQuery} (T."cityId" = ${req.cityId} OR T."centerId" = ${req.centerId} OR T."subCenterId" = ${req.subCenterId}) 
	Order by T."receiptId",T."bookNo"
  `);
  console.log("query");
  return donationReport[0];
};

const getMaxBookingNo = async (req) => {
  // console.log(" max bookingNo from query- service ", req.bookingNo)

  let getMaxCount = await sequelize.query(`
	select count(*)+1 as MaxId from public."T_DONATION_TRANSACTION" T where T."bookNo" = '${req.bookingNo}'
  `, {
    plain: true,
    type: Sequelize.QueryTypes.SELECT
  });
  //console.log(getMaxCount.maxid);  
  return getMaxCount.maxid;
};

module.exports = {
  createReceipt,
  queryReceipts,
  getReceiptById,
  updateReceiptById,
  deleteReceiptById,
  getDonationReceiptReport,
  getMaxBookingNo
};
