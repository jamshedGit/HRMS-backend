const httpStatus = require("http-status");
const { Storage } = require('@google-cloud/storage');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { MortuaryFormModel, MortuaryImageModel, IbFormModel, CountryModel, CityModel, IncidentTypeModel, CenterModel, SubCenterModel, VehicleDetailModel, StatusTypeModel, HospitalModel, PoliceStationModel, IbsImageModel, CoffinFormModel } = require("../../../models");
const ApiError = require("../../../utils/ApiError");
const Pagination = require('../../../utils/common');
const { createDatetime, getPathStorageFromUrl } = require('../../../utils/common');
const { uploadToFirebase } = require('../../../middlewares/upload.middleware');
const storage = new Storage({
    projectId: 'eams-test-7f4a7',
    keyFilename: 'eams-test-7f4a7-firebase-adminsdk-hfara-9c9ec246a0.json'
});

const createMortuaryForm = async (req, formData) => {
    formData.createdBy = req.user.id;
    formData.countryId = parseInt(formData?.countryId)
    formData.cityId = parseInt(formData?.cityId)
    formData.statusId = parseInt(formData?.statusId)
    formData.hospitalId = formData?.hospitalId ? parseInt(formData?.hospitalId) : null
    formData.ibfId = formData?.ibfId ? parseInt(formData?.ibfId) : null
    formData.dateTime = createDatetime(formData?.dateTime)
    formData.mortuaryReachdateTime = createDatetime(formData?.mortuaryReachdateTime)
    formData.dischargeFromMortuaryDateTime = createDatetime(formData?.dischargeFromMortuaryDateTime)
    // formData.incidentTypeId = parseInt(formData?.incidentTypeId)
    // formData.districtId = parseInt(formData?.districtId)
    // formData.areaId = parseInt(formData?.areaId)
    // formData.age = parseInt(formData?.age)
    // formData.vehicleId = formData?.vehicleId ? parseInt(formData?.vehicleId) : null
    // formData.policeStationId = formData?.policeStationId ? parseInt(formData?.policeStationId) : null
    // // return formData;
    // console.log(formData);
    const mortuaryFormCreated = await MortuaryFormModel.create(formData);
    if (!mortuaryFormCreated) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Mortuary form not created');
    }

    const images = [];
    if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
            const url = await uploadToFirebase(req.files[i], 'mortuaryFormImages', mortuaryFormCreated.id, '-SN.');
            images.push({ name: `SN${mortuaryFormCreated.id}`, mfId: mortuaryFormCreated.id, url: url, createdBy: req.user.id });
        }
        if (!images) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Mortuary form Images not created something went wrong!');
        }
        console.log("Images object", images)
    }

    var bulkImagesCreated;
    if (images) {
        bulkImagesCreated = await MortuaryImageModel.bulkCreate(images);
        if (!bulkImagesCreated) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Mortuary form Images not created something went wrong!');
        }

    }
    // console.log("bulk creation",bulkImagesCreated);

    return getMortuaryFormById(mortuaryFormCreated.id)
    // return mortuaryFormCreated;
}

const getMortuaryFormById = async (id) => {
    return await MortuaryFormModel.findByPk(id, {
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
                model: HospitalModel,
                as: 'hospital',
                attributes: ['id', 'name'],
            },
            {
                model: StatusTypeModel,
                as: 'status',
                attributes: ['id', 'name'],
            },
            {
                model: MortuaryImageModel,
                as: 'mortuaryFormImages',
                attributes: ['id', 'name', 'url'],
            },
            {
                model: CoffinFormModel,
                as: 'coffinFormRelatedToMortuaryForm',
                attributes: ['id', 'statusId'],
                include: {
                    model: StatusTypeModel,
                    as: "status",
                    attributes: ['id', 'name'],
                },
            },
        ]
    });
};

