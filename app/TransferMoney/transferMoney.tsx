"use client";
import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ThreeDot } from "react-loading-indicators";
import Image from "next/image";

// data for sending money
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
  LastName: string;
  FirstName: string;
  Email: string;
  Id: string;
  PhoneNumber: number;
}

export default function TransferMoney() {
  const [userData, setUserData] = useState<userDataType | null>(null);
  const router = useRouter();
  const [errorLoadingUserData, setErrorLoadingUserData] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [lLoadingEmails, setLoadingEmails] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [amountToSend, setAmountToSend] = useState(0);
  const [amountScreen, setAmountScreen] = useState(true);
  const [moneyTransfered, setMoneyTransfered] = useState(false);
  const [recipientScreen, setRecipientScreen] = useState(false);
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

  // get user data
  useEffect(() => {
    setLoadingUserData(true);
    getUserData();
  }, []);

  // fetches user data and up
  const getUserData = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      console.error("No user found in localStorage.");
      setErrorLoadingUserData(true);
      setLoadingUserData(false);

      return;
    }
    const parsedUser = JSON.parse(user);
    let userId = parsedUser.Id;
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
        console.log("Fetched user data:", mappedUserData);
        setUserData(mappedUserData);
        setLoadingUserData(false);
      } else {
        console.error("Failed to load user data");
        setErrorLoadingUserData(true);
        setLoadingUserData(false);
      }
    } catch (error) {
      console.error("Failed to load user data", error);
      setErrorLoadingUserData(true);
      setLoadingUserData(false);
    }
  };

  // compares password and confirms it with retyped password
  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        throw new Error("No logged in user.");
      }
      const parsedUser = JSON.parse(storedUser);
      const currentUserId = parsedUser.Id;
      const response: Response = await fetch(
        "https://localhost:7248/api/users/transfer",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amountToSend: amountToSend,
            userId: currentUserId,
            password: data.password,
            recipientId: selectedRecipient?.Id,
          }),
        }
      );
      const responseData = await response.json();
      console.log(responseData);
      if (responseData.success) {
        setMoneyTransfered(true);
        setLoading(false);
      } else {
        setErrorMessage(responseData.message || "Transfer failed.");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      setErrorMessage((error as any).message);
      setLoading(false);
    }
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
      console.log("selectedRecipient: ", selectedRecipient);
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
            Amount must be between K10 and K{userData?.balance}
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
                if (
                  userData &&
                  userData.balance !== undefined &&
                  parseInt(target.value) > userData.balance
                ) {
                  target.value = userData.balance.toString();
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

  // function to search for recipient by email
  const searchRecipient = (
    data: recipientDataType | recipientDataType[],
    email: string
  ) => {
    console.log("users found: ", data);
    const results = (Array.isArray(data) ? data : [data]).filter((user) =>
      user.Email.toLowerCase().includes(email.toLowerCase())
    );
    setSearchResults(results);
  };

  // function to search for recipient by email
  const handleEmailSearch = async (email: string) => {
    setErrorMessage("");
    setLoadingEmails(true);
    try {
      const storedUser = localStorage.getItem("user");
      const user = localStorage.getItem("user");
      if (!user) {
        console.error("No user found in localStorage.");
        setErrorLoadingUserData(true);
        setLoading(false);

        return;
      }
      const parsedUser = JSON.parse(user);
      let currentUserId = parsedUser.Id;
      console.log(currentUserId);
      const response = await fetch(
        `https://localhost:7248/api/users/search/${email}?excludeId=${currentUserId}`
      );
      if (response.ok) {
        const data = await response.json();

        searchRecipient(data, email);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error(error);
    }
    setLoadingEmails(false);
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
        {searchResults.length > 0 ? (
          <div className="mt-[10px] w-[300px] sm:w-[350px] md:w-[400px] lg:w-[400px]">
            {searchResults.map((result) => (
              <div
                key={result.Id}
                className={` hover:bg-grey-300 py-[10px] px-[5px] border-b border-gray-300 cursor-pointer ${
                  selectedRecipient?.Id === result.Id
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
                    {result?.FirstName}
                  </span>
                  <span className=" text-black text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] ">
                    {result?.LastName}
                  </span>
                  <span className=" text-black text-[14px] sm:text-[14px] md:text-[16px] lg:text-[18px] ">
                    {result?.Email}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center ">
            <span className="text-[#ff0000] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
              No users found.
            </span>
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
        ;
      </div>
    );
  };

  // filter date
  const filterDate = (date: string) => {
    const newDate = new Date(date);
    const day = newDate.getDate();
    const month = newDate.toLocaleString("default", { month: "long" });
    const year = newDate.getFullYear();
    return `${day}th ${month} ${year}`;
  };

  // screen for confirmation of transaction
  const mountConfirmationScreen = () => {
    return (
      <div
        className="flex flex-col items-start justify-start"
        style={{ width: "100%" }}
      >
        <div className=" flex flex-col ">
          <div className=" ">
            <div className=" mb-[15px] flex flex-col items-center justify-center justify-items-center ">
              <span className=" text-[17px] sm:text-[18px] md:text-[19px] lg:text-[20px] text-black text-center ">
                Recipients Details!
              </span>
              <span className=" mt-[5px] text-[#737373] text-[12px] sm:text-[14px] md:text-[16px] lg:text-[18px] ">
                Please review all the details before sending the funds!
              </span>
            </div>
            <div className=" rounded-[10px] border-separate border-green-500 border-[2px] border-dotted p-[5px] ">
              <div className=" flex justify-between mb-[10px] ">
                <span className=" text-[#313131] text-center text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] ">
                  Amount to be sent:
                </span>
                <span className=" text-[#313131] text-center text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                  K {amountToSend}
                </span>
              </div>

              <div className=" flex justify-between mb-[10px] ">
                <span className=" text-[#313131] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                  Name:
                </span>
                <span className=" text-[#313131] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                  {selectedRecipient?.FirstName} {selectedRecipient?.LastName}
                </span>
              </div>

              <div className=" flex justify-between mb-[10px] ">
                <span className=" text-[#313131] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                  Email:
                </span>
                <span className=" text-[#313131] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                  {selectedRecipient?.Email}
                </span>
              </div>

              <div className=" flex justify-between mb-[10px] ">
                <span className=" text-[#313131] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                  Phone Number:
                </span>
                <span className=" text-[#313131] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                  {selectedRecipient?.PhoneNumber}
                </span>
              </div>

              <div className=" flex justify-between mb-[10px] ">
                <span className=" text-[#313131] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                  Date:
                </span>
                <span className=" text-[#313131] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                  {filterDate(new Date().toISOString())}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-[300px] sm:w-[350px] md:w-[400px] lg:w-[400px] "
        >
          <span className=" mt-[5px] text-[#737373] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] py-[ 12px]">
            Enter your password to confirm your transaction!
          </span>
          <label
            className=" mt-[10px] text-[black] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] py-[12px] "
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="px-[10px] text-black rounded-[10px] border-[1px] border-[#453E3A] hover:border-[#6366f1] text-[16px] sm:text-lg md:text-lg lg:text-lg py-[8px] sm:py-[12px] md:py-[12px] lg:py-[12px]"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters long",
              },
              pattern: {
                value:
                  /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain at least one uppercase letter, one number, and one special character",
              },
            })}
          />
          <div className=" justify-between flex flex-row w-[300px] sm:w-[350px] md:w-[400px] lg:w-[400px] ">
            <button
              type="button"
              className={` text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] mt-[20px] rounded-[10px] py-[12px] bg-black text-white px-[10px] ${
                loading ? "bg-gray-400 text-gray-700" : "bg-black text-white"
              }`}
              onClick={prevscreen}
              disabled={loading}
            >
              Previous
            </button>
            {!loading ? (
              <button
                type="submit"
                className={`text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] mt-[20px] rounded-[10px] py-[12px] px-[12px] ${
                  isValid ? "bg-black text-white" : "bg-gray-400 text-gray-700"
                }`}
                disabled={!isValid}
              >
                Send
              </button>
            ) : (
              <div className=" mt-[20px] items-center justify-items-center">
                <div className=" items-center ml-[10px]">
                  <ThreeDot color="black" size="small" />
                </div>
              </div>
            )}
          </div>
          {errorMessage && (
            <div className=" mt-[20px] text-red-500 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-bold">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    );
  };

  const transferMoneyUi = () => {
    return (
      <>
        {!loadingUserData ? (
          userData ? (
            <>
              <div className="mb-[50px]">
                <span className=" text-[#373737] text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-bold ">
                  Transfer Money
                </span>
              </div>
              <div
                className=" mr-[] sm:mr-[] md:mr-[30px] lg:mr-[30px] flex flex-col sm:flex-col md:flex-row lg:flex-row items-center justify-center p-[20px] "
                style={{ width: "100%" }}
              >
                <div
                  className=" mb-[15px] sm:mb-[15px] md:mb-[] lg:mb-[] flex flex-row sm:flex-row md:flex-col lg:flex-col items-start justify-center gap-5"
                  style={{ width: "100%" }}
                >
                  <div
                    className={` px-[10px] py-[1px] rounded-full  ${
                      amountScreen
                        ? " border-[#000000] border-[2px] "
                        : " border-[1px] border-[#6b6b6b] "
                    }`}
                  >
                    <span
                      className={` text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] ${
                        amountScreen
                          ? " text-[#000000] text-bold "
                          : " text-[#6b6b6b] "
                      }`}
                    >
                      1
                    </span>
                  </div>

                  <div
                    className={` px-[10px] py-[1px] rounded-full  ${
                      recipientScreen
                        ? " border-[#000000] border-[2px] "
                        : " border-[#6b6b6b] border-[1px] "
                    }`}
                  >
                    <span
                      className={` text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] ${
                        recipientScreen
                          ? " text-[#000000] text-bold "
                          : " text-[#6b6b6b] "
                      }`}
                    >
                      2
                    </span>
                  </div>

                  <div
                    className={` px-[10px] py-[1px] rounded-full  ${
                      confirmationScreen
                        ? " border-[#000000] border-[2px] "
                        : " border-[#6b6b6b] border-[1px] "
                    }`}
                  >
                    <span
                      className={` text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] ${
                        confirmationScreen
                          ? " text-[#000000] text-bold "
                          : " text-[#6b6b6b] "
                      }`}
                    >
                      3
                    </span>
                  </div>
                </div>
                {amountScreen && mountAmountScreen()}
                {recipientScreen && mountRecipientScreen()}
                {confirmationScreen && mountConfirmationScreen()}
              </div>
            </>
          ) : (
            <div className=" flex flex-col items-center justify-items-center  ">
              <span className=" text-red-500 text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-bold">
                Error loading user data. Please try again later.
              </span>
              <button
                className=" bg-black ml-[20px] p-[10px] rounded-[10px]"
                onClick={getUserData}
              >
                <span
                  className="text-white text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px]"
                  id="try-again"
                >
                  Try again
                </span>
              </button>
            </div>
          )
        ) : (
          <div className=" flex flex-col items-center justify-items-center  ">
            <div className=" items-center ml-[10px]">
              <ThreeDot color="black" size="small" />
            </div>
          </div>
        )}
      </>
    );
  };

  const successFullTransfer = () => {
    return (
      <div className="flex flex-col items-center justify-center">
        <Image
          src="/transfer_success.png"
          alt="Success"
          width={150}
          height={150}
          className="mb-[20px] h-[90px] w-[90px] sm:h-[100px] sm:w-[100px] md:h-[150px] md:w-[150px] lg:h-[150px] lg:w-[150px]"
        />
        <span className="text-[#278727] text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-bold">
          Transfer Successful
        </span>

        <button
          className=" gap-5 flex flex-row items-center bg-black mt-[20px] p-[10px] rounded-[10px]"
          onClick={() => router.back()}
        >
          <Image
            src="/back.png"
            alt="Success"
            width={150}
            height={150}
            className=" h-[30px] w-[30px] sm:h-[35px] sm:w-[35px] md:h-[40px] md:w-[40px] lg:h-[45px] lg:w-[45px] filter invert"
          />
          <span className="text-white text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
            Go back home
          </span>
        </button>
      </div>
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-[family-name:var(--font-geist-sans)] flex-col">
      {moneyTransfered ? successFullTransfer() : transferMoneyUi()}
      <div className="ml-[30px] mt-[35px] items-center justify-items-center">
        <div>
          <span className="  text-black text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] ">
            © 2025 Samuel Kibunda
          </span>
        </div>
      </div>
    </div>
  );
}
