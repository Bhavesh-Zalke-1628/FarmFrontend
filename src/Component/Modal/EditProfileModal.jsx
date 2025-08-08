import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProfile } from "../../Redux/Slice/authSlice";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, Loader2, Mail, Phone, Save, User, X } from "lucide-react";
import LocationPicker from "../Comman/LocationPeeker";

// Main EditProfileModal Component
function EditProfileModal({ initialData, onClose }) {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        mobileNumber: "",
        farmName: "",
    });
    const [location, setLocation] = useState(null);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                fullName: initialData.fullName || "",
                email: initialData.email || "",
                mobileNumber: initialData.mobileNumber || "",
                farmName: initialData?.farm?.farmName || "",
            });

            if (initialData?.farm?.location) {
                const loc = initialData.farm.location;
                if (typeof loc === "string") {
                    const parts = loc.split(",");
                    if (parts.length === 2) {
                        setLocation({
                            lat: parseFloat(parts[0]),
                            lng: parseFloat(parts[1]),
                            address: initialData.address || "",
                        });
                    }
                } else if (typeof loc === "object" && loc.lat && loc.lng) {
                    setLocation({
                        lat: loc.lat,
                        lng: loc.lng,
                        address: initialData.address || "",
                    });
                }
            } else {
                setLocation({ lat: null, lng: null, address: initialData.address || "" });
            }
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Full name is required';
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.mobileNumber.trim()) {
            newErrors.mobileNumber = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobileNumber)) {
            newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            const updatedFields = {};

            // Check for changes in form data
            for (const key in formData) {
                if (formData[key] !== (initialData[key] || "")) {
                    updatedFields[key] = formData[key];
                }
            }

            // Check for location changes
            if (location && (
                location.lat !== (initialData?.farm?.location?.lat || null) ||
                location.lng !== (initialData?.farm?.location?.lng || null) ||
                location.address !== (initialData?.address || "")
            )) {
                updatedFields.farm = {
                    ...(initialData?.farm || {}),
                    farmName: formData.farmName,
                    location: { lat: location.lat, lng: location.lng },
                };
                updatedFields.address = location.address;
            }

            if (Object.keys(updatedFields).length > 0) {
                await dispatch(updateProfile(updatedFields));
            }

            onClose();
        } catch (error) {
            setErrors({ submit: 'Failed to update profile. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    transition={{ type: "spring", duration: 0.3 }}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-green-50">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
                            <p className="text-gray-600 text-sm mt-1">Update your information and farm details</p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-xl transition-all duration-200"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Form */}
                    <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {errors.submit && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-red-50 border border-red-200 rounded-2xl"
                                >
                                    <p className="text-red-700 text-sm">{errors.submit}</p>
                                </motion.div>
                            )}

                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-emerald-600" />
                                    Personal Information
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3.5 border-2 rounded-2xl transition-all duration-200 focus:outline-none ${errors.fullName
                                                ? 'border-red-300 bg-red-50 focus:border-red-500'
                                                : 'border-gray-200 bg-gray-50 focus:border-emerald-500 focus:bg-white'
                                                }`}
                                            placeholder="Enter your full name"
                                        />
                                        {errors.fullName && (
                                            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                            <Phone className="w-4 h-4 mr-1" />
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleChange}
                                            maxLength="10"
                                            className={`w-full px-4 py-3.5 border-2 rounded-2xl transition-all duration-200 focus:outline-none ${errors.mobileNumber
                                                ? 'border-red-300 bg-red-50 focus:border-red-500'
                                                : 'border-gray-200 bg-gray-50 focus:border-emerald-500 focus:bg-white'
                                                }`}
                                            placeholder="Enter 10-digit mobile number"
                                        />
                                        {errors.mobileNumber && (
                                            <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                        <Mail className="w-4 h-4 mr-1" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3.5 border-2 rounded-2xl transition-all duration-200 focus:outline-none ${errors.email
                                            ? 'border-red-300 bg-red-50 focus:border-red-500'
                                            : 'border-gray-200 bg-gray-50 focus:border-emerald-500 focus:bg-white'
                                            }`}
                                        placeholder="Enter your email address"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>
                            </div>

                            {/* Farm Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                    <Building2 className="w-5 h-5 mr-2 text-emerald-600" />
                                    Farm Information
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Farm Name
                                    </label>
                                    <input
                                        type="text"
                                        name="farmName"
                                        value={formData.farmName}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 border-2 border-gray-200 bg-gray-50 focus:border-emerald-500 focus:bg-white rounded-2xl transition-all duration-200 focus:outline-none"
                                        placeholder="Enter your farm name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        Farm Location
                                    </label>
                                    <LocationPicker location={location} setLocation={setLocation} />
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-3 text-gray-700 bg-white border-2 border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className={`flex items-center space-x-2 px-6 py-3 text-white rounded-2xl font-medium transition-all duration-200 ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 hover:shadow-lg transform hover:scale-[1.02]'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-5 h-5" />
                                    <span>Save Changes</span>
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default EditProfileModal;