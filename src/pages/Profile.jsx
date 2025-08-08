// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import { User } from 'lucide-react';
// import EditProfileModal from '../Component/Modal/EditProfileModal'

// function Profile() {
//     const { data: userData } = useSelector((state) => state.auth);
//     const [isModalOpen, setIsModalOpen] = useState(false);

//     return (
//         <div className="flex flex-col md:flex-row gap-8">
//             <div className="md:w-1/3">
//                 <div className="flex flex-col items-center">
//                     <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
//                         <User size={48} className="text-gray-400" />
//                     </div>
//                     <h2 className="text-xl font-bold">{userData?.fullName || "User"}</h2>
//                     <p className="text-gray-500">{userData?.email || "user@example.com"}</p>
//                 </div>
//             </div>

//             <div className="md:w-2/3">
//                 <div className="space-y-4">
//                     <div>
//                         <h3 className="font-medium text-gray-700">Personal Information</h3>
//                         <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
//                             <div>
//                                 <label className="block text-sm text-gray-500">Full Name</label>
//                                 <p className="mt-1">{userData?.fullName || "Not provided"}</p>
//                             </div>
//                             <div>
//                                 <label className="block text-sm text-gray-500">Email</label>
//                                 <p className="mt-1">{userData?.email || "Not provided"}</p>
//                             </div>
//                             <div>
//                                 <label className="block text-sm text-gray-500">Phone</label>
//                                 <p className="mt-1">{userData?.mobileNumber || "Not provided"}</p>
//                             </div>
//                             <div>
//                                 <label className="block text-sm text-gray-500">Account Type</label>
//                                 <p className="mt-1 capitalize">{userData?.role || "farmer"}</p>
//                             </div>
//                             <div>
//                                 <label className="block text-sm text-gray-500"> Address</label>
//                                 <p className="mt-1 capitalize">{userData?.address || "Not Provided"}</p>
//                             </div>
//                         </div>
//                     </div>

//                     <div>
//                         <h3 className="font-medium text-gray-700">Farm Information</h3>
//                         <div className="mt-2 space-y-2">
//                             <p className="text-gray-600">Farm Name: {userData?.farm?.farmName || "Not provided"}</p>
//                             <p className="text-gray-600">Location: {userData?.farm?.location || "Not provided"}</p>
//                         </div>
//                     </div>

//                     <button
//                         onClick={() => setIsModalOpen(true)}
//                         className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
//                     >
//                         Edit Profile
//                     </button>
//                 </div>
//             </div>

//             {isModalOpen && (
//                 <EditProfileModal
//                     initialData={userData}
//                     onClose={() => setIsModalOpen(false)}
//                 />
//             )}
//         </div>
//     );
// }

