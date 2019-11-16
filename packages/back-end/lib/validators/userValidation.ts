import { ethers } from "ethers";

//check if the address is a valid ethereum address
const isAddress = (address) => {
    try {
        ethers.utils.getAddress(address);
    } catch (e) {
        return false; 
    }
    return true;
}

export const validateUserSchema = async(req, res, next) => {
    try {

      let {firstName, lastName, publicAddress} = req.body;
      const validAddress = isAddress(publicAddress)
        
      if (firstName === "" || lastName === "" || publicAddress === "" || validAddress === false) {
        return res.status(400).json({status: 400, error: "Invalid Input, Please fill all mandatory fields"})
      } else {
        return next();
      }

    } catch (err) {
      return res
        .status(500)
        .send({ status: 500, error: "Internal Server Error" });
    }
};