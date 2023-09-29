"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import useLoading from "@/hooks/useLoading";
import { sumMultipleDuration } from "@/utils/common";
import axios from "axios";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import momentTz from "@/modules/moment";
import ButtonLoading from "@/components/base/ButtonLoading";

interface IFormInput {
  from: Date;
  to: Date;
}

const Report = () => {
  const [data, setData] = useState([]);
  const { isLoading, fetch } = useLoading({
    onError: (error) => {
      console.error("Error: \n", error);
    },
    onSuccess: (result) => {
      const formatted = result.data.map((i: any) => ({
        ...sumMultipleDuration(i.data),
        type: i.type,
      }));
      console.log("SUCCESSFUL ", result.data, " !! ", formatted);
      setData(formatted);
    },
  });

  useEffect(() => {
    fetch(() =>
      axios.get("http://localhost:8000/my-daily/get-by-bulk-filter", {
        params: {
          from: "2023-09-01 14:30:00",
          to: "2023-09-01 14:30:00",
        },
      })
    );
  }, []);

  const { register, handleSubmit } = useForm<IFormInput>();

  const onSubmit: SubmitHandler<IFormInput> = (values) => {
    return fetch(() =>
      axios.get("http://localhost:8000/my-daily/get-by-bulk-filter", {
        params: {
          from: momentTz(values.from)
            .hours(0)
            .minutes(0)
            .seconds(0)
            .milliseconds(0)
            .format(),
          to: momentTz(values.to)
            .hours(23)
            .minutes(59)
            .seconds(59)
            .milliseconds(99)
            .format(),
        },
      })
    );
  };

  return (
    <>
      <Breadcrumb pageName="Report" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div date-rangepicker className="flex items-center">
          <div>
            <input
              type="date"
              placeholder="Enter your date"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              {...register("from")}
            />
          </div>
          <span className="mx-4 text-gray-500">to</span>
          <div>
            <input
              type="date"
              placeholder="Enter your date"
              className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
              {...register("to")}
            />
          </div>
          <button
            type="submit"
            className="flex justify-center rounded bg-primary p-3 font-medium text-gray"
          >
            {isLoading ? <ButtonLoading title="Reporting ..." /> : "Report"}
          </button>
        </div>
      </form>

      <div className="mx-auto mt-4.5 mb-5.5 grid max-w-400 grid-cols-10 rounded-md border border-stroke py-2.5 shadow-1 dark:border-strokedark dark:bg-[#37404F]">
        {data.map((i: any, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center gap-1 border-r border-stroke px-4 dark:border-strokedark xsm:flex-row"
          >
            <span className="font-semibold text-black dark:text-white">
              {i.hours}h
            </span>
            <span className="font-semibold text-black dark:text-white">
              {i.minutes}m
            </span>
            <span className="text-sm">{i.type}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default Report;
