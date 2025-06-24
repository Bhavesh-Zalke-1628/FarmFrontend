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

const StoreFormModal = ({ open, handleClose }) => {
    const dispatch = useDispatch();
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
        { label: "Address", name: "address", icon: <Home size={18} />, multiline: true },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        try {
            await dispatch(getRazorPayId()).unwrap();
            await dispatch(purchaseCourseBundle()).unwrap();

            if (!razorpayKey || !subscription_id) {
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
                    const storeRes = await dispatch(createStore(formData));
                    const storeId = storeRes?.payload?.data?._id;

                    if (storeId) {
                        const paymentDetails = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature,
                            storeId,
                        };

                        const verifyRes = await dispatch(verifyUserPayment(paymentDetails));

                        console.log(verifyRes)

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

            new window.Razorpay(options).open();
        } catch (error) {
            Swal.fire("Error", error.message || "Something went wrong", "error");
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="w-full max-w-4xl mx-auto rounded-xl overflow-hidden shadow-xl transform transition-all scale-100 bg-white bg-opacity-90 backdrop-blur-lg md:flex md:gap-6 p-0">
                    {/* Left Section */}
                    <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-green-200 via-green-100 to-green-50 p-6">
                        <Store size={64} className="text-green-600 drop-shadow-md mb-4 animate-bounce" />
                        <Typography variant="h5" className="font-bold text-gray-700 text-center mb-1">
                            Start Your Store
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 text-center">
                            Create your digital storefront and reach more customers.
                        </Typography>
                    </div>

                    {/* Right Section */}
                    <div className="w-full md:w-1/2 p-6">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <Typography variant="h6" className="flex items-center gap-2 font-semibold text-gray-800">
                                <Store size={20} /> Store Registration
                            </Typography>
                            <button
                                onClick={handleClose}
                                className="text-2xl font-bold hover:text-red-500 transition duration-300"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-5">
                            {fields.map(({ label, name, type = "text", icon, multiline = false }) => (
                                <div key={name} className="relative group">
                                    <TextField
                                        fullWidth
                                        label={label}
                                        name={name}
                                        type={type}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        multiline={multiline}
                                        rows={multiline ? 3 : 1}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <span className="text-green-600 group-hover:animate-pulse">{icon}</span>
                                                </InputAdornment>
                                            ),
                                        }}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: "12px",
                                                backgroundColor: "#f9f9f9",
                                                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                                                transition: "all 0.3s ease",
                                                "&:hover": {
                                                    backgroundColor: "#f1f5f9",
                                                },
                                                "&.Mui-focused": {
                                                    backgroundColor: "#e0fce9",
                                                    boxShadow: "0 0 0 2px #4ade80",
                                                    borderColor: "#22c55e",
                                                },
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: "#16a34a",
                                            },
                                        }}
                                    />
                                </div>
                            ))}

                            <div className="flex justify-end gap-4 pt-6">
                                <Button
                                    onClick={handleClose}
                                    variant="outlined"
                                    color="error"
                                    className="rounded-full border-red-500 text-red-500 hover:bg-red-50 hover:shadow-md transition duration-300 font-medium px-5 py-2"
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 ease-in-out font-semibold px-6 py-2"
                                    disableElevation
                                >
                                    Proceed to Payment
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default StoreFormModal;
