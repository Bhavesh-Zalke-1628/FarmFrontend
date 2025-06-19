import React, { useEffect, useState } from "react";
import {
    Modal,
    Typography,
    TextField,
    Button,
    InputAdornment,
} from "@mui/material";
import { Mail, Home, Phone, Store } from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { updateStore } from "../../Redux/Slice/storeSlice";

const EditStoreModal = ({ open, handleClose, initialData = {} }) => {
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        address: "",
    });

    // Only update state if initialData changes or modal opens
    useEffect(() => {
        if (open && initialData?._id) {
            setFormData((prevData) => {
                const isSame =
                    prevData.name === initialData.name &&
                    prevData.email === initialData.email &&
                    prevData.contact === initialData.contact &&
                    prevData.address === initialData.address;

                return isSame
                    ? prevData
                    : {
                        name: initialData.name || "",
                        email: initialData.email || "",
                        contact: initialData.contact || "",
                        address: initialData.address || "",
                    };
            });
        }
    }, [open, initialData]);

    const fields = [
        { label: "Store Name", name: "name", icon: <Store size={18} /> },
        { label: "Email", name: "email", type: "email", icon: <Mail size={18} /> },
        { label: "Contact Number", name: "contact", type: "tel", icon: <Phone size={18} /> },
        { label: "Address", name: "address", icon: <Home size={18} />, multiline: true },
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleUpdate = async () => {
        try {
            const res = await dispatch(updateStore({ id: initialData._id, data: formData })).unwrap();
            if (res.success) {
                Swal.fire("Success", "Store updated successfully", "success");
                handleClose();
            } else {
                Swal.fire("Failed", res.message || "Store update failed", "error");
            }
        } catch (error) {
            Swal.fire("Error", error.message || "Something went wrong", "error");
        }
    };

    return (
        <Modal open={open} onClose={handleClose}>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                <div className="w-full max-w-3xl mx-auto rounded-xl bg-white shadow-lg p-6 md:flex md:gap-6">
                    {/* Left Section */}
                    <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-br from-yellow-100 via-white to-yellow-50 p-6">
                        <Store size={64} className="text-yellow-500 animate-bounce drop-shadow-lg mb-4" />
                        <Typography variant="h5" className="font-bold text-gray-700 text-center mb-1">
                            Edit Store
                        </Typography>
                        <Typography variant="body2" className="text-gray-600 text-center">
                            Update your store's information and keep it up to date.
                        </Typography>
                    </div>

                    {/* Right Section */}
                    <div className="w-full md:w-1/2">
                        <div className="flex justify-between items-center border-b pb-2 mb-4">
                            <Typography variant="h6" className="font-semibold text-gray-800 flex items-center gap-2">
                                <Store size={20} /> Edit Store Details
                            </Typography>
                            <button
                                onClick={handleClose}
                                className="text-2xl font-bold hover:text-red-500 transition duration-300"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }} className="space-y-5">
                            {fields.map(({ label, name, type = "text", icon, multiline = false }) => (
                                <TextField
                                    key={name}
                                    fullWidth
                                    label={label}
                                    name={name}
                                    type={type}
                                    value={formData[name]}
                                    onChange={handleChange}
                                    multiline={multiline}
                                    rows={multiline ? 3 : 1}
                                    variant="outlined"
                                    size="small"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <span className="text-yellow-600">{icon}</span>
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: "10px",
                                            backgroundColor: "#fcfcfc",
                                            transition: "0.3s",
                                            "&:hover": {
                                                backgroundColor: "#f5f5f5",
                                            },
                                            "&.Mui-focused": {
                                                backgroundColor: "#fffbe6",
                                                boxShadow: "0 0 0 2px #facc15",
                                                borderColor: "#eab308",
                                            },
                                        },
                                        "& .MuiInputLabel-root.Mui-focused": {
                                            color: "#d97706",
                                        },
                                    }}
                                />
                            ))}

                            <div className="flex justify-end gap-4 pt-6">
                                <Button
                                    onClick={handleClose}
                                    variant="outlined"
                                    color="error"
                                    className="rounded-full px-5 py-2"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    className="rounded-full bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-6 py-2 shadow-md transition-all"
                                >
                                    Update Store
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EditStoreModal;
