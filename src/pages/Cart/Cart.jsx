import React, { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Layout from '../../Layout/Layout';
import {
    fetchCart,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    localAddToCart,
    localRemoveFromCart,
    localDecrementQuantity,
    localClearCart
} from '../../Redux/Slice/cartSlice';
import { OrderSummary } from '../../Component/Comman/OrderSummary';

const calculateDiscountedPrice = (price, offerPercentage = 0, quantity = 1) => {
    const discount = price * (offerPercentage / 100);
    return (price - discount) * quantity;
};

const calculateOriginalPrice = (price, quantity = 1) => price * quantity;

const LoadingCart = React.memo(() => (
    <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your cart...</p>
    </div>
));

const ErrorCart = React.memo(({ error, onRetry }) => (
    <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="text-xl font-medium text-gray-800 mt-4">Error loading cart</h3>
        <p className="text-gray-600 mt-2">{error}</p>
        <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
            Retry
        </button>
    </div>
));

const CartHeader = React.memo(({ totalQuantity, onClearCart, hasItems }) => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-0">
            Your Shopping Cart ({totalQuantity})
        </h1>
        {hasItems && (
            <button
                onClick={onClearCart}
                className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center"
                aria-label="Clear cart"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Clear Cart
            </button>
        )}
    </div>
));

const EmptyCart = React.memo(() => (
    <div className="text-center py-12 sm:py-20 bg-white rounded-lg shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 sm:h-20 w-16 sm:w-20 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h2 className="text-xl sm:text-2xl font-medium text-gray-700 mt-4 sm:mt-6">Your cart is empty</h2>
        <p className="text-gray-500 mt-2 mb-4 sm:mb-6">Looks like you haven't added anything to your cart yet</p>
        <Link
            to="/products"
            className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base font-medium rounded-lg shadow-md transition duration-200"
            aria-label="Shop now"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 sm:h-5 w-4 sm:w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            Shop Now
        </Link>
    </div>
));

