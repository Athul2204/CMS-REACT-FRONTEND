import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PharmacistLayout from "../components/PharmacistLayout";
import { getMedicineBillDetail } from "../api/pharmacistApi";

const PrintBillPage = () => {
  const { billId } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadBill = async () => {
      try {
        const res = await getMedicineBillDetail(billId);
        setBill(res.data || res);
      } catch {
        setError("Failed to load bill.");
      } finally {
        setLoading(false);
      }
    };

    loadBill();
  }, [billId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <PharmacistLayout title="Print Bill">
        <div className="text-gray-400 py-10 text-center">Loading bill...</div>
      </PharmacistLayout>
    );
  }

  if (error || !bill) {
    return (
      <PharmacistLayout title="Print Bill">
        <div className="text-red-400 py-10 text-center">
          {error || "Bill not found."}
        </div>
      </PharmacistLayout>
    );
  }

  return (
    <>
    {/* <PharmacistLayout title="Print Bill"> */}
      <div className="print:hidden flex items-center justify-between mb-6">
        <button
          onClick={() => navigate("/pharmacist/bills")}
          className="text-sm text-gray-400 hover:text-white"
        >
          ← Back to Bills
        </button>

        <button
          onClick={handlePrint}
          className="bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition"
        >
          Print / Save PDF
        </button>
      </div>

      <div className="max-w-5xl mx-auto bg-white text-black rounded-xl shadow print:shadow-none print:rounded-none">
        <div className="p-8">
          <div className="border-b pb-4 mb-6 text-center">
            {/* <h1 className="text-2xl font-bold">Clinic Pharmacy Bill</h1> */}
           <h1 className="text-xl font-bold mb-2 text-center">
                Clinic Pharmacy Bill
                </h1>

                {bill.payment_status === "Pending" && (
                <p className="text-center text-red-600 font-semibold mb-4">
                    ⚠ UNPAID BILL
                </p>
                )}
  
            <p className="text-sm text-gray-600">Patient Copy</p>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6 text-sm">
            <div className="space-y-1">
              <p><span className="font-semibold">Bill No:</span> #{bill.bill_id}</p>
              <p><span className="font-semibold">Prescription Code:</span> {bill.prescription_code || "—"}</p>
              <p>
                <span className="font-semibold">Bill Date:</span>{" "}
                {bill.created_at ? new Date(bill.created_at).toLocaleDateString("en-IN") : "—"}
              </p>
              <p>
                <span className="font-semibold">Dispense Date:</span>{" "}
                {bill.dispense_date ? new Date(bill.dispense_date).toLocaleDateString("en-IN") : "—"}
              </p>
            </div>

            <div className="space-y-1">
              <p>
                <span className="font-semibold">Patient:</span>{" "}
                {bill.patient_details?.full_name || "—"}
              </p>
              <p>
                <span className="font-semibold">Doctor:</span>{" "}
                {bill.doctor_name || "—"}
              </p>
              <p>
                <span className="font-semibold">Payment Status:</span>{" "}
                <span className={bill.payment_status === "Paid" ? "text-green-700 font-semibold" : "text-yellow-700 font-semibold"}>
                  {bill.payment_status}
                </span>
              </p>
            </div>
          </div>

          {bill.bill_note ? (
            <div className="mb-5 border border-yellow-400 bg-yellow-50 text-yellow-800 rounded-lg px-4 py-3 text-sm">
              {bill.bill_note}
            </div>
          ) : null}

          <div className="overflow-x-auto mb-6">
            <table className="w-full border border-gray-300 text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2 text-left">Medicine</th>
                  <th className="border px-3 py-2 text-left">Dosage</th>
                  <th className="border px-3 py-2 text-left">Instructions</th>
                  <th className="border px-3 py-2 text-center">Prescribed</th>
                  <th className="border px-3 py-2 text-center">Given</th>
                  <th className="border px-3 py-2 text-center">Remaining</th>
                  <th className="border px-3 py-2 text-right">Unit Price</th>
                  <th className="border px-3 py-2 text-right">Line Total</th>
                </tr>
              </thead>
              <tbody>
                {bill.items?.length ? (
                  bill.items.map((item, index) => (
                    <tr key={index} className="align-top">
                      <td className="border px-3 py-2">
                        <p className="font-medium">{item.medicine_name}</p>
                        {item.batch_numbers?.length ? (
                          <p className="text-xs text-gray-500 mt-1">
                            Batch: {item.batch_numbers.join(", ")}
                          </p>
                        ) : null}
                        {item.is_partial ? (
                          <p className="text-xs text-red-600 mt-1 font-medium">
                            Partial Dispense
                          </p>
                        ) : null}
                      </td>

                      <td className="border px-3 py-2">{item.dosage || "—"}</td>
                      <td className="border px-3 py-2">{item.instructions || "—"}</td>
                      <td className="border px-3 py-2 text-center">{item.prescribed_quantity}</td>
                      <td className="border px-3 py-2 text-center">{item.dispensed_quantity}</td>
                      <td className="border px-3 py-2 text-center">{item.remaining_quantity}</td>
                      <td className="border px-3 py-2 text-right">
                        ₹{parseFloat(item.unit_price || 0).toFixed(2)}
                      </td>
                      <td className="border px-3 py-2 text-right">
                        ₹{parseFloat(item.line_total || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={8} className="border px-3 py-6 text-center text-gray-500">
                      No items found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {bill.items?.some((item) => item.is_partial) ? (
            <div className="mb-6">
              <h3 className="font-semibold text-red-700 mb-2">Important Note</h3>
              <div className="space-y-2">
                {bill.items
                  .filter((item) => item.is_partial)
                  .map((item, index) => (
                    <p key={index} className="text-sm text-red-700">
                      • {item.note}
                    </p>
                  ))}
              </div>
            </div>
          ) : null}

          <div className="ml-auto w-full max-w-sm border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{parseFloat(bill.total_amount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>₹{parseFloat(bill.discount || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>Final Amount</span>
              <span>₹{parseFloat(bill.final_amount || 0).toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-10 text-center text-xs text-gray-500">
            Thank you. Please keep this bill for your records.
          </div>
        </div>
      </div>
    {/* </PharmacistLayout> */}
    </>
  );
};

export default PrintBillPage;