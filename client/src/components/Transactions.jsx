import React, { useContext } from 'react';

import { TransactionContext } from '../context/TransactionContext';
import dummyData from '../utils/dummyData';
import { shortenAddress } from '../utils/shortenAddress';
import useFetch from '../hooks/useFetch';

const TransactionCard = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url }) => {
    const gifUrl = useFetch({keyword});
    return (
        //different widths for different device sizes
        <div className="bg-[#181918] m-4 flex flex-1
            2xl:min-w-[450px] 
            2xl:max-w-[500px]
            sm:min-w-[270px]
            sm:max-w-[300px]
            min-w-full
            flex-col p-3 rounded-md hover:shadow-2xl"
        >
            <div className="flex flex-col items-center w-full mt-3">
                <div className="display-flex justify-start w-full mb-6 p-2">
                    <a href={`https://ropsten.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer">
                        <p className="text-white text-base">From: {shortenAddress(addressFrom)}</p>
                    </a>
                    <a href={`https://ropsten.etherscan.io/address/${addressTo}`} target="_blank" rel="noreferrer">
                        <p className="text-white text-base">To: {shortenAddress(addressTo)}</p>
                    </a>
                    <p className="text-white text-base">Amount: {amount} ETH</p>
                    {message && (
                        <>
                         <br />
                         <p className="text-white text-base">Message: {message}</p>
                        </>
                    )}
                </div>
                <img src={gifUrl || url} alt="gif" className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover" />

                <div className="bg-black p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
                    <p className="text-[#37c7da] font-bold">{timestamp}</p>
                </div>
            </div>
        </div>
    )
}

const Transactions = () => {
    //getting the transaction data from the transaction context
    const { currentAccount, transaction } = useContext(TransactionContext);

    return ( 
        <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
            <div className="flex flex-col md:p-12 py-12 px-4">
                {/* latest transactions */}
                {currentAccount ? (
                    <h3 className="text-white text-3xl text-center my-2">
                        Latest Transactions
                    </h3>
                ): (
                    /* connect account to see latest transactions */
                    <h3 className="text-white text-3xl text-center my-2">
                        Connect your account to see the latest transactions
                    </h3>
                )}

                {/* Looping through the transactions  and reversing it because we want to start from the newest to the oldest*/}
                <div className="flex flex-wrap justify-center items-center">
                    {transaction.reverse().map((transaction, i) => (
                        <TransactionCard key={i} {...transaction} /> //Spreading all the properites we get froma transaction into the transaction card component as props
                    ))}
                </div>
                
            </div>
        </div>
     );
}
 
export default Transactions;