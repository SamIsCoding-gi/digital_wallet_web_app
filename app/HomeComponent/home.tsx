"use client";
import React, { useState, useEffect, use } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
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
  const [userData, setUserData] = useState<userDataType>({
    userId: "",
    firstName: "",
    lastName: "",
    phoneNumber: 0,
    balance: 0,
    email: "",
  });
  const [errorLoadingUserData, setErrorLoadingUserData] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("Samuel");
  const [balance, setBalance] = useState(500);

  useEffect(() => {
    setFirstName("Samuel");
    let firstName = "Samuel";
    setGreeting(getTimeOfDayGreeting());
    getUserData();
    setLoading(false);
  }, []);

  // fetches user data
  const getUserData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/userData");
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setUserData(data);
        setLoading(false);
      }
    } catch (error) {
      setErrorLoadingUserData(true);
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className=" mb-[50px] flex items-center font-[family-name:var(--font-geist-sans)] flex-col">
      {errorLoadingUserData ? (
        <div className="text-red-500 text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-bold">
          Error loading user data. Please try again later.
        </div>
      ) : (
        <>
          <div className=" mt-[50px]"></div>
          <span className=" text-[#373737] text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-bold">
        {greeting} {firstName}
          </span>
          <div className=" flex flex-col items-center  ">
        <div className="flex flex-col items-start shadow-lg rounded-[12px] py-[50px] px-[300px]">
          <div
            className="flex flex-col items-start justify-items-start "
            id="balance"
          >
            <span className="mt-[10px] text-start text-[#737373] text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
          Your balance
            </span>
            <span className="text-[#278727] text-[30px] sm:text-[35px] md:text-[40px] lg:text-[45px] font-bold">
          K{balance}
            </span>
          </div>
        </div>
        <div className=" flex flex-col mt-[30px]">
          <Link href="/TransferMoney" passHref>
            <button className=" bg-black ml-[20px] p-[10px] rounded-[10px]">
          <span>Send Money</span>
            </button>
          </Link>
        </div>
          </div>
        </>
      )}
    </div>
  );
}
