// Password defaults
// var defaults = {
//   length: 8
// }
/*
     * Generates a random password.
     */
exports.generate = function (userOptions) {
//   var options = _.assign(defaults, userOptions)

  // Generate a random number.
  var number = Math.random()

  // Convert this number into a string.
  var string = number.toString(36)

  // Grab a section of the string as the password
  var password = string.slice(-userOptions)

  // Return the password back!
  return password
}
