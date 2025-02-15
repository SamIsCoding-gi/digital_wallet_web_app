"use client";
import React, { use, useState, useEffect } from "react";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThreeDot } from "react-loading-indicators";

// data for sign in form
interface IFormInput {
  email: string;
  password: string;
}

export default function SignIn() {
  // form validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });

  const [loading, setLoading] = useState(false);
  const [errorSigningIn, setErrorSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // Check if user is logged in on component mount
  useEffect(() => {
    console.log("Checking if user is logged in");
    checkIfUserIsLoggedIn();
  }, []);

  // check if user is logged in
  const checkIfUserIsLoggedIn = () => {
    const user = localStorage.getItem("user");
    if (user) {
      console.log("User is logged in", user);
      router.push("HomeComponent");
    }
  };

  // submission of form
  const onSubmit = (data: any) => {
    setLoading(true);
    console.log(data);
    signIn(data.email, data.password);
    setLoading(false);
  };

  // sign in user
  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await fetch("https://localhost:7248/api/users/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setLoading(false);
        router.push("HomeComponent");
      } else {
        setErrorMessage("Invalid email or password.");
        setLoading(false);
        setErrorSigningIn(true);
      }
    } catch (error) {
      setErrorMessage((error as any).message);
      setLoading(false);
      setErrorSigningIn(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-[family-name:var(--font-geist-sans)] flex-col">
      <div>
        <span className=" text-[#373737] text-[20px] sm:text-[25px] md:text-[30px] lg:text-[35px] font-bold">
          Samuel's Digital Wallet App
        </span>
      </div>
      <div className="flex justify-items-center items-center flex-col shadow-lg bg-white rounded-[12px] p-[50px]">
        <h1 className=" text-[#737373] text-[25px] sm:text-[30px] md:text-[37px] lg:text-[40px] font-bold text-">
          Sign In
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-[200px] sm:w-[300px] md:w-[400px] lg:w-[400px] "
        >
          <label
            className=" text-[black] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] "
            htmlFor="email"
          >
            Email
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
            })}
          />
          <label
            className=" mt-[10px] text-[black] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] py-[12px] "
            htmlFor="password"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className=" px-[10px] text-black rounded-[10px] border-[1px] border-[#453E3A] hover:border-[#6366f1] text-[16px] sm:text-lg md:text-lg lg:text-lg py-[8px] sm:py-[12px] md:py-[12px] lg:py-[12px] "
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

          {!loading ? (
            <button
              type="submit"
              className={`text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] mt-[20px] rounded-[10px] py-[12px] ${
                isValid ? "bg-black text-white" : "bg-gray-400 text-gray-700"
              }`}
              disabled={!isValid}
            >
              Sign In
            </button>
          ) : (
            <div className=" mt-[20px] items-center justify-items-center">
              <div className=" items-center ml-[10px]">
                <ThreeDot color="black" size="small" />
              </div>
            </div>
          )}
          {errorSigningIn && (
            <div className=" mt-[20px] text-red-500 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] font-bold">
              {errorMessage}
            </div>
          )}
        </form>

        <div className="flex flex-col items-center mt-[20px] text-[black] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] ">
          <p className=" text-[black] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] ">
            Don't have an account?{" "}
            <Link href="/CreateAccount" passHref>
              {" "}
              <span className=" text-[#6366f1] hover:underline">Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
