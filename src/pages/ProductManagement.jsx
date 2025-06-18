import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Star, ShoppingCart,
    Plus, Loader, X, ChevronDown, ChevronUp
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import ProductCard from '../Component/ui/ProductCard';
import Pagination from '../Component/ui/Pagination';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProduct } from '../Redux/Slice/productSlice';

const ProductManagementPage = () => {
    const navigate = useNavigate();
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [sortOption, setSortOption] = useState('featured');
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const productsPerPage = 12;

    const dispatch = useDispatch();
    const { products, loading, error } = useSelector((state) => state.products);

    // Extract unique categories from products
    const categories = ['All', ...new Set(products.map(product => product.category))];

    // Fetch products on component mount
    useEffect(() => {
        dispatch(getAllProduct());
    }, [dispatch]);

    // Filter and sort products
    useEffect(() => {
        if (!products || products.length === 0) return;

        let result = [...products];

        // Filter by search term
        if (searchTerm) {
            result = result.filter(product =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        // Filter by category
        if (selectedCategory !== 'All') {
            result = result.filter(product => product.category === selectedCategory);
        }

        // Filter by price range
        result = result.filter(product =>
            product.price >= priceRange[0] && product.price <= priceRange[1]
        );

        // Sort products
        switch (sortOption) {
            case 'price-low':
                result.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                result.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
                break;
            default:
                // 'featured' - default sorting
                break;
        }

        setFilteredProducts(result);
        setCurrentPage(1);
    }, [products, searchTerm, selectedCategory, priceRange, sortOption]);

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setPriceRange([0, 1000]);
        setSortOption('featured');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader className="animate-spin text-green-600" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center p-6 bg-red-50 rounded-lg max-w-md">
                    <p className="text-red-600 font-medium mb-4">Error loading products</p>
                    <button
                        onClick={() => dispatch(getAllProduct())}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Mobile filter dialog */}
            <div className={`fixed inset-0 z-40 lg:hidden ${mobileFiltersOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setMobileFiltersOpen(false)} />
                <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto">
                    <div className="p-4 flex items-center justify-between border-b">
                        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                        <button onClick={() => setMobileFiltersOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>
                    <div className="p-4 space-y-6">
                        <div>
                            <h3 className="font-medium mb-2">Search</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Categories</h3>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        className={`block w-full text-left px-3 py-1.5 rounded-md ${selectedCategory === category ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-100'}`}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            setMobileFiltersOpen(false);
                                        }}
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-2">Price Range</h3>
                            <div className="flex items-center justify-between mb-2">
                                <span>₹{priceRange[0]}</span>
                                <span>₹{priceRange[1]}</span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="1000"
                                value={priceRange[1]}
                                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                className="w-full"
                            />
                        </div>
                        <button
                            onClick={resetFilters}
                            className="w-full py-2 text-sm text-blue-600 hover:text-blue-800"
                        >
                            Reset all filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero section */}
                <div className="bg-gradient-to-r from-green-600 to-green-800 rounded-xl p-8 mb-8 text-white">
                    <h1 className="text-3xl font-bold mb-2">Product Management</h1>
                    <p className="text-lg mb-4">Manage your product inventory</p>
                    <Link
                        to="/products/new"
                        className="inline-flex items-center px-4 py-2 bg-white text-green-700 rounded-lg font-medium hover:bg-gray-100"
                    >
                        <Plus size={18} className="mr-2" />
                        Add New Product
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters sidebar - desktop */}
                    <div className="hidden lg:block w-64 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-4">
                        <div className="mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-medium text-lg flex items-center">
                                    <Filter className="mr-2" size={18} /> Filters
                                </h3>
                                <button
                                    onClick={resetFilters}
                                    className="text-sm text-blue-600 hover:text-blue-800"
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="relative mb-4">
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                            </div>

                            <div className="mb-4">
                                <h4 className="font-medium mb-2">Categories</h4>
                                <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {categories.map((category) => (
                                        <button
                                            key={category}
                                            className={`block w-full text-left px-3 py-1.5 rounded-md ${selectedCategory === category ? 'bg-green-100 text-green-700' : 'hover:bg-gray-100'}`}
                                            onClick={() => setSelectedCategory(category)}
                                        >
                                            {category}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-4">
                                <h4 className="font-medium mb-2">Price Range (₹)</h4>
                                <div className="flex items-center justify-between mb-2">
                                    <span>{priceRange[0]}</span>
                                    <span>{priceRange[1]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="1000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Product grid */}
                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                            <button
                                onClick={() => setMobileFiltersOpen(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border rounded-lg shadow-sm"
                            >
                                <Filter size={18} />
                                Filters
                                {mobileFiltersOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>

                            <div className="flex items-center gap-4">
                                <p className="text-gray-600">
                                    Showing {filteredProducts.length > 0 ? indexOfFirstProduct + 1 : 0}-{Math.min(indexOfLastProduct, filteredProducts.length)} of {filteredProducts.length} products
                                </p>
                                <div className="flex items-center">
                                    <label htmlFor="sort" className="mr-2 text-gray-600">Sort:</label>
                                    <select
                                        id="sort"
                                        className="border rounded-md px-3 py-1.5 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                        value={sortOption}
                                        onChange={(e) => setSortOption(e.target.value)}
                                    >
                                        <option value="featured">Featured</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                        <option value="rating">Rating</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {currentProducts.length > 0 ? (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                    {currentProducts.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                            onClick={() => handleProductClick(product._id)}
                                            showEditButton
                                        />
                                    ))}
                                </div>
                                {totalPages > 1 && (
                                    <div className="mt-8">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <h3 className="text-xl font-medium text-gray-700 mb-2">
                                    {products.length === 0 ? 'No products available' : 'No products found'}
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    {products.length === 0 ? 'Please add some products to get started' : 'Try adjusting your search or filter criteria'}
                                </p>
                                <Link
                                    to="/products/new"
                                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                                >
                                    <Plus size={18} className="mr-2" />
                                    Add New Product
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductManagementPage;