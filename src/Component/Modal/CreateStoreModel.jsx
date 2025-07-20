import React, { useState, useEffect } from "react";
import {
    Modal,
    Typography,
    TextField,
    Button,
    InputAdornment,
    CircularProgress,
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
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        address: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [paymentInitializing, setPaymentInitializing] = useState(false);

    const fields = [
        { label: "Store Name", name: "name", icon: <Store size={18} /> },
        { label: "Email", name: "email", type: "email", icon: <Mail size={18} /> },
        { label: "Contact Number", name: "contact", type: "tel", icon: <Phone size={18} /> },
        { label: "Address", name: "address", icon: <Home size={18} />, multiline: true },
    ];

    useEffect(() => {
        // Reset form when modal closes
        if (!open) {
            setFormData({
                name: "",
                email: "",
                contact: "",
                address: "",
            });
            setIsLoading(false);
            setPaymentInitializing(false);
        }
    }, [open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const initializePayment = async () => {
        // try {
        setPaymentInitializing(true);

        // Get Razorpay credentials
        const razorpayAction = await dispatch(getRazorPayId());


        if (!razorpayAction.payload?.data?.key) {
            throw new Error("Failed to initialize payment gateway");
        }

        // Create subscription
        const subscriptionAction = await dispatch(purchaseCourseBundle());


        if (!subscriptionAction.payload?.data?.subscription_id) {
            throw new Error("Failed to create subscription plan");
        }


        return {
            razorpayKey: razorpayAction.payload.data.key,
            subscriptionId: subscriptionAction.payload.data.subscription_id
        };
        // } catch (error) {
        //     console.error("Payment initialization error:", error);
        //     throw error;
        // } finally {
        //     setPaymentInitializing(false);
        // }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic form validation
        if (!formData.name || !formData.email || !formData.contact) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            setIsLoading(true);

            // Initialize payment gateway
            const { razorpayKey, subscriptionId } = await initializePayment();

            const options = {
                key: razorpayKey,
                subscription_id: subscriptionId,
                name: "🌿 GreenFields Platform",
                description: "Premium Store Subscription",
                image: "https://your-logo-url.com/logo.png",
                theme: {
                    color: "#22C55E",
                    backdrop_color: "#F0FDF4"
                },
                modal: {
                    ondismiss: () => {
                        Swal.fire({
                            icon: 'info',
                            title: 'Payment Cancelled',
                            text: 'You can complete your subscription later',
                            confirmButtonColor: '#22C55E',
                        });
                    }
                },
                handler: async function (response) {
                    try {
                        const processingAlert = Swal.fire({
                            title: 'Processing...',
                            html: 'Creating your store and verifying payment',
                            allowOutsideClick: false,
                            didOpen: () => {
                                Swal.showLoading();
                            }
                        });

                        // Create store
                        const storeRes = await dispatch(createStore(formData));
                        const storeId = storeRes?.payload?.data?._id;

                        if (!storeId) {
                            await processingAlert.close();
                            throw new Error('Store creation failed');
                        }

                        // Verify payment
                        const paymentDetails = {
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_subscription_id: response.razorpay_subscription_id,
                            razorpay_signature: response.razorpay_signature,
                            storeId,
                        };

                        const verifyRes = await dispatch(verifyUserPayment(paymentDetails));
                        await processingAlert.close();

                        if (verifyRes?.payload?.success) {
                            await Swal.fire({
                                icon: 'success',
                                title: 'Congratulations! 🎉',
                                html: `
                                    <div style="text-align: left;">
                                        <p>Your store is now active with premium features!</p>
                                        <div style="background: #F0FDF4; padding: 12px; border-radius: 8px; margin-top: 12px;">
                                            <p><strong>Next steps:</strong></p>
                                            <ul style="margin-left: 16px;">
                                                <li>Customize your store settings</li>
                                                <li>Add your products</li>
                                                <li>Invite team members</li>
                                            </ul>
                                        </div>
                                    </div>
                                `,
                                confirmButtonColor: '#22C55E',
                                confirmButtonText: 'Go to Dashboard →',
                            });
                            handleClose();
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (error) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Almost There!',
                            html: `
                                <div>
                                    <p>${error.message}</p>
                                    <p style="margin-top: 12px;">Our team has been notified and will contact you shortly.</p>
                                </div>
                            `,
                            confirmButtonColor: '#22C55E',
                            footer: '<a href="/contact">Need immediate help? Contact support</a>'
                        });
                    }
                },
                prefill: {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.contact,
                },
                notes: {
                    "Welcome Note": "Thank you for choosing GreenFields!",
                }
            };

            new window.Razorpay(options).open();

        } catch (error) {
            console.error("Payment error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Payment Failed',
                text: error.message || 'Failed to initialize payment',
                confirmButtonColor: '#22C55E',
            });
        } finally {
            setIsLoading(false);
            if (paymentInitializing) {
                setPaymentInitializing(false);
            }
            handleClose();
            // Reset form data
            setFormData({
                name: "",
                email: "",
                contact: "",
                address: "",
                pincode: "",
            });

        }
    };

    return (
        <Modal open={open} onClose={!isLoading ? handleClose : undefined}>
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
                                onClick={!isLoading ? handleClose : undefined}
                                className="text-2xl font-bold hover:text-red-500 transition duration-300"
                                disabled={isLoading}
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {fields.map(({ label, name, type = "text", icon, multiline = false }) => (
                                <div key={name} className="relative group">
                                    <TextField
                                        fullWidth
                                        required
                                        label={label}
                                        name={name}
                                        type={type}
                                        value={formData[name]}
                                        onChange={handleChange}
                                        multiline={multiline}
                                        rows={multiline ? 3 : 1}
                                        variant="outlined"
                                        size="small"
                                        disabled={isLoading}
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
                                    disabled={isLoading}
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:shadow-lg hover:from-green-600 hover:to-emerald-700 transition-all duration-300 ease-in-out font-semibold px-6 py-2"
                                    disableElevation
                                    disabled={isLoading || paymentInitializing}
                                    endIcon={
                                        (isLoading || paymentInitializing) && (
                                            <CircularProgress size={20} color="inherit" />
                                        )
                                    }
                                >
                                    {paymentInitializing ? "Initializing..." : "Proceed to Payment"}
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