import React, { useEffect, useState } from "react";
import { useAuth } from "../../Hooks/UseAuth";
import { useGET } from "../../Hooks/useApi";

const CreateStock = () => {
  const [homePrice, setHomePrice] = useState("");
  const [initialQuantity, setInitialQuantity] = useState("");
  const [addedQuantity, setAddedQuantity] = useState("");
  const [selectedProductId, setSelectedProductId] = useState("");
  const [editStockId, setEditStockId] = useState(null); // Track the stock being edited
  const { user } = useAuth();
  const [quantityCheck, setQuantityCheck] = useState(null);

  // Fetching product data for dropdown
  const { data: productData, isLoading: isProductLoading } =
    useGET("product/alist/");

  // Fetching stock data for the table
  const {
    data: stockData,
    isLoading: isStockLoading,
    refetch,
  } = useGET("stock/list/");
  // Call quantity check API when component mounts
  useEffect(() => {
    const fetchQuantityCheck = async () => {
      try {
        const response = await fetch(
          "https://cafe-app-meu8i.ondigitalocean.app/quantity/check/",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user.token.access}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quantity check");
        }

        const data = await response.json();
        setQuantityCheck(data); // Store the data in state
      } catch (error) {
        console.error("Error fetching quantity check:", error);
      }
    };

    fetchQuantityCheck();
  }, [user.token.access]); // Run this effect once when the component mounts

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "homePrice") setHomePrice(value);
    if (name === "initialQuantity") setInitialQuantity(value);
    if (name === "productId") setSelectedProductId(value);
    if (name === "addedQuantity") setAddedQuantity(value); // Track added quantity in edit mode
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!homePrice || !initialQuantity || !selectedProductId) {
      alert("All fields are required.");
      return;
    }

    try {
      const response = await fetch(
        "https://cafe-app-meu8i.ondigitalocean.app/stock/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token.access}`,
          },
          body: JSON.stringify({
            home_price: homePrice,
            initial_quantity: initialQuantity,
            product: selectedProductId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create stock");
      }

      alert("Stock created successfully!");
      // Clear form after submission
      setHomePrice("");
      setInitialQuantity("");
      setSelectedProductId("");

      // Refetch stock data
      refetch();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("Failed to create stock. Please try again.");
    }
  };

  const handleUpdateClick = (stock) => {
    setEditStockId(stock.id);
    setHomePrice(stock.home_price);
    setInitialQuantity(stock.initial_quantity); // Pre-fill initial quantity in edit mode
    setSelectedProductId(stock.product.id); // Pre-select the product in edit mode
    setAddedQuantity(""); // Reset added quantity input
  };

  const handleSaveUpdate = async () => {
    if (!homePrice || !initialQuantity || !selectedProductId) {
      alert("All fields are required for update.");
      return;
    }

    try {
      const response = await fetch(
        `https://cafe-app-meu8i.ondigitalocean.app/stock/update/${editStockId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token.access}`,
          },
          body: JSON.stringify({
            home_price: homePrice,
            initial_quantity: initialQuantity, // Update initial quantity
            added_quantity: addedQuantity, // Use added_quantity in update
            product: selectedProductId, // Include product ID
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update stock");
      }

      alert("Stock updated successfully!");
      refetch(); // Refresh stock data
      setEditStockId(null); // Exit edit mode
      setHomePrice("");
      setInitialQuantity("");
      setAddedQuantity("");
      setSelectedProductId("");
    } catch (error) {
      console.error("Error updating stock:", error);
      alert("Failed to update stock.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `https://cafe-app-meu8i.ondigitalocean.app/stock/delete/${id}/`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${user.token.access}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete stock");
      }

      alert("Stock deleted successfully!");
      refetch(); // Refresh stock data
    } catch (error) {
      console.error("Error deleting stock:", error);
      alert("Failed to delete stock.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto p-5 bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg mb-6">
        <h2 className="text-xl font-bold mb-4 text-center">
          {editStockId ? "Update Stock" : "Create Stock"}
        </h2>
        <form onSubmit={editStockId ? (e) => e.preventDefault() : handleSubmit}>
          {/* Home Price Input */}
          <div className="mb-4">
            <label
              htmlFor="homePrice"
              className="block text-sm font-medium text-gray-700"
            >
              Home Price
            </label>
            <input
              type="number"
              id="homePrice"
              name="homePrice"
              value={homePrice}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter home price"
            />
          </div>

          {/* Initial Quantity Input (show in both create and edit modes) */}
          <div className="mb-4">
            <label
              htmlFor="initialQuantity"
              className="block text-sm font-medium text-gray-700"
            >
              Initial Quantity
            </label>
            <input
              type="number"
              id="initialQuantity"
              name="initialQuantity"
              value={initialQuantity}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter initial quantity"
            />
          </div>

          {/* Added Quantity Input (only shown in edit mode) */}
          {editStockId && (
            <div className="mb-4">
              <label
                htmlFor="addedQuantity"
                className="block text-sm font-medium text-gray-700"
              >
                Added Quantity
              </label>
              <input
                type="number"
                id="addedQuantity"
                name="addedQuantity"
                value={addedQuantity}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter quantity to add"
              />
            </div>
          )}

          {/* Product Dropdown */}
          <div className="mb-4">
            <label
              htmlFor="productId"
              className="block text-sm font-medium text-gray-700"
            >
              Select Product
            </label>
            {isProductLoading ? (
              <p>Loading products...</p>
            ) : (
              <select
                id="productId"
                name="productId"
                value={selectedProductId}
                onChange={handleInputChange}
                className="border border-gray-300 rounded p-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Product --</option>
                {productData &&
                productData.results &&
                productData.results.length > 0 ? (
                  productData.results.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Code: {product.product_code})
                    </option>
                  ))
                ) : (
                  <option disabled>No products available</option>
                )}
              </select>
            )}
          </div>

          {/* Submit or Save Button */}
          <button
            type={editStockId ? "button" : "submit"}
            onClick={editStockId ? handleSaveUpdate : undefined}
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {editStockId ? "Save Update" : "Create Stock"}
          </button>
        </form>
      </div>

      {/* Display Stock Data in Table */}
      <div className="bg-white p-6 rounded shadow-md w-full max-w-3xl">
        <h2 className="text-xl font-bold mb-4 text-center">Stock List</h2>
        {isStockLoading ? (
          <p>Loading stock data...</p>
        ) : (
          <table className="min-w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Product Name</th>
                <th className="border px-4 py-2">Home Price</th>
                <th className="border px-4 py-2">Stock Available</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stockData &&
              stockData.results &&
              stockData.results.length > 0 ? (
                stockData.results.map((stock) => (
                  <tr key={stock.id}>
                    <td className="border px-4 py-2">
                      {stock.product.name} (Code: {stock.product.product_code})
                    </td>
                    <td className="border px-4 py-2">{stock.home_price}</td>
                    <td className="border px-4 py-2">
                      {stock.remaining_quantity}
                    </td>
                    <td className="border px-4 py-2 space-x-2">
                      <button
                        onClick={() => handleUpdateClick(stock)}
                        className="bg-yellow-500 text-white px-2 py-1 rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(stock.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No stock data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CreateStock;
