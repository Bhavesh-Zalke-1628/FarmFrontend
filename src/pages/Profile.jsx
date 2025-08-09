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
    LogOut,
    Sprout,
    Calendar,
    TrendingUp,
    Award,
    Settings
} from 'lucide-react';
import EditProfileModal from '../Component/Modal/EditProfileModal';
import { updateProfilePicture } from '../Redux/Slice/authSlice';
import { useEffect, useState } from 'react';
import { useLogout } from '../utils';
import { getAllCrops } from '../Redux/Slice/cropsSlice';
import CropList from '../Component/Crops/CropList';

function Profile() {
    const { data: userData, loading } = useSelector((state) => state.auth);
    const { crops } = useSelector(state => state?.crops);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [profilePic, setProfilePic] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const dispatch = useDispatch();
    const handleLogout = useLogout();

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

    useEffect(() => {
        dispatch(getAllCrops());
    }, [dispatch]);

    // Calculate total acres
    const totalAcres = crops?.reduce((total, crop) => total + (parseFloat(crop.quantity) || 0), 0) || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-xl">
                                <User className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Profile Dashboard</h1>
                                <p className="text-gray-600">Manage your farm and account</p>
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Sidebar - Profile Card */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Info Card */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-24"></div>
                            <div className="relative px-6 pb-6">
                                {/* Profile Picture */}
                                <div className="relative -mt-12 mb-4">
                                    <div className="relative group">
                                        {userData?.profile ? (
                                            <img
                                                src={profilePic || userData?.profile?.secure_url}
                                                alt="Profile"
                                                className={`w-24 h-24 rounded-full border-4 border-white shadow-lg ${isUploading ? 'opacity-50' : ''
                                                    }`}
                                            />
                                        ) : (
                                            <div className={`w-24 h-24 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center border-4 border-white shadow-lg ${isUploading ? 'opacity-50' : ''
                                                }`}>
                                                <User size={32} className="text-white" />
                                            </div>
                                        )}

                                        {/* Upload Overlay */}
                                        {isUploading && (
                                            <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                                                <Loader2 size={20} className="text-white animate-spin" />
                                            </div>
                                        )}

                                        {/* Camera Button */}
                                        <label className="absolute bottom-0 right-0 w-8 h-8 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg transition-colors">
                                            <Camera size={14} className="text-white" />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={getImage}
                                                disabled={isUploading}
                                                className="hidden"
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* User Info */}
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-1 capitalize">
                                        {userData?.fullName || 'Welcome User'}
                                    </h2>
                                    <p className="text-gray-600 text-sm mb-2">
                                        {userData?.email || 'user@example.com'}
                                    </p>
                                    <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                        <Shield size={12} />
                                        {userData?.role || 'Farmer'}
                                    </div>
                                </div>

                                {/* Edit Profile Button */}
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    disabled={isUploading}
                                    className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit3 size={16} />
                                    Edit Profile
                                </button>
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <Sprout className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Crops</p>
                                            <p className="font-semibold text-gray-900">{crops?.length || 0}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Total Area</p>
                                            <p className="font-semibold text-gray-900">{totalAcres.toFixed(1)} Acres</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                            <Award className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">Status</p>
                                            <p className="font-semibold text-green-600">Active</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-6">
                        {/* Personal Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                                <button
                                    onClick={() => setIsModalOpen(true)}
                                    className="inline-flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-green-600 transition-colors"
                                >
                                    <Settings size={16} />
                                    Edit
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                                    <p className="text-gray-900 capitalize">{userData?.fullName || 'Not provided'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
                                    <p className="text-gray-900">{userData?.email || 'Not provided'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Phone</label>
                                    <p className="text-gray-900">{userData?.mobileNumber || 'Not provided'}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
                                    <p className="text-gray-900 capitalize">{userData?.address || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>

                        {/* Farm Information */}
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-6">Farm Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl">
                                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Home size={20} className="text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-medium text-gray-900 mb-1">Farm Name</h4>
                                        <p className="text-gray-600 text-sm">{userData?.farm?.farmName || 'Not provided'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl">
                                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <MapPin size={20} className="text-white" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h4 className="font-medium text-gray-900 mb-1">Location</h4>
                                        <p className="text-gray-600 text-sm">{userData?.farm?.location || 'Not provided'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Crops Section */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <CropList crops={crops} />
                            </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <EditProfileModal
                            initialData={userData}
                            onClose={() => setIsModalOpen(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;