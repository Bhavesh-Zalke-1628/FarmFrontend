import { useEffect } from "react";
import { toast } from "react-toastify"; // ✅ use react-toastify instead
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { verifyUserPayment, getRazorPayId, purchaseCourseBundle } from "../../Redux/Slice/paymentSlice";


function Checkout() {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const razorpayKey = useSelector((state) => state?.razorpay?.key);
    const subscription_id = useSelector((state) => state?.razorpay?.subscription_id);

    const paymentDetails = {
        razorpay_payment_id: "",
        razorpay_subscription_id: "",
        razorpay_signature: ""
    }

    async function handleSubscription(e) {
        e.preventDefault();
        if (!razorpayKey || !subscription_id) {
            toast.error("Something went wrong");
            return;
        }

        const options = {
            key: razorpayKey,
            subscription_id: subscription_id,
            name: "e-Shiksha Pvt. Ltd.",
            description: "Subscription",
            theme: {
                color: '#F37254'
            },
            handler: async function (response) {
                paymentDetails.razorpay_payment_id = response.razorpay_payment_id;
                paymentDetails.razorpay_signature = response.razorpay_signature;
                paymentDetails.razorpay_subscription_id = response.razorpay_subscription_id;
                toast.success("Payment successful");

                const res = await dispatch(verifyUserPayment(paymentDetails));
                toast.success(res?.payload?.msg);

                res?.payload?.success ? navigate("/checkout/success") : navigate("/checkout/fail");
            }
        }

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    async function load() {
        await dispatch(getRazorPayId());
        await dispatch(purchaseCourseBundle());
    }

    useEffect(() => {
        load();
    }, []);

    return (
        <>
            <form
                onSubmit={handleSubscription}
                className="min-h-[90vh] flex items-center justify-center text-white"
            >
                <div className="w-80 h-[26rem] flex flex-col justify-center shadow-[0_0_10px_black] rounded-lg relative">
                    <h1 className="bg-yellow-500 absolute top-0 w-full text-center py-4 text-2xl font-bold rounded-tl0lg rounded-tr-lg">Subscription Bundle</h1>
                    <div className="px-4 space-y-5 text-center">

                    </div>
                </div>
            </form>
        </>
    );
}

export default Checkout;
