"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { ThreeDot } from "react-loading-indicators";

interface transactionData {
  firstName: string;
  lastName: string;
  email: string;
  phonenumber: number;
  date: string;
  invoice: string;
  amount: number;
  type: string;
}
export default function TransactionHistory() {
  const [transactionHistorydata, setTransactionHistoryData] = useState<
    transactionData[]
  >([]);

  const dummyTransactions: transactionData[] = [
    {
      firstName: "Samuel",
      lastName: "Kibunda",
      email: "samkaizi40@gmail.com",
      phonenumber: 2609738273647,
      date: "2025/04/02",
      invoice: "73hfn74",
      amount: 300,
      type: "credit",
    },
    {
      firstName: "Samuel",
      lastName: "Kibunda",
      email: "samkaizi40@gmail.com",
      phonenumber: 2609738273647,
      date: "2025/04/02",
      invoice: "73hfn74",
      amount: 300,
      type: "credit",
    },
    {
      firstName: "Samuel",
      lastName: "Kibunda",
      email: "samkaizi40@gmail.com",
      phonenumber: 2609738273647,
      date: "2025/04/02",
      invoice: "73hfn74",
      amount: 300,
      type: "credit",
    },
    {
      firstName: "Samuel",
      lastName: "Kibunda",
      email: "samkaizi40@gmail.com",
      phonenumber: 2609738273647,
      date: "2025/04/02",
      invoice: "73hfn74",
      amount: 300,
      type: "credit",
    },
    {
      firstName: "Samuel",
      lastName: "Kibunda",
      email: "samkaizi40@gmail.com",
      phonenumber: 2609738273647,
      date: "2025/02/02",
      invoice: "73hf74n74",
      amount: 500,
      type: "credit",
    },
    {
      firstName: "Samuel",
      lastName: "Kibunda",
      email: "samkaizi40@gmail.com",
      phonenumber: 2609738273647,
      date: "2025/02/02",
      invoice: "73hf74n74",
      amount: 500,
      type: "credit",
    },
    {
      firstName: "Samuel",
      lastName: "Kibunda",
      email: "samkaizi40@gmail.com",
      phonenumber: 2609738273647,
      date: "2025/02/02",
      invoice: "73hf74n74",
      amount: 500,
      type: "credit",
    },
  ];

  const handleEmailSearch = (invoice: string) => {
    // Simulate an API call to search for recipients by email
    const results = dummyTransactions.filter((history) =>
      history.invoice.toLowerCase().includes(invoice.toLowerCase())
    );
    console.log(results);
    setTransactionHistoryData(results);
  };

  const [showAll, setShowAll] = useState(false);

  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="flex-1 h-screen font-[family-name:var(--font-geist-sans)] flex-col">
      <div className="mb-[10px] flex flex-col justify-items-center">
        <span className="text-center text-[#313131] text-[18px] sm:text-[23px] md:text-[27px] lg:text-[30px] text-bold">
          Transactions
        </span>
      </div>

      <div className="flex flex-col mx-[10px]">
        <div>
          {dummyTransactions.length > 0 ? (
            <div className="mx-[1%] sm:mx-[50px] md:mx-[50px] lg:mx-[50px]">
              {(showAll
                ? dummyTransactions
                : dummyTransactions.slice(0, 5)
              ).map((transaction, index) => (
                <div
                  key={index}
                  className="bg-[#ececec] p-[10px] rounded-[10px] justify-between min-w-full flex flex-row mb-[10px] items-center"
                >
                  <div className="flex flex-col">
                    <span className="text-[#000000] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                      {transaction.firstName} {transaction.lastName}
                    </span>
                    <span className="text-[#5f5f5f] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                      {transaction.phonenumber}
                    </span>
                  </div>

                  <span className="text-[#5f5f5f] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                    {transaction.date}
                  </span>
                  <span className="text-[#5f5f5f] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                    {transaction.invoice}
                  </span>
                  <div className="flex flex-row">
                    {transaction.type === "credit" && (
                      <span className="text-[#000000] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] text-bold">
                        -
                      </span>
                    )}
                    <span className="text-[#000000] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] text-bold">
                      {transaction.amount}
                    </span>
                  </div>
                </div>
              ))}
              {dummyTransactions.length > 5 && (
                <div className=" flex-1 items-center justify-items-center">
                  <button
                    onClick={handleShowMore}
                    className="mt-[10px] text-[#0000ff] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]"
                  >
                    {showAll ? "Show Less" : "Show More"}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center ">
              <span className="text-[#ff0000] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                No transactions found.
              </span>
              <div className="bg-[black] p-[10px] rounded-[10px] flex flex-col justify-items-center items-center justify-center">
                <button
                  onClick={() => handleEmailSearch("")}
                  className="mt-[10px] text-[#ffffff] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]"
                >
                  Retry
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
