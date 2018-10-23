/*
 * These are the request handlers and in-memory data
 */
// Define in-memory data
const doctorsId = 0;
let appointmentId = 0;
// Store objects that have doctors unique ID, a first name, and a last name.
const doctors = [
  {uniqueId : '0', firstName: 'Dr. A', lastName: 'B'},
  {uniqueId : '1', firstName: 'Dr. Alg', lastName: 'Kri'}
  ];
// Store objects that have appointment unique ID, patient first name, patient last name, date & time, and kind
const appointment = [];
const doctorAppointment = [];


// Define the handlers
const handlers = {};

// Doctor handler
handlers.doctor = function(data, callback) {
  const acceptableMethods = ['get'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._doctor[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for doctor submethods
handlers._doctor = {};


// Doctor - get
// Get a list of all doctors
handlers._doctor.get = function(data, callback) {
  callback(200, doctors);
};



// Appointment handler
handlers.appointment = function(data, callback) {
  const acceptableMethods = ['post', 'delete'];
  if(acceptableMethods.indexOf(data.method) > -1) {
    handlers._appointment[data.method](data, callback);
  } else {
    callback(405);
  }
};

// Container for doctor submethods
handlers._appointment = {};

// Appointment - post
// Required data: doctorsId, firstName, lastName, date, time, kind
handlers._appointment.post = function(data, callback) {
  console.log('appointment post works');
  const doctorsId = typeof(data.payload.doctorsId) === 'string' ? data.payload.doctorsId.trim() : false;
  const firstName = typeof(data.payload.firstName) === 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) === 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const date = typeof(data.payload.date) === 'string' && data.payload.date.trim().length > 0 ? data.payload.date.trim() : false;
  const time = typeof(data.payload.time) === 'string' && data.payload.time.trim().length > 0 ? data.payload.time.trim() : false;
  const kind = typeof(data.payload.kind) === 'string' && data.payload.kind.trim().length > 0 ? data.payload.kind.trim() : false;
  if (doctorsId && firstName && lastName && date && time && kind) {
    // Create entry in appointment table
    appointment.push({
      appointmentId : appointmentId,
      firstName : firstName,
      lastName : lastName,
      date : date,
      time : time,
      kind : kind
    });

    // Create entry in doctor appointment table
    doctorAppointment.push({
      doctorsId : doctorsId,
      appointmentId : appointmentId
    });
    appointmentId += 1;
    callback(200);
  } else {
    callback(400, {'Error' : 'Missing required fields'});
  }
};


// Appointment - delete
// Required data: doctorsId, appointmentId
handlers._appointment.delete = function(data, callback) {
  console.log('appointment delete works');
  const doctorsId = typeof(data.queryStringObject.doctorsId) === 'string' ? data.queryStringObject.doctorsId : false;
  const appointmentId = typeof(data.queryStringObject.appointmentId) === 'string' ? data.queryStringObject.appointmentId : false;
  for(let i = 0; i < doctorAppointment.length; i++) {
    if(doctorAppointment[i].doctorsId === doctorsId && doctorAppointment[i].appointmentId === appointmentId) {
      doctorAppointment[i] = 'undefined';
      callback(200);
    }
  }
};


// Ping handler
handlers.ping = function(data, callback) {
  callback(200);
};

// Not found handler
handlers.notFound = function(data, callback) {
  callback(404);
};


// Export the module
module.exports = handlers;