const getMortuaryFormImageById = async (id) => {
    try {
        const image = await MortuaryImageModel.findOne({
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

const deleteMortuaryFormImageById = async (mortuaryFormImageId) => {
    const mortuaryImage = await MortuaryImageModel.findOne({ where: { id: mortuaryFormImageId }, });
    if (!mortuaryImage) {
        throw new ApiError(httpStatus.NOT_FOUND, "Mortuary form image not found");
    }
    return await mortuaryImage.destroy();
    // return mortuaryImage;
};

const updateMortuaryForm = async (req, formData) => {
    formData.updatedBy = req.user.id;
    formData.countryId = parseInt(formData?.countryId)
    formData.cityId = parseInt(formData?.cityId)
    formData.statusId = parseInt(formData?.statusId)
    formData.hospitalId = formData?.hospitalId ? parseInt(formData?.hospitalId) : null
    formData.ibfId = formData?.ibfId ? parseInt(formData?.ibfId) : null
    formData.dateTime = createDatetime(formData?.dateTime)
    formData.mortuaryReachdateTime = createDatetime(formData?.mortuaryReachdateTime)
    formData.dischargeFromMortuaryDateTime = createDatetime(formData?.dischargeFromMortuaryDateTime)
    // formData.incidentTypeId = parseInt(formData?.incidentTypeId)
    // formData.districtId = parseInt(formData?.districtId)
    // formData.areaId = parseInt(formData?.areaId)
    // formData.age = parseInt(formData?.age)
    // formData.vehicleId = formData?.vehicleId ? parseInt(formData?.vehicleId) : null
    // formData.policeStationId = formData?.policeStationId ? parseInt(formData?.policeStationId) : null
    // // return formData;
    // console.log(formData);
    const oldImages = formData?.oldImages?.map(Number)

    // return formData;
    // console.log(formData);
    const mortuaryForm = await getMortuaryFormById(formData.id);
    if (!mortuaryForm) {
        throw new ApiError(httpStatus.NOT_FOUND, "Mortuary form not found");
    }
    delete formData.id;
    Object.assign(mortuaryForm, formData);
    const updatedMortuaryForm = await mortuaryForm.save();

    if (!updatedMortuaryForm) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Mortuary form not updated');
    }

    if (oldImages && oldImages.length > 0) {
        for (let i = 0; i < oldImages.length; i++) {
            var value = await getMortuaryFormImageById(oldImages[i])
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
                    await deleteMortuaryFormImageById(oldImages[i])
                })
                .catch((err) => {
                    // Code to handle errors 
                    // console.error(err);
                    throw new ApiError(httpStatus.NOT_FOUND, `Mortuary form image not updated ${err}`);
                });
        }
    }

    const images = [];
    if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
            const url = await uploadToFirebase(req.files[i], 'mortuaryFormImages', updatedMortuaryForm.id, '-SN.');
            images.push({ name: `SN${updatedMortuaryForm.id}`, mfId: updatedMortuaryForm.id, url: url, createdBy: req.user.id });
        }
        if (!images) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Mortuary form Images not uploaded on firebase!');
        }
        // console.log("Images object", images)
    }

    var bulkImagesCreated;
    if (images) {
        bulkImagesCreated = await MortuaryImageModel.bulkCreate(images);
        if (!bulkImagesCreated) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Mortuary form Images not created!');
        }
    }
    // console.log("bulk creation",bulkImagesCreated);
    return await getMortuaryFormById(updatedMortuaryForm.id)
    // return updatedMortuaryForm;
}

const getMortuaryForms = async (filter, options, searchQuery) => {
    let limit = options.pageSize;
    let offset = 0 + (options.pageNumber - 1) * limit
    searchQuery = searchQuery.toLowerCase();
    const { count, rows } = await MortuaryFormModel.findAndCountAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        where: {
            [Op.or]: [
                { 'country.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('country.name')), 'LIKE', '%' + searchQuery + '%') },
                { 'city.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('city.name')), 'LIKE', '%' + searchQuery + '%') },
                { 'hospital.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('hospital.name')), 'LIKE', '%' + searchQuery + '%') },
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
                model: HospitalModel,
                as: 'hospital',
                attributes: ['id', 'name'],
            },
            {
                model: StatusTypeModel,
                as: 'status',
                attributes: ['id', 'name'],
            },
            {
                model: CoffinFormModel,
                as: 'coffinFormRelatedToMortuaryForm',
                attributes: ['id', 'statusId'],
                include: {
                    model: StatusTypeModel,
                    as: "status",
                    attributes: ['id', 'name'],
                },
            },
            // {
            //     model: MortuaryImageModel,
            //     as: 'mortuaryFormImages',
            //     attributes: ['id', 'name', 'url'],
            // },
        ],
        offset: offset,
        limit: limit,
    });
    return Pagination.paginationFacts(count, limit, options.pageNumber, rows);
    // return mortuaryForms;
};

const deleteMortuaryFormById = async (mortuaryFormId, deleteBody, updatedBy) => {
    const mortuaryForm = await getMortuaryFormById(mortuaryFormId);
    if (!mortuaryForm) {
        throw new ApiError(httpStatus.NOT_FOUND, "Mortuary Form not found");
    }
    deleteBody.updatedBy = updatedBy;
    deleteBody.isActive = !mortuaryForm.isActive;
    delete deleteBody.id;
    Object.assign(mortuaryForm, deleteBody);
    const updatedMortuaryForm = await mortuaryForm.save();
    return getMortuaryFormById(updatedMortuaryForm.id)
    // await mortuaryForm.destroy();
    // return mortuaryForm;
};

module.exports = {
    createMortuaryForm,
    getMortuaryFormById,
    getMortuaryFormImageById,
    deleteMortuaryFormImageById,
    updateMortuaryForm,
    getMortuaryForms,
    deleteMortuaryFormById
};