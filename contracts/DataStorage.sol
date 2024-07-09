// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.21;

contract DataStorage {
    mapping(bytes32 => bytes) private data;
    event DataStored(bytes32 indexed key, bytes value);
    event DataDeleted(bytes32 indexed key);

    function storeData(bytes32 key, bytes memory value) public {
        data[key] = value;
        emit DataStored(key, value);
    }

    function retrieveData(bytes32 key) public view returns (bytes memory) {
        return data[key];
    }

    function deleteData(bytes32 key) public {
        delete data[key];
        emit DataDeleted(key);
    }
}
