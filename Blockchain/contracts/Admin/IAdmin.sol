pragma solidity = 0.5.0;

contract IAdmin {
    
    


    /**
      * @dev These functions are in the WhitelistAdminRole contract. 
      *      As the Admin contract inherits from both, these functions are 
      *      available from the admin contract, and can be found in the 
      *      WhitelistAdminRole contract from OppenZeppelin.
      *
      * @dev A view function checking if an address is an admin
        function isWhitelistAdmin(address account) public view returns (bool) {
            return _whitelistAdmins.has(account);
        }
      *
      * @dev Allows an admin address to add another admin account
        function addWhitelistAdmin(address account) public onlyWhitelistAdmin {
            _addWhitelistAdmin(account);
        }
      *
      * @dev Allows an admin address to remove itself as an admin
        function renounceWhitelistAdmin() public {
            _removeWhitelistAdmin(msg.sender);
        }
     */
}