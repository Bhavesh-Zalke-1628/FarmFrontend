import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct } from '../../Redux/Slice/productSlice';
import Layout from '../../Layout/Layout';
import Swal from 'sweetalert2';
import { addToCart } from '../../Redux/Slice/cartSlice';
import ProductCard from '../../Component/ui/ProductCard';
import { useNavigate } from 'react-router-dom';

function AllProduct() {
    // Redux state
    const dispatch = useDispatch();
    const { products, totalCount, loading, error } = useSelector((state) => state.products);

    console.log("products", products)

    const { isLoggedIn } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    // Local state
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [page, setPage] = useState(1);

    const LIMIT = 8;
    const skip = (page - 1) * LIMIT;
    const totalPages = Math.max(1, Math.ceil(totalCount / LIMIT));

    // Fetch products when page/skip/limit change
    useEffect(() => {
        dispatch(getAllProduct({ limit: LIMIT, skip }));
    }, [dispatch, page, LIMIT, skip]);

    // Scroll to top on page change
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page]);

    // 🟩 Reset to last valid page if product total shrinks (e.g. via filtering, or data changes on server)
    useEffect(() => {
        // If current page is now too high for available products, reset to valid page
        const newTotalPages = Math.max(1, Math.ceil(totalCount / LIMIT));
        if (page > newTotalPages) setPage(newTotalPages);
        // eslint-disable-next-line
    }, [totalCount, LIMIT]);

    // Pagination sliding window
    const getPageNumbers = () => {
        const delta = 2;
        let start = Math.max(1, page - delta);
        let end = Math.min(totalPages, page + delta);
        if (page <= delta) end = Math.min(totalPages, 1 + 2 * delta);
        if (page + delta > totalPages) start = Math.max(1, totalPages - 2 * delta);
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    };

    // Click handlers
    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedProduct(null);
    };

    const handleAddToCart = (e, product) => {
        if (!isLoggedIn) {
            Swal.fire({
                icon: 'info',
                title: 'Login Required',
                text: 'Please login to add items to your cart.',
                confirmButtonText: 'Go to Login',
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
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

    // --- UI ---
    return (
        <Layout>
            <div className=" max-w-7xl mx-auto pb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Explore Our Products</h1>

                {/* (Optional) Show total results */}
                {typeof totalCount === 'number' && (
                    <div className="text-center mb-4 text-sm text-gray-500">
                        Showing page {page} of {totalPages}, {totalCount} products found.
                    </div>
                )}

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

                        {/* Centered spinner during re-loading */}
                        {loading && (
                            <div className="text-center mt-4 text-gray-600">Loading...</div>
                        )}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center mt-6 space-x-2" aria-label="Pagination">
                                <button
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                    className={`px-4 py-2 border rounded ${page === 1 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700'
                                        }`}
                                    aria-label="Previous Page"
                                >
                                    Prev
                                </button>
                                {getPageNumbers().map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`px-4 py-2 border rounded ${page === p ? 'bg-green-600 text-white' : 'bg-white text-gray-700'
                                            }`}
                                        aria-current={page === p ? 'page' : undefined}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                    className={`px-4 py-2 border rounded ${page === totalPages ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700'
                                        }`}
                                    aria-label="Next Page"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    // Graceful empty state for bad page (no products to show)
                    <div>
                        <div className="text-center text-gray-500">No products found.</div>
                        {page > 1 && (
                            <div className="text-center mt-2">
                                <button
                                    className="text-green-700 underline"
                                    onClick={() => setPage(1)}
                                >
                                    Go to first page
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Modal */}
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
