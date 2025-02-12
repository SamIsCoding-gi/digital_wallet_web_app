import Image from "next/image";
import SignIn from "./signin";
import HomeComponent from "./HomeComponent/home";
import TransferMoney from "./TransferMoney/transferMoney";

export default function Home() {
  return (
    <div className=" flex-1 bg-white items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      {/* <SignIn /> */}
      {/* <HomeComponent /> */}
      <TransferMoney />
    </div>
  );
}
