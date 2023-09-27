"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DatePicker from "@/components/base/DatePicker";

import { useForm, SubmitHandler } from "react-hook-form";
import moment from "@/modules/moment";
import axios from "axios";
import { useState } from "react";
import Card from "@/components/base/Card";
import { NOTION_CODE_EXPECTED } from "@/constants/common";
import { getTypeByCode } from "@/utils/common";

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

const ButtonLoading = () => {
  return (
    <button
      type="submit"
      className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray inline-flex items-center"
    >
      <svg
        aria-hidden="true"
        role="status"
        className="inline w-4 h-4 mr-3 text-white animate-spin"
        viewBox="0 0 100 101"
        fill="none"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      Importing...
    </button>
  );
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

        if (!emojiIntoCode || !NOTION_CODE_EXPECTED.includes(emojiIntoCode)) {
          throw new Error(
            `Invalid code: ${emojiIntoCode}, at content: ${arr[i + 1]}`
          );
        }

        const from = target.slice(5, target.indexOf("→")).trim().split(" ");
        const to = target
          .slice(target.indexOf("→") + 1, target.length)
          .trim()
          .split(" ");

        result.push({
          description: arr[i + 1].trim(),
          type: getTypeByCode(emojiIntoCode),
          from: moment(date)
            .hour(Number(from[0]))
            .minute(Number(from[1]))
            .toDate(),
          to: moment(date).hour(Number(to[0])).minute(Number(to[1])).toDate(),
        });
      }
      return result;
    }

    const params = formatter(content, date);

    fetch(() => axios.post("http://localhost:8000/my-daily/insert", params));
  };

  return (
    <>
      <Breadcrumb pageName="Import From Notion" />

      <div className="grid grid-cols-1 gap-9 sm:grid-cols-2">
        <div className="flex flex-col gap-9">
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
                    rows={32}
                    placeholder="Type your content"
                    className="w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    {...register("content")}
                  ></textarea>
                </div>

                {isLoading ? (
                  <ButtonLoading />
                ) : (
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                  >
                    Import
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        <div className="flex flex-col gap-9">
          <Card title="Explain emoji by code">
            {[
              { label: "🐷", code: 56375, type: "HEALTH" },
              { label: "🔹", code: 56633, type: "CHORE" },
              { label: "🐤", code: 56356, type: "BTASKEE" },
              { label: "♨️", code: 65039, type: "RELAX" },
              { label: "🥊", code: 56650, type: "LEARN" },
              { label: "💕", code: 56469, type: "LOVE" },
              { label: "🏠", code: 57312, type: "HOME" },
              { label: "💭", code: 56493, type: "THINKING" },
              { label: "👩‍👧‍👦", code: 56425, type: "FAMILY" },
              { label: "🍀", code: 57152, type: "MEDITATION" },
              { label: "🦜", code: 56732, type: "FRIEND" },
              { label: "❌", code: "49 or 50", type: "STUPID" },
            ].map((emoji) => (
              <Card.Item key={emoji.code} label={emoji.label}>
                <p>{emoji.code}</p>
                <p>{emoji.type}</p>
              </Card.Item>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
};

export default FormElements;
