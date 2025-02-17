"use client";
import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import TransactionHistory from "../TransactionHistory/transactionHistory";
import { ThreeDot } from "react-loading-indicators";

interface WalletData {
  UserId: string;
  Balance: number;
}

interface userDataType {
  Id: string;
  FirstName: string;
  LastName: string;
  PhoneNumber: number;
  Balance: number;
  Email: string;
}

// greets user depending on time of day
const getTimeOfDayGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good Morning";
  } else if (currentHour < 17) {
    return "Good Afternoon";
  } else if (currentHour < 20) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

// data for transaction history
interface transactionData {
  FirstName: string;
  LastName: string;
  Email: string;
  PhoneNumber: number;
  TransactionDate: string;
  TransactionId: string;
  Amount: number;
  Type: string;
}

export default function HomeComponent() {
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [userData, setUserData] = useState<userDataType | null>(null);
  const [errorLoadingWalletData, setErrorLoadingWalletData] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMoneyInOut, setLoadingMoneyInOut] = useState(true);
  const [moneyInOut, setMoneyInOut] = useState<number[]>([]);
  const [transactionHistorydata, setTransactionHistoryData] = useState<
    transactionData[]
  >([]);

  useEffect(() => {
    setGreeting(getTimeOfDayGreeting());
    setLoadingMoneyInOut(true);
    const user = localStorage.getItem("user");
    if (user) {
      setUserData(JSON.parse(user));
    }
    fetchWallet();
    setLoading(false);
  }, []);

  const fetchWallet = async () => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error("No logged-in user found.");
      }
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.Id;
      const response = await fetch(
        `https://localhost:7248/api/users/wallet/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        console.log("current users wallet: ", data);
        getTransactionHistory();

        setWallet(data);
      } else {
        setLoading(false);
        setErrorLoadingWalletData(true);
      }
    } catch (err: any) {
      setLoading(false);
      setErrorLoadingWalletData(true);
    }
    setLoading(false);
  };

  // fetches transaction history
  const getTransactionHistory = async () => {
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
        console.log("Transaction history: ", data);
        setTransactionHistoryData(data);
        const totals = calculateTransactionTotals(data);
        setMoneyInOut([totals.moneyIn, totals.moneyOut]);
        setLoadingMoneyInOut(false);
      } else {
        console.error("Failed to fetch transaction history");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setLoadingMoneyInOut(false);
    }
  };

  // Calculate money in and money out from transaction history data
  const calculateTransactionTotals = (transactions: transactionData[]) => {
    return transactions.reduce(
      (acc, tx) => {
        if (tx.Type && tx.Type.toLowerCase() === "debit") {
          acc.moneyOut += Number(tx.Amount);
        } else if (tx.Type && tx.Type.toLowerCase() === "credit") {
          acc.moneyIn += Number(tx.Amount);
        }
        return acc;
      },
      { moneyIn: 0, moneyOut: 0 }
    );
  };

  return (
    <div className=" flex-1 flex-col font-[family-name:var(--font-geist-sans)]  ">
      <div
        className=" mb-[50px] flex flex-col items-center justify-items-center "
        id="home"
      >
        {errorLoadingWalletData ? (
          <div className="flex flex-col justify-center justify-center mx-[10px]">
            <span className="text-red-500 text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-bold">
              Error loading user data. Please try again later.
            </span>
            <button
              className="mt-[10px] bg-black p-[10px] rounded-[10px]"
              onClick={fetchWallet}
            >
              <span className="text-white text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                Retry
              </span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center  ">
            <div className=" mt-[50px]"></div>
            <span className=" text-[#373737] text-[16px] sm:text-[28px] md:text-[23px] lg:text-[25px] font-bold ">
              {greeting} {userData?.FirstName}
            </span>

            <div className=" rounded-[12px] border-[1px] border-[#cbd2d6] shadow-lg rounded-[12px] py-[50px] sm:py-[60px] md:py-[70px] lg:py-[80px] px-[100px] sm:px-[100px] md:px-[100px] lg:px-[100px] mx-[00px] bg-white flex flex-col items-center mt-[20px]">
              <div className="flex flex-col ">
                <div className=" flex flex-col items-center justify-items-center">
                  <span className="mt-[15px] mb-[15px] text-[#737373] text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                    Your balance
                  </span>
                  <span className="text-[#278727] text-[24px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-bold">
                    K{wallet?.Balance} ZMW
                  </span>
                  <span className=" text-black text-bold text-[16px] sm:text-[18px] md:text-[23px] lg:text-[25px] ">
                    Available
                  </span>
                </div>
              </div>
              <div className=" flex flex-col mt-[30px]  ">
                <Link href="/TransferMoney" passHref>
                  <button className=" bg-black text-white ml-[20px] p-[10px] rounded-[10px] hover:bg-gray-800 transition duration-300 ease-in-out">
                    <span className="text-[12px] sm:text-[16px] md:text-[18px] lg:text-[18px]">
                      Send Money
                    </span>
                  </button>
                </Link>
              </div>
            </div>
            <span className=" mt-[30px] text-[#373737] text-[16px] sm:text-[28px] md:text-[23px] lg:text-[25px] font-bold ">
              Insights
            </span>
            <div className=" mt-[20px] flex flex-row items-center judtify-items-center gap-[100] sm:gap-80 md:gap-80 lg:gap-80 ">
              <div className=" shadow-lg rounded-[12px] border-[1px] p-[10px] border-[#cbd2d6] flex flex-col items-center ">
                <span className=" text-black text-bold text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] ">
                  Money in
                </span>
                <span className=" mt-[15px] text-black text-bold text-[21px] sm:text-[21px] md:text-[23px] lg:text-[25px] ">
                  K{moneyInOut[0]}
                </span>
              </div>
              <div className=" shadow-lg rounded-[12px] border-[1px] p-[10px] border-[#cbd2d6] flex flex-col items-center ">
                <span className=" text-black text-bold text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] ">
                  Money Out
                </span>
                <span className=" mt-[15px] text-black text-bold text-[21px] sm:text-[21px] md:text-[23px] lg:text-[25px] ">
                  K{moneyInOut[1]}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
