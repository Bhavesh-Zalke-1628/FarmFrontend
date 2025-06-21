import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
    verifyUserPayment,
    getRazorPayId,
    purchaseCourseBundle,
} from "../../Redux/Slice/paymentSlice";

function Checkout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const razorpayKey = useSelector((state) => state?.razorpay?.key);
    const subscription_id = useSelector((state) => state?.razorpay?.subscription_id);

    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handleInputChange = (e) => {
        setUserDetails({
            ...userDetails,
            [e.target.name]: e.target.value,
        });
    };

    const validateForm = () => {
        return Object.values(userDetails).every(val => val.trim() !== '');
    };

    const handleSubscription = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.error("Please fill all user details");
            return;
        }

        if (!razorpayKey || !subscription_id) {
            toast.error("Razorpay not initialized");
            return;
        }

        const options = {
            key: razorpayKey,
            subscription_id: subscription_id,
            name: "e-Shiksha Pvt. Ltd.",
            description: "Course Subscription",
            handler: async function (response) {
                const paymentDetails = {
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                    razorpay_subscription_id: response.razorpay_subscription_id,
                };

                const res = await dispatch(verifyUserPayment(paymentDetails));
                toast.success(res?.payload?.msg || "Payment Verified");

                res?.payload?.success
                    ? navigate("/checkout/success")
                    : navigate("/checkout/fail");
            },
            prefill: {
                name: userDetails.name,
                email: userDetails.email,
                contact: userDetails.phone,
            },
            theme: {
                color: "#22c55e",
            },
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    const load = async () => {
        await dispatch(getRazorPayId());
        await dispatch(purchaseCourseBundle());
    };

    useEffect(() => {
        load();
    }, []);

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">📚 Subscribe to Course Bundle</h1>

            <form
                onSubmit={handleSubscription}
                className="bg-white shadow-lg rounded-lg p-6 space-y-6"
            >
                <div>
                    <h2 className="text-xl font-semibold mb-4">🧑 Your Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="name"
                            placeholder="Full Name"
                            className="border p-2 rounded"
                            value={userDetails.name}
                            onChange={handleInputChange}
                        />
                        <input
                            name="email"
                            placeholder="Email"
                            className="border p-2 rounded"
                            value={userDetails.email}
                            onChange={handleInputChange}
                        />
                        <input
                            name="phone"
                            placeholder="Phone"
                            className="border p-2 rounded"
                            value={userDetails.phone}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="text-center">
                    <button
                        type="submit"
                        className="bg-green-600 text-white px-8 py-4 text-lg rounded-lg hover:bg-green-700 transition"
                    >
                        ✅ Subscribe Now
                    </button>
                </div>
            </form>
        </div>
    );
}

export default Checkout;
