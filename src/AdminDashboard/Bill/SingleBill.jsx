import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Hooks/UseAuth";
import ReactToPrint from "react-to-print";

const SingleBill = () => {
  const { id } = useParams(); // Get the bill ID from the URL
  const { user } = useAuth();
  const [billDetails, setBillDetails] = useState(null); // Store fetched bill details
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle error state
  const componentRef = useRef(); // Ref for the component to be printed

  useEffect(() => {
    const fetchBillDetails = async () => {
      try {
        const response = await fetch(
          `https://cafe-app-meu8i.ondigitalocean.app/indivisual-print/details/${id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.token.access}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok) {
          setBillDetails(data); // Set bill details if the request is successful
        } else {
          setError(`Error: ${data.detail || "Failed to fetch bill details"}`);
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false); // Stop loading after the fetch completes
      }
    };

    fetchBillDetails();
  }, [id, user.token.access]);

  if (loading) {
    return <div className="p-4 text-center">Loading...</div>; // Show a loading message while fetching data
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">{error}</div>; // Show an error message if the fetch fails
  }

  return (
    <div className="p-4 mt-4 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Bill Details</h2>

      <div ref={componentRef}>
        {billDetails ? (
          <div>
            <div className="mb-4">
              {/* <h3 className="text-xl font-semibold mb-2">Cafe Information</h3> */}
              <div className="flex flex-col items-center mb-2">
                {billDetails.cafe.photo && (
                  <img
                    src={
                      "https://cafe-app-meu8i.ondigitalocean.app" +
                      billDetails.cafe.photo
                    }
                    alt="Cafe"
                    className="w-24 h-24 object-cover rounded-full mr-4"
                  />
                )}

                <p className="font-semibold text-2xl">
                  <b> {billDetails.cafe.name}</b>
                </p>
                {/* <p>Address: {billDetails.cafe.address}</p> */}
                <p>Kamana Chowk, Bharatpur, Nepal</p>
                <p>984-5523000</p>
                <p>blackjaack90@gmail.com</p>
                {/* <p>Email: {billDetails.cafe.email}</p> */}
              </div>
            </div>

            <div className="mb-4">
              <p>
                <strong>Bill Number:</strong> {billDetails.bill_number}
              </p>
              <p>
                <strong>Date:</strong> {billDetails.bill_created}
              </p>
              {/* <p>
                <strong>Time:</strong> {billDetails.bill_time}
              </p> */}
              <p>
                <strong>Table Number:</strong>{" "}
                {billDetails.order.table_number.table_name}
              </p>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-2">Order Summary</h3>
              <table className="w-full bg-gray-100 border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border px-4 py-2">Product</th>
                    <th className="border px-4 py-2">Price</th>
                    <th className="border px-4 py-2">Quantity</th>
                    <th className="border px-4 py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {billDetails.order.order_list.map((item) => (
                    <tr key={item.id}>
                      <td className="border px-4 py-2">{item.product}</td>
                      <td className="border px-4 py-2">
                        Rs {item.price.toFixed(2)}
                      </td>
                      <td className="border px-4 py-2">{item.quantity}</td>
                      <td className="border px-4 py-2">
                        Rs {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              {/* <p>
                <strong>Discount Amount:</strong> Rs
                {billDetails.discount_amount.toFixed(2)}
              </p> */}
              <p className="text-xl font-bold">
                <strong>Grand Total:</strong> Rs
                {billDetails.grand_total.toFixed(2)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-center">No bill details available</p>
        )}
      </div>

      <div className="mt-4 text-center">
        <ReactToPrint
          trigger={() => (
            <button className="btn btn-primary">Print Bill</button>
          )}
          content={() => componentRef.current}
        />
      </div>
    </div>
  );
};

export default SingleBill;