const CartItem = React.memo(({ item, onIncrement, onDecrement, onRemove }) => {
    const discountedPrice = useMemo(
        () => calculateDiscountedPrice(item.price, item.offerPercentage, item.quantity),
        [item.price, item.offerPercentage, item.quantity]
    );

    const originalPrice = useMemo(
        () => calculateOriginalPrice(item.price, item.quantity),
        [item.price, item.quantity]
    );

    return (
        <div className={`flex flex-col sm:flex-row bg-white rounded-lg border ${item.isDeleted ? 'border-red-200 bg-red-50' : 'border-gray-200'} overflow-hidden shadow-sm hover:shadow-md transition duration-200`}>
            <div className="sm:w-1/3 md:w-1/4">
                <img
                    src={item.productId?.img?.secure_url || item.img?.secure_url || 'https://via.placeholder.com/300x300?text=Product'}
                    alt={item.name}
                    className="w-full h-40 sm:h-48 object-cover"
                    loading="lazy"
                />
            </div>
            <div className="sm:w-2/3 md:w-3/4 p-4 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{item.name}</h3>
                    <div className="flex items-center mt-1 sm:mt-2">
                        <span className="text-base sm:text-lg font-bold text-gray-900">
                            ₹{calculateDiscountedPrice(item.price, item.offerPercentage, 1)}
                        </span>
                        {item.offerPercentage > 0 && (
                            <span className="ml-2 text-sm text-gray-500 line-through">₹{item.price}</span>
                        )}
                    </div>
                    {item.offerPercentage > 0 && (
                        <p className="text-green-600 text-xs sm:text-sm mt-1">{item.offerPercentage}% OFF</p>
                    )}
                </div>

                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                        <button
                            onClick={() => onDecrement(item.productId)}
                            disabled={item.quantity <= 1}
                            className={`px-2 sm:px-3 py-1 text-base ${item.quantity <= 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <span className="px-3 sm:px-4 py-1 text-gray-800">{item.quantity}</span>
                        <button
                            onClick={() => onIncrement(item.productId)}
                            disabled={item.stockQuantity <= item.quantity}
                            className={`px-2 sm:px-3 py-1 text-base ${item.stockQuantity <= item.quantity ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>

                    <div className="text-right">
                        <div className="flex flex-col items-end">
                            <p className="text-base sm:text-lg font-bold text-gray-900">
                                ₹{discountedPrice}
                            </p>
                            {item.offerPercentage > 0 && (
                                <span className="text-xs text-gray-500 line-through">
                                    ₹{originalPrice}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => onRemove(item.productId)}
                            className="text-xs sm:text-sm text-red-500 hover:text-red-700 flex items-center mt-1 justify-end w-full"
                            aria-label="Remove item"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 sm:h-4 w-3 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

const CartItems = React.memo(({ items, onIncrement, onDecrement, onRemove }) => (
    <div className="space-y-3 sm:space-y-4">
        {items.map((item) => (
            <CartItem
                key={item.productId}
                item={item}
                onIncrement={onIncrement}
                onDecrement={onDecrement}
                onRemove={onRemove}
            />
        ))}
    </div>
));

function Cart() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(state => state.auth.isLoggedIn);

    const cartState = useSelector(state => state.cart);
    const {
        items,
        totalQuantity,
        totalPrice,
        grandTotal,
        totalDiscount,
        status,
        shippingFee,
        netPrice,
        error
    } = cartState;

    const handleIncrement = useCallback(async (productId) => {
        const item = items.find(i => i.productId === productId);
        if (!item) return;

        try {
            if (isLoggedIn) {
                await dispatch(updateCartItemQuantity({
                    productId,
                    quantity: item.quantity + 1
                })).unwrap();
            } else {
                dispatch(localAddToCart({ ...item, quantity: 1 }));
                toast.success("Item quantity increased");
            }
        } catch (error) {
            toast.error(error.message || "Failed to update quantity");
        }
    }, [dispatch, isLoggedIn, items]);

    const handleRemove = useCallback(async (productId) => {
        try {
            if (isLoggedIn) {
                await dispatch(removeFromCart(productId)).unwrap();
            } else {
                dispatch(localRemoveFromCart(productId));
            }
        } catch (error) {
            console.log(error)
        }
    }, [dispatch, isLoggedIn]);

    const handleDecrement = useCallback(async (productId) => {
        const item = items.find(i => i.productId === productId);
        if (!item) return;

        try {
            if (item.quantity <= 1) {
                await handleRemove(productId);
                return;
            }

            if (isLoggedIn) {
                await dispatch(updateCartItemQuantity({
                    productId,
                    quantity: item.quantity - 1
                })).unwrap();
            } else {
                dispatch(localDecrementQuantity(productId));
                toast.success("Item quantity decreased");
            }
        } catch (error) {
            toast.error(error.message || "Failed to update quantity");
        }
    }, [dispatch, isLoggedIn, items, handleRemove]);

    const handleClearCart = useCallback(async () => {
        try {
            if (isLoggedIn) {
                await dispatch(clearCart()).unwrap();
            } else {
                dispatch(localClearCart());
            }
        } catch (error) {
            toast.error(error.message || "Failed to clear cart");
        }
    }, [dispatch, isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn && status === 'idle') {
            dispatch(fetchCart());
        }
    }, [dispatch, isLoggedIn, status]);

    const handlePurchase = useCallback(() => {
        const unavailableItems = items.some(item => item.outOfStock || item.isDeleted);
        if (unavailableItems) {
            toast.error("Please remove unavailable items before checkout");
            return;
        }

        if (!isLoggedIn) {
            toast.info("Please login to proceed to checkout");
            navigate("/login", { state: { from: "/cart" } });
            return;
        }

        navigate("/order-checkout", {
            state: {
                items: items.filter(item => !item.isDeleted),
                netPrice,
                totalPrice,
                totalQuantity,
                totalDiscount,
                grandTotal,
                shippingFee,
            }
        });
    }, [isLoggedIn, items, totalPrice, totalQuantity, totalDiscount, grandTotal, shippingFee, navigate]);

    if (status === 'loading') {
        return <Layout><LoadingCart /></Layout>;
    }

    if (error) {
        return <Layout><ErrorCart error={error} onRetry={() => dispatch(fetchCart())} /></Layout>;
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-10">
                <CartHeader
                    totalQuantity={totalQuantity}
                    onClearCart={handleClearCart}
                    hasItems={items.length > 0}
                />

                {items.length === 0 ? (
                    <EmptyCart />
                ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <CartItems
                                    items={items}
                                    onIncrement={handleIncrement}
                                    onDecrement={handleDecrement}
                                    onRemove={handleRemove}
                                />
                            </div>
                            <div className="lg:col-span-1">
                                <OrderSummary
                                    totalQuantity={totalQuantity}
                                    totalPrice={totalPrice}
                                    totalDiscount={totalDiscount}
                                    shippingFee={shippingFee}
                                    grandTotal={grandTotal}
                                    onCheckout={handlePurchase}
                                    netPrice={netPrice}
                                />
                            </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default React.memo(Cart);