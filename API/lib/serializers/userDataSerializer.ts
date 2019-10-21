export const mapUserDataToResponse = user => ({
  firstname: user.firstName,
  lastname: user.lastName,
  publicaddress: user.publicAddress,
  dateofbirth: user.dateOfBirth,
  idnumber: user.idNumber,
  phoneNumber: user.phoneNumber
});
