/*
 * Helpers for various tasks
 */

// Container for all helpers
const helpers = {};

// Pares a JSON string to an object in all cases, without throwing
helpers.parseJsonToObject = function(str) {
  try {
    let obj = JSON.parse(str);
    return obj;
  } catch (e) {
    return {};
  }
};


// Export the module
module.exports = helpers;