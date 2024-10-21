const DDL_FIELD_NAMES = {
  default :{
    labelField: 'name',
    valueField: 'id',
  },
  driver :{
    labelField: 'userName',
    valueField: 'id',
  },
  alarmTime: {
    labelField: 'durationInMinutes',
    valueField: 'id',
  },
  vehicle:{
    // labelField: 'name'
    labelField: 'regNo',
    valueField: 'id',
  },
  model:{
    labelField: 'modelName',
    valueField: '_id',
  },
  variant:{
    labelField: 'variant',
    valueField: '_id',
  },
  inspectionType:{
    labelField: 'inspectionType',
    valueField: '_id',
  },
  parts:{
    labelField: 'parts',
    valueField: '_id',
  },
  userName:{
    labelField: 'userName',
    valueField: '_id',
  },
  BankName:{
    labelField: 'Name',
    valueField: 'Id',
  },
  BranchName:{
    labelField: 'Name',
    valueField: 'Id',
  },
  DeptName:{
    labelField: 'deptName',
    valueField: 'deptId',
  },
  EmployeesKeys:{
    labelField: 'firstName',
    valueField: 'Id',
  },

  FormMenus:{
    labelField: 'formName',
    valueField: 'Id',
  },

  LeaveType:{
    labelField: 'name',
    valueField: 'Id',
  },

  SalaryRevisionKeys:{
    labelField: 'reviewDate',
    valueField: 'Id',
  },
};

const HttpStatusCodes = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  VALIDATION: 409,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
const HttpResponseMessages = {
  OK: 'Successfully',
  // OK: 'Successfully',
  CREATED: 'Successfully Created',
  NO_CONTENT: 'No Content',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized access',
  VALIDATION: 'Request Validation Error',
  FORBIDDEN: 'Forbidden to access required resource',
  NOT_FOUND: 'Resource not found',
  INTERNAL_SERVER_ERROR: 'Something went wrong',
};
module.exports = { DDL_FIELD_NAMES, HttpStatusCodes, HttpResponseMessages };
