// import React from 'react'
import { useState } from "react";
import arrow from '../../src/assets/arrow.svg';

// Step 1: Usertypes
interface DateInput {
  day: string;
  month: string;
  year: string;
}

interface FormErrors {
  day?: string;
  month?: string;
  year?: string;
}

interface AgeResult {
  years: number | string;
  months: number | string;
  days: number | string;
}


// MY STEP TWO WAS UI DESIGN, INCLUDNG MOBILE DESIGN
const AgeCalculator = () => {
// STEP 3:  React state object - input states
const [inputData, setInputData] = useState<DateInput>({
day: "",
month: "",
year: "",
});

// STEP 4 :  input handler
// DTEP 14 - UPDATE HANDLER TO MAKE ERROR MESSAGES DISAPPEAR WHEN USER RETYPES
const handleChange =(e: React.ChangeEvent<HTMLInputElement>)=> {
  const { name, value } = e.target;
// numeric-only input handling 
const numericValue = value.replace(/\D/g, "");

  setInputData((prev) => ({
    ...prev,
    [name]: numericValue,
  }));

  setErrors((prev) => {
    const updatedErrors = { ...prev };
    delete updatedErrors[name as keyof FormErrors];
    return updatedErrors;
  });
};

// STEP 6 - CREATING ERROR STATE
const [errors, setErrors] = useState<FormErrors>({})

// STEP 10 - Age calculations - Connect calculated values to the UI through React state
const [ageResult, setAgeResult] = useState<AgeResult>({
  years: "--",
  months: "--",
  days: "--",
});

// STEP 11 - TO ENSURE DGIT LENGTH USING PAD START WITH ZERO FOR DAY AND MONTH
const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
  const { name, value } = e.target;

  if ((name === "day" || name === "month") && value.length === 1) {
    setInputData((prev) => ({
      ...prev,
      [name]: value.padStart(2, "0"),
    }));
  }
};

