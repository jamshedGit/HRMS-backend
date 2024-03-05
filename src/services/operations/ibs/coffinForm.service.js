const httpStatus = require("http-status");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { CoffinFormModel, CountryModel, CityModel, StatusTypeModel, IbFormModel, MortuaryFormModel } = require("../../../models");
const ApiError = require("../../../utils/ApiError");
const Pagination = require('../../../utils/common');
const { createDatetime } = require('../../../utils/common');

const createCoffinForm = async (req, formData) => {
try {
    formData.createdBy = req.user.id;
    formData.dateTime = formData.dateTime ? createDatetime(formData?.dateTime) : null
    formData.dateTimeofDeath = formData?.dateTimeofDeath ? createDatetime(formData?.dateTimeofDeath) : null
    if (formData.countryId) {
        const countryIdRecord = await CountryModel.findByPk(formData.countryId);
        if (!countryIdRecord) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Country record not found!');
        }
    }
    if (formData.cityId) {
        const cityIdRecord = await CityModel.findByPk(formData.cityId);
        if (!cityIdRecord) {
            throw new ApiError(httpStatus.NOT_FOUND, 'City record not found!');
        }
    }
    if (formData.statusId) {
        const statusIdRecord = await StatusTypeModel.findByPk(formData.statusId);
        if (!statusIdRecord) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Status record not found!');
        }
    }
    if (formData.ibfId) {
        const ibfIdRecord = await IbFormModel.findByPk(formData.ibfId);
        if (!ibfIdRecord) {
            throw new ApiError(httpStatus.NOT_FOUND, 'ibfId record not found!');
        }
    }
    if (formData.mfId) {
        const mfIdRecord = await MortuaryFormModel.findByPk(formData.mfId);
        if (!mfIdRecord) {
            throw new ApiError(httpStatus.NOT_FOUND, 'mfId record not found!');
        }
    }
    const coffinFormCreated = await CoffinFormModel.create(formData);
    if (!coffinFormCreated) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Coffin form not created');
    }
    return getCoffinFormById(coffinFormCreated.id)
    // return coffinFormCreated;  
} catch (error) {
            throw new ApiError(httpStatus.NOT_FOUND, error);
}
}

const getCoffinFormById = async (id) => {
    return await CoffinFormModel.findByPk(id, {
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
                model: StatusTypeModel,
                as: 'status',
                attributes: ['id', 'name'],
            },
            {
                model: IbFormModel,
                as: 'ibForm',
                attributes: ['id', 'patientName'],
            },
            {
                model: MortuaryFormModel,
                as: 'mortuaryForm',
                attributes: ['id', 'fullNameOfTheDeceased'],
            }
        ]
    });
};

const updateCoffinForm = async (req, formData) => {
    formData.updatedBy = req.user.id;
    formData.dateTime = formData.dateTime ? createDatetime(formData?.dateTime) : null
    formData.dateTimeofDeath = formData?.dateTimeofDeath ? createDatetime(formData?.dateTimeofDeath) : null

    if (formData.countryId) {
        const countryIdRecord = await CountryModel.findByPk(formData.countryId);
        if (!countryIdRecord) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Country record not found!');
        }
    }
    if (formData.cityId) {
        const cityIdRecord = await CityModel.findByPk(formData.cityId);
        if (!cityIdRecord) {
            throw new ApiError(httpStatus.NOT_FOUND, 'City record not found!');
        }
    }

    
    if (formData.statusId) {
        const statusIdRecord = await StatusTypeModel.findByPk(formData.statusId);
        if (!statusIdRecord) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Status record not found!');
        }
    }
    if (formData.ibfId) {
        const ibfIdRecord = await IbFormModel.findByPk(formData.ibfId);
        if (!ibfIdRecord) {
            throw new ApiError(httpStatus.NOT_FOUND, 'ibfId record not found!');
        }
    }
    if (formData.mfId) {
        const mfIdRecord = await MortuaryFormModel.findByPk(formData.mfId);
        if (!mfIdRecord) {
            throw new ApiError(httpStatus.NOT_FOUND, 'mfId record not found!');
        }
    }
    const coffinForm = await getCoffinFormById(formData.id);
    if (!coffinForm) {
        throw new ApiError(httpStatus.NOT_FOUND, "Coffin form not found");
    }
    delete formData.id;
    Object.assign(coffinForm, formData);
    const updatedCoffinForm = await coffinForm.save();
    return await getCoffinFormById(updatedCoffinForm.id)
    // return updatedCoffinForm;
}

const getCoffinForms = async (filter, options, searchQuery) => {
    let limit = options.pageSize;
    let offset = 0 + (options.pageNumber - 1) * limit
    searchQuery = searchQuery.toLowerCase();
    const { count, rows } = await CoffinFormModel.findAndCountAll({
        order: [
            ['updatedAt', 'DESC']
        ],
        where: {
            [Op.or]: [
                { 'country.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('country.name')), 'LIKE', '%' + searchQuery + '%') },
                { 'city.name': Sequelize.where(Sequelize.fn('LOWER', Sequelize.col('city.name')), 'LIKE', '%' + searchQuery + '%') },
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
                model: StatusTypeModel,
                as: 'status',
                attributes: ['id', 'name'],
            },
            {
                model: IbFormModel,
                as: 'ibForm',
                attributes: ['id', 'patientName'],
            },
            {
                model: MortuaryFormModel,
                as: 'mortuaryForm',
                attributes: ['id', 'fullNameOfTheDeceased'],
            }
        ],
        offset: offset,
        limit: limit,
    });
    return Pagination.paginationFacts(count, limit, options.pageNumber, rows);
    // return coffinForms;
};

const deleteCoffinFormById = async (coffinFormId, deleteBody, updatedBy) => {
    const coffinForm = await getCoffinFormById(coffinFormId);
    if (!coffinForm) {
        throw new ApiError(httpStatus.NOT_FOUND, "Coffin Form not found");
    }
    deleteBody.updatedBy = updatedBy;
    deleteBody.isActive = !coffinForm.isActive;
    delete deleteBody.id;
    Object.assign(coffinForm, deleteBody);
    const updatedCoffinForm = await coffinForm.save();
    return getCoffinFormById(updatedCoffinForm.id)
    // await coffinForm.destroy();
    // return coffinForm;
};

module.exports = {
    createCoffinForm,
    getCoffinFormById,
    updateCoffinForm,
    getCoffinForms,
    deleteCoffinFormById
};