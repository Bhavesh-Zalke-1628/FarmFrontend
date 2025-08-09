import { useState, useEffect } from "react";
import { X, Sprout, Plus, Edit3, AlertCircle } from "lucide-react";

export default function CropForm({ initialData = null, onSubmit, onClose }) {
    const [formData, setFormData] = useState({
        name: "",
        quantity: ""
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Prefill form when editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                quantity: initialData.quantity || ""
            });
        }
    }, [initialData]);

    // Validation function
    const validateForm = () => {
        const newErrors = {};

        // Validate crop name
        if (!formData.name.trim()) {
            newErrors.name = "Crop name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Crop name must be at least 2 characters";
        } else if (formData.name.trim().length > 50) {
            newErrors.name = "Crop name must be less than 50 characters";
        }

        // Validate quantity
        if (!formData.quantity) {
            newErrors.quantity = "Quantity is required";
        } else {
            const qty = parseFloat(formData.quantity);
            if (isNaN(qty)) {
                newErrors.quantity = "Please enter a valid number";
            } else if (qty <= 0) {
                newErrors.quantity = "Quantity must be greater than 0";
            } else if (qty > 10000) {
                newErrors.quantity = "Quantity seems too large. Please verify.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input changes with real-time validation
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear specific field error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }

        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            // Trim whitespace and ensure proper data types
            const cleanedData = {
                name: formData.name.trim(),
                quantity: parseFloat(formData.quantity)
            };

            await onSubmit(cleanedData);
        } catch (error) {
            console.error("Form submission error:", error);
            // You could set a general error state here if needed
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle backdrop click to close modal
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    // Handle Enter key submission
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto animate-in fade-in duration-200">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            {initialData ? (
                                <Edit3 className="w-5 h-5 text-green-600" />
                            ) : (
                                <Plus className="w-5 h-5 text-green-600" />
                            )}
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {initialData ? "Edit Crop" : "Add New Crop"}
                            </h2>
                            <p className="text-sm text-gray-600">
                                {initialData ? "Update crop information" : "Enter crop details"}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-6 space-y-6" onKeyDown={handleKeyDown}>
                    {/* Crop Name Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Crop Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Sprout className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g., Wheat, Rice, Corn"
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${errors.name
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                maxLength="50"
                                required
                            />
                        </div>
                        {errors.name && (
                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {errors.name}
                            </div>
                        )}
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Enter the name of your crop</span>
                            <span>{formData.name.length}/50</span>
                        </div>
                    </div>

                    {/* Quantity Field */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">
                            Area (Acres) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="0.0"
                                step="0.1"
                                min="0.1"
                                max="10000"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-colors ${errors.quantity
                                    ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                                    : 'border-gray-300 hover:border-gray-400'
                                    }`}
                                required
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <span className="text-gray-500 text-sm">acres</span>
                            </div>
                        </div>
                        {errors.quantity && (
                            <div className="flex items-center gap-2 text-red-600 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {errors.quantity}
                            </div>
                        )}
                        <p className="text-xs text-gray-500">
                            Enter the area in acres (e.g., 2.5 for two and half acres)
                        </p>
                    </div>

                    {/* Summary */}
                    {formData.name && formData.quantity && !errors.name && !errors.quantity && (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <h4 className="font-medium text-green-800 mb-1">Preview</h4>
                            <p className="text-green-700 text-sm">
                                <span className="font-medium capitalize">{formData.name}</span> - {formData.quantity} acres
                            </p>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={isSubmitting || Object.keys(errors).length > 0}
                            className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    {initialData ? "Updating..." : "Adding..."}
                                </>
                            ) : (
                                <>
                                    {initialData ? (
                                        <>
                                            <Edit3 className="w-4 h-4" />
                                            Update Crop
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            Add Crop
                                        </>
                                    )}
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}