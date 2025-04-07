// CreateStoreModal.jsx
import React, { useState } from "react";
import {
    Modal,
    Typography,
    TextField,
    Button,
    InputAdornment,
} from "@mui/material";
import { Mail, Home, Phone, Store } from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import {
    getRazorPayId,
    purchaseCourseBundle,
    verifyUserPayment,
} from "../../Redux/Slice/paymentSlice";
import { toast } from "react-toastify";
import { createStore } from "../../Redux/Slice/storeSlice";

const CreateStoreModal = ({ open, handleClose }) => {
    const dispatch = useDispatch();

    // ❌ DON'T use async in useSelector
    const razorpayKey = useSelector((state) => state.payment.key);
    const subscription_id = useSelector((state) => state.payment.subscription_id);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        address: "",
    });

    const fields = [
        { label: "Store Name", name: "name", icon: <Store size={18} /> },
        { label: "Email", name: "email", type: "email", icon: <Mail size={18} /> },
        { label: "Contact Number", name: "contact", type: "tel", icon: <Phone size={18} /> },
        { label: "Address", name: "address", icon: <Home size={18} /> },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            console.log("📦 Starting store creation flow...");

            // Step 1: Get Razorpay key
            const keyRes = await dispatch(getRazorPayId()).unwrap();
            console.log("✅ Razorpay Key Fetched:", keyRes);

            // Step 2: Create subscription
            const subRes = await dispatch(purchaseCourseBundle()).unwrap();
            console.log("✅ Subscription Created:", subRes);

            console.log("📘 Current Razorpay State:", { razorpayKey, subscription_id });

            if (!razorpayKey || !subscription_id) {
                console.error("❌ Razorpay setup failed: Missing key or subscription_id");
                toast.error("Razorpay setup failed");
                return;
            }

            const options = {
                key: razorpayKey,
                subscription_id,
                name: "e-Shiksha Pvt. Ltd.",
                description: "Store Subscription",
                theme: { color: "#00BFFF" },
                handler: async function (response) {
                    console.log("💳 Payment Response from Razorpay:", response);

                    const storeRes = await dispatch(createStore(formData));
                    const storeId = storeRes?.payload?.data?._id;

                    console.log("🏪 Store creation response:", storeRes);

                    if (storeId) {
                        const paymentDetails = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature,
                            storeId,
                        };

                        console.log("🔐 Verifying Payment With Details:", paymentDetails);

                        const verifyRes = await dispatch(verifyUserPayment(paymentDetails));
                        console.log("✅ Payment Verification Response:", verifyRes);

                        if (verifyRes?.payload?.success) {
                            Swal.fire("Success", "Store created & payment verified!", "success");
                            handleClose();
                        } else {
                            Swal.fire("Warning", "Payment done but verification failed", "warning");
                        }
                    } else {
                        Swal.fire("Error", "Store not created", "error");
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.contact,
                },
            };

            console.log("🚀 Launching Razorpay Checkout with options:", options);
            new window.Razorpay(options).open();
        } catch (error) {
            console.error("❌ Error in create store flow:", error);
            Swal.fire("Error", error.message || "Something went wrong", "error");
        }
    };


    return (
        <Modal open={open} onClose={handleClose}>
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                <div className="p-6 w-full max-w-md bg-white rounded-lg shadow-lg">
                    <div className="flex items-center justify-between pb-4 border-b">
                        <Typography variant="h6">🚀 Create New Store</Typography>
                        <button onClick={handleClose} className="text-xl">✖</button>
                    </div>
                    <form className="space-y-4 mt-4">
                        {fields.map(({ label, name, type = "text", icon }) => (
                            <TextField
                                key={name}
                                fullWidth
                                label={label}
                                name={name}
                                type={type}
                                variant="outlined"
                                value={formData[name]}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {icon}
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        ))}
                        <div className="flex justify-end gap-4 mt-4">
                            <Button onClick={handleClose} color="error" variant="contained">Cancel</Button>
                            <Button onClick={handleSubmit} color="primary" variant="contained">
                                Proceed to payment
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default CreateStoreModal;
