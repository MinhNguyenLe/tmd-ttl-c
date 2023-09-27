import { PropsWithChildren } from "react";

interface CardProps {
  title: string;
}
const Card = ({ children, title }: PropsWithChildren<CardProps>) => {
  return (
    <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">{title}</h3>
      </div>
      <div className="p-6.5">{children}</div>
    </div>
  );
};

interface CardItemProps {
  label: string;
}

Card.Item = ({ children, label }: PropsWithChildren<CardItemProps>) => {
  return (
    <div className="mb-4.5">
      <label className="mb-2.5 block text-black dark:text-white">{label}</label>
      {children}
    </div>
  );
};

export default Card;
 