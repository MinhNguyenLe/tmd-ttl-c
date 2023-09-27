const DatePicker = ({ ...props }) => {
  return (
    <input
      type="date"
      className="custom-input-date custom-input-date-1 w-full rounded border-[1.5px] border-stroke bg-transparent py-3 px-5 font-medium outline-none transition focus:border-primary active:border-primary dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
      {...props}
    />
  );
};

export default DatePicker;
