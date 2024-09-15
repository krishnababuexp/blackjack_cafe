import React, { useState } from "react";
import { useAuth } from "../../Hooks/UseAuth";
import { useGET } from "../../Hooks/useApi";

const TableCreate = () => {
  const [tableName, setTableName] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [currentTableId, setCurrentTableId] = useState(null);
  const { user } = useAuth();
  const { data, isLoading, refetch } = useGET("table/list/");

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "tableName") setTableName(value);
    if (name === "tableNumber") setTableNumber(value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!tableName || !tableNumber) {
      alert("Both fields are required.");
      return;
    }

    try {
      const url = editMode
        ? `https://cafe-app-meu8i.ondigitalocean.app/${currentTableId}/`
        : "https://cafe-app-meu8i.ondigitalocean.app/table/create/";

      const method = editMode ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token.access}`,
        },
        body: JSON.stringify({
          table_name: tableName,
          table_number: tableNumber,
        }),
      });

      if (!response.ok) {
        throw new Error(
          editMode ? "Failed to update table" : "Failed to create table"
        );
      }

      alert(
        editMode ? "Table updated successfully!" : "Table created successfully!"
      );
      // Clear form after submission
      setTableName("");
      setTableNumber("");
      setEditMode(false);
      setCurrentTableId(null);
      refetch(); // Refetch the table list after submission
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert(
        editMode
          ? "Failed to update table. Please try again."
          : "Failed to create table. Please try again."
      );
    }
  };

  const handleEdit = (table) => {
    setEditMode(true);
    setTableName(table.table_name);
    setTableNumber(table.table_number);
    setCurrentTableId(table.table_number); // Assuming table_number is unique and used as an identifier
  };

  const handleDelete = async (tableId) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      try {
        const response = await fetch(
          `https://cafe-app-meu8i.ondigitalocean.app/table/delete/${tableId}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${user.token.access}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to delete table");
        }

        alert("Table deleted successfully!");
        refetch(); // Refetch the table list after deletion
      } catch (error) {
        console.error("There was a problem with the delete operation:", error);
        alert("Failed to delete table. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto p-5 bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg mb-6">
        <h2 className="text-xl font-bold mb-4 text-center">
          {editMode ? "Edit Table" : "Create Table"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="tableName"
              className="block text-sm font-medium text-gray-700"
            >
              Table Name
            </label>
            <input
              type="text"
              id="tableName"
              name="tableName"
              value={tableName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter table name"
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="tableNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Table Number
            </label>
            <input
              type="number"
              id="tableNumber"
              name="tableNumber"
              value={tableNumber}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter table number"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {editMode ? "Update Table" : "Create Table"}
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl">
        <h2 className="text-xl font-bold mb-4 text-center">Table List</h2>
        {isLoading ? (
          <p>Loading tables...</p>
        ) : data && data.results.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Table Name</th>
                <th className="py-2 px-4 border-b">Table Number</th>
                <th className="py-2 px-4 border-b">Available</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((table) => (
                <tr key={table.table_number}>
                  <td className="py-2 px-4 border-b">{table.table_name}</td>
                  <td className="py-2 px-4 border-b">{table.table_number}</td>
                  <td className="py-2 px-4 border-b">
                    {table.available ? "Yes" : "No"}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(table)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(table.table_number)}
                      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default TableCreate;
