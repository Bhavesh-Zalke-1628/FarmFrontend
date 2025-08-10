import { useState } from "react";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import CropForm from "./CropForm";
import { Edit, Trash, Plus, Sprout } from "lucide-react";
import { addCrop, deleteCrop, updateCrop, getAllCrops } from "../../Redux/Slice/cropsSlice";

function CropList({ crops }) {
    const dispatch = useDispatch();
    const [showForm, setShowForm] = useState(false);
    const [editingCrop, setEditingCrop] = useState(null);

    // ---- Open Add Form ----
    const openAddForm = () => {
        setEditingCrop(null);
        setShowForm(true);
    };

    // ---- Open Edit Form ----
    const openEditForm = (crop) => {
        setEditingCrop(crop);
        setShowForm(true);
    };

    // ---- Close Form ----
    const closeForm = () => {
        setShowForm(false);
        setEditingCrop(null);
    };

    // ---- Handle Form Submit (Add or Edit) ----
    const handleSubmit = async (data) => {
        if (editingCrop) {
            await dispatch(updateCrop({ id: editingCrop._id, data }));
        } else {
            await dispatch(addCrop(data));
        }
        dispatch(getAllCrops()); // Refresh list after changes
        closeForm();
    };

    // ---- Handle Delete with Confirmation ----
    const handleDelete = (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "This crop will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            customClass: {
                popup: 'rounded-xl',
                confirmButton: 'rounded-lg px-6 py-2',
                cancelButton: 'rounded-lg px-6 py-2'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                await dispatch(deleteCrop(id));
                dispatch(getAllCrops()); // Refresh list after delete
                Swal.fire({
                    title: "Deleted!",
                    text: "The crop has been deleted successfully.",
                    icon: "success",
                    customClass: {
                        popup: 'rounded-xl',
                        confirmButton: 'rounded-lg px-6 py-2'
                    }
                });
            }
        });
    };

    return (
        <div className="max-w-7xl mx-auto px-2 sm:px-6 py-6 space-y-8">

            {/* ---------- Header ---------- */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 mb-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-xl">
                        <Sprout className="w-7 h-7 sm:w-8 sm:h-8 text-green-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Crop Management
                        </h1>
                        <p className="text-gray-600 mt-1 text-sm sm:text-base">
                            Manage your {crops.length} crop{crops.length !== 1 ? 's' : ''} efficiently
                        </p>
                    </div>
                </div>
                <button
                    onClick={openAddForm}
                    className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                    <Plus className="w-5 h-5" />
                    Add New Crop
                </button>
            </div>

            {/* ---------- Empty State ---------- */}
            {crops.length === 0 && (
                <div className="text-center py-8 sm:py-16">
                    <div className="mx-auto w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                        <Sprout className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                        No crops added yet
                    </h3>
                    <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
                        Start by adding your first crop to track your agricultural activities.
                    </p>
                    <button
                        onClick={openAddForm}
                        className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors text-sm sm:text-base"
                    >
                        <Plus className="w-5 h-5" />
                        Add Your First Crop
                    </button>
                </div>
            )}

            {/* ---------- Crop Grid ---------- */}
            {crops.length > 0 && (
                <div className="grid gap-4 sm:gap-6 grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 overflow-x-auto">
                    {crops.map((crop, index) => (
                        <div
                            key={crop._id || index}
                            className="group relative bg-white rounded-2xl border border-gray-200 hover:border-green-300 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col min-w-0 w-full"
                        >
                            {/* Card Content */}
                            <div className="p-4 sm:p-6 pb-3 flex-1 flex flex-col justify-between">
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                                            {crop?.name || 'Unnamed Crop'}
                                        </h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full"></div>
                                            <span className="text-xs sm:text-sm text-gray-600">Active</span>
                                        </div>
                                    </div>
                                </div>
                                {/* Quantity */}
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 sm:p-4 mt-2">
                                    <div className="text-center">
                                        <p className="text-xl sm:text-2xl font-bold text-green-700">
                                            {crop?.quantity || 0}
                                        </p>
                                        <p className="text-xs sm:text-sm font-medium text-green-600 mt-0.5 sm:mt-1">Acres</p>
                                    </div>
                                </div>
                            </div>

                            {/* Hover Actions */}
                            <div className="absolute inset-0 bg-gradient-to-t from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none sm:pointer-events-auto">
                                <div className="flex gap-1 ml-5 mt-2">
                                    <button
                                        onClick={() => openEditForm(crop)}
                                        className="p-1.5 sm:p-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors"
                                        title="Edit crop"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(crop._id)}
                                        className="p-1.5 sm:p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                                        title="Delete crop"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ---------- Summary Stats ---------- */}
            {crops.length > 0 && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 sm:p-6 border border-green-100">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Summary</h3>
                    <div className="grid grid-cols-1 xs:grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4">
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold text-green-700">{crops.length}</p>
                            <p className="text-xs sm:text-sm text-gray-600">Total Crops</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold text-green-700">
                                {crops.reduce((total, crop) => total + (parseFloat(crop.quantity) || 0), 0).toFixed(1)}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">Total Acres</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xl sm:text-2xl font-bold text-green-700">
                                {crops.length > 0
                                    ? (crops.reduce((total, crop) => total + (parseFloat(crop.quantity) || 0), 0) / crops.length).toFixed(1)
                                    : 0}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-600">Avg. per Crop</p>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------- Form Modal ---------- */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
                    <div className="bg-white rounded-2xl w-full max-w-xs sm:max-w-md max-h-[95vh] overflow-y-auto shadow-xl">
                        <CropForm
                            initialData={editingCrop}
                            onSubmit={handleSubmit}
                            onClose={closeForm}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CropList;
