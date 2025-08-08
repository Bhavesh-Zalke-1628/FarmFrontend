import { useEffect, useState, useCallback } from 'react';
import CreateStoreModal from '../Modal/CreateStoreModel';
import CreateProductModal from '../Modal/CreateProduct';
import ViewProduct from '../Modal/ViewProduct';
import EditStoreModal from '../Modal/EditStoreModal';
import { Pencil, Trash2, Plus, Store, Package, Info } from 'lucide-react';
import Swal from 'sweetalert2';
import { useDispatch, useSelector } from 'react-redux';
import { getStoreDetails } from '../../Redux/Slice/storeSlice';
import { changeStockStatus, deleteProduct, getProductByStoreId, updateProductQuantity } from '../../Redux/Slice/productSlice';

function ShowStore() {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showCreateProduct, setShowCreateProduct] = useState(false);
    const [productId, setProductId] = useState(null);
    const [editProductData, setEditProductData] = useState(null);
    const [editStoreData, setEditStoreData] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const { data: userData } = useSelector((state) => state.auth);
    const { store, loading: storeLoading } = useSelector((state) => state.store);
    const { products, loading: productsLoading } = useSelector((state) => state.products);

    // Fetch store and products
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                if (userData?._id && !store?._id) {
                    await dispatch(getStoreDetails(userData._id));
                }
                if (store?._id) {
                    await dispatch(getProductByStoreId(store._id));
                }
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
        // Only run when user or store ID changes
    }, [userData?._id, store?._id, dispatch]);

    // Handlers
    const handleCreateStore = useCallback(() => {
        Swal.fire({
            title: 'Create Your Store',
            html: `
        <div class="text-left">
          <p class="mb-4">To create your store, a one-time payment of <span class="font-bold">₹1000</span> is required.</p>
          <ul class="list-disc pl-5 mb-4 space-y-1">
            <li>Custom store branding</li>
            <li>Unlimited products</li>
            <li>24/7 support</li>
          </ul>
        </div>
      `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#f59e0b',
            confirmButtonText: 'Proceed to Payment',
            cancelButtonText: 'Not Now',
            showLoaderOnConfirm: true,
            preConfirm: () => new Promise((resolve) => setTimeout(resolve, 1000)),
        }).then((result) => {
            if (result.isConfirmed) {
                setShowCreateForm(true);
            }
        });
    }, []);

    const openCreateProductModal = useCallback(() => {
        setEditProductData(null);
        setShowCreateProduct(true);
    }, []);

    const handleEditProduct = useCallback((e, product) => {
        e.stopPropagation();
        setEditProductData(product);
        setShowCreateProduct(true);
    }, []);

    const handleDeleteProduct = useCallback((e, id) => {
        e.stopPropagation();
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            background: '#ffffff',
            backdrop: `
        rgba(0,0,0,0.5)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `
        }).then((result) => {
            if (result.isConfirmed) {
                dispatch(deleteProduct(id))
                    .unwrap()
                    .then(() => {
                        Swal.fire('Deleted!', 'Your product has been deleted.', 'success');
                        dispatch(getProductByStoreId(store?._id));
                    })
                    .catch(() => {
                        Swal.fire('Error!', 'Failed to delete product.', 'error');
                    });
            }
        });
    }, [dispatch, store?._id]);

    const toggleStock = useCallback(async (status, productId) => {


        const res = await dispatch(changeStockStatus(productId));

        const updatedStatus = res?.payload?.updatedProduct?.outOfStock;


        if (!updatedStatus) {
            const { value: quantity } = await Swal.fire({
                title: "Stock Enabled",
                text: "Enter the new quantity for this product:",
                icon: "warning",
                input: "number",
                inputLabel: "Quantity",
                inputPlaceholder: "Enter quantity",
                inputAttributes: { min: 1 },
                showCancelButton: true,
                confirmButtonText: "Update",
                cancelButtonText: "Cancel",
                preConfirm: (value) => {
                    if (!value || isNaN(value) || Number(value) <= 0) {
                        Swal.showValidationMessage("Please enter a valid quantity greater than 0");
                        return false;
                    }
                    return value;
                }
            });

            if (quantity) {
                await dispatch(updateProductQuantity({ productId, quantity }));
                Swal.fire({
                    icon: "success",
                    title: "Quantity Updated",
                    text: `Product quantity updated to ${quantity}`,
                    timer: 1500,
                    showConfirmButton: false
                });
            }
        }
    }, [dispatch]);

    const handleEditStore = useCallback((e) => {
        e.stopPropagation();
        setEditStoreData(true);
    }, []);

    // Show loading spinner
    if (isLoading || storeLoading || productsLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
            </div>
        );
    }

    // Main render
    return (
        <div className="w-full px-4 py-8 max-w-7xl mx-auto">
            {/* Store Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <Store className="text-yellow-500" size={28} />
                        {store?._id ? store.name : 'My Store'}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {store?._id
                            ? 'Manage your store and products'
                            : 'Create your store to start selling'
                        }
                    </p>
                </div>
                {store?._id && (
                    <button
                        onClick={openCreateProductModal}
                        className="mt-4 md:mt-0 flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        <Plus size={18} />
                        Add Product
                    </button>
                )}
            </div>

            {store?._id ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Store Info */}
                    <div className="lg:col-span-1 max-h-fit bg-white rounded-xl shadow-lg border border-gray-100">
                        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 text-white rounded-t-lg flex items-center gap-3">
                            <Store size={24} />
                            <h2 className="text-xl font-semibold">Store Information</h2>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Store Name</h3>
                                <p className="mt-1 text-gray-800">{store.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Contact Email</h3>
                                <p className="mt-1 text-gray-800">{store.email}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Phone Number</h3>
                                <p className="mt-1 text-gray-800">{store.contact || 'Not provided'}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Address</h3>
                                <p className="mt-1 text-gray-800">{store.address || 'Not provided'}</p>
                            </div>
                            <div className="pt-4 border-t border-gray-100">
                                <button
                                    onClick={handleEditStore}
                                    className="w-full bg-gray-50 hover:bg-gray-100 text-gray-800 font-medium py-2 px-4 rounded-lg transition-colors">
                                    Edit Store Details
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Product List */}
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white flex items-center gap-3">
                                <Package size={24} />
                                <h2 className="text-xl font-semibold">Your Products</h2>
                            </div>
                            <div className="p-4">
                                {products?.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {products.map((product) => (
                                            <div
                                                key={product._id}
                                                className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                                            >
                                                {/* Image */}
                                                <div
                                                    className="h-40 bg-gray-100 relative cursor-pointer overflow-hidden"
                                                    onClick={() => setProductId(product._id)}
                                                >
                                                    {product.img ? (
                                                        <img
                                                            src={product.img.secure_url}
                                                            alt={product.name}
                                                            className="w-full h-full object-fill transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center w-full h-full text-gray-400">
                                                            <Package size={48} className="opacity-30" />
                                                        </div>
                                                    )}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                                                        <span className="text-white text-sm font-medium">Click to view details</span>
                                                    </div>
                                                </div>
                                                {/* Info */}
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-gray-800 capitalize">{product.name}</h3>
                                                            <p className="text-sm text-gray-500 mt-1">{product.description}</p>
                                                            <h3 className="font-semibold text-gray-800 mt-1">Qty: {product.quantity}</h3>
                                                            <h3 className="font-semibold text-gray-800 mt-1">Offer: {product.offerPercentage}</h3>
                                                        </div>
                                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                            {product.category || 'Uncategorized'}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3 flex items-center justify-between">
                                                        <div className="flex items-center gap-2 mt-2">
                                                            {product.offerPercentage > 0 ? (
                                                                <>
                                                                    <span className="text-green-600 font-bold text-lg">
                                                                        ₹{Math.round(product.price - (product.price * product.offerPercentage) / 100)}
                                                                    </span>
                                                                    <span className="line-through text-gray-400 text-sm">
                                                                        ₹{product.price}
                                                                    </span>
                                                                    <span className="text-red-600 font-semibold text-sm">
                                                                        ({product.offerPercentage}% OFF)
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                <span className="text-green-600 font-bold text-lg">₹{product.price}</span>
                                                            )}
                                                        </div>
                                                        {product.originalPrice && (
                                                            <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
                                                        )}
                                                        <div className="flex items-center space-x-4">
                                                            <p className="font-bold capitalize">Stock {!product.outOfStock ? 'In' : 'Out'}</p>

                                                            <button
                                                                onClick={() => toggleStock(product.outOfStock, product._id)}
                                                                className={`w-14 h-7 flex items-center rounded-full p-1 transition duration-300 ${!product.outOfStock ? 'bg-green-500' : 'bg-red-500'}`}
                                                            >
                                                                <div
                                                                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${!product.outOfStock ? 'translate-x-7' : 'translate-x-0'}`}
                                                                />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Actions */}
                                                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <button
                                                        onClick={(e) => handleEditProduct(e, product)}
                                                        className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md text-blue-600 hover:text-blue-800"
                                                        title="Edit"
                                                    >
                                                        <Pencil size={16} />
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleDeleteProduct(e, product._id)}
                                                        className="p-1.5 bg-white/90 hover:bg-white rounded-full shadow-md text-red-600 hover:text-red-800"
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-12 text-center">
                                        <Package size={48} className="text-gray-300 mb-4" />
                                        <h3 className="text-lg font-medium text-gray-500">No products yet</h3>
                                        <p className="text-gray-400 mt-1 mb-4">Add your first product to get started</p>
                                        <button
                                            onClick={openCreateProductModal}
                                            className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg shadow-md transition-colors"
                                        >
                                            <Plus size={18} />
                                            Add Product
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-full">
                                    <Package className="text-green-600" size={18} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Products</p>
                                    <p className="text-xl font-semibold">{products?.length || 0}</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-full">
                                    <Info className="text-blue-600" size={18} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Active Listings</p>
                                    <p className="text-xl font-semibold">{products?.length || 0}</p>
                                </div>
                            </div>
                            <div className="bg-white p-4 rounded-lg shadow border border-gray-100 flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-full">
                                    <Store className="text-purple-600" size={18} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Store Rating</p>
                                    <p className="text-xl font-semibold">4.8 ★</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                // No store: show call to action
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-lg border border-gray-100">
                    <Store size={64} className="text-yellow-500 mb-6" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">You don't have a store yet</h2>
                    <p className="text-gray-500 max-w-md text-center mb-8">
                        Create your own store to start selling products online. Get your products in front of customers today!
                    </p>
                    <button
                        onClick={handleCreateStore}
                        className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-3 px-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                    >
                        <Plus size={20} />
                        Create Your Store
                    </button>
                    <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-2xl">
                        <div className="text-center p-4">
                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Package className="text-blue-600" size={20} />
                            </div>
                            <h3 className="font-medium text-gray-800">Add Products</h3>
                            <p className="text-sm text-gray-500 mt-1">Unlimited product listings</p>
                        </div>
                        <div className="text-center p-4">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Store className="text-green-600" size={20} />
                            </div>
                            <h3 className="font-medium text-gray-800">Custom Branding</h3>
                            <p className="text-sm text-gray-500 mt-1">Your logo and colors</p>
                        </div>
                        <div className="text-center p-4">
                            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Info className="text-purple-600" size={20} />
                            </div>
                            <h3 className="font-medium text-gray-800">Analytics</h3>
                            <p className="text-sm text-gray-500 mt-1">Track your sales</p>
                        </div>
                    </div>
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
                initialData={editProductData}
            />
            <EditStoreModal
                open={editStoreData}
                handleClose={() => setEditStoreData(false)}
                initialData={store}
            />

            {productId && <ViewProduct productId={productId} onClose={() => setProductId(null)} />}
        </div>
    );
}

export default ShowStore;
