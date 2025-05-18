import { useEffect, useState } from 'react';
import CreateStoreModal from '../Modal/CreateStoreModel';
import CreateProductModal from '../Modal/CreateProduct';
import ViewProduct from '../Modal/ViewProduct';
import { Button } from '@mui/material';
import { Pencil, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreDetails } from '../../Redux/Slice/storeSlice';
import { deleteProduct, getAllProduct } from '../../Redux/Slice/productSlice';

function ShowStore() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showCreateProduct, setShowCreateProduct] = useState(false);
    const [productId, setProductId] = useState(null);
    const [editProductData, setEditProductData] = useState(null); // <-- For edit

    const dispatch = useDispatch();
    const { data: userData } = useSelector((state) => state.auth);
    const { store } = useSelector((state) => state.store);

    useEffect(() => {
        if (userData?._id && !store?._id) {
            dispatch(getStoreDetails(userData._id));
        }
    }, [userData?._id, store?._id, dispatch]);

    // Payment prompt before creating store
    const handleCreateStore = () => {
        Swal.fire({
            title: 'Pay ₹1000 to Create Store',
            text: 'To create your store, a payment of ₹1000 is required. Proceed with the payment to complete the setup.',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'Proceed to Payment',
        }).then((result) => {
            if (result.isConfirmed) {
                setShowCreateForm(true);
            }
        });
    };

    // Open create product modal for new product
    const openCreateProductModal = () => {
        setEditProductData(null); // Clear any editing data
        setShowCreateProduct(true);
    };

    // Open edit product modal with data
    const handleEditProduct = (e, product) => {
        e.stopPropagation();
        setEditProductData(product);
        setShowCreateProduct(true);
    };

    // Placeholder for delete - you can implement with Swal + dispatch
    const handleDeleteProduct = (e, productId) => {
        e.stopPropagation();
        Swal.fire({
            title: 'Delete Product?',
            text: 'This action cannot be undone.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Delete',
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteProduct(productId))
                dispatch(getAllProduct())
                console.log('Delete product id:', productId);
            }
        });
    };

    return (
        <div className="w-full px-4 py-6">
            {store?._id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Store Details */}
                    <section className="bg-white shadow-md rounded-xl p-6">
                        <h2 className="text-xl font-semibold mb-4">🏪 Store Details</h2>
                        <div className="space-y-2 text-gray-700">
                            <p>
                                <strong>Name:</strong> {store.name}
                            </p>
                            <p>
                                <strong>Email:</strong> {store.email}
                            </p>
                            <p>
                                <strong>Contact:</strong> {store.contact}
                            </p>
                            <p>
                                <strong>Address:</strong> {store.address}
                            </p>
                            <p className="capitalize">
                                <strong>Owner:</strong> {store.owner?.fullName}
                            </p>
                        </div>
                    </section>

                    {/* Product Details */}
                    <section className="bg-white shadow-md rounded-xl p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold mb-2 sm:mb-0">📦 Product Details</h2>
                            <button
                                className="bg-yellow-400 px-4 py-2 rounded-lg shadow text-black font-semibold"
                                onClick={openCreateProductModal}
                            >
                                Add Product +
                            </button>
                        </div>

                        {store.products?.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {store.products.map(({ _id, image, name, description, price, category }, index) => (
                                    <div
                                        key={_id || index}
                                        className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all ease-in-out duration-300 cursor-pointer p-4 group relative"
                                        onClick={() => setProductId(_id)}
                                    >
                                        {/* Edit/Delete Icons on Hover - only for admin */}
                                        {userData?.role === 'admin' && (
                                            <div className="absolute top-2 right-2 hidden group-hover:flex gap-3 z-10 ">
                                                <button
                                                    onClick={(e) => handleEditProduct(e, { _id, image, name, description, price, category })}
                                                    className="text-gray-500 hover:text-blue-600"
                                                    title="Edit"
                                                >
                                                    <Pencil size={18} />
                                                </button>
                                                <button
                                                    onClick={(e) => handleDeleteProduct(e, _id)}
                                                    className="text-gray-500 hover:text-red-600"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        )}

                                        {/* Product Info */}
                                        <div className="flex flex-col gap-4">
                                            {image && (
                                                <img
                                                    src={image}
                                                    alt={name}
                                                    className="w-full h-40 object-cover rounded-md border"
                                                />
                                            )}

                                            <div className="flex flex-col gap-1">
                                                <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
                                                <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
                                                <p className="text-blue-600 font-medium text-base mt-1">₹ {price}</p>
                                                {category && <p className="text-xs text-gray-500">Category: {category}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center">No products available.</p>
                        )}
                    </section>
                </div>
            ) : (
                <div className="w-full flex justify-center mt-6">
                    <Button
                        className="bg-yellow-500 text-white"
                        onClick={handleCreateStore}
                        variant="contained"
                    >
                        Create Store
                    </Button>
                </div>
            )}

            {/* Modals */}
            <CreateStoreModal open={showCreateForm} handleClose={() => setShowCreateForm(false)} />
            <CreateProductModal
                storeId={store?._id}
                open={showCreateProduct}
                handleClose={() => {
                    setShowCreateProduct(false);
                    setEditProductData(null);
                }}
                initialData={editProductData} // Pass product data for editing or null for creating new
            />
            {productId && <ViewProduct productId={productId} onClose={() => setProductId(null)} />}
        </div>
    );
}

export default ShowStore;