// export default Profile;import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Home,
    Edit3,
    Camera,
    Shield,
    Loader2,
    Upload,
    LucideLogOut
} from 'lucide-react';
import EditProfileModal from '../Component/Modal/EditProfileModal';
import { updateProfilePicture } from '../Redux/Slice/authSlice';
import { useState } from 'react';
import { useLogout } from '../utils';
function Profile() {
    const { data: userData, loading } = useSelector((state) => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profilePic, setProfilePic] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const dispatch = useDispatch();
    const handleLogout = useLogout()

    const getImage = async (event) => {
        const uploadedImage = event.target.files[0];
        if (!uploadedImage) return;

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
        if (!allowedTypes.includes(uploadedImage.type)) {
            alert('Please select a valid image file (JPEG, PNG, JPG, or WebP)');
            return;
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (uploadedImage.size > maxSize) {
            alert('File size should be less than 5MB');
            return;
        }

        setIsUploading(true);
        setUploadProgress(0);

        // Preview the image
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
            setProfilePic(e.target.result);
        };
        fileReader.readAsDataURL(uploadedImage);

        // Simulate upload progress
        const progressInterval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 90) {
                    clearInterval(progressInterval);
                    return 90;
                }
                return prev + 10;
            });
        }, 200);

        try {
            // Prepare form data and dispatch Redux action to upload
            const formData = new FormData();
            formData.append('profilePic', uploadedImage);

            await dispatch(updateProfilePicture(formData));

            // Complete the progress
            setUploadProgress(100);

            // Hide loader after a brief delay
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
            }, 500);

        } catch (error) {
            console.error('Upload failed:', error);
            setIsUploading(false);
            setUploadProgress(0);
            setProfilePic(''); // Reset preview on error
            alert('Upload failed. Please try again.');
        }

        clearInterval(progressInterval);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 p-4 md:p-8">
            {/* Header Section */}
            <div className="max-w-6xl mx-auto mb-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        Profile Dashboard
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your account and farm information</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Profile Card */}
                    <div className="lg:w-1/3">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1">
                            <div className="flex flex-col items-center text-center">
                                {/* Profile Image with Hover Effect and Loader */}
                                <div className="relative group mb-6">
                                    {userData?.profile ? (
                                        <img
                                            src={profilePic || userData?.profile?.secure_url}
                                            alt="Profile"
                                            className={`w-32 h-32 rounded-full  shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 ${isUploading ? 'opacity-50' : ''
                                                }`}
                                        />
                                    ) : (
                                        <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 ${isUploading ? 'opacity-50' : ''
                                            }`}>
                                            <User size={48} className="text-white" />
                                        </div>
                                    )}

                                    {/* Upload Loader Overlay */}
                                    {isUploading && (
                                        <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex flex-col items-center justify-center">
                                            <div className="relative">
                                                <Loader2 size={32} className="text-white animate-spin mb-2" />
                                                <div className="text-white text-xs font-medium">
                                                    {uploadProgress}%
                                                </div>
                                            </div>
                                            {/* Progress Ring */}
                                            <div className="absolute inset-0 rounded-full">
                                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="45"
                                                        stroke="rgba(255,255,255,0.2)"
                                                        strokeWidth="3"
                                                        fill="none"
                                                    />
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="45"
                                                        stroke="white"
                                                        strokeWidth="3"
                                                        fill="none"
                                                        strokeDasharray={`${2 * Math.PI * 45}`}
                                                        strokeDashoffset={`${2 * Math.PI * 45 * (1 - uploadProgress / 100)}`}
                                                        className="transition-all duration-300"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    )}

                                    {/* Hidden File Input */}
                                    <input
                                        name='profilePic'
                                        type="file"
                                        id="profile-picture-upload"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 rounded-full"
                                        onChange={getImage}
                                        disabled={isUploading}
                                    />

                                    {/* Camera Overlay */}
                                    {!isUploading && (
                                        <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center transition-all duration-300 cursor-pointer pointer-events-none">
                                            <div className="flex flex-col items-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <Camera size={28} className="mb-1" />
                                                <span className="text-xs font-medium">Change Photo</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Status Message */}
                                {isUploading && (
                                    <div className="mb-4 px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium flex items-center gap-2">
                                        <Upload size={16} className="animate-bounce" />
                                        Uploading profile picture...
                                    </div>
                                )}

                                {/* User Info */}
                                <h2 className="text-2xl font-bold text-gray-800 mb-2 capitalize">
                                    {userData?.fullName || 'Welcome User'}
                                </h2>
                                <p className="text-gray-500 mb-4 flex items-center gap-2">
                                    <Mail size={16} />
                                    {userData?.email || 'user@example.com'}
                                </p>

                                {/* Role Badge */}
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full text-sm font-medium text-green-700 mb-6">
                                    <Shield size={16} />
                                    <span className="capitalize">{userData?.role || 'farmer'}</span>
                                </div>

                                {/* Edit Button */}
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={isUploading}
                                    className={`w-full px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-300 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Edit3 size={18} />
                                            Edit Profile
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Information Cards */}
                    <div className="lg:w-2/3 space-y-6">
                        {/* Personal Information Card */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300">
                            <div className="flex items-center gap-3 mb-6 justify-between">
                                <div className=' flex items-center gap-1'>
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                        <User size={20} className="text-white" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-800">Personal Information</h3>
                                </div>


                                <button
                                    onClick={handleLogout}
                                    disabled={isUploading}
                                    className={` px-3 py-3 
                                            bg-gradient-to-r from-blue-600 to-indigo-700 
                                            text-white rounded-xl 
                                            hover:from-blue-500 hover:to-red-600 
                                            ease-in-out transition-all duration-300 
                                            font-medium shadow-lg 
                                            hover:shadow-xl transform hover:-translate-y-0.5 
                                            flex items-center justify-center gap-2 
                                            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <LucideLogOut />
                                    Log Out
                                </button>

                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide">
                                        Full Name
                                    </label>
                                    <p className="capitalize text-lg text-gray-800 font-medium group-hover:text-green-600 transition-colors duration-200">
                                        {userData?.fullName || 'Not provided'}
                                    </p>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                                        <Mail size={14} />
                                        Email
                                    </label>
                                    <p className="text-lg text-gray-800 font-medium group-hover:text-blue-600 transition-colors duration-200">
                                        {userData?.email || 'Not provided'}
                                    </p>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                                        <Phone size={14} />
                                        Phone
                                    </label>
                                    <p className="text-lg text-gray-800 font-medium group-hover:text-purple-600 transition-colors duration-200">
                                        {userData?.mobileNumber || 'Not provided'}
                                    </p>
                                </div>

                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-500 mb-2 uppercase tracking-wide flex items-center gap-2">
                                        <MapPin size={14} />
                                        Address
                                    </label>
                                    <p className="text-lg text-gray-800 font-medium group-hover:text-indigo-600 transition-colors duration-200 capitalize">
                                        {userData?.address || 'Not provided'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Farm Information Card */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center">
                                    <Home size={20} className="text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800">Farm Information</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:border-green-200 transition-colors duration-200">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Home size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800 mb-1">Farm Name</h4>
                                        <p className="text-gray-600 text-lg">{userData?.farm?.farmName || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:border-blue-200 transition-colors duration-200">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                                        <MapPin size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-semibold text-gray-800 mb-1">Location</h4>
                                        <p className="text-gray-600 text-lg">{userData?.farm?.location || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Stats Card */}
                        <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100 hover:shadow-3xl transition-all duration-300">
                            <h3 className="text-2xl font-bold text-gray-800 mb-6">Quick Stats</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 hover:border-green-200 transition-all duration-300 hover:transform hover:scale-105">
                                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <Home size={24} className="text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Profile</h4>
                                    <p className="text-green-600 font-bold text-xl">Active</p>
                                </div>

                                <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:transform hover:scale-105">
                                    <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <Shield size={24} className="text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Verification</h4>
                                    <p className="text-blue-600 font-bold text-xl">Verified</p>
                                </div>

                                <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:border-purple-200 transition-all duration-300 hover:transform hover:scale-105">
                                    <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <User size={24} className="text-white" />
                                    </div>
                                    <h4 className="font-semibold text-gray-800 mb-2">Member Since</h4>
                                    <p className="text-purple-600 font-bold text-xl">2024</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <EditProfileModal initialData={userData} onClose={() => setIsModalOpen(false)} />
            )}
        </div>
    );
}

export default Profile;