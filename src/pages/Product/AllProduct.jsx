import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct } from '../../Redux/Slice/productSlice';
import Layout from '../../Layout/Layout';
import ProductModal from '../../Component/Modal/ProductModal';
import Swal from 'sweetalert2';
import { addToCart } from '../../Redux/Slice/cartSlice';
import ProductCard from '../../Component/ui/ProductCard';

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

        dispatch(addToCart({
            ...product,
            productId: product._id,
            quantity: 1
        }));

       
    };

    return (
        <Layout>
            <div className="p-5 max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                    Explore Our Products
                </h1>

                {loading ? (
                    <p className="text-center text-gray-600">Loading products...</p>
                ) : error ? (
                    <p className="text-center text-red-600">Failed to load products.</p>
                ) : products?.length ? (
                    <ProductCard
                        products={products}
                        handleAddToCart={handleAddToCart}
                        handleProductClick={handleProductClick}
                    />
                ) : (
                    <div className="text-center text-gray-500">No products found.</div>
                )}
            </div>
        </Layout>
    );
}

export default AllProduct;
