"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler, set } from "react-hook-form";
import { ThreeDot } from "react-loading-indicators";

// data for signup form
interface IFormInput {
  firstName: string;
  lastName: string;
  phoneNumber: number;
  email: string;
  password: string;
  confirmPassword: string;
}

export default function CreateAccount() {
  // form validation
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });
  const [errorCreatingAccount, setErrorCreatingAccount] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // compares password and confirms it with retyped password
  const password = watch("password");

  // form submission to create account
  const onSubmit = (data: any) => {
    setErrorCreatingAccount(false);
    setLoading(true);
    createAccount(data);
  };

  // creates user account
  const createAccount = async (data: IFormInput) => {
    setLoading(true);
    const userId = crypto.randomUUID();
    const dataWithId = { ...data, Id: userId };

    try {
      const response = await fetch(
        "https://localhost:7248/api/users/create-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataWithId),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        console.log("Response data:", responseData);
        localStorage.setItem("user", JSON.stringify(dataWithId));
        console.log("Created user: ", dataWithId);
        setLoading(false);
        router.back();
      } else {
        const errorText = await response.text();
        console.error("Failed to create account:", errorText);
        setErrorMessages([errorText]);
        setErrorCreatingAccount(true);
        setLoading(false);
      }
    } catch (error) {
      console.error("Failed to create account:", error);
      setLoading(false);
      setErrorMessages([
        error instanceof Error ? error.message : String(error),
      ]);
      setErrorCreatingAccount(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center font-[family-name:var(--font-geist-sans)] flex-col">
      <div className=" rounded-[12px] border-[1px] border-[#cbd2d6] mb-[5px] mt-[100px] flex justify-items-center items-center flex-col shadow-lg bg-white rounded-[12px] p-[50px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-[300px] sm:w-[350px] md:w-[400px] lg:w-[400px] "
        >
          <h1 className=" text-[#737373] text-[25px] sm:text-[30px] md:text-[37px] lg:text-[40px] font-bold text-">
            Create Account
          </h1>
          <label
            className=" mt-[10px] text-[black] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] "
            htmlFor="firstname"
          >
            First Name
          </label>
          <input
            className=" px-[10px] text-black rounded-[10px] border-[1px] border-[#453E3A] hover:border-[#6366f1] text-[16px] sm:text-lg md:text-lg lg:text-lg py-[8px] sm:py-[12px] md:py-[12px] lg:py-[12px] "
            type="text"
            id="firstname"
            maxLength={100}
            minLength={3}
            {...register("firstName", {
              required: "first name is required",
              maxLength: { value: 100, message: "Max length is 100" },
              minLength: { value: 3, message: "Min length is 5" },
            })}
          />
          <label
            className=" mt-[10px] text-[black] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] "
            htmlFor="lastname"
          >
            Last Name
          </label>
          <input
            className=" px-[10px] text-black rounded-[10px] border-[1px] border-[#453E3A] hover:border-[#6366f1] text-[16px] sm:text-lg md:text-lg lg:text-lg py-[8px] sm:py-[12px] md:py-[12px] lg:py-[12px] "
            type="text"
            id="lastname"
            maxLength={100}
            minLength={3}
            {...register("lastName", {
              required: "last name is required",
              maxLength: { value: 100, message: "Max length is 100" },
              minLength: { value: 3, message: "Min length is 5" },
            })}
          />

          <label
            className=" px-[10px] mt-[10px] text-[black] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] "
            htmlFor="phone"
          >
            Phone Number
          </label>
          <div className="flex items-center border-[1px] border-[#453E3A] rounded-[10px] hover:border-[#6366f1]">
            <span className="bg-gray-200 text-black py-[12px] px-[16px] rounded-l-[10px]">
              +260
            </span>
            <input
              className=" px-[10px] flex-1 text-black text-[16px] sm:text-lg md:text-lg lg:text-lg py-[8px] sm:py-[12px] md:py-[12px] lg:py-[12px] rounded-r-[10px] border-none focus:ring-0"
              type="tel"
              id="phone"
              maxLength={9}
              minLength={9}
              pattern="\d*"
              inputMode="numeric"
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                target.value = target.value.replace(/[^0-9]/g, "");
              }}
              {...register("phoneNumber", {
                required: "phone number is required",
                maxLength: { value: 9, message: "Max length is 100" },
                minLength: { value: 9, message: "Min length is 5" },
              })}
            />
          </div>

          <label
            className=" mt-[10px] text-[black] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] "
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
          <span className=" mt-[5px] text-[#737373] text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] py-[ 12px]">
            Note: Password must contain at least one uppercase letter, one
            number, and one special character!
          </span>
          <label
            className="mt-[10px] text-[black] text-[16px] sm:text-[18px] md:text-[20px] lg:text-[24px] py-[12px]"
            htmlFor="confirmPassword"
          >
            Retype Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="px-[10px] text-black rounded-[10px] border-[1px] border-[#453E3A] hover:border-[#6366f1] text-[16px] sm:text-lg md:text-lg lg:text-lg py-[8px] sm:py-[12px] md:py-[12px] lg:py-[12px]"
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords do not match",
            })}
          />
          {errors.confirmPassword && (
            <p
              className="text-red-700 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] "
              role="alert"
            >
              {errors.confirmPassword.message as string}
            </p>
          )}

          {!loading ? (
            <button
              type="submit"
              className={`text-[16px] sm:text-[16px] md:text-[18px] lg:text-[20px] mt-[20px] rounded-[10px] py-[12px] ${
                isValid ? "bg-black text-white" : "bg-gray-400 text-gray-700"
              }`}
              disabled={!isValid}
            >
              Creat Account
            </button>
          ) : (
            <div className=" mt-[20px] items-center justify-items-center">
              <div className=" items-center ml-[10px]">
                <ThreeDot color="black" size="small" />
              </div>
            </div>
          )}
          {errorCreatingAccount && (
            <p
              className=" mt-[20px] text-red-700 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] "
              role="alert"
            >
              {errorMessages.join(", ")}{" "}
            </p>
          )}
        </form>
      </div>
      <div className="ml-[30px] mt-[35px]">
        <span className="  text-black text-[15px] sm:text-[16px] md:text-[18px] lg:text-[20px] ">
          © 2025 Samuel Kibunda
        </span>
      </div>
    </div>
  );
}