// STEP 7 - SUBMIT HANDLER
// prevent default behaviour
const handleSubmit = (e: React.FormEvent<HTMLFormElement>)=> {
e.preventDefault();

console.log("SUBMIT WORKING");
const newErrors: FormErrors = {};

// empty validation
// day 
if (inputData.day.trim() === "") {
  newErrors.day = "This field is required";
}
// month
if (inputData.month.trim() === "") {
  newErrors.month = "This field is required";
}
// year
if (inputData.year.trim() === "") {
  newErrors.year = "This field is required";
}

// STEP 13 - Digit length validation (incorrect digits for day, month and year)
if (!newErrors.day && inputData.day.length !== 2) {
  newErrors.day = "Day must be 2 digits";
}

if (!newErrors.month && inputData.month.length !== 2) {
  newErrors.month = "Month must be 2 digits";
}

if (!newErrors.year && inputData.year.length !== 4) {
  newErrors.year = "Year must be 4 digits";
}

// Date validation 
// STEP 9
// convert to numbers
const day = Number(inputData.day);
const month = Number(inputData.month);
const year = Number(inputData.year);

const today = new Date();
// invalid days
if (!newErrors.month && (month < 1 || month > 12)) {
  newErrors.month = "Please input a valid month";
}
// invalid months
if (!newErrors.day && (day < 1 || day > 31)) {
  newErrors.day = "Please input a valid day";
}

// check for any existing validation errors before creating the date
if (!newErrors.day && !newErrors.month && !newErrors.year) {
  // leap year validation using JavaScript Date handling
const birthDate = new Date(year, month - 1, day);

// check impossible dates
if (birthDate.getDate() !== day ||
birthDate.getMonth() !== month - 1 || 
birthDate.getFullYear() !== year) {
  newErrors.day = "Must be a valid date";
}

// check future dates
if (birthDate > today) {
  newErrors.year = "Must be in the past";
}
}
// error handling and validation flow control up to return in if statement.
setErrors(newErrors);

console.log(newErrors);

// stop if there is an error
if (Object.keys(newErrors).length > 0) {
  return;
}

// console.log("Form submission successful");
// age calculation logic using JavaScript Date objects
let years = today.getFullYear() - year;
let months = today.getMonth() - month - 1;
let days = today.getDay() - day;

if (days < 0) {
  months--;

  const previousMonth = new Date(
    today.getFullYear(),
    today.getMonth(),
    0
  );

  days += previousMonth.getDate();
}

if (months < 0) {
  years--;
  months += 12;
}

setAgeResult({
  years,
  months,
  days,
});

};
  return (
<div className="min-h-screen flex items-center justify-center bg-gray-200 pb-14 pl-4 pr-4">
  <div className="bg-white w-full max-w-[700px] pb-8 pt-12 pl-6 pr-6 md:p-10 rounded-t-3xl rounded-bl-3xl rounded-br-[120px] md:rounded-br-[180px]">

    {/* FORM STEP 8: CONNECT FORM TO SUBMIT HANDLER */}
    <form onSubmit={handleSubmit} className="flex flex-col gap-8"> 

      {/* INPUTS */}
      <div className="flex gap-4 md:gap-6">

        {/* DAY - UPDATE LABEL AND INPUT TO CATER FOR ERROR
         VALIDATION - BORDER AND LABEL TO TURN RED*/}
        <div className="flex flex-col">
          <label className={
            `text-[12px] md:text-sm tracking-[4px] font-bold mb-2 ${
              errors.day ? "text-red-500" : "text-gray-500"
            }`}>
            DAY
          </label>

{/* STEP5: CONNECTING INPUTS - DAY, MONTH AND YEAR INPUTS TO STATE */}
{/* STEP 12 - UPDATE INPUT WITH ONBLUR AND SPECIFY NUMBER OF DIGITS EACH FIELD MUST TAKE */}
          <input
            type="number"
            name="day"
            value={inputData.day}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={2}
            placeholder="DD"
            className={`w-full max-w-[90px] md:max-w-[130px] border rounded-lg px-3 md:px-4 py-3 text-xl md:text-3xl font-bold outline-none ${errors.day ? "border-red-500" :  "border-gray-300 focus:border-purple-500"
            }`}
          />

          {errors.day && (
        <p className="text-red-500 text-sm italic mt-1">
         {errors.day}
        </p>
)}
        </div>

        {/* MONTH */}
        <div className="flex flex-col">
          <label className={
            `text-[12px] md:text-sm tracking-[4px] font-bold mb-2 ${
              errors.month ? "text-red-500" : "text-gray-500"
            }
            `}>
            MONTH
          </label>

          <input
            type="number"
            name="month"
            value={inputData.month}
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={2}
            placeholder="MM"
            className={`w-full max-w-[90px] md:max-w-[130px] border rounded-lg px-3 md:px-4 py-3 text-xl md:text-3xl font-bold outline-none ${errors.month ? "border-red-500" :  "border-gray-300 focus:border-purple-500"
            }`}
          />

          {errors.month && (
         <p className="text-red-500 text-sm italic mt-1">
         {errors.month}
          </p>
)}
        </div>

        {/* YEAR */}
        <div className="flex flex-col">
          <label className={
            `text-[12px] md:text-sm tracking-[4px] font-bold mb-2 ${
              errors.year ? "text-red-500" : "text-gray-500"
            }
            `}>
            YEAR
          </label>

          <input
            type="text"
            name="year"
            value={inputData.year}
            onChange={handleChange}
            inputMode="numeric"
            maxLength={4}
            placeholder="YYYY"
            className={`w-full max-w-[90px] md:max-w-[130px] border rounded-lg px-3 md:px-4 py-3 text-xl md:text-3xl font-bold outline-none ${
              errors.year ? "border-red-500" :  "border-gray-300 focus:border-purple-500"
            }`}
          />

          {errors.year && (
         <p className="text-red-500 text-sm italic mt-1">
         {errors.year}
        </p>
)}
        </div>
      </div>

      {/* LINE + BUTTON */}
      <div className="relative flex items-center justify-center md:justify-start pt-6">

        {/* LINE */}
        <div className="w-full border-t border-gray-300"></div>

        {/* BUTTON */}
        <button
          type="submit"
          className="absolute bg-purple-500 hover:bg-black active:bg-black transition-all duration-200 active:scale-95 w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center md:right-0"
        >
          <img
            className="w-6 hover:scale-125 transition-all"
            src={arrow}
            alt="icon-arrow"
          />
        </button>
      </div>
    </form>

    {/* RESULTS */}
<div className="mt-14">
{/* Adds rendering of age results in this result using ageResult.years/months/days */}
  <h1 className="text-5xl md:text-8xl font-extrabold italic leading-tight">
    <span className="text-purple-500">
      {ageResult.years}
    </span>{" "}
    years
  </h1>

  <h1 className="text-5xl md:text-8xl font-extrabold italic leading-tight">
    <span className="text-purple-500">
      {ageResult.months}
    </span>{" "}
    months
  </h1>

  <h1 className="text-5xl md:text-8xl font-extrabold italic leading-tight">
    <span className="text-purple-500">
      {ageResult.days}
    </span>{" "}
    days
  </h1>

</div>

  </div>
</div>
  )
}

export default AgeCalculator