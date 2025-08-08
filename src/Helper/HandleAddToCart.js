import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const useAddToCart = (product, onClose = () => { }) => {
    const dispatch = useDispatch();
    const { isLoggedIn } = useSelector(state => state?.auth || {});
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleAddToCart = async (e) => {
        if (e) e.stopPropagation(); // Prevent event bubbling if event is provided

        if (!isLoggedIn) {
            Swal.fire({
                icon: 'info',
                title: 'Login Required',
                text: 'Please login to add items to your cart.',
                confirmButtonText: 'Go to Login',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
            return;
        }

        try {
            setLoading(true);
            await dispatch(addToCart(product)); // Assuming addToCart is an async thunk
            Swal.fire({
                icon: 'success',
                title: 'Added!',
                text: 'Product added to your cart.',
                timer: 1500,
                showConfirmButton: false,
            });
            onClose();
        } catch (err) {
            console.error('Add to cart error:', err);
            Swal.fire({
                icon: 'error',
                title: 'Oops!',
                text: 'Failed to add product to cart.',
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        handleAddToCart,
        loading,
    };
};

export default useAddToCart;