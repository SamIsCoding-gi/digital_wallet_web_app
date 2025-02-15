"use client";
import { useEffect } from "react";
import Image from "next/image";
import SignIn from "./signin";
import { useRouter } from "next/navigation";
import HomeComponent from "./HomeComponent/home";
import TransferMoney from "./TransferMoney/transferMoney";
import TransactionHistory from "./TransactionHistory/transactionHistory";

// className=" flex-1 bg-white items-center justify-items-center font-[family-name:var(--font-geist-sans)]"
export default function Home() {
  const router = useRouter();
  useEffect(() => {
    console.log("Checking if user is logged in");
    checkIfUserIsLoggedIn();
  }, []);

  // check if user is logged in
  const checkIfUserIsLoggedIn = () => {
    const user = localStorage.getItem("user");
    console.log("User is logged in", user);
    if (user) {
      console.log("User is logged in", user);
      router.push("HomeComponent");
    }
  };

  return (
    <div className=" flex-1 bg-white font-[family-name:var(--font-geist-sans)]">
      <SignIn />
      {/* <HomeComponent /> */}
      {/* <TransactionHistory /> */}
      {/* <TransferMoney /> */}
    </div>
  );
}
