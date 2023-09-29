"use client";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";

import { useForm, SubmitHandler } from "react-hook-form";
import momentTz from "@/modules/moment";
import axios from "axios";
import Card from "@/components/base/Card";
import { NOTION_CODE_EXPECTED } from "@/constants/common";
import { getTypeByCode } from "@/utils/common";
import useLoading from "@/hooks/useLoading";
import ButtonLoading from "@/components/base/ButtonLoading";

interface IFormInput {
  date: Date;
  content: string;
}

const ImportFromNotion = () => {
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

        const from = target
          .slice(5, target.indexOf("→"))
          .trim()
          .split(" ")
          .map((i) => Number(i));
        const to = target
          .slice(target.indexOf("→") + 1, target.length)
          .trim()
          .split(" ")
          .map((i) => Number(i));

        console.log(
          from,
          momentTz(date)
            .add(1, "days")
            .set({
              hour: from[0],
              minute: from[1],
            })
            .toDate()
        );

        // day in past
        if (i < 3) {
          // 23:30 (past) -> 6:30 (today) sleep
          result.push({
            description: arr[i + 1].trim(),
            type: getTypeByCode(emojiIntoCode),
            from:
              from[0] > 20
                ? momentTz(date)
                    .subtract(1, "days")
                    .set({
                      hour: from[0],
                      minute: from[1],
                    })
                    .toDate()
                : momentTz(date).hour(from[0]).minute(from[1]).toDate(),
            to:
              to[0] > 20
                ? momentTz(date)
                    .subtract(1, "days")
                    .set({
                      hour: to[0],
                      minute: to[1],
                    })
                    .toDate()
                : momentTz(date).hour(to[0]).minute(to[1]).toDate(),
          });
        } // day in future
        else {
          result.push({
            description: arr[i + 1].trim(),
            type: getTypeByCode(emojiIntoCode),
            from:
              from[0] < 6
                ? momentTz(date)
                    .add(1, "days")
                    .set({
                      hour: from[0],
                      minute: from[1],
                    })
                    .toDate()
                : momentTz(date).hour(from[0]).minute(from[1]).toDate(),
            to:
              to[0] < 6
                ? momentTz(date)
                    .add(1, "days")
                    .set({
                      hour: to[0],
                      minute: to[1],
                    })
                    .toDate()
                : momentTz(date).hour(to[0]).minute(to[1]).toDate(),
          });
        }
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

                <button
                  type="submit"
                  className="flex w-full justify-center rounded bg-primary p-3 font-medium text-gray"
                >
                  {isLoading ? (
                    <ButtonLoading title="Importing ..." />
                  ) : (
                    "Import"
                  )}
                </button>
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

export default ImportFromNotion;
