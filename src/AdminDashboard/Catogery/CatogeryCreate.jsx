import React, { useState, useEffect } from "react";
import { useAuth } from "../../Hooks/UseAuth";
import { useGET } from "../../Hooks/useApi";

const CatogeryCreate = () => {
  const [category, setCategory] = useState("");
  const [editMode, setEditMode] = useState(null);
  const [editedCategoryName, setEditedCategoryName] = useState("");

  const { user } = useAuth();
  const { data, isLoading, refetch } = useGET("catogery/list/");
  console.log(data);

  // Handle category input change
  const handleInputChange = (event) => {
    setCategory(event.target.value);
  };

  // Handle adding a new category
  const handleAddClick = async () => {
    if (category.trim() === "") {
      alert("Category cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        "https://cafe-app-meu8i.ondigitalocean.app/catogery/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token.access}`,
          },
          body: JSON.stringify({ name: category }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      alert("Category added successfully!");
      setCategory(""); // Clear input field
      refetch(); // Refetch the list of categories to instantly update the UI
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("Failed to add category. Please try again.");
    }
  };

  // Handle entering edit mode
  const handleEdit = (id, name) => {
    setEditMode(id);
    setEditedCategoryName(name);
  };

  // Handle saving updated category
  const handleSave = async (id) => {
    if (editedCategoryName.trim() === "") {
      alert("Category name cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `https://cafe-app-meu8i.ondigitalocean.app/catogery/update/${id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token.access}`,
          },
          body: JSON.stringify({ name: editedCategoryName }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      alert("Category updated successfully!");
      setEditMode(null); // Exit edit mode
      refetch(); // Refetch the list of categories to instantly update the UI
    } catch (error) {
      console.error("There was a problem with the update operation:", error);
      alert("Failed to update category. Please try again.");
    }
  };

  // Handle deleting a category
  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://cafe-app-meu8i.ondigitalocean.app/catogery/delete/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token.access}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      alert("Category deleted successfully!");
      refetch(); // Refetch the list of categories to instantly update the UI
    } catch (error) {
      console.error("There was a problem with the delete operation:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-center">Create Category</h2>
        <input
          type="text"
          value={category}
          onChange={handleInputChange}
          className="border border-gray-300 rounded p-2 w-full mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter category name"
        />
        <button
          onClick={handleAddClick}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Add Category
        </button>

        {isLoading ? (
          <p className="text-center mt-4">Loading categories...</p>
        ) : data && data.results && data.results.length > 0 ? (
          <table className="min-w-full bg-white mt-6 border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">ID</th>
                <th className="py-2 px-4 border-b text-left">Photo</th>
                <th className="py-2 px-4 border-b text-left">Name</th>
                <th className="py-2 px-4 border-b text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.results.map((category) => (
                <tr key={category.id}>
                  <td className="py-2 px-4 border-b">{category.id}</td>
                  <td className="py-2 px-4 border-b">
                    {category.photo ? (
                      <img
                        src={category.photo}
                        alt={category.name}
                        className="h-12 w-12 object-cover"
                      />
                    ) : (
                      <span className="text-gray-500">No Photo</span>
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editMode === category.id ? (
                      <input
                        type="text"
                        value={editedCategoryName}
                        onChange={(e) => setEditedCategoryName(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      category.name
                    )}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {editMode === category.id ? (
                      <button
                        onClick={() => handleSave(category.id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2 hover:bg-green-600"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEdit(category.id, category.name)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center mt-4">No categories available</p>
        )}
      </div>
    </div>
  );
};

export default CatogeryCreate;
