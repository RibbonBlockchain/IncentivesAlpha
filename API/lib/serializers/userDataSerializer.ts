export const mapUserDataToResponse = user => ({
  id: user._id,
  firstname: user.firstName,
  lastname: user.lastName,
  publicaddress: user.publicAddress,
  dateofbirth: user.dateOfBirth,
  idnumber: user.idNumber
});
