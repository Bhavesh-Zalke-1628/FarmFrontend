import React, { useState, useEffect } from 'react';
import {
    Search, Filter, Loader, X, ChevronDown, ChevronUp, Plus
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import ProductCard from '../../Component/ui/ProductCard';
import Pagination from '../../Component/ui/Pagination';
import ProductModal from '../../Component/Modal/CreateProduct';
import { getAllProduct } from '../../Redux/Slice/productSlice';

const ProductManagementPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [sortOption, setSortOption] = useState('featured');
    const [currentPage, setCurrentPage] = useState(1);
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [showCreateProduct, setShowCreateProduct] = useState(false);

    const productsPerPage = 12;
    const { products, loading, error } = useSelector((state) => state.products);
    const { role } = useSelector(state => state.auth);

    const categories = ['All', ...new Set(products.map(p => p.category))];

    useEffect(() => {
        dispatch(getAllProduct());
    }, [dispatch]);

    const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
        return matchesSearch && matchesCategory && matchesPrice;
    }).sort((a, b) => {
        switch (sortOption) {
            case 'price-low': return a.price - b.price;
            case 'price-high': return b.price - a.price;
            case 'rating': return (b.rating || 0) - (a.rating || 0);
            default: return 0;
        }
    });

    const indexOfLast = currentPage * productsPerPage;
    const indexOfFirst = indexOfLast - productsPerPage;
    const currentProducts = filtered.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filtered.length / productsPerPage);

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader className="animate-spin text-green-600" size={48} /></div>;
    if (error) return (
        <div className="flex justify-center items-center min-h-screen">
            <div className="bg-red-50 p-6 rounded shadow max-w-sm text-center">
                <h2 className="text-red-600 text-lg font-semibold mb-3">Error loading products</h2>
                <button onClick={() => dispatch(getAllProduct())} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    Retry
                </button>
            </div>
        </div>
    );

    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('All');
        setPriceRange([0, 5000]);
        setSortOption('featured');
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-b-xl shadow-md">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold">Product Management</h1>
                        <p className="text-md">Easily manage your store inventory</p>
                    </div>
                    {role === 'admin' && (
                        <button
                            onClick={() => setShowCreateProduct(true)}
                            className="bg-white text-green-700 px-5 py-2 rounded-lg hover:bg-gray-100 font-medium flex items-center"
                        >
                            <Plus size={18} className="mr-2" /> Add Product
                        </button>
                    )}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Panel */}
                    <aside className="w-full lg:w-64 bg-white p-4 rounded-lg shadow h-fit">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold flex items-center"><Filter className="mr-2" size={18} />Filters</h3>
                            <button onClick={resetFilters} className="text-blue-600 text-sm">Reset</button>
                        </div>
                        <div className="space-y-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-3 py-2 w-full border rounded-md focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div>
                                <h4 className="font-medium mb-1">Category</h4>
                                <div className="space-y-1 max-h-40 overflow-y-auto">
                                    {categories.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`w-full text-left px-3 py-1.5 rounded-md text-sm ${selectedCategory === cat ? 'bg-green-100 text-green-700 font-semibold' : 'hover:bg-gray-100'}`}
                                        >{cat}</button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="font-medium mb-1">Price</h4>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>₹{priceRange[0]}</span><span>₹{priceRange[1]}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    value={priceRange[1]}
                                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label htmlFor="sort" className="block text-sm font-medium mb-1">Sort By</label>
                                <select
                                    id="sort"
                                    value={sortOption}
                                    onChange={(e) => setSortOption(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="featured">Featured</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Rating</option>
                                </select>
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <main className="flex-1">
                        {currentProducts.length > 0 ? (
                            <>
                                <ProductCard
                                    products={currentProducts}
                                />
                                {totalPages > 1 && (
                                    <div className="mt-6">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            onPageChange={setCurrentPage}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white p-8 rounded shadow text-center">
                                <h3 className="text-xl font-medium text-gray-700 mb-2">No Products Found</h3>
                                <p className="text-gray-500 mb-4">Try adjusting your search or filter options.</p>
                                {role === 'admin' && (
                                    <button
                                        onClick={() => setShowCreateProduct(true)}
                                        className="inline-flex items-center bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                                    >
                                        <Plus size={18} className="mr-2" /> Add Product
                                    </button>
                                )}
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* Create Product Modal */}
            <ProductModal
                open={showCreateProduct}
                handleClose={() => setShowCreateProduct(false)}
            />
        </div>
    );
};

export default ProductManagementPage;
