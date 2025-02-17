"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { ThreeDot } from "react-loading-indicators";
import { error } from "console";

export interface TransactionData {
  TransactionId: string;
  UserId: string;
  CounterPartyFirstName: string;
  CounterPartyLastName: string;
  TransactionDate: string;
  Amount: number;
  Type: string;
}
export default function TransactionHistory() {
  const [transactionHistorydata, setTransactionHistoryData] = useState<
    TransactionData[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [errorLoadingTransactionHistory, setErrorLoadingTransactionHistory] =
    useState(false);

  useEffect(() => {
    setLoading(true);
    console.log("getting Transaction history");
    getTransactionHistory();
  }, []);

  // fetches transaction history
  const getTransactionHistory = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error("No logged-in user found.");
      }
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.Id;
      const response = await fetch(
        `https://localhost:7248/api/users/transactionHistory/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setTransactionHistoryData(data);
        setLoading(false);
      } else {
        console.error("Failed to fetch transaction history");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const [showAll, setShowAll] = useState(false);

  const handleShowMore = () => {
    setShowAll(!showAll);
  };

  // filter date
  const filterDate = (date: string) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.toLocaleString("default", { month: "long" });
    const year = newDate.getFullYear();
    const hours = newDate.getHours();
    const minutes = newDate.getMinutes();
    return `${day}th ${month} ${year}, ${hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
  };

  return (
    <div className=" font-[family-name:var(--font-geist-sans)] flex-col bg-white ">
      {loading ? (
        <div className="flex flex-col items-center justify-center">
          <ThreeDot color="#000000" size="large" />
        </div>
      ) : errorLoadingTransactionHistory ? (
        <div className="flex flex-col items-center justify-center">
          <span className="text-[#ff0000] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
            Error loading transaction history.
          </span>
          <div className="bg-[black] p-[10px] rounded-[10px] flex flex-col justify-items-center items-center justify-center">
            <button
              onClick={() => getTransactionHistory()}
              className="mt-[10px] text-[#ffffff] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <div className=" flex-1 w-full">
          <div className="mb-[10px] flex flex-col justify-items-center">
            <span className="text-center text-[#373737] text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-boldtext-[#373737] text-[16px] sm:text-[28px] md:text-[23px] lg:text-[25px] font-bold">
              Transactions
            </span>
          </div>

          <div className=" flex flex-col  ">
            <div>
              {transactionHistorydata.length > 0 ? (
                <div className="  mx-[1%] sm:mx-[100px] md:mx-[150px] lg:mx-[200px]">
                  {(showAll
                    ? transactionHistorydata
                    : transactionHistorydata.slice(0, 5)
                  ).map((transaction, index) => (
                    <div
                      key={index}
                      className=" bg-[#ececec] p-[10px] rounded-[10px] justify-between min-w-full flex flex-row mb-[10px] items-center"
                    >
                      <div className="flex flex-col">
                        <span className="text-[#000000] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                          {transaction?.Type === "credit"
                            ? `From: ${transaction?.CounterPartyFirstName} ${transaction?.CounterPartyLastName}`
                            : `To: ${transaction?.CounterPartyFirstName} ${transaction?.CounterPartyLastName}`}
                        </span>
                      </div>

                      <span className="text-[#5f5f5f] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                        {filterDate(transaction?.TransactionDate)}
                      </span>
                      <span className="text-[#5f5f5f] text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px]">
                        {transaction?.TransactionId.slice(0, 8)}...
                      </span>
                      <div className="flex flex-row">
                        <span
                          className={`text-[10px] sm:text-[12px] md:text-[14px] lg:text-[16px] text-bold ${
                            transaction?.Type === "credit"
                              ? "text-[#008000]"
                              : "text-[#ff0000]"
                          }`}
                        >
                          {transaction?.Type === "credit" ? "+" : "-"} K{" "}
                          {transaction?.Amount}
                        </span>
                      </div>
                    </div>
                  ))}
                  {transactionHistorydata.length > 5 && (
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
                      onClick={() => getTransactionHistory()}
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
      )}
    </div>
  );
}
