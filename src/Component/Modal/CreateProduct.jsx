import React, { useState, useEffect } from "react";
import {
    Modal,
    Typography,
    TextField,
    Button,
    InputAdornment,
} from "@mui/material";
import { Store, Factory, ListOrdered, DollarSign, FileText } from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createProduct, getAllProduct, updateProduct } from "../../Redux/Slice/productSlice";

const ProductModal = ({ open, handleClose, storeId, initialData = null }) => {
    const dispatch = useDispatch();

    // Use initialData for edit mode; if null => create mode
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        quantity: 0,
        price: 0,
        description: "",
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                company: initialData.company || "",
                quantity: initialData.quantity || 0,
                price: initialData.price || 0,
                description: initialData.description || "",
            });
        } else {
            setFormData({
                name: "",
                company: "",
                quantity: 0,
                price: 0,
                description: "",
            });
        }
    }, [initialData, open]);

    const fields = [
        { label: "Product Name", name: "name", icon: <Store size={18} /> },
        { label: "Company", name: "company", icon: <Factory size={18} /> },
        { label: "Quantity", name: "quantity", type: "number", icon: <ListOrdered size={18} /> },
        { label: "Price", name: "price", type: "number", icon: <DollarSign size={18} /> },
        { label: "Description", name: "description", multiline: true, icon: <FileText size={18} /> },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" || name === "price" ? Number(value) : value,
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.company || !formData.description) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            let result;
            if (initialData && initialData._id) {
                // Edit mode
                result = await dispatch(updateProduct({
                    productId: initialData._id,
                    productData: formData,
                })).unwrap();
                if (result) {
                    dispatch(getAllProduct())
                }
            } else {
                // Create mode
                result = await dispatch(createProduct({
                    storeId,
                    productData: formData,
                })).unwrap();
                if (result) {
                    dispatch(getAllProduct())
                }
            }

            if (result?.data?._id) {
                Swal.fire(
                    "Success",
                    initialData ? "Product updated successfully" : "Product created successfully",
                    "success"
                );
                handleClose();
            } else {
                Swal.fire("Error", initialData ? "Product update failed" : "Product creation failed", "error");
            }
        } catch (err) {
            toast.error(err?.message || "Something went wrong");
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
                <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-xl">
                    <div className="flex items-center justify-between pb-4 border-b">
                        <Typography variant="h6" className="text-gray-800 font-semibold">
                            {initialData ? "✏️ Edit Product" : "📦 Create New Product"}
                        </Typography>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-red-500 text-xl font-bold"
                        >
                            &times;
                        </button>
                    </div>

                    <form className="mt-5 space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
                        {fields.map(({ label, name, type = "text", icon, multiline = false }) => (
                            <TextField
                                key={name}
                                fullWidth
                                label={label}
                                name={name}
                                type={type}
                                variant="outlined"
                                value={formData[name]}
                                multiline={multiline}
                                rows={multiline ? 3 : 1}
                                onChange={handleChange}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            {icon}
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '12px',
                                    },
                                }}
                            />
                        ))}

                        <div className="flex justify-end pt-2 gap-4">
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                color="error"
                                sx={{ textTransform: "none", borderRadius: "8px", minWidth: "120px" }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ textTransform: "none", borderRadius: "8px", minWidth: "140px" }}
                            >
                                {initialData ? "Update Product" : "Create Product"}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    );
};

export default ProductModal;
