const httpStatus = require("http-status");
const { Storage } = require('@google-cloud/storage');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const sequelize = require('../../../config/db')
// const { Op } = require('sequelize');
const { IbFormModel, CountryModel, CityModel, IncidentTypeModel, CenterModel, SubCenterModel, VehicleDetailModel, StatusTypeModel, HospitalModel, PoliceStationModel, IbsImageModel, MortuaryFormModel } = require("../../../models");
const ApiError = require("../../../utils/ApiError");
const Pagination = require('../../../utils/common');
const { createDatetime, getPathStorageFromUrl } = require('../../../utils/common');
// const { IbsImageModel } = require('../../../models');
const { uploadToFirebase } = require('../../../middlewares/upload.middleware');
const storage = new Storage({
    projectId: 'eams-test-7f4a7',
    keyFilename: 'eams-test-7f4a7-firebase-adminsdk-hfara-9c9ec246a0.json'
});

const createIbForm = async (req, formData) => {
    formData.createdBy = req.user.id;
    formData.countryId = parseInt(formData?.countryId)
    formData.cityId = parseInt(formData?.cityId)
    formData.incidentTypeId = parseInt(formData?.incidentTypeId)
    formData.districtId = parseInt(formData?.districtId)
    formData.areaId = parseInt(formData?.areaId)
    formData.age = parseInt(formData?.age)
    formData.statusId = parseInt(formData?.statusId)
    formData.vehicleId = formData?.vehicleId ? parseInt(formData?.vehicleId) : null
    formData.hospitalId = formData?.hospitalId ? parseInt(formData?.hospitalId) : null
    formData.policeStationId = formData?.policeStationId ? parseInt(formData?.policeStationId) : null
    formData.dateTime = createDatetime(formData?.dateTime)
    formData.incidentlocationReachdateTime = createDatetime(formData?.incidentlocationReachdateTime)
    formData.hospitalReachdateTime = createDatetime(formData?.hospitalReachdateTime)
    // // return formData;
    // console.log(formData);
    const ibFormCreated = await IbFormModel.create(formData);
    if (!ibFormCreated) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ib form not created');
    }

    const images = [];
    if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
            const url = await uploadToFirebase(req.files[i], 'ibFormImages', ibFormCreated.id, '-CRN.');
            images.push({ name: `CRN${ibFormCreated.id}`, ibfId: ibFormCreated.id, url: url, createdBy: req.user.id });
        }
        if (!images) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Ib form Images not created something went wrong!');
        }
        console.log("Images object", images)
    }

    var bulkImagesCreated;
    if (images) {
        bulkImagesCreated = await IbsImageModel.bulkCreate(images);
        if (!bulkImagesCreated) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Ib form Images not created something went wrong!');
        }

    }
    // console.log("bulk creation",bulkImagesCreated);

    return getIbFormById(ibFormCreated.id)
    // return ibFormCreated;
}

const getIbFormById = async (id) => {
    return await IbFormModel.findByPk(id, {
        include: [
            {
                model: CountryModel,
                as: 'country',
                attributes: ['id', 'name'],
            },
            {
                model: CityModel,
                as: 'city',
                attributes: ['id', 'name'],
            },
            {
                model: IncidentTypeModel,
                as: 'incidentType',
                attributes: ['id', 'name'],
            },
            {
                model: CenterModel,
                as: 'district',
                attributes: ['id', 'name'],
            },
            {
                model: SubCenterModel,
                as: 'area',
                attributes: ['id', 'name'],
            },
            {
                model: VehicleDetailModel,
                as: 'vehicle',
                attributes: ['id', 'name'],
            },
            {
                model: HospitalModel,
                as: 'hospital',
                attributes: ['id', 'name'],
            },
            {
                model: PoliceStationModel,
                as: 'policeStation',
                attributes: ['id', 'name'],
            },
            {
                model: StatusTypeModel,
                as: 'status',
                attributes: ['id', 'name'],
            },
            {
                model: IbsImageModel,
                as: 'ibFormImages',
                attributes: ['id', 'name', 'url'],
            },
            {
                model: MortuaryFormModel,
                as: 'relatedMortuaryForm',
                attributes: ['id', 'fullNameOfTheDeceased', 'statusId'],
                include: {
                    model: StatusTypeModel,
                    as: "status",
                    attributes: ['id', 'name'],
                },
            },
        ]
    });
};

