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
            <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-70">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
                    <div className="flex items-center justify-between border-b pb-3">
                        <Typography variant="h6" className="font-semibold flex items-center gap-2">
                            <Store size={24} /> Create New Store
                        </Typography>
                        <button
                            onClick={handleClose}
                            className="text-2xl font-bold hover:text-gray-700 transition"
                            aria-label="Close modal"
                        >
                            &times;
                        </button>
                    </div>

                    <form className="mt-6 space-y-5">
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
                                        <InputAdornment position="start" className="text-gray-600">
                                            {icon}
                                        </InputAdornment>
                                    ),
                                }}
                                size="small"
                            />
                        ))}

                        <div className="flex justify-end gap-3 mt-6">
                            <Button
                                onClick={handleClose}
                                color="error"
                                variant="outlined"
                                size="medium"
                                className="font-medium"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                color="primary"
                                variant="contained"
                                size="medium"
                                className="font-semibold"
                            >
                                Proceed to Payment
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default CreateStoreModal;
