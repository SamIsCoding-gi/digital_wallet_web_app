"use client";
import React, { useState, useEffect, use } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import TransactionHistory from "../TransactionHistory/transactionHistory";
import { ThreeDot } from "react-loading-indicators";

interface userDataType {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  balance: number;
  email: string;
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

export default function HomeComponent() {
  const [userData, setUserData] = useState<userDataType | null>(null);
  const [errorLoadingUserData, setErrorLoadingUserData] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("Samuel");
  const [balance, setBalance] = useState(500);

  useEffect(() => {
    setGreeting(getTimeOfDayGreeting());
    getUserData();
    setLoading(false);
  }, []);

  //
  useEffect(() => {
    if (userData) {
    }
  }, [userData]);

  // fetches user data
  const getUserData = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      console.error("No user found in localStorage.");
      setErrorLoadingUserData(true);
      setLoading(false);

      return;
    }
    const parsedUser = JSON.parse(user);
    console.log(parsedUser);
    let userId = parsedUser.Id;
    setLoading(true);
    try {
      const response = await fetch(
        `https://localhost:7248/api/users/userData/${userId}`
      );
      if (response.ok) {
        const data = await response.json();
        const mappedUserData: userDataType = {
          userId: data.Id,
          firstName: data.FirstName,
          lastName: data.LastName,
          phoneNumber: Number(data.PhoneNumber),
          balance: data.Balance,
          email: data.Email,
        };
        setUserData(mappedUserData);
        setLoading(false);
      } else {
        console.error("Failed to load user data");
        setErrorLoadingUserData(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to load user data", error);
      setErrorLoadingUserData(true);
      setLoading(false);
    }
  };

  return (
    <div className=" flex-1 flex-col font-[family-name:var(--font-geist-sans)]  ">
      <div
        className=" mb-[50px] flex flex-col items-center justify-items-center "
        id="home"
      >
        {errorLoadingUserData ? (
          <div className="flex flex-col justify-center justify-center mx-[10px]">
            <span className="text-red-500 text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-bold">
              Error loading user data. Please try again later.
            </span>
            <button
              className="mt-[10px] bg-black p-[10px] rounded-[10px]"
              onClick={getUserData}
            >
              <span className="text-white text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                Retry
              </span>
            </button>
          </div>
        ) : (
            <div className="flex flex-col items-center  ">
            <div className=" mt-[50px]"></div>
            <span className=" text-[#373737] text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-bold">
              {greeting} {userData?.firstName}
            </span>
            <div className=" flex flex-col items-center mt-[20px]">
              <div className="flex flex-col shadow-lg rounded-[12px] py-[50px] sm:py-[80px] md:py-[100px] lg:py-[150px] px-[100px] sm:px-[200px] md:px-[250px] lg:px-[300px] mx-[00px] bg-white">
              <div className=" flex flex-col items-center">
                <span className="mt-[10px] text-[#737373] text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                Your balance
                </span>
                <span className="text-[#278727] text-[30px] sm:text-[40px] md:text-[60px] lg:text-[80px] font-bold">
                K{userData?.balance}
                </span>
              </div>
              </div>
              <div className=" flex flex-col mt-[30px]  ">
              <Link href="/TransferMoney" passHref>
                <button className=" bg-black text-white ml-[20px] p-[10px] rounded-[10px] hover:bg-gray-800 transition duration-300 ease-in-out">
                <span>Send Money</span>
                </button>
              </Link>
              </div>
            </div>
            </div>
        )}
      </div>
      {/* {!errorLoadingUserData && <TransactionHistory />} */}
    </div>
  );
}