const getIbFormImageById = async (id) => {
    try {
        const image = await IbsImageModel.findOne({
            where: { id },
            attributes: ['url']
        });

        if (image) {
            const imageUrl = image.url;
            return imageUrl;
        } else {
            // Handle the "record not found" scenario
            throw new ApiError(httpStatus.NOT_FOUND, `Image with ID ${id} not found`);
            // Perform any other necessary actions
        }

    } catch (error) {
        // Handle other errors
        console.error('Error occurred while retrieving image URL:', error);
        throw new ApiError(httpStatus.NOT_FOUND, `Error occurred while retrieving image URL: ${error}`);
        // Perform additional error handling steps
    }
};

const deleteIbFormImageById = async (ibFormImageId) => {
    const ibImage = await IbsImageModel.findOne({ where: { id: ibFormImageId }, });
    if (!ibImage) {
        throw new ApiError(httpStatus.NOT_FOUND, "Ib form image not found");
    }
    return await ibImage.destroy();
    // return ibImage;
};

const updateIbForm = async (req, formData) => {
    formData.updatedBy = req.user.id;
    formData.id = parseInt(formData?.id)
    formData.countryId = parseInt(formData?.countryId)
    formData.cityId = parseInt(formData?.cityId)
    formData.incidentTypeId = parseInt(formData?.incidentTypeId)
    formData.districtId = parseInt(formData?.districtId)
    formData.areaId = parseInt(formData?.areaId)
    formData.age = parseInt(formData?.age)
    formData.statusId = parseInt(formData?.statusId)
    formData.vehicleId = formData?.vehicleId ? parseInt(formData?.vehicleId) : null
    formData.hospitalId = formData?.hospitalId ? parseInt(formData?.hospitalId) : null
    formData.policeStationId = formData?.policeStationId ? parseInt(formData?.policeStationId) : null
    formData.dateTime = createDatetime(formData?.dateTime)
    formData.incidentlocationReachdateTime = createDatetime(formData?.incidentlocationReachdateTime)
    formData.hospitalReachdateTime = createDatetime(formData?.hospitalReachdateTime)
    const oldImages = formData?.oldImages?.map(Number)

    // return formData;
    // console.log(formData);
    const ibForm = await getIbFormById(formData.id);
    if (!ibForm) {
        throw new ApiError(httpStatus.NOT_FOUND, "Ib form not found");
    }
    delete formData.id;
    Object.assign(ibForm, formData);
    const updatedIbForm = await ibForm.save();

    if (!updatedIbForm) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Ib form not updated');
    }

    if (oldImages && oldImages.length > 0) {
        for (let i = 0; i < oldImages.length; i++) {
            var value = await getIbFormImageById(oldImages[i])
            // const firstSplit = value.url.split("%2F");
            // const second = firstSplit[1].split("?");
            // const fileName = second[0];
            // console.log("originalUrl", value.url);
            // console.log("fileName", fileName)
            // console.log(value);
            const imagePath = getPathStorageFromUrl(value);
            storage
                .bucket("eams-test-7f4a7.appspot.com")
                .file(imagePath).delete().then(async () => {
                    // Code to execute on successful deletion 
                    // console.log(`File deleted successfully ${imagePath}`);
                    await deleteIbFormImageById(oldImages[i])
                })
                .catch((err) => {
                    // Code to handle errors 
                    // console.error(err);
                    throw new ApiError(httpStatus.NOT_FOUND, `Ib form image not updated ${err}`);
                });
        }
    }

    const images = [];
    if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
            const url = await uploadToFirebase(req.files[i], 'ibFormImages', updatedIbForm.id, '-CRN.');
            images.push({ name: `CRN${updatedIbForm.id}`, ibfId: updatedIbForm.id, url: url, createdBy: req.user.id });
        }
        if (!images) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Ib form Images not uploaded on firebase!');
        }
        // console.log("Images object", images)
    }

    var bulkImagesCreated;
    if (images) {
        bulkImagesCreated = await IbsImageModel.bulkCreate(images);
        if (!bulkImagesCreated) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Ib form Images not created!');
        }
    }
    // console.log("bulk creation",bulkImagesCreated);
    return await getIbFormById(updatedIbForm.id)
    // return updatedIbForm;
};

