"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DatePicker from "@/components/base/DatePicker";

import { useForm, SubmitHandler } from "react-hook-form";
import moment from "moment-timezone";
import axios from "axios";
import { useState } from "react";

moment.tz.setDefault("Asia/Jakarta");

interface IFormInput {
  date: Date;
  content: string;
}

const useLoading = ({
  onSuccess,
  onError,
}: {
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const fetchWithLoading = (fetch: () => Promise<any>) => {
    setIsLoading(true);
    return fetch()
      .then((result) => {
        setIsLoading(false);

        onSuccess?.(result);
      })
      .catch((error) => {
        setIsLoading(false);

        onError?.(error);
      });
  };

  return { isLoading, fetch: fetchWithLoading };
};

const FormElements = () => {
  const { register, handleSubmit, reset } = useForm<IFormInput>();

  const { isLoading, fetch } = useLoading({
    onError: (error) => {
      console.error("Error: \n", error);
    },
    onSuccess: () => {
      console.log("SUCCESSFUL");
      reset();
    },
  });

  const onSubmit: SubmitHandler<IFormInput> = (values) => {
    const { date, content } = values;

    function formatter(str: string, date: Date) {
      const arr = str.split("\n\n");
      arr.shift();

      const result = [];
      for (let i = 0; i < arr.length; i += 2) {
        const target = arr[i];
        const emojiIntoCode = arr[i][4].codePointAt(0);

        const from = target.slice(5, target.indexOf("→")).trim().split(" ");
        const to = target
          .slice(target.indexOf("→") + 1, target.length)
          .trim()
          .split(" ");

        result.push({
          description: arr[i + 1].trim(),
          type: emojiIntoCode,
          from: moment(date)
            .hour(Number(from[0]))
            .minute(Number(from[1]))
            .toDate(),
          to: moment(date).hour(Number(to[0])).minute(Number(to[1])).toDate(),
        });
      }
      return result;
    }

    fetch(() =>
      axios.post(
        "http://localhost:8000/my-daily/insert",
        formatter(content, date)
      )
    );
  };

  return (
    <>
      <Breadcrumb pageName="Import From Notion" />

      <div>!!! Loading: {isLoading.toString()}</div>

      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Import from Notion
          </h3>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6.5">
            <div className="mb-4.5">
              <label className="mb-2.5 block text-black dark:text-white">
                Date
              </label>
              <input
                type="date"
                placeholder="Enter your date"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                {...register("date")}
              />
            </div>

            <div className="mb-6">
              <label className="mb-2.5 block text-black dark:text-white">
                Content
              </label>
              <textarea
                rows={6}
                placeholder="Type your content"
                className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                {...register("content")}
              ></textarea>
            </div>

            <button
              type="submit"
              className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
            >
              Import
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default FormElements;
