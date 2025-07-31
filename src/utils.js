import Swal from "sweetalert2";
import { logoutAccount } from "./Redux/Slice/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

export function useLogout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: 'Logout Confirmation',
            text: 'Are you sure you want to logout?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes, logout',
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            background: '#ffffff',
        });

        if (result.isConfirmed) {
            const res = await dispatch(logoutAccount());
            if (res?.payload) {
                navigate('/');
            }
        }
    };

    return handleLogout;
}
