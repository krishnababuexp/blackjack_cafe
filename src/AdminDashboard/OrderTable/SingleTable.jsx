import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGET } from "../../Hooks/useApi";
import { useAuth } from "../../Hooks/UseAuth";

const SingleTable = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [orderItems, setOrderItems] = useState([]);
  const [tableOrders, setTableOrders] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [editQuantity, setEditQuantity] = useState(0);
  const [billCreated, setBillCreated] = useState(false);
  const { user } = useAuth();

  const { data: productData } = useGET("product/alist/");
  const { data: tableOrderData, refetch } = useGET(`table-order/list/${id}/`);

  // Set product data on load
  useEffect(() => {
    if (productData) {
      setProducts(productData.results || []);
    }
  }, [productData]);

  // Set table orders on load
  useEffect(() => {
    if (tableOrderData && tableOrderData.data) {
      const { data } = tableOrderData;
      setTableOrders([data]); // Ensure tableOrders is always an array
    } else {
      setTableOrders([]); // Set to empty array if data is not available
    }
  }, [tableOrderData]);

  // Add new product to orderItems
  const handleAddProduct = () => {
    const product = products.find((p) => p.id === parseInt(selectedProduct));
    if (product) {
      const newOrderItem = { product: product.id, quantity };
      setOrderItems([...orderItems, newOrderItem]); // Instantly update UI
      setSelectedProduct("");
      setQuantity(1);
    }
  };

  // Send new order to the API
  const handleSendOrder = async () => {
    const orderData = {
      order_item: orderItems,
      table_number: id,
      order_taken_by: 1,
    };

    try {
      const response = await fetch(
        "https://cafe-app-meu8i.ondigitalocean.app/order/create/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token.access}`,
          },
          body: JSON.stringify(orderData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert("Order sent successfully!");
        setOrderItems([]); // Clear the order items
        refetch(); // Refetch table orders after creation to instantly update UI
      } else {
        alert(`Error: ${result.detail || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Error creating order: " + error.message);
    }
  };

  // Update existing order
  const handleUpdateOrder = async () => {
    if (tableOrders.length === 0) {
      alert("No existing order to update.");
      return;
    }

    const existingOrder = tableOrders[0];
    const orderData = {
      order_item: orderItems,
      table_number: id,
      order_taken_by: 1,
    };

    try {
      const response = await fetch(
        `https://cafe-app-meu8i.ondigitalocean.app/order-item-update/${id}/${existingOrder.order_number}/${existingOrder.order_item[0].id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token.access}`,
          },
          body: JSON.stringify(orderData),
        }
      );
      const result = await response.json();
      if (response.ok) {
        alert("Order updated successfully!");
        setOrderItems([]); // Clear the order items
        refetch(); // Refetch table orders after update to instantly update UI
      } else {
        alert(`Error: ${result.detail || "Something went wrong"}`);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order: " + error.message);
    }
  };

  // Delete a product from the existing order
  const handleDeleteItem = async (orderNumber, itemId) => {
    try {
      const response = await fetch(
        `https://cafe-app-meu8i.ondigitalocean.app/ordered-item-delete/${orderNumber}/${itemId}/`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token.access}`,
          },
        }
      );
      if (response.ok) {
        alert("Item deleted successfully!");
        setTableOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderNumber
              ? {
                  ...order,
                  order_item: order.order_item.filter(
                    (item) => item.id !== itemId
                  ),
                }
              : order
          )
        );
        refetch(); // Refetch table orders after deletion to instantly update UI
      } else {
        alert("Error deleting the item.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Error deleting item: " + error.message);
    }
  };

  // Handle update click for editing item quantity
  const handleUpdateClick = (itemId, currentQuantity) => {
    setEditRow(itemId);
    setEditQuantity(currentQuantity);
  };

  // Save updated item to the API
  const handleSaveClick = async (orderNumber, itemId, productId) => {
    const updateData = {
      order_item: [
        {
          product: productId,
          quantity: editQuantity,
        },
      ],
      table_number: id,
      order_taken_by: 1,
    };

    try {
      const response = await fetch(
        `https://cafe-app-meu8i.ondigitalocean.app/order-item-update/${id}/${orderNumber}/${itemId}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token.access}`,
          },
          body: JSON.stringify(updateData),
        }
      );
      if (response.ok) {
        alert("Item updated successfully!");
        setEditRow(null);
        refetch(); // Refetch table orders after update to instantly update UI
      } else {
        alert("Error updating the item.");
      }
    } catch (error) {
      console.error("Error updating item:", error);
      alert("Error updating item: " + error.message);
    }
  };

  const handleCancelClick = () => {
    setEditRow(null);
    setEditQuantity(0);
  };

  // Create a bill for the current order
  const handleCreateBill = async () => {
    if (tableOrders.length > 0) {
      const orderId = tableOrders[0].id;
      try {
        const response = await fetch(
          "https://cafe-app-meu8i.ondigitalocean.app/bill/create/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token.access}`,
            },
            body: JSON.stringify({ order: orderId }),
          }
        );
        const result = await response.json();
        if (response.ok) {
          alert("Bill created successfully!");
          setBillCreated(true);
          navigate(`/singlebill/${result.data.id}`); // Navigate to the created bill page
        } else {
          alert(`Error: ${result.detail || "Something went wrong"}`);
        }
      } catch (error) {
        console.error("Error creating bill:", error);
        alert("Error creating bill: " + error.message);
      }
    } else {
      alert("No order to create a bill for.");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Single Table Order</h2>

      <div className="mb-4">
        <h3 className="text-xl font-bold mb-2">Add New Product</h3>
        <label className="block text-lg mb-2">Select Product</label>
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          className="border rounded-lg p-2 w-full mb-2"
        >
          <option value="">Select a product</option>
          {products.length > 0 ? (
            products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))
          ) : (
            <option value="">No products available</option>
          )}
        </select>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
          className="border rounded-lg p-2 w-full mb-2"
        />
        <button
          onClick={handleAddProduct}
          className="bg-blue-500 text-white p-2 rounded-lg"
        >
          Add Product
        </button>
      </div>

      {orderItems.length > 0 ? (
        <div className="mb-4">
          <h3 className="text-xl font-bold mb-2">Order Summary</h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Product Name</th>
                <th className="border px-4 py-2">Quantity</th>
              </tr>
            </thead>
            <tbody>
              {orderItems.map((item, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">
                    {products.find((p) => p.id === item.product)?.name ||
                      "Unknown Product"}
                  </td>
                  <td className="border px-4 py-2">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button
            onClick={handleSendOrder}
            className="bg-green-500 text-white p-2 rounded-lg mt-4"
          >
            Send Order
          </button>
        </div>
      ) : (
        <p>No items added to the order</p>
      )}
      {tableOrders.length > 0 && tableOrders[0]?.order_item?.length > 0 ? (
        <div className="mt-8">
          <h3 className="text-xl font-bold mb-2">Existing Order</h3>
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="border px-4 py-2">Product Name</th>
                <th className="border px-4 py-2">Per Price</th>
                <th className="border px-4 py-2">Total Price</th>
                <th className="border px-4 py-2">Quantity</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableOrders[0].order_item.length > 0 ? (
                tableOrders[0].order_item.map((item) => (
                  <tr key={item.id}>
                    <td className="border px-4 py-2">
                      {item.product || "Unknown Product"}
                    </td>
                    <td className="border px-4 py-2">{item.price || "N/A"}</td>
                    <td className="border px-4 py-2">
                      {item.order_product_price || "N/A"}
                    </td>
                    <td className="border px-4 py-2">
                      {editRow === item.id ? (
                        <input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(e.target.value)}
                          className="border rounded-lg p-1"
                          min="1"
                        />
                      ) : (
                        item.quantity
                      )}
                    </td>
                    <td className="border px-4 py-2">
                      {editRow === item.id ? (
                        <>
                          <button
                            onClick={() =>
                              handleSaveClick(
                                tableOrders[0].order_number,
                                item.id,
                                item.product_id
                              )
                            }
                            className="bg-green-500 text-white p-2 rounded-lg mr-2"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelClick}
                            className="bg-gray-500 text-white p-2 rounded-lg"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              handleUpdateClick(item.id, item.quantity)
                            }
                            className="bg-yellow-500 text-white p-2 rounded-lg mr-2"
                          >
                            Update
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteItem(
                                tableOrders[0].order_number,
                                item.id
                              )
                            }
                            className="bg-red-500 text-white p-2 rounded-lg"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border px-4 py-2 text-center">
                    No items in the existing order
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          <p>
            <strong>Total Price:</strong> {tableOrders[0].total_price || "N/A"}
          </p>
          <button
            onClick={handleUpdateOrder}
            className="bg-yellow-500 text-white p-2 rounded-lg mt-4"
          >
            Update Existing Order
          </button>
        </div>
      ) : (
        <p>No existing order found</p>
      )}

      <button
        onClick={handleCreateBill}
        className="bg-purple-500 text-white p-2 rounded-lg mt-4"
      >
        Create Bill
      </button>
    </div>
  );
};

export default SingleTable;
