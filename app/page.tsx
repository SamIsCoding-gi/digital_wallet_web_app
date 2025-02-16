"use client";
import { useEffect, useState } from "react";
import SignIn from "./signin";
import { useRouter } from "next/navigation";
import HomeComponent from "./HomeComponent/home";
import TransactionHistory from "./TransactionHistory/transactionHistory";
import { ThreeDot } from "react-loading-indicators";

// className=" flex-1 bg-white items-center justify-items-center font-[family-name:var(--font-geist-sans)]"
export default function Home() {
  const router = useRouter();
  const [isloggedIn, setIsLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("Checking if user is logged in");
    checkIfUserIsLoggedIn();
  }, []);

  // check if user is logged in
  const checkIfUserIsLoggedIn = () => {
    const user = localStorage.getItem("user");
    console.log(user);
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const loggingOut = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
  };

  return (
    <div className=" flex-1 min-h-screen bg-white font-[family-name:var(--font-geist-sans)]">
      {!loading ? (
        isloggedIn ? (
          <div className=" min-h-screen mx-[10px]">
            <div className=" flex flex-row justify-between w-full items-center ">
              <button
                className=" p-[5px] rounded-[10px] "
                onClick={() => {
                  loggingOut();
                }}
              >
                <span className=" text-red-900 text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px]">
                  Log Out
                </span>
              </button>
            </div>
            <HomeComponent />
            <TransactionHistory />
          </div>
        ) : (
          <SignIn />
        )
      ) : (
        <div className=" items-center ml-[10px]">
          <ThreeDot color="black" size="small" />
        </div>
      )}
      <div className="ml-[30px] mt-[35px] items-center justify-items-center">
        <div>
          <span className="  text-black text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] ">
            © 2025 Samuel Kibunda
          </span>
        </div>
      </div>

      <div className="py-[10px] bg-white"></div>
    </div>
  );
}
