const httpStatus = require('http-status');
const pick = require('../../../utils/pick');
const ApiError = require('../../../utils/ApiError');
const catchAsync = require('../../../utils/catchAsync');
const { settingService } = require('../../../services');
const { HttpStatusCodes, HttpResponseMessages } = require('../../../utils/constants');
const GeoPoint = require('geopoint');


const getRolesMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getRolesMasterData(req.user.roleId),
  });
});

const getResourcesMasterData = catchAsync(async (req, res) => {
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: await settingService.getResourcesMasterData(),
    });
});

const getCountriesMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getCountriesMasterData(),
  });
});

const getAlarmTimesMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getAlarmTimesMasterData(),
  });
});

const getCitiesMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getCitiesMasterData(req.body.countryId),
  });
});

const getCentersMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getCentersMasterData(),
  });
});

const getSubCentersMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getSubCentersMasterData(req.body.centerId),
  });
});

const getCentersMasterDataByCityId = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getCentersMasterDataByCityId(req.body.cityId),
  });
});

const getStatusMasterData = catchAsync(async (req, res) => {
    res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      data: await settingService.getStatusMasterData(req.body),
    });
});

const getDriversMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getDriversMasterData(req.body.subCenterId, req.body.available, req.body.notAvailable),
  });
});

const getVehiclesCategoryMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getVehiclesCategoryMasterData(),
  });
});

const getIncidentTypeMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getIncidentTypeMasterData(),
  });
});

const getIncidentSeverityMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getIncidentSeverityMasterData(),
  });
});

const getVehiclesByCenterIdMasterData = catchAsync(async (req, res) => {
  const filter = { centerId: req.body.centerId, subCenterId: req?.body?.subCenterId ? req?.body?.subCenterId : ''};
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getVehiclesByCenterIdMasterData(req.body.available, req.body.inProgress, filter)
  });
});

const getVehiclesDashboardMasterData = catchAsync(async (req, res) => {
  const filter = { cityId: req.body.cityId,
                   centerId: req?.body?.centerId ? req?.body?.centerId : '',
                   subCenterId: req?.body?.subCenterId ? req?.body?.subCenterId : '',
                   alarmTimeId: req?.body?.alarmTimeId ? req?.body?.alarmTimeId : ''
                  };
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getVehiclesDashboardMasterData(req, filter)
  });
});

const getNearByCenters = catchAsync(async (req, res) => {
  const { lat, long } = req.body;
  const CentersMasterData = await settingService.getCentersMasterData_old();
  

   function haversineGreatCircleDistance(lat, long, lat2, lon2, earthRadius = 3959)
   {
       // earth radius 
       // in meter = 6371000
       // in miles = 3959
     // convert from degrees to radians
     var pi = Math.PI;
    //  return degrees * (pi/180);

     var latFrom = (lat * (pi/180));
     var lonFrom = (long * (pi/180));
     var latTo =   (lat2 * (pi/180));
     var lonTo =   (lon2 * (pi/180));

     var latDelta = latTo - latFrom;
     var lonDelta = lonTo - lonFrom;

     var angle = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(latDelta / 2), 2) +
       Math.cos(latFrom) * Math.cos(latTo) * Math.pow(Math.sin(lonDelta / 2), 2)));
     return angle * earthRadius;
   }

  // const dist = haversineGreatCircleDistance(lat, long, lat2, lon2);

  // function distance(lat1, lon1, lat2, lon2, unit) {
  //   if ((lat1 == lat2) && (lon1 == lon2)) {
  //     return 0;
  //   }
  //   else {
  //     var radlat1 = Math.PI * lat1/180;
  //     var radlat2 = Math.PI * lat2/180;
  //     var theta = lon1-lon2;
  //     var radtheta = Math.PI * theta/180;
  //     var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  //     if (dist > 1) {
  //       dist = 1;
  //     }
  //     dist = Math.acos(dist);
  //     dist = dist * 180/Math.PI;
  //     dist = dist * 60 * 1.1515;
  //     if (unit=="K") { dist = dist * 1.609344 }
  //     if (unit=="N") { dist = dist * 0.8684 }
  //     return dist;
  //   }
  // }

  // console.log(distance(lat, long, lat2, lon2, "K"));
  // const dist = distance(lat, long, lat2, lon2, "K");
    
    point1 = new GeoPoint(lat, long);
    point2 = new GeoPoint(24.88305973296032, 67.06964795040052);
    var dist = point1.distanceTo(point2, true)//output in kilometers
    console.log(dist)

  res.send({
      code: HttpStatusCodes.OK,
      message: HttpResponseMessages.OK,
      distance: dist,
      data: CentersMasterData
    });
});

const getHospitalsMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getHospitalsMasterData(req.body.cityId),
  });
});

const getPoliceStationsMasterData = catchAsync(async (req, res) => {
  res.send({
    code: HttpStatusCodes.OK,
    message: HttpResponseMessages.OK,
    data: await settingService.getPoliceStationsMasterData(req.body.cityId),
  });
});

module.exports = {
  getRolesMasterData,
  getResourcesMasterData,
  getCountriesMasterData,
  getAlarmTimesMasterData,
  getCitiesMasterData,
  getCentersMasterData,
  getSubCentersMasterData,
  getCentersMasterDataByCityId,
  getDriversMasterData,
  getVehiclesCategoryMasterData,
  getIncidentTypeMasterData,
  getIncidentSeverityMasterData,
  getVehiclesByCenterIdMasterData,
  getStatusMasterData,
  getNearByCenters,
  getVehiclesDashboardMasterData,
  getHospitalsMasterData,
  getPoliceStationsMasterData
};
