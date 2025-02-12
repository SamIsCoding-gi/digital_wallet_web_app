"use client";
import React, { useState, useEffect } from "react";
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
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("Samuel");
  const [balance, setBalance] = useState(500);

  useEffect(() => {
    setFirstName("Samuel");
    let firstName = "Samuel";
    setGreeting(getTimeOfDayGreeting());
    setLoading(false);
  }, []);

  return (
    <div className="flex min-h-screen items-center font-[family-name:var(--font-geist-sans)] flex-col">
      <span className=" text-[#373737] text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-bold">
        Samuel's Digital Wallet App
      </span>
      <div className=" flex flex-row min-h-screen items-center  ">
        <div className=" flex-col shadow-lg rounded-[12px] p-[100px] ">
          <div className="flex justify-items-center items-center flex-col mb-[10px] ">
            <span
              className=" text-[#737373] text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] font-bold text-"
              id="greeting"
            >
              {" "}
              {greeting} {firstName}
            </span>
          </div>
          <div className=" flex flex-col " id="balance">
            <span className=" mt-[10px] text-start text-[#737373] text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] text-">
              Your balance
            </span>
            <span className=" text-[#278727] text-[30px] sm:text-[35px] md:text-[40px] lg:text-[45px] font-bold ">
              K{balance}
            </span>
          </div>
        </div>
        <div className=" flex flex-col gap-10">
          <button className=" bg-black ml-[20px] p-[10px] rounded-[10px]">
            <span>Send Money</span>
          </button>
          <button className=" bg-black ml-[20px] p-[10px] rounded-[10px]">
            <span>transaction history</span>
          </button>
        </div>
      </div>
    </div>
  );
}
