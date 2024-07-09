// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.21;

contract CoreContract {
    address public owner;
    mapping(address => bool) public registeredUsers;
    event UserRegistered(address user);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerUser(address _user) public onlyOwner {
        registeredUsers[_user] = true;
        emit UserRegistered(_user);
    }

    function authenticateUser(address _user) public view returns (bool) {
        return registeredUsers[_user];
    }
}
