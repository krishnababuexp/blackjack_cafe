import React, { useState } from "react";
import { useGET } from "../../Hooks/useApi";
import { useAuth } from "../../Hooks/UseAuth";

const ProductCreate = () => {
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  const [productCode, setProductCode] = useState("");
  const [categoryId, setCategoryId] = useState(""); // State for selected category ID
  const [editingProductId, setEditingProductId] = useState(null); // State to track the product being edited
  const { data, isLoading } = useGET("catogery/list/");
  const {
    data: productData,
    isLoading: isProductLoading,
    refetch,
  } = useGET("product/alist/");

  const { user } = useAuth();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "productName") setProductName(value);
    if (name === "price") setPrice(value);
    if (name === "productCode") setProductCode(value);
  };

  const handleCategoryChange = (event) => {
    setCategoryId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!productName || !price || !productCode || !categoryId) {
      alert("All fields are required.");
      return;
    }

    try {
      const url = editingProductId
        ? `https://cafe.pythonanywhere.com/product/update/${editingProductId}/`
        : "https://cafe.pythonanywhere.com/product/create/";

      const method = editingProductId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token.access}`,
        },
        body: JSON.stringify({
          name: productName,
          user_price: parseFloat(price),
          product_code: productCode,
          catogery: categoryId,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      alert(
        editingProductId
          ? "Product updated successfully!"
          : "Product created successfully!"
      );

      // Clear form after submission
      setProductName("");
      setPrice("");
      setProductCode("");
      setCategoryId("");
      setEditingProductId(null);

      // Refetch products after submission
      refetch();
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert(
        editingProductId
          ? "Failed to update product. Please try again."
          : "Failed to create product. Please try again."
      );
    }
  };

  const handleEdit = (productId) => {
    const product = productData?.results?.find(
      (product) => product.id === productId
    );
    if (product) {
      setProductName(product.name);
      setPrice(product.user_price);
      setProductCode(product.product_code);
      setCategoryId(product.catogery.id);
      setEditingProductId(productId);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const response = await fetch(
          `https://cafe.pythonanywhere.com/product/delete/${productId}/`,
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

        alert("Product deleted successfully!");
        refetch();
      } catch (error) {
        console.error("There was a problem with the delete operation:", error);
        alert("Failed to delete product. Please try again.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-auto p-5 bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4 text-center">
          {editingProductId ? "Edit Product" : "Create Product"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Product Name */}
          <div className="mb-4">
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700"
            >
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={productName}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
            />
          </div>

          {/* Price */}
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={price}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter price"
            />
          </div>

          {/* Product Code */}
          <div className="mb-4">
            <label
              htmlFor="productCode"
              className="block text-sm font-medium text-gray-700"
            >
              Product Code
            </label>
            <input
              type="text"
              id="productCode"
              name="productCode"
              value={productCode}
              onChange={handleInputChange}
              className="border border-gray-300 rounded p-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product code"
            />
          </div>

          {/* Category */}
          <div className="mb-4">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700"
            >
              Category
            </label>
            <select
              id="category"
              value={categoryId}
              onChange={handleCategoryChange}
              className="border border-gray-300 rounded p-2 w-full mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {!isLoading && data && data.results?.length > 0 ? (
                data.results.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No categories available
                </option>
              )}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {editingProductId ? "Save Changes" : "Create Product"}
          </button>
        </form>
      </div>

      {/* Product List */}
      <div className="bg-white p-6 rounded shadow-md w-full max-w-4xl mt-6">
        <h2 className="text-xl font-bold mb-4 text-center">Product List</h2>
        {isProductLoading ? (
          <p>Loading products...</p>
        ) : productData && productData.results?.length > 0 ? (
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Name</th>
                <th className="py-2 px-4 border-b">Code</th>
                <th className="py-2 px-4 border-b">Price</th>
                <th className="py-2 px-4 border-b">Category</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {productData.results.map((product) => (
                <tr key={product.id}>
                  <td className="py-2 px-4 border-b">{product.name}</td>
                  <td className="py-2 px-4 border-b">{product.product_code}</td>
                  <td className="py-2 px-4 border-b">{product.user_price}</td>
                  <td className="py-2 px-4 border-b">
                    {product.catogery.name}
                  </td>
                  <td className="py-2 px-4 border-b">
                    <button
                      onClick={() => handleEdit(product.id)}
                      className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
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
          <p>No products available.</p>
        )}
      </div>
    </div>
  );
};

export default ProductCreate;
