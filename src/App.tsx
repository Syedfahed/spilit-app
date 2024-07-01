import { SubmitHandler, useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

function App() {
  interface FormData {
    name: string;
    cost: number;
  }
  const [tableData, setTableData] = useState<FormData[]>([{name:'Room rent',cost:12000},{name:'Maintanance',cost:1200}]);
  const [inputLength,setInputLength] =useState(0)
  const [isSplit ,setSplit] =useState(false)
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

 const split = ()=>{
  return calculateTotalCost() / inputLength
 }
  return (
    <div className="">
      <h1 className="p-5 shadow-md text-2xl font-semibold">Room Maintenance</h1>

      <div className="">
        <div className="p-5 grid grid-cols-2 gap-10 shadow-sm rounded-sm m-5 max-w-4xl border-green-500 border">
          <div className="">
            <h2 className="text-lg font-medium my-5">Add Item</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-1">
                <label className="flex-1">Name:</label>
                <input
                  {...register("name")}
                  className="border p-1 rounded-md border-black w-[50%]"
                />
                <p className="text-red-600 text-sm">
                  {errors && errors.name?.message}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <label className="flex-1">Cost:</label>
                <input
                  {...register("cost")}
                  className="border p-1 rounded-md border-black w-[50%]"
                />
                <p className="text-red-600 text-sm">
                  {errors && errors.cost?.message}
                </p>
              </div>
              <div className="my-4 flex justify-start">
                <button
                  type="submit"
                  className="bg-green-600 w-[50%] px-5 text-white py-1 rounded-md"
                >
                  Add
                </button>
              </div>
            </form>
          </div>
          <div>
            <h2 className="text-lg font-medium my-5">Items List</h2>
            {tableData.length > 0 ? (
              <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Cost
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((data, index) => (
                        <tr
                          key={index}
                          className={`${
                            index % 2 === 0
                              ? "bg-gray-50 dark:bg-gray-800"
                              : "bg-white dark:bg-gray-900"
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
                <div className="flex gap-4 justify-center">
                  <a
                    href="#split"
                    onClick={()=>setSplit(true)}
                    className="bg-green-600 w-[50%] px-5 text-white py-1 rounded-md text-center"
                  >
                    Split
                  </a>
                  <button
                    onClick={()=>setTableData([])}
                    className="bg-green-600 w-[50%] px-5 text-white py-1 rounded-md"
                  >
                    Reset
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h2> Add you'r list</h2>
              </div>
            )}
          </div>
          {
            isSplit && <div className="" id="split">
            <div className="flex gap-4 items-center">
              <label>Split Into:</label>
              <input
                type="number"
                className="border p-1 rounded-md border-black w-[20%]"
                onChange={(e)=>setInputLength(e.target.value)
                }
              />
            </div>
            <div>
              {
                inputLength &&  `Each Member: ${split()}`
              }
            
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  );
}

export default App;
