import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { ChangeEvent, useState } from "react";

function App() {
  interface FormData {
    name: string;
    cost: number;
  }

  const [tableData, setTableData] = useState<FormData[]>([
    { name: 'Room rent', cost: 12000 },
    { name: 'Maintenance', cost: 1200 }
  ]);
  
  const [inputLength, setInputLength] = useState<number>(1); // Set default to 1
  const [isSplit, setSplit] = useState(true);

  const validationSchema = Yup.object({
    name: Yup.string().required("Required"),
    cost: Yup.number()
      .typeError("Cost must be a number")
      .positive("Cost must be a positive number")
      .required("Cost is required"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setTableData((prevData) => [...prevData, data]);
    reset(); // Clear form inputs after submission
  };

  const calculateTotalCost = () => {
    return tableData.reduce((acc, item) => acc + item.cost, 0);
  };

  const split = () => {
    if (!inputLength || inputLength <= 0) return 0; // Ensure inputLength is a valid number
    return calculateTotalCost() / inputLength;
  };

  return (
    <div className="p-5">
      <h1 className="text-center text-2xl font-semibold mb-5">Room Maintenance</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="p-5 shadow-sm rounded-sm border border-green-500">
          <h2 className="text-lg font-medium mb-5">Add Item</h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-1 mb-4">
              <label>Name:</label>
              <input
                {...register("name")}
                className="border p-1 rounded-md border-black"
              />
              <p className="text-red-600 text-sm">
                {errors && errors.name?.message}
              </p>
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <label>Cost:</label>
              <input
                {...register("cost")}
                className="border p-1 rounded-md border-black"
              />
              <p className="text-red-600 text-sm">
                {errors && errors.cost?.message}
              </p>
            </div>
            <div className="flex justify-start">
              <button
                type="submit"
                className="bg-green-600 px-5 text-white py-1 rounded-md"
              >
                Add
              </button>
            </div>
          </form>
        </div>
        <div>
          <h2 className="text-lg font-medium mb-5">Items List</h2>
          {tableData.length > 0 ? (
            <div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">Name</th>
                      <th scope="col" className="px-6 py-3">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map((data, index) => (
                      <tr
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-gray-50 dark:bg-gray-800" : "bg-white dark:bg-gray-900"
                        } border-b dark:border-gray-700`}
                      >
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white whitespace-nowrap">
                          {data?.name}
                        </td>
                        <td className="px-6 py-4">{data?.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="my-5 text-right text-md font-bold">
                Total: {calculateTotalCost()}
              </div>
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button
                  onClick={() => setSplit(true)}
                  className="bg-green-600 w-full md:w-auto px-5 text-white py-1 rounded-md"
                >
                  Split
                </button>
                <button
                  onClick={() => {setTableData([])
                    setSplit(false)
                  }}
                  className="bg-green-600 w-full md:w-auto px-5 text-white py-1 rounded-md"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2>Add your list</h2>
            </div>
          )}
        </div>
        {isSplit && (
          <div className="p-5 shadow-sm rounded-sm border border-green-500">
            <div className="flex gap-4 items-center mb-4">
              <label>Split Into:</label>
              <input
                type="number"
                className="border p-1 rounded-md border-black w-20"
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setInputLength(parseInt(e.target.value))
                }
              />
            </div>
            {inputLength && inputLength > 0 ? (
              <div>
                Each Member: {split().toFixed(2)}
              </div>
            ):<p></p>}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