const getIbForms = async (filter, options, searchQuery) => {
    let limit = options.pageSize;
    let offset = 0 + (options.pageNumber - 1) * limit
    searchQuery = searchQuery.toLowerCase();
    const { count, rows } = await IbFormModel.findAndCountAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        where: {
            [Op.or]: [
                { patientName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('patientName')), 'LIKE', '%' + searchQuery + '%') },
                { 'country.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('country.name')), 'LIKE', '%' + searchQuery + '%') },
                { 'city.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('city.name')), 'LIKE', '%' + searchQuery + '%') },
                { 'incidentType.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('incidentType.name')), 'LIKE', '%' + searchQuery + '%') },
                { 'district.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('district.name')), 'LIKE', '%' + searchQuery + '%') },
                { 'area.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('area.name')), 'LIKE', '%' + searchQuery + '%') },
                { 'vehicle.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('vehicle.name')), 'LIKE', '%' + searchQuery + '%') },
                { 'hospital.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('hospital.name')), 'LIKE', '%' + searchQuery + '%') },
                { 'policeStation.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('policeStation.name')), 'LIKE', '%' + searchQuery + '%') },
                { 'status.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('status.name')), 'LIKE', '%' + searchQuery + '%') },
            ]
        },
        include: [
            {
                model: CountryModel,
                as: 'country',
                attributes: ['id', 'name'],
            },
            {
                model: CityModel,
                as: 'city',
                attributes: ['id', 'name'],
            },
            {
                model: IncidentTypeModel,
                as: 'incidentType',
                attributes: ['id', 'name'],
            },
            {
                model: CenterModel,
                as: 'district',
                attributes: ['id', 'name'],
            },
            {
                model: SubCenterModel,
                as: 'area',
                attributes: ['id', 'name'],
            },
            {
                model: VehicleDetailModel,
                as: 'vehicle',
                attributes: ['id', 'name'],
            },
            {
                model: HospitalModel,
                as: 'hospital',
                attributes: ['id', 'name'],
            },
            {
                model: PoliceStationModel,
                as: 'policeStation',
                attributes: ['id', 'name'],
            },
            {
                model: StatusTypeModel,
                as: 'status',
                attributes: ['id', 'name'],
            },
            {
                model: MortuaryFormModel,
                as: 'relatedMortuaryForm',
                attributes: ['id', 'fullNameOfTheDeceased', 'statusId'],
                include: {
                    model: StatusTypeModel,
                    as: "status",
                    attributes: ['id', 'name'],
                },
            },
            // {
            //     model: IbsImageModel,
            //     as: 'ibFormImages',
            //     attributes: ['id', 'name', 'url'],
            // },
        ],
        offset: offset,
        limit: limit,
    });
    return Pagination.paginationFacts(count, limit, options.pageNumber, rows);
    // return ibForms;
};

const deleteIbFormById = async (ibFormId, deleteBody, updatedBy) => {
    const ibForm = await getIbFormById(ibFormId);
    if (!ibForm) {
        throw new ApiError(httpStatus.NOT_FOUND, "Ib Form not found");
    }
    deleteBody.updatedBy = updatedBy;
    deleteBody.isActive = !ibForm.isActive;
    delete deleteBody.id;
    Object.assign(ibForm, deleteBody);
    const updatedIbForm = await ibForm.save();
    return getIbFormById(updatedIbForm.id)
    // await ibForm.destroy();
    // return ibForm;
};

const getIbsReportByYear = async (year) => {
    let ibsReport = await sequelize.query(`select * from (
        SELECT
            IT."id",
            IT."name",
            COUNT(CASE WHEN DATE_PART('month', IB."createdAt") = 1 THEN 1 END) AS JAN,
            COUNT(CASE WHEN DATE_PART('month', IB."createdAt") = 2 THEN 1 END) AS FEB,
            COUNT(CASE WHEN DATE_PART('month', IB."createdAt") = 3 THEN 1 END) AS MAR,
            COUNT(CASE WHEN DATE_PART('month', IB."createdAt") = 4 THEN 1 END) AS APR,
            COUNT(CASE WHEN DATE_PART('month', IB."createdAt") = 5 THEN 1 END) AS MAY,
            COUNT(CASE WHEN DATE_PART('month', IB."createdAt") = 6 THEN 1 END) AS JUNE,
            COUNT(CASE WHEN DATE_PART('month', IB."createdAt") = 7 THEN 1 END) AS JULY,
            COUNT(CASE WHEN DATE_PART('month', IB."createdAt") = 8 THEN 1 END) AS AUG,
            COUNT(CASE WHEN DATE_PART('month', IB."createdAt") = 9 THEN 1 END) AS SEP,
            COUNT(CASE WHEN DATE_PART('month', IB."createdAt") = 10 THEN 1 END) AS OCT,
            COUNT(CASE WHEN DATE_PART('month', IB."createdAt") = 11 THEN 1 END) AS NOV,
            COUNT(CASE WHEN DATE_PART('month', IB."createdAt") = 12 THEN 1 END) AS DEC,
            COUNT(IB."incidentTypeId") AS TOTAL
        FROM public."T_INCIDENT_TYPE" AS IT
        LEFT JOIN public."T_IB_FORMS" AS IB ON IT."id" = IB."incidentTypeId" AND DATE_PART('year', IB."createdAt") = ${year} 
        AND IB."incidentTypeId" <> 2
        where IT."id" <> 2
        GROUP BY IT."id", IT."name"
        union all
                SELECT
            IT."id",
            IT."name",
            COUNT(CASE WHEN DATE_PART('month', INC."createdAt") = 1 THEN 1 END) AS JAN,
            COUNT(CASE WHEN DATE_PART('month', INC."createdAt") = 2 THEN 1 END) AS FEB,
            COUNT(CASE WHEN DATE_PART('month', INC."createdAt") = 3 THEN 1 END) AS MAR,
            COUNT(CASE WHEN DATE_PART('month', INC."createdAt") = 4 THEN 1 END) AS APR,
            COUNT(CASE WHEN DATE_PART('month', INC."createdAt") = 5 THEN 1 END) AS MAY,
            COUNT(CASE WHEN DATE_PART('month', INC."createdAt") = 6 THEN 1 END) AS JUNE,
            COUNT(CASE WHEN DATE_PART('month', INC."createdAt") = 7 THEN 1 END) AS JULY,
            COUNT(CASE WHEN DATE_PART('month', INC."createdAt") = 8 THEN 1 END) AS AUG,
            COUNT(CASE WHEN DATE_PART('month', INC."createdAt") = 9 THEN 1 END) AS SEP,
            COUNT(CASE WHEN DATE_PART('month', INC."createdAt") = 10 THEN 1 END) AS OCT,
            COUNT(CASE WHEN DATE_PART('month', INC."createdAt") = 11 THEN 1 END) AS NOV,
            COUNT(CASE WHEN DATE_PART('month', INC."createdAt") = 12 THEN 1 END) AS DEC,
            COUNT(INC."incidentTypeId") AS TOTAL
        FROM public."T_INCIDENT_TYPE" AS IT
        JOIN public."T_INCIDENT_DETAILS" AS INC ON IT."id" = INC."incidentTypeId" AND DATE_PART('year', INC."createdAt") = ${year}
        GROUP BY IT."id", IT."name") as report
        ORDER BY report."id", report."name"`);

    return ibsReport[0];
};

module.exports = {
    createIbForm,
    getIbFormById,
    getIbFormImageById,
    deleteIbFormImageById,
    updateIbForm,
    getIbForms,
    deleteIbFormById,
    getIbsReportByYear
};

// /**
//  * Create a IncidentDetail
//  * @param {Object} IncidentDetailBody
//  * @returns {Promise<IncidentDetail>}
//  */
// const createIncidentDetail = async (req, IncidentDetailBody) => {
//     // // IncidentDetailBody.slug = IncidentDetailBody.callerName.replace(/ /g, "-").toLowerCase();
//     // Making the Data of the Incident Details here.
//     let vehicleIdCount = IncidentDetailBody.vehicleId.length
//     let incidentDetailData = {
//         callerName: IncidentDetailBody.callerName,
//         callerCNIC: IncidentDetailBody.callerCNIC,
//         callerPhoneNo: IncidentDetailBody.callerPhoneNo,
//         patientName: IncidentDetailBody.patientName,
//         patientCNIC: IncidentDetailBody.patientCNIC,
//         shortDescription: IncidentDetailBody.shortDescription,
//         location: IncidentDetailBody.location,
//         area: IncidentDetailBody.area,
//         incidentTypeId: IncidentDetailBody.incidentTypeId,
//         incidentSeverityId: IncidentDetailBody.incidentSeverityId,
//         createdBy: req.user.id
//     }
//     // Check if the Vehicles are available or not
//     let vehicleCheck = false;
//     IncidentDetailBody.vehicleId.map(async (item) => {
//         let vehicleAvailability = await VehicleDetailModel.findOne({
//             where: item
//         });
//         if (vehicleAvailability.status == 'InProgress') {
//             vehicleCheck = true;
//         }
//     });
//     if (vehicleCheck) {
//         throw new ApiError(httpStatus.BAD_REQUEST, "Vehicle isn't available at the moment!");
//     }

//     //Creating the Incident Detail is here.
//     let incidentDetailAdded = await IncidentDetailModel.create(incidentDetailData);
//     let incidentDetailId = incidentDetailAdded.id

//     // IncidentDetailBody.slug = IncidentDetailBody.callerName.replace(/ /g, "-").toLowerCase();

//     // Making the data of the Driver Trip log Using Incident details
//     let data = [];
//     for (let i = 0; i < vehicleIdCount; i++) {

//         // console.log("IncidentDetailBody.vehicleId[i]", IncidentDetailBody.vehicleId[i]);
//         const driver = await getDriverById(IncidentDetailBody.vehicleId[i])
//         // console.log("driverId", driver.driverId)
//         const triplogbyVehicleId = await getDriverTripLogByVehicleId(IncidentDetailBody.vehicleId[i])
//         if (!triplogbyVehicleId) {

//             /// get vehicle initial reading from vehicle master data

//             let obj = {
//                 startDateTime: Date.now(),
//                 vehicleId: IncidentDetailBody.vehicleId[i],
//                 // initialReading: '0',
//                 initialReading: driver.milleage,
//                 finalReading: 0,
//                 kiloMeters: 0,
//                 status: "InProgress",
//                 createdBy: req.user.id,
//                 // centerId: IncidentDetailBody.centerId,
//                 alarmTimeId: IncidentDetailBody.alarmTimeId ? IncidentDetailBody.alarmTimeId : 2,
//                 sourceCenterId: driver.tempCenterId,
//                 sourceSubCenterId: driver.tempSubCenterId,
//                 driverId: driver.driverId,
//                 incidentId: incidentDetailId,
//                 dateTime: Date.now()
//             };
//             data.push(obj)

//             const updateBody = {
//                 status: "InProgress"
//             }
//             // await vehicleDetailService(IncidentDetailBody.vehicleId[i], updateBody, req.user.id)
//             await updateVehicleOnIncidentCreation(IncidentDetailBody.vehicleId[i], updateBody, req.user.id, driver.driverId)
//         } else {
//             let obj = {
//                 startDateTime: Date.now(),
//                 vehicleId: IncidentDetailBody.vehicleId[i],
//                 initialReading: triplogbyVehicleId.finalReading,
//                 finalReading: 0,
//                 kiloMeters: 0,
//                 status: "InProgress",
//                 createdBy: req.user.id,
//                 // centerId: IncidentDetailBody.centerId,
//                 alarmTimeId: IncidentDetailBody.alarmTimeId ? IncidentDetailBody.alarmTimeId : 2,
//                 sourceCenterId: driver.tempCenterId,
//                 sourceSubCenterId: driver.tempSubCenterId,
//                 driverId: driver.driverId,
//                 incidentId: incidentDetailId,
//                 dateTime: Date.now()
//             };
//             data.push(obj)

//             const updateBody = {
//                 status: "InProgress"
//             }
//             // await vehicleDetailService(IncidentDetailBody.vehicleId[i], updateBody, req.user.id)
//             await updateVehicleOnIncidentCreation(IncidentDetailBody.vehicleId[i], updateBody, req.user.id, driver.driverId)
//         }
//     }

//     // console.log('Data', data);
//     // Creating the Driver Trip log Here
//     await DriverTripLogModel.bulkCreate(data)
//     // Returning the Incient Details here
//     return incidentDetailAdded
// };

// const getDriverById = async (id) => {
//     const driverDetails = await VehicleDetailModel.findOne({
//         where: { id: id },
//         attributes: ['driverId', 'milleage', 'tempCenterId', 'tempSubCenterId']
//     });
//     return driverDetails;
// };

// const getDriverTripLogByVehicleId = async (vehicleId) => {
//     console.log("triplog function", vehicleId);
//     const DriverTripLog = await DriverTripLogModel.findOne({
//         where: { vehicleId: vehicleId },
//         order: [['updatedAt', 'DESC']]
//     })

//     if (!DriverTripLog) {
//         // throw new ApiError(httpStatus.NOT_FOUND, "Driver TripLog not found");
//         return null
//     } else {
//         return DriverTripLog
//     }
// }

// /**
//  * Query for IncidentDetails
//  * @param {Object} filter - Mongo filter
//  * @param {Object} options - Query options
//  * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
//  * @param {number} [options.limit] - Maximum number of results per page (default = 10)
//  * @param {number} [options.page] - Current page (default = 1)
//  * @returns {Promise<QueryResult>}
//  */
// const queryIncidentDetails = async (filter, options, searchQuery) => {
//     // let limit = options.limit;
//     // let offset = 0 + (options.page - 1) * limit;
//     let limit = options.pageSize;
//     let offset = 0 + (options.pageNumber - 1) * limit
//     searchQuery = searchQuery.toLowerCase();
//     const { count, rows } = await IncidentDetailModel.findAndCountAll({
//         where: {
//             [Op.or]: [
//                 { callerName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('callerName')), 'LIKE', '%' + searchQuery + '%') },
//                 { callerCNIC: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('callerCNIC')), 'LIKE', '%' + searchQuery + '%') },
//                 { callerPhoneNo: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('callerPhoneNo')), 'LIKE', '%' + searchQuery + '%') },
//                 { patientName: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('patientName')), 'LIKE', '%' + searchQuery + '%') },
//                 { 'T_INCIDENT_DETAILS.location': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('T_INCIDENT_DETAILS.location')), 'LIKE', '%' + searchQuery + '%') },
//                 // {area: Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('area')), 'LIKE', '%' + searchQuery + '%')},
//                 { 'incidentType.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('incidentType.name')), 'LIKE', '%' + searchQuery + '%') },
//                 { 'incidentSeverity.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('incidentSeverity.name')), 'LIKE', '%' + searchQuery + '%') },
//             ]
//         },
//         order: [
//             // ['id', 'DESC'],
//             ['updatedAt', 'DESC']
//         ],
//         include: [
//             {
//                 model: IncidentTypeModel,
//                 as: 'incidentType',
//                 attributes: ['name'],
//             },
//             {
//                 model: IncidentSeverityModel,
//                 as: 'incidentSeverity',
//                 attributes: ['name'],
//             }
//         ],
//         offset: offset,
//         limit: limit,
//     });
//     return Pagination.paginationFacts(count, limit, options.pageNumber, rows);
// };

// /**
//  * Get IncidentDetail by id
//  * @param {ObjectId} id
//  * @returns {Promise<IncidentDetailModel>}
//  */
// const getIncidentDetailById = async (id) => {

//     const incidentData = await DriverTripLogModel.findAll({
//         where: {
//             incidentId: id
//         },
//         // attributes: ['centerId'],
//         include: [
//             {
//                 model: IncidentDetailModel,
//                 as: 'incident',
//                 attributes: ['id', 'callerName', 'callerCNIC', 'callerPhoneNo', 'patientName', 'patientCNIC', 'shortDescription', 'location', 'area'],
//                 include: [
//                     {
//                         model: IncidentSeverityModel,
//                         as: 'incidentSeverity',
//                         attributes: ['id', 'name']
//                     },
//                     {
//                         model: IncidentTypeModel,
//                         as: 'incidentType',
//                         attributes: ['id', 'name']
//                     }
//                 ]
//             },
//             {
//                 model: VehicleDetailModel,
//                 as: 'vehicle',
//                 attributes: ['id', 'regNo']
//             },
//             {
//                 model: CenterModel,
//                 as: 'sourcecenter',
//                 attributes: ['id', 'name']
//             }
//         ]
//     });

//     const insidentDataArr = JSON.parse(JSON.stringify(incidentData));
//     const vehicleIdsObj = insidentDataArr.reduce((acc, cv) => {
//         return { ...acc, ...cv, vehicleId: [...acc.vehicleId, { ...cv.vehicle }] }
//     }, { vehicleId: [] });

//     let oldVehicleIds = [];
//     // console.log('vehicleIdsObj', vehicleIdsObj)
//     vehicleIdsObj?.vehicleId?.map((val) => {
//         console.log(val)
//         oldVehicleIds.push(val?.id);
//     });

//     // console.log(oldVehicleIds)
//     delete vehicleIdsObj.vehicle
//     // delete vehicleIdsObj.center
//     vehicleIdsObj.oldVehicleId = oldVehicleIds;
//     // vehicleIdsObj.incident.incidentSeverityId = vehicleIdsObj.incident.incidentSeverity.id;
//     // vehicleIdsObj.incident.incidentTypeId = vehicleIdsObj.incident.incidentType.id;

//     return vehicleIdsObj
// };

// const getIncidentDetailByIdForUpdate = async (id) => {

//     const incidentData = await IncidentDetailModel.findOne({
//         where: {
//             id: id
//         },
//     });
//     return incidentData;
// };

// /**
//  * Update IncidentDetail by id
//  * @param {ObjectId} IncidentDetailId
//  * @param {Object} updateBody
//  * @returns {Promise<IncidentDetailModel>}
//  */
// const updateIncidentDetailById = async (IncidentDetailId, updateBody, updatedBy) => {

//     // console.log("IncidentDetailId", IncidentDetailId);
//     const IncidentDetail = await getIncidentDetailByIdForUpdate(IncidentDetailId);
//     if (!IncidentDetail) {
//         throw new ApiError(httpStatus.NOT_FOUND, "Incident Detail not found");
//     }
//     // updateBody.slug = updateBody.callerName.replace(/ /g, "-").toLowerCase()
//     var oldVehicleIds = updateBody.oldVehicleId;
//     var newVehicleIds = updateBody.newVehicleId;
//     var centerId = updateBody.centerId;
//     updateBody.updatedBy = updatedBy;
//     delete updateBody.id;
//     delete updateBody.oldVehicleId;
//     delete updateBody.newVehicleId;
//     delete updateBody.centerId;
//     Object.assign(IncidentDetail, updateBody);
//     // console.log("IncidentDetail", IncidentDetail);
//     const updatedIncidentDetail = await IncidentDetail.save();

//     // console.log("oldVehicleIds", oldVehicleIds);
//     // console.log("newVehicleIds", newVehicleIds);
//     if (newVehicleIds.length) {

//         // filter out new vehicleIds and create new array of vehicleIds
//         for (let i = 0; i < newVehicleIds.length; i++) {
//             oldVehicleIds.push(newVehicleIds[i]);
//         }
//         const vehicleIds = oldVehicleIds.filter(function (item) {
//             return oldVehicleIds.lastIndexOf(item) == oldVehicleIds.indexOf(item);
//         });

//         // creating new triplog with new vehicleIds.
//         if (vehicleIds.length) {
//             // console.log("Final Array", vehicleIds)
//             let data = [];
//             for (let i = 0; i < vehicleIds.length; i++) {
//                 const driver = await getDriverById(vehicleIds[i])
//                 // console.log("driverId", driver.driverId)
//                 const triplogbyVehicleId = await getDriverTripLogByVehicleId(vehicleIds[i])
//                 if (!triplogbyVehicleId) {

//                     /// get vehicle initial reading from vehicle master data
//                     let obj = {
//                         startDateTime: Date.now(),
//                         vehicleId: vehicleIds[i],
//                         // initialReading: '0',
//                         initialReading: driver.milleage,
//                         finalReading: 0,
//                         kiloMeters: 0,
//                         status: "InProgress",
//                         updatedBy: updatedBy,
//                         // centerId: centerId,
//                         // alarmTimeId: updateBody.alarmTimeId,
//                         alarmTimeId: updateBody.alarmTimeId ? updateBody.alarmTimeId : 2,
//                         sourceCenterId: driver.tempCenterId,
//                         sourceSubCenterId: driver.tempSubCenterId,
//                         driverId: driver.driverId,
//                         incidentId: IncidentDetailId,
//                         dateTime: Date.now()
//                     };
//                     data.push(obj)

//                     const updateBody = {
//                         status: "InProgress"
//                     }
//                     // await vehicleDetailService(vehicleIds[i], updateBody, updatedBy)
//                     await updateVehicleOnIncidentCreation(vehicleIds[i], updateBody, updatedBy, driver.driverId)
//                 } else {
//                     let obj = {
//                         startDateTime: Date.now(),
//                         vehicleId: vehicleIds[i],
//                         initialReading: triplogbyVehicleId.finalReading,
//                         finalReading: 0,
//                         kiloMeters: 0,
//                         status: "InProgress",
//                         updatedBy: updatedBy,
//                         // centerId: centerId,
//                         // alarmTimeId: updateBody.alarmTimeId,
//                         alarmTimeId: updateBody.alarmTimeId ? updateBody.alarmTimeId : 2,
//                         sourceCenterId: driver.tempCenterId,
//                         sourceSubCenterId: driver.tempSubCenterId,
//                         driverId: driver.driverId,
//                         incidentId: IncidentDetailId,
//                         dateTime: Date.now()
//                     };
//                     data.push(obj)

//                     const updateBody = {
//                         status: "InProgress"
//                     }
//                     // await vehicleDetailService(vehicleIds[i], updateBody, updatedBy)
//                     await updateVehicleOnIncidentCreation(vehicleIds[i], updateBody, updatedBy, driver.driverId)
//                 }
//             }

//             // console.log('Data', data);
//             // Creating the Driver Trip log Here
//             await DriverTripLogModel.bulkCreate(data)

//             // Returning the Updated Incient Details here
//             return updatedIncidentDetail
//             // return IncidentDetail

//         }
//     }
//     // console.log("finally block")
//     // Returning the Updated Incient Details here
//     return updatedIncidentDetail
//     // return IncidentDetail;

// };

// // const getDetailsofVehiclesbyCenterId = async (centerId, vehicleId) => {
// //   const data = await DriverTripLogModel.findAll({
// //     where: {centerId: centerId, vehicleId: vehicleId}
// //   })
// //   if(!data){
// //     return null
// //   }else{
// //     return data
// //   }
// // }

// /**
//  * Delete IncidentDetail by id
//  * @param {ObjectId} IncidentDetailId
//  * @returns {Promise<IncidentDetailModel>}
//  */
// const deleteIncidentDetailById = async (IncidentDetailId) => {
//     const IncidentDetail = await getIncidentDetailById(IncidentDetailId);
//     if (!IncidentDetail) {
//         throw new ApiError(httpStatus.NOT_FOUND, "Incident Detail not found");
//     }
//     await IncidentDetail.destroy();
//     return IncidentDetail;
// };

// module.exports = {
//     createIncidentDetail,
//     queryIncidentDetails,
//     getIncidentDetailById,
//     getIncidentDetailByIdForUpdate,
//     updateIncidentDetailById,
//     deleteIncidentDetailById,
//     getDriverById
// };
