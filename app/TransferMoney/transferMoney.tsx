"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import { ThreeDot } from "react-loading-indicators";

// data for
interface IFormInput {
  amountToSend: number;
  email: string;
}

// data for user
interface userDataType {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  balance: number;
  email: string;
}

// data for recipient
interface recipientDataType {
  userId: string;
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
}

export default function TransferMoney() {
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("Samuel");
  const [balance, setBalance] = useState(500);
  const [amountToSend, setAmountToSend] = useState(0);
  const [amountScreen, setAmountScreen] = useState(false);
  const [recipientScreen, setRecipientScreen] = useState(true);
  const [confirmationScreen, setConfirmationScreen] = useState(false);
  const [searchResults, setSearchResults] = useState<recipientDataType[]>([]);
  const [selectedRecipient, setSelectedRecipient] =
    useState<recipientDataType | null>(null);

  // form validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  // data template for testing
  const genericUser: userDataType[] = [
    {
      userId: "1",
      firstName: "Samuel",
      lastName: "Kamau",
      phoneNumber: 26096234563,
      balance: 500,
      email: "samkaizi40@gmail.com",
    },
    {
      userId: "2",
      firstName: "John",
      lastName: "Phiri",
      phoneNumber: 26096234563,
      balance: 500,
      email: "samueltrido@gmail.com",
    },
    {
      userId: "3",
      firstName: "Kiritana",
      lastName: "Asuwara",
      phoneNumber: 26096234563,
      balance: 500,
      email: "samuel@gmail.com",
    },
  ];

  // compares password and confirms it with retyped password
  const onSubmit = (data: any) => {
    setLoading(true);
    console.log(data);
    setTimeout(() => {
      setLoading(false);
    }, 9000);
  };

  // function to navigate to next screen
  const nextscreen = (data: any) => {
    if (amountScreen) {
      console.log("Data: ", data);
      setAmountToSend(data.balance);
      setAmountScreen(false);
      setRecipientScreen(true);
    } else if (recipientScreen) {
      setRecipientScreen(false);
      setConfirmationScreen(true);
      console.log(selectedRecipient);
      console.log(selectedRecipient);
    } else if (confirmationScreen) {
      setConfirmationScreen(false);
      setAmountScreen(true);
    }
  };

  // function to navigate to previous screen
  const prevscreen = () => {
    if (amountScreen) {
      setAmountScreen(false);
      setConfirmationScreen(true);
    } else if (recipientScreen) {
      setRecipientScreen(false);
      setAmountScreen(true);
      setSelectedRecipient(null);
      setSearchResults([]);
    } else if (confirmationScreen) {
      setConfirmationScreen(false);
      setRecipientScreen(true);
    }
  };

  // screen ui for amount of money to be sent
  const mountAmountScreen = () => {
    return (
      <div>
        <div className=" mb-[10px] flex flex-col ">
          <span className=" mb-[10px] text-black text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] ">
            Enter Amount to transfer!
          </span>
          <span className=" text-[#453E3A] text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] ">
            Amount must be between K10 and K{balance}
          </span>
        </div>

        <form
          onSubmit={handleSubmit(nextscreen)}
          className="flex flex-col w-[300px] sm:w-[350px] md:w-[400px] lg:w-[400px] "
        >
          <div className=" flex items-center ">
            <span className=" text-[20px] sm:text-[20px] md:text-[25px] lg:text-[30px] bg-gray-200 text-[#278727] py-[12px] px-[16px] rounded-l-[10px]">
              K
            </span>
            <input
              className=" border-[#453E3A] focus:border-[#000000] rounded-[10px] hover:border-[#6366f1] px-[10px] flex-1 text-black text-[16px] sm:text-lg md:text-lg lg:text-lg py-[8px] sm:py-[12px] md:py-[12px] lg:py-[12px] rounded-r-[10px] border-[1px] focus:ring-0"
              type="number"
              id="moneysent"
              maxLength={10}
              minLength={2}
              pattern="\d*"
              inputMode="numeric"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, "");
                if (parseInt(target.value) > balance) {
                  target.value = balance.toString();
                }
              }}
              {...register("balance", {
                required: "field number is required",
                maxLength: { value: 10, message: "Max length is 100" },
                minLength: { value: 2, message: "Min length is 5" },
              })}
            />
          </div>

          {!loading ? (
            <button
              type="submit"
              className={`text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] mt-[20px] rounded-[10px] py-[12px] ${
                isValid ? "bg-black text-white" : "bg-gray-400 text-gray-700"
              }`}
              disabled={!isValid}
            >
              Next
            </button>
          ) : (
            <div className=" mt-[20px] items-center justify-items-center">
              <div className=" items-center ml-[10px]">
                <ThreeDot color="black" size="small" />
              </div>
            </div>
          )}
        </form>
      </div>
    );
  };

  const handleEmailSearch = (email: string) => {
    // Simulate an API call to search for recipients by email
    const results = genericUser.filter((user) =>
      user.email.toLowerCase().includes(email.toLowerCase())
    );
    console.log(results);
    setSearchResults(results);
  };

  // screen for selection of reciepient
  const mountRecipientScreen = () => {
    return (
      <div
        className="flex flex-col items-start justify-start"
        style={{ width: "100%" }}
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-[300px] sm:w-[350px] md:w-[400px] lg:w-[400px] "
        >
          <label
            className=" mt-[10px] text-[black] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] "
            htmlFor="email"
          >
            Enter email of the recipient!
          </label>
          <input
            className=" px-[10px] text-black rounded-[10px] border-[1px] border-[#453E3A] hover:border-[#6366f1] text-[16px] sm:text-lg md:text-lg lg:text-lg py-[8px] sm:py-[12px] md:py-[12px] lg:py-[12px] "
            type="email"
            id="email"
            maxLength={100}
            minLength={5}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: "Invalid email address",
              },
              onChange: (e) => handleEmailSearch(e.target.value),
            })}
          />
        </form>

        {searchResults.length > 0 && (
          <div className="mt-[10px] w-[300px] sm:w-[350px] md:w-[400px] lg:w-[400px]">
            {searchResults.map((result) => (
              <div
                key={result.userId}
                className={` hover:bg-grey-300 py-[10px] px-[5px] border-b border-gray-300 cursor-pointer ${
                  selectedRecipient?.userId === result.userId
                    ? "bg-gray-200 rounded-[10px]"
                    : ""
                }`}
                onClick={() => {
                  setSelectedRecipient(result);
                }}
              >
                <div
                  className=" gap-4 sm:gap-4 md:gap-7 lg:gap-10 flex flex-row items-center justify-between"
                  style={{ width: "100%" }}
                >
                  <span className="  text-black text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] ">
                    {result.firstName}
                  </span>
                  <span className=" text-black text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] ">
                    {result.lastName}
                  </span>
                  <span className=" text-black text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] ">
                    {result.email}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className=" justify-between flex flex-row w-[300px] sm:w-[350px] md:w-[400px] lg:w-[400px] ">
          <button
            type="button"
            className={` text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] mt-[20px] rounded-[10px] py-[12px] bg-black text-white px-[10px] `}
            onClick={prevscreen}
          >
            Previous
          </button>
          <button
            type="submit"
            className={`text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] mt-[20px] rounded-[10px] py-[12px] px-[10px] ${
              selectedRecipient
                ? "bg-black text-white"
                : "bg-gray-400 text-gray-700"
            }`}
            disabled={!selectedRecipient}
            onClick={nextscreen}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  // screen for confirmation of transaction
  const mountConfirmationScreen = () => {
    return (
      <div
        className="flex flex-col items-start justify-start"
        style={{ width: "100%" }}
      ></div>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-[family-name:var(--font-geist-sans)] flex-col">
      <div className="mb-[50px]">
        <span className=" text-[#373737] text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-bold ">
          Transfer Money
        </span>
      </div>
      <div
        className="flex flex-row items-start justify-center p-[20px] "
        style={{ width: "100%" }}
      >
        <div
          className="flex flex-col items-start justify-start mr-[20px]"
          style={{ width: "100%" }}
        >
          <span
            className={` text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] ${
              amountScreen ? " text-[#000000] text-bold " : " text-[#6b6b6b] "
            }`}
          >
            Amount
          </span>
          <span
            className={` text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] ${
              recipientScreen
                ? " text-[#000000] text-bold "
                : " text-[#6b6b6b] "
            }`}
          >
            Recipient
          </span>
          <span
            className={` text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] ${
              confirmationScreen
                ? " text-[#000000] text-bold "
                : " text-[#6b6b6b] "
            }`}
          >
            confirmation
          </span>
        </div>
        {amountScreen && mountAmountScreen()}
        {recipientScreen && mountRecipientScreen()}
        {confirmationScreen && mountConfirmationScreen()}
      </div>
    </div>
  );
}
