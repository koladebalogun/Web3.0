import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

//We are destrcuturing the ethereum object from window.ethereum
const { ethereum } = window;



const getEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract( contractAddress, contractABI, signer ); //These three things are needed to fetch the contract

  console.log({ provider, signer, transactionContract });

  return transactionContract;

};




export const TransactionProvider = ({ children }) => {
    //STATES
  const [currentAccount, setCurrentAccount] = useState("");
  const [formData, setFormData] = useState({ addressTo: "", amount: "", keyword: "", message: "" }); // creating the state variables here and pass them through the context value into the welcome component
  const [isLoading, setIsLoading] = useState(false);
  const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));
  const [transaction, setTransaction] = useState([]);





  const handleChange = (e, name) => {
    setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };




  const getAllTransactions = async () => {
    try {
      if (!ethereum) return alert("Please Install metamask");

      const transactionContract = getEthereumContract();

      const availableTransactions = await transactionContract.getAllTransactions();

      const structuredTransaction = availableTransactions.map((transaction) => ({
        addressTo: transaction.receiver,
        addressFrom: transaction.sender,
        timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
        message: transaction.message,
        keyword: transaction.keyword,
        amount: parseInt(transaction.amount._hex) / (10 ** 18)
      }))

      setTransaction(structuredTransaction);
    } catch (error) {
      console.log(error);
    }
  }




  //Function for checking if a wallet is connected at the start
  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) return alert("Please Install metamask");

      //getting the metamask connected account
      const accounts = await ethereum.request({ method: "eth_accounts" });

      console.log(accounts);

      if (accounts.length) {
        setCurrentAccount(accounts[0]); //At the start of every render, we'll have access to our account

        getAllTransactions();
      } else {
        console.log("No accounts found");
      }
    } catch (error) {
      console.log(error);

      throw new Error("No Ethereum Object");
    }
  };





  //setting up the number of transactions so that for every transaction, we'll know which one it is.
  const checkIfTransactionsExist = async () => {
    try {
      if (ethereum) {
        const transactionContract = getEthereumContract();
        const currentTransactionCount = await transactionContract.getTransactionCount();

        window.localStorage.setItem("transactionCount", currentTransactionCount);
      }
    } catch (error) {
      console.log(error);
    }
  };



  //Function for connecting the account
  const connectWallet = async () => {
    try {
      if (!ethereum) return alert("Please Install metamask");

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setCurrentAccount(accounts[0]); //connecting the first account on the metamask
    } catch (error) {
      console.log(error);

      throw new Error("No Ethereum Object");
    }
  };




  //Function for sending transaction
  const sendTransaction = async () => {
    try {
      if (!ethereum) return alert("Please Install metamask");

      //get the data from the form
      const { addressTo, amount, keyword, message } = formData;
      const transactionContract = getEthereumContract();
      const parsedAmount = ethers.utils.parseEther(amount);

      await ethereum.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: currentAccount,
            to: addressTo,
            gas: "0x5208", //2100 gwei
            value: parsedAmount._hex,
          },
        ],
      });

      const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      setIsLoading(false);
      console.log(`Success - ${transactionHash.hash}`);

      const transactionCount = await transactionContract.getTransactionCount();

      setTransactionCount(transactionCount.toNumber());

      window.reload();

    } catch (error) {
      console.log(error);

      throw new Error("No Ethereum Object");
    }
  };





  //calling the function only at the start of the application
  useEffect(() => {
    checkIfWalletIsConnected();
    checkIfTransactionsExist();
  }, []);

  return (
    <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transaction, isLoading }} >
      {children}
    </TransactionContext.Provider>
  );
};
