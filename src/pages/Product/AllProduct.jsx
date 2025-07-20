import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct } from '../../Redux/Slice/productSlice';
import Layout from '../../Layout/Layout';
import ProductModal from '../../Component/Modal/ProductModal';
import Swal from 'sweetalert2';
import { addToCart } from '../../Redux/Slice/cartSlice';
import ProductCard from '../../Component/ui/ProductCard';
import { useNavigate } from 'react-router-dom';

function AllProduct() {
    const dispatch = useDispatch();
    const { products, totalCount, loading, error } = useSelector((state) => state.products);
    const { isLoggedIn } = useSelector((state) => state.auth);

    const navigate = useNavigate()

    console.log("products", products)

    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);

    const LIMIT = 8;
    const skip = (page - 1) * LIMIT;


    useEffect(() => {
        dispatch(getAllProduct({ limit: LIMIT, skip }));
    }, [dispatch, page]);

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleAddToCart = (e, product) => {
        // e.stopPropagation();
        if (!isLoggedIn) {
            Swal.fire({
                icon: 'info',
                title: 'Login Required',
                text: 'Please login to add items to your cart.',
                confirmButtonText: 'Go to Login',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login'); // Adjust the path as per your route
                }
            });
            return;
        }

        if (!product.quantity || product.quantity <= 0) {
            Swal.fire({
                icon: 'warning',
                title: 'Out of Stock',
                text: 'Sorry, this product is currently unavailable.',
            });
            return;
        }

        dispatch(addToCart({ ...product, productId: product._id, quantity: 1 }));
    };

    const totalPages = Math.ceil(totalCount / LIMIT);

    return (
        <Layout>
            <div className="p-5 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore Our Products</h1>

                {loading && products.length === 0 ? (
                    <p className="text-center text-gray-600">Loading products...</p>
                ) : error ? (
                    <p className="text-center text-red-600">Failed to load products.</p>
                ) : products?.length ? (
                    <>
                        <ProductCard
                            products={products}
                            handleAddToCart={handleAddToCart}
                            handleProductClick={handleProductClick}
                        />

                        {loading && (
                            <div className="text-center mt-4 text-gray-600">Loading...</div>
                        )}

                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 space-x-2">
                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setPage(index + 1)}
                                        className={`px-4 py-2 border rounded ${page === index + 1
                                            ? 'bg-green-600 text-white'
                                            : 'bg-white text-gray-700'
                                            }`}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center text-gray-500">No products found.</div>
                )}

                {showModal && (
                    <ProductModal
                        product={selectedProduct}
                        onClose={closeModal}
                        onAddToCart={handleAddToCart}
                    />
                )}
            </div>
        </Layout>
    );
}

export default AllProduct;
