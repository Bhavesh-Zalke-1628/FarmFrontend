import React, { useState, useEffect } from "react";
import {
    Modal,
    Typography,
    TextField,
    Button,
    InputAdornment,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    IconButton,
    Divider,
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import { BsPersonCircle } from 'react-icons/bs';
import {
    Store,
    Factory,
    ListOrdered,
    DollarSign,
    FileText,
    Image,
    Plus,
    X,
    ChevronDown,
    Bug,
    Leaf,
    AlertTriangle,
    BookOpen,
    Tag
} from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { createProduct, getProductByStoreId, updateProduct } from "../../Redux/Slice/productSlice"

const ProductModal = ({ open, handleClose, storeId, initialData = null }) => {
    const dispatch = useDispatch();

    // Enhanced form data structure matching the new schema
    const [formData, setFormData] = useState({
        name: "",
        company: "",
        quantity: 0,
        price: 0,
        description: "",
        offerPercentage: 0,
        category: "",
        productImg: "",
        content: {
            activeIngredients: [],
            targetPests: [],
            usageAreas: [],
            instructions: "",
            precautions: ""
        }
    });

    const [loading, setLoading] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    // State for managing dynamic inputs
    const [newIngredient, setNewIngredient] = useState({ name: "", concentration: "" });
    const [newPest, setNewPest] = useState("");
    const [newUsageArea, setNewUsageArea] = useState("");

    // Category options
    const categoryOptions = [
        "Pesticide",
        "Herbicide",
        "Fungicide",
        "Fertilizer",
        "Growth Regulator",
        "Soil Conditioner",
        "Seed Treatment",
        "Other"
    ];

    function getImage(event) {
        event.preventDefault();
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
                category: initialData?.category || "",
                productImg: initialData?.img?.secure_url || "",
                content: {
                    activeIngredients: initialData?.content?.activeIngredients || [],
                    targetPests: initialData?.content?.targetPests || [],
                    usageAreas: initialData?.content?.usageAreas || [],
                    instructions: initialData?.content?.instructions || "",
                    precautions: initialData?.content?.precautions || ""
                }
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
                category: "",
                productImg: "",
                content: {
                    activeIngredients: [],
                    targetPests: [],
                    usageAreas: [],
                    instructions: "",
                    precautions: ""
                }
            });
            setPreviewImage("");
        }
    }, [initialData, open]);

    const basicFields = [
        { label: "Product Name", name: "name", icon: <Store size={18} /> },
        { label: "Company", name: "company", icon: <Factory size={18} /> },
        { label: "Quantity", name: "quantity", type: "number", icon: <ListOrdered size={18} /> },
        { label: "Offer %", name: "offerPercentage", type: "number", icon: <Tag size={18} /> },
        { label: "Price", name: "price", type: "number", icon: <DollarSign size={18} /> },
        { label: "Description", name: "description", multiline: true, icon: <FileText size={18} /> },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "quantity" || name === "price" || name === "offerPercentage" ? Number(value) : value,
        }));
    };

    const handleContentChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            content: {
                ...prev.content,
                [field]: value
            }
        }));
    };

    // Functions for managing dynamic arrays
    const addIngredient = () => {
        if (newIngredient.name && newIngredient.concentration) {
            handleContentChange("activeIngredients", [
                ...formData.content.activeIngredients,
                { ...newIngredient }
            ]);
            setNewIngredient({ name: "", concentration: "" });
        }
    };

    const removeIngredient = (index) => {
        const updated = formData.content.activeIngredients.filter((_, i) => i !== index);
        handleContentChange("activeIngredients", updated);
    };

    const addPest = () => {
        if (newPest.trim()) {
            handleContentChange("targetPests", [...formData.content.targetPests, newPest.trim()]);
            setNewPest("");
        }
    };

    const removePest = (index) => {
        const updated = formData.content.targetPests.filter((_, i) => i !== index);
        handleContentChange("targetPests", updated);
    };

    const addUsageArea = () => {
        if (newUsageArea.trim()) {
            handleContentChange("usageAreas", [...formData.content.usageAreas, newUsageArea.trim()]);
            setNewUsageArea("");
        }
    };

    const removeUsageArea = (index) => {
        const updated = formData.content.usageAreas.filter((_, i) => i !== index);
        handleContentChange("usageAreas", updated);
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
        payload.append("category", formData.category);

        // Append content as JSON string
        payload.append("content", JSON.stringify(formData.content));

        if (formData.productImg instanceof File) {
            payload.append("productImg", formData.productImg);
        }

        setLoading(true);

        try {
            let result;
            if (initialData && initialData._id) {
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
                    offerPercentage: 0,
                    category: "",
                    content: {
                        activeIngredients: [],
                        targetPests: [],
                        usageAreas: [],
                        instructions: "",
                        precautions: ""
                    }
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
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4">
                <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 bg-white rounded-2xl shadow-xl">
                    <div className="flex items-center justify-between pb-4 border-b sticky top-0 bg-white z-10">
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
                        <div className="flex flex-col lg:flex-row gap-6">
                            {/* Left: Image Upload Section */}
                            <div className="lg:w-1/3 w-full">
                                <label htmlFor="image_uploads" className="cursor-pointer inline-block w-full">
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
                            <div className="lg:w-2/3 w-full space-y-6">
                                {/* Basic Information */}
                                <div className="space-y-4">
                                    <Typography variant="h6" className="text-gray-700 font-medium flex items-center gap-2">
                                        <Store size={20} />
                                        Basic Information
                                    </Typography>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {basicFields.map(({ label, name, type = "text", icon, multiline = false }) => (
                                            <div key={name} className={multiline ? "md:col-span-2" : ""}>
                                                <TextField
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
                                            </div>
                                        ))}

                                        {/* Category Dropdown */}
                                        <FormControl fullWidth>
                                            <InputLabel>Category</InputLabel>
                                            <Select
                                                value={formData.category}
                                                label="Category"
                                                onChange={(e) => handleChange({ target: { name: 'category', value: e.target.value } })}
                                                sx={{ borderRadius: '12px' }}
                                            >
                                                {categoryOptions.map((cat) => (
                                                    <MenuItem key={cat} value={cat}>
                                                        {cat}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </div>
                                </div>

                                <Divider />

                                {/* Enhanced Content Section */}
                                <Accordion defaultExpanded>
                                    <AccordionSummary expandIcon={<ChevronDown />}>
                                        <Typography variant="h6" className="text-gray-700 font-medium flex items-center gap-2">
                                            <Leaf size={20} />
                                            Product Content Details
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <div className="space-y-6">
                                            {/* Active Ingredients */}
                                            <div>
                                                <Typography variant="subtitle1" className="mb-3 flex items-center gap-2">
                                                    <Bug size={18} />
                                                    Active Ingredients
                                                </Typography>
                                                <div className="flex gap-2 mb-3">
                                                    <TextField
                                                        size="small"
                                                        placeholder="Ingredient name"
                                                        value={newIngredient.name}
                                                        onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                                    />
                                                    <TextField
                                                        size="small"
                                                        placeholder="Concentration (e.g., 5%)"
                                                        value={newIngredient.concentration}
                                                        onChange={(e) => setNewIngredient({ ...newIngredient, concentration: e.target.value })}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                                    />
                                                    <IconButton onClick={addIngredient} color="primary">
                                                        <Plus size={18} />
                                                    </IconButton>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.content.activeIngredients.map((ingredient, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={`${ingredient.name} (${ingredient.concentration})`}
                                                            onDelete={() => removeIngredient(index)}
                                                            deleteIcon={<X size={16} />}
                                                            color="primary"
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Target Pests */}
                                            <div>
                                                <Typography variant="subtitle1" className="mb-3 flex items-center gap-2">
                                                    <Bug size={18} />
                                                    Target Pests
                                                </Typography>
                                                <div className="flex gap-2 mb-3">
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        placeholder="Enter pest name"
                                                        value={newPest}
                                                        onChange={(e) => setNewPest(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && addPest()}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                                    />
                                                    <IconButton onClick={addPest} color="primary">
                                                        <Plus size={18} />
                                                    </IconButton>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.content.targetPests.map((pest, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={pest}
                                                            onDelete={() => removePest(index)}
                                                            deleteIcon={<X size={16} />}
                                                            color="secondary"
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Usage Areas */}
                                            <div>
                                                <Typography variant="subtitle1" className="mb-3 flex items-center gap-2">
                                                    <Leaf size={18} />
                                                    Usage Areas
                                                </Typography>
                                                <div className="flex gap-2 mb-3">
                                                    <TextField
                                                        size="small"
                                                        fullWidth
                                                        placeholder="e.g., Agriculture, Garden"
                                                        value={newUsageArea}
                                                        onChange={(e) => setNewUsageArea(e.target.value)}
                                                        onKeyPress={(e) => e.key === 'Enter' && addUsageArea()}
                                                        sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
                                                    />
                                                    <IconButton onClick={addUsageArea} color="primary">
                                                        <Plus size={18} />
                                                    </IconButton>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.content.usageAreas.map((area, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={area}
                                                            onDelete={() => removeUsageArea(index)}
                                                            deleteIcon={<X size={16} />}
                                                            color="success"
                                                            variant="outlined"
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Instructions */}
                                            <TextField
                                                fullWidth
                                                label="Usage Instructions"
                                                multiline
                                                rows={3}
                                                value={formData.content.instructions}
                                                onChange={(e) => handleContentChange("instructions", e.target.value)}
                                                placeholder="e.g., Mix 10ml per liter of water..."
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <BookOpen size={18} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />

                                            {/* Precautions */}
                                            <TextField
                                                fullWidth
                                                label="Precautions"
                                                multiline
                                                rows={3}
                                                value={formData.content.precautions}
                                                onChange={(e) => handleContentChange("precautions", e.target.value)}
                                                placeholder="e.g., Avoid contact with skin and eyes..."
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <AlertTriangle size={18} />
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                                            />
                                        </div>
                                    </AccordionDetails>
                                </Accordion>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end pt-6 gap-4 border-t mt-6">
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