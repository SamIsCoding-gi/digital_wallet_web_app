"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import SignIn from "./signin";
import { useRouter } from "next/navigation";
import HomeComponent from "./HomeComponent/home";
import TransferMoney from "./TransferMoney/transferMoney";
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

  return (
    <div className=" flex-1 min-h-screen bg-white font-[family-name:var(--font-geist-sans)]">
      {!loading ? (
        isloggedIn ? (
          <div className=" min-h-screen">
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
    </div>
  );
}
