import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct } from '../../Redux/Slice/productSlice';
import Layout from '../../Layout/Layout';
import ProductModal from '../../Component/Modal/ProductModal';
import Swal from 'sweetalert2';
import { addToCart } from '../../Redux/Slice/cartSlice';

function AllProduct() {
    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);
    const { isLoggedIn } = useSelector((state) => state.auth);

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (isLoggedIn) {
            dispatch(getAllProduct());
        }
    }, [dispatch, isLoggedIn]);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();

        if (!isLoggedIn) {
            Swal.fire({
                icon: 'info',
                title: 'Login Required',
                text: 'Please login to add items to your cart.',
                customClass: {
                    popup: 'custom-swal-popup',
                    title: 'custom-swal-title',
                    content: 'custom-swal-text'
                }
            });
            return;
        }

        if (product.stock === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Out of Stock',
                text: 'Sorry, this product is currently unavailable.',
            });
            return;
        }

        dispatch(addToCart({ ...product, productId: product._id, quantity: 1 }));

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Added to cart!',
            showConfirmButton: false,
            timer: 500,
        });
    };

    return (
        <Layout>
            <div className="p-5 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore Our Products</h1>

                {loading ? (
                    <p className="text-center text-gray-600">Loading products...</p>
                ) : error ? (
                    <p className="text-center text-red-600">Failed to load products. Please try again later.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-3">
                        {products.length > 0 ? (
                            products.map((product) => (
                                <div
                                    key={product._id}
                                    className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition duration-300 bg-white cursor-pointer"
                                    onClick={() => handleProductClick(product)}
                                >
                                    <div className="h-48 overflow-hidden bg-gray-100 flex justify-center items-center">
                                        {product.images?.[0] ? (
                                            <img
                                                src={product.images[0]}
                                                alt={product.name}
                                                className="w-full h-full object-cover transform hover:scale-105 transition duration-300"
                                            />
                                        ) : (
                                            <div className="text-gray-400">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.description}</p>

                                        <div className="flex items-center gap-2 mt-3">
                                            <span className="text-green-700 font-bold text-lg">
                                                ₹{product.price}
                                            </span>
                                            {product.originalPrice && (
                                                <span className="line-through text-sm text-gray-400">
                                                    ₹{product.originalPrice}
                                                </span>
                                            )}
                                        </div>
                                        {console.log(product)}

                                        <button
                                            className={`w-full mt-4 py-2 rounded transition ${product.outOfStock
                                                ? "bg-gray-400 cursor-not-allowed text-white"
                                                : "bg-green-600 hover:bg-green-700 text-white"
                                                }`}
                                            onClick={(e) => handleAddToCart(e, product)}
                                            disabled={product.stock === 0}
                                        >
                                            {product.outOfStock ? "Out of Stock" : "Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500">No products found.</div>
                        )}
                    </div>
                )}

                {/* Product Details Modal */}
                {showModal && selectedProduct && (
                    <ProductModal product={selectedProduct} onClose={closeModal} />
                )}
            </div>
        </Layout>
    );
}

export default AllProduct;
