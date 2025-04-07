import React, { useEffect, useState } from 'react';
import CreateStoreModal from '../Modal/CreateStoreModel';
import { Button } from '@mui/material';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getStoreDetails } from '../../Redux/Slice/storeSlice';

function ShowStore() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const { _id } = useSelector(state => state?.store?.store)

    console.log(_id)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { data } = useSelector(state => state?.auth);
    const { store } = useSelector(state => state?.store)
    console.log(store)

    console.log(data)
    const handleCreateStore = () => {
        Swal.fire({
            title: "Pay ₹1000 to Create Store",
            text: "To create your store, a payment of ₹1000 is required. Proceed with the payment to complete the setup.",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Proceed to Payment",
        }).then((result) => {
            if (result.isConfirmed) {
                setShowCreateForm(true);
            }
        });
    };


    useEffect(() => {
        dispatch(getStoreDetails(data._id))
    }, [dispatch]);

    return (
        <div className="w-full flex flex-wrap gap-6 justify-center">
            {/* Store Details */}
            <div className="w-full md:w-[48%] bg-white shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">🏪 Store Details</h2>
                <div className="space-y-2 text-gray-700">
                    <p><strong>Name:</strong> {store?.name}</p>
                    <p><strong>Email:</strong> {store?.email}</p>
                    <p><strong>Contact:</strong> {store?.contact}</p>
                    <p><strong>Address:</strong> {store?.address}</p>
                    <p className='capitalize'><strong>Owner:</strong > {store?.owner?.fullName}</p>
                </div>

                <Button
                    className="mt-6 bg-yellow-500 text-white"
                    onClick={handleCreateStore}
                    variant="contained"
                >
                    Create Store
                </Button>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-[48%] bg-white shadow-md rounded-xl p-6">
                <h2 className="text-xl font-semibold mb-4">📦 Product Details</h2>
                <p className="text-gray-600">No products found.</p>
            </div>

            {/* Modal */}
            <CreateStoreModal open={showCreateForm} handleClose={() => setShowCreateForm(false)} />
        </div>
    );
}

export default ShowStore;
