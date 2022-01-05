//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

contract Transactions {
    uint256 transactionCount; //A simple number variable that will hold the number of transactions

    event Transfer(address from, address receiver, uint amount, string message, uint256 timestamp, string keyword); //this event is like a function that will be called later on

    struct TransferStruct { //These are properties that the transfer or transaction will have
        address sender;
        address receiver;
        uint amount;
        string message;
        uint256 timestamp;
        string keyword;
    }

    //Array of transactions because we want to store them
    TransferStruct[] transactions;

    function addToBlockchain(address payable receiver, uint amount, string memory message, string memory keyword) public {
        transactionCount += 1;
        transactions.push(TransferStruct(msg.sender, receiver, amount, message, block.timestamp, keyword)); //We are pushing our transferStruct and passing in all the parameters our transfer struct needs

        emit Transfer(msg.sender, receiver, amount, message, block.timestamp, keyword);
    }

    function getAllTransactions() public view returns (TransferStruct[] memory) {
        return transactions;
    }

    function getTransactionCount() public view returns (uint256) {
        return transactionCount;
    }

}



//(address from) adress: is the type of the address
// from: is the variable name

//uint 256 timestamp: will be a number showing when the transfer was sent. Similar to a date and time

//Whenever the add to blockchain function is called, we