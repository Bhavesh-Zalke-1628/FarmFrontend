import React, { useState, useEffect } from "react";
import {
    Modal,
    Typography,
    TextField,
    Button,
    InputAdornment,
} from "@mui/material";
import { BsPersonCircle } from 'react-icons/bs';
import { Store, Factory, ListOrdered, DollarSign, FileText, Image } from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createProduct, getProductByStoreId, updateProduct } from "../../Redux/Slice/productSlice"
const ProductModal = ({ open, handleClose, storeId, initialData = null }) => {
    const dispatch = useDispatch();


    // Use initialData for edit mode; if null => create mode
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        quantity: 0,
        price: 0,
        description: "",
        offerPercentage: 0,
        productImg: ""
    });
    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState("")

    function getImage(event) {
        event.preventDefault();
        // getting the image
        const uploadedImage = event.target.files[0];

        if (uploadedImage) {
            setFormData({
                ...formData,
                productImg: uploadedImage
            });
            const fileReader = new FileReader();
            fileReader.readAsDataURL(uploadedImage);
            fileReader.addEventListener("load", function () {
                setPreviewImage(this.result);
            })
        }
    }


    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || "",
                company: initialData.company || "",
                quantity: initialData.quantity || 0,
                price: initialData.price || 0,
                description: initialData.description || "",
                offerPercentage: initialData?.offerPercentage || 0,
                productImg: initialData?.img?.secure_url || ""
            });

            if (initialData?.img?.secure_url) {
                setPreviewImage(initialData.img.secure_url);
            }
        } else {
            setFormData({
                name: "",
                company: "",
                quantity: 0,
                price: 0,
                offerPercentage: 0,
                description: "",
            });
            setPreviewImage("")
        }
    }, [initialData, open]);

    const fields = [
        { label: "Product Name", name: "name", icon: <Store size={18} /> },
        { label: "Company", name: "company", icon: <Factory size={18} /> },
        { label: "Quantity", name: "quantity", type: "number", icon: <ListOrdered size={18} /> },
        { label: "Offer", name: "offerPercentage", type: "number", icon: <ListOrdered size={18} /> },
        { label: "Price", name: "price", type: "number", icon: <DollarSign size={18} /> },
        { label: "Description", name: "description", multiline: true, icon: <FileText size={18} /> },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" || name === "price" || name == "offerPercentage" ? Number(value) : value,
        }));
    };


    const handleSubmit = async () => {
        if (!formData.name || !formData.company || !formData.description) {
            toast.error("Please fill in all required fields");
            return;
        }

        const payload = new FormData();
        payload.append("name", formData.name);
        payload.append("company", formData.company);
        payload.append("quantity", formData.quantity);
        payload.append("price", formData.price);
        payload.append("description", formData.description);
        payload.append("offerPercentage", formData.offerPercentage);

        if (formData.productImg instanceof File) {
            payload.append("productImg", formData.productImg);
        }
        setLoading(true); // Start loading

        // Log FormData properly
        for (let [key, value] of payload.entries()) {
            console.log(`${key}:`, value);
        }


        try {
            let result;
            if (initialData && initialData._id) {
                console.log("hello")
                result = await dispatch(updateProduct({
                    productId: initialData._id,
                    productData: payload
                })).unwrap();

            } else {
                result = await dispatch(createProduct({
                    storeId,
                    productData: payload
                })).unwrap();
            }

            if (result?.data?._id) {
                Swal.fire(
                    "Success",
                    initialData ? "Product updated successfully" : "Product created successfully",
                    "success"
                );

                // Refresh products
                dispatch(getProductByStoreId(storeId));

                // Reset form
                setFormData({
                    name: "",
                    company: "",
                    quantity: 0,
                    price: 0,
                    description: "",
                    productImg: "",
                    offerPercentage: 0
                });
                setPreviewImage("");

                // Close modal
                handleClose();
            } else {
                Swal.fire("Error", initialData ? "Product update failed" : "Product creation failed", "error");
            }

        } catch (err) {
            toast.error(err?.message || "Something went wrong");
        } finally {
            setLoading(false); // Stop loading
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
                    <form
                        className="mt-5"
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <div className="flex flex-col md:flex-row gap-x-6 gap-y-6">
                            {/* Left: Image Upload Section */}
                            <div className="md:w-1/2 w-full text-center">
                                <label htmlFor="image_uploads" className="cursor-pointer inline-block">
                                    {previewImage ? (
                                        <img
                                            src={previewImage}
                                            alt="Product Preview"
                                            className="w-full h-64 object-cover rounded-xl border-2 border-gray-200 shadow-md hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-64 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-200 transition">
                                            <span className="text-gray-500">Click to Upload Image</span>
                                        </div>
                                    )}
                                </label>
                                <input
                                    onChange={getImage}
                                    className="hidden"
                                    type="file"
                                    name="productImg"
                                    id="image_uploads"
                                    accept=".jpg, .jpeg, .png, .svg"
                                />
                                <p className="text-sm text-gray-400 mt-2">Only .jpg, .jpeg, .png, .svg formats allowed</p>
                            </div>

                            {/* Right: Form Fields */}
                            <div className="md:w-1/2 w-full space-y-4">
                                {fields.map(({ label, name, type = "text", icon, multiline = false }) => (
                                    <>
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
                                    </>

                                ))}
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end pt-6 gap-4">
                            <Button
                                onClick={handleClose}
                                variant="outlined"
                                color="error"
                                disabled={loading}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    minWidth: "120px",
                                    boxShadow: "0px 2px 8px rgba(255, 0, 0, 0.1)",
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                disabled={loading}
                                sx={{
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    minWidth: "140px",
                                    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
                                }}
                            >
                                {loading
                                    ? initialData ? "Updating..." : "Creating..."
                                    : initialData ? "Update Product" : "Create Product"}
                            </Button>
                        </div>
                    </form>

                </div>
            </div>
        </Modal>
    );
};

export default ProductModal;
