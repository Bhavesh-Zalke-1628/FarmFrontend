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
import { createStore } from "../../Redux/Slice/storeSlice";
import { toast } from "react-toastify";

const CreateStoreModal = ({ open, handleClose }) => {
    const dispatch = useDispatch();
    const razorpayKey = useSelector((state) => state?.payment?.key);
    const subscription_id = useSelector((state) => state?.payment?.subscription_id);

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

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleSubmit = async () => {
        try {
            await dispatch(getRazorPayId());
            await dispatch(purchaseCourseBundle());

            if (!razorpayKey || !subscription_id) {
                toast.error("Razorpay setup failed");
                return;
            }

            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Failed to load Razorpay SDK");
                return;
            }

            const options = {
                key: razorpayKey,
                subscription_id: subscription_id,
                name: "e-Shiksha Pvt. Ltd.",
                description: "Store Subscription",
                theme: { color: "#F37254" },
                handler: async function (response) {
                    const paymentDetails = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_subscription_id: response.razorpay_subscription_id,
                        razorpay_signature: response.razorpay_signature,
                    };

                    const storeResponse = await dispatch(createStore(formData));

                    if (res?.payload?.success) {
                        const res = await dispatch(verifyUserPayment(paymentDetails));
                        console.log(res)
                        if (storeResponse?.payload?.success) {
                            Swal.fire("Success", "Store created & payment done!", "success");
                            handleClose();
                        } else {
                            Swal.fire("Store Error", "Payment was fine, but store not created", "warning");
                        }
                    } else {
                        Swal.fire("Failed", "Payment verification failed", "error");
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.contact,
                },
            };

            window.Razorpay(options).open(); // ✅ this is what you asked
        } catch (error) {
            Swal.fire("Error", error.message || "Something went wrong", "error");
        }
    };

    return (
        <Modal open={open} onClose={handleClose} aria-labelledby="create-store-modal">
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                <div className="relative p-6 w-full max-w-md bg-white rounded-lg shadow-lg dark:bg-gray-800">
                    <div className="flex items-center justify-between pb-4 border-b border-gray-300 dark:border-gray-600">
                        <Typography variant="h6" className="text-gray-900 dark:text-white font-semibold">
                            🚀 Create New Store
                        </Typography>
                        <button
                            type="button"
                            className="text-gray-400 hover:bg-gray-200 hover:text-gray-900 rounded-lg w-8 h-8 flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                            onClick={handleClose}
                        >
                            ✖
                        </button>
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
                                    startAdornment: <InputAdornment position="start">{icon}</InputAdornment>,
                                }}
                            />
                        ))}

                        <div className="flex justify-end gap-4 mt-4">
                            <Button onClick={handleClose} color="error" variant="contained">
                                Cancel
                            </Button>
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
