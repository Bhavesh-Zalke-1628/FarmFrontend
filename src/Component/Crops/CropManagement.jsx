import { Leaf } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addCrop, getAllCrops } from '../../Redux/Slice/cropsSlice'
import CropForm from './CropForm'

function CropManagementCom() {
    const dispatch = useDispatch()
    const [showForm, setShowForm] = useState(false);

    const { crops } = useSelector(state => state?.crops)
    console.log(crops)

    useEffect(() => {
        dispatch(getAllCrops())
    }, [dispatch]);

    const handleSubmit = (data) => {
        dispatch(addCrop(data));
        dispatch(getAllCrops());
        closeForm();
    };

    const openAddForm = () => {
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
    };


    return (
        <div className="space-y-8 animate-fadeIn">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-600 bg-clip-text text-transparent flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Leaf size={20} className="text-white" />
                    </div>
                    Crop Management
                </h1>
                <div className="flex gap-3">
                    <button
                        onClick={openAddForm}
                        className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                        Add Crop
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {crops.map((item) => (
                    <div
                        key={item}
                        className="bg-white/70 backdrop-blur-xl p-6 rounded-3xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                    >
                        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                            <Leaf size={24} className="text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                        <p className="text-gray-600 mb-4">
                            Manage your crops and monitor growth progress
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                                Active
                            </span>
                            <button className="text-green-600 hover:text-green-700 font-medium">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {
                showForm && <CropForm
                    // initialData={editingCrop}
                    onSubmit={handleSubmit}
                    onClose={closeForm}
                />
            }
        </div>

    )
}

export default CropManagementCom
