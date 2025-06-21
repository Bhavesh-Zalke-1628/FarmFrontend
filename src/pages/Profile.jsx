import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { User } from 'lucide-react';
import EditProfileModal from '../Component/Modal/EditProfileModal'

function Profile() {
    const { data: userData } = useSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
                <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                        <User size={48} className="text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold">{userData?.fullName || "User"}</h2>
                    <p className="text-gray-500">{userData?.email || "user@example.com"}</p>
                </div>
            </div>

            <div className="md:w-2/3">
                <div className="space-y-4">
                    <div>
                        <h3 className="font-medium text-gray-700">Personal Information</h3>
                        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-500">Full Name</label>
                                <p className="mt-1">{userData?.fullName || "Not provided"}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Email</label>
                                <p className="mt-1">{userData?.email || "Not provided"}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Phone</label>
                                <p className="mt-1">{userData?.mobileNumber || "Not provided"}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500">Account Type</label>
                                <p className="mt-1 capitalize">{userData?.role || "farmer"}</p>
                            </div>
                            <div>
                                <label className="block text-sm text-gray-500"> Address</label>
                                <p className="mt-1 capitalize">{userData?.address || "Not Provided"}</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-medium text-gray-700">Farm Information</h3>
                        <div className="mt-2 space-y-2">
                            <p className="text-gray-600">Farm Name: {userData?.farm?.farmName || "Not provided"}</p>
                            <p className="text-gray-600">Location: {userData?.farm?.location || "Not provided"}</p>
                        </div>
                    </div>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <EditProfileModal
                    initialData={userData}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
}

export default Profile;
