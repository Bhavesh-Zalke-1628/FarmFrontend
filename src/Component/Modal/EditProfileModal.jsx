import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { updateProfile } from '../../Redux/Slice/authSlice';

function EditProfileModal({ initialData, onClose }) {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        mobileNumber: '',
        farmName: '',
        location: '',
        address: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || '',
                email: initialData.email || '',
                mobileNumber: initialData.mobileNumber || '',
                address: initialData.address || '',
                farmName: initialData.farm.farmName || '',
                location: initialData.farm.location || '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🔍 Compare with initialData to get only changed fields
        const updatedFields = {};
        for (const key in formData) {
            if (formData[key] !== initialData[key]) {
                updatedFields[key] = formData[key];
            }
        }

        // ✅ Only dispatch if any field changed
        if (Object.keys(updatedFields).length > 0) {
            await dispatch(updateProfile(updatedFields));
        }

        onClose(); // Close modal
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-600">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">Phone</label>
                        <input
                            type="text"
                            name="mobileNumber"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">Farm Name</label>
                        <input
                            type="text"
                            name="farmName"
                            value={formData.farmName}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div>
                        <label className="block text-sm text-gray-600">Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border rounded hover:bg-gray-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditProfileModal;
