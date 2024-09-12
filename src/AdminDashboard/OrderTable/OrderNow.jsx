import React from "react";
import { useGET } from "../../Hooks/useApi";
import { NavLink } from "react-router-dom";

const OrderNow = () => {
  const { data, isLoading } = useGET("table/list/");
  console.log(data);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Available Tables
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data && data.results.length > 0 ? (
            data.results.map((table) => (
              <NavLink to={`/singletable/${table.table_number}`}>
                <div
                  key={table.table_number}
                  className={`p-4 border rounded-lg ${
                    table.available ? "bg-green-100" : "bg-red-100"
                  } border-gray-300`}
                  style={{ width: "100%", height: "150px" }} // Adjust height as needed
                >
                  <h3 className="text-lg font-semibold">{table.table_name}</h3>
                  <p className="text-sm">Table Number: {table.table_number}</p>
                </div>
              </NavLink>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-600">
              No tables available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderNow;
