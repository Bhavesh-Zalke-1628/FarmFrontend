import React from "react";
import { motion } from "framer-motion";
import Layout from "../Layout/Layout";

function About() {
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (

        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-16 px-4 sm:px-6 lg:px-8">
                <motion.div
                    className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Hero Section */}
                    <div className="relative h-64 bg-green-600 flex items-center justify-center">
                        <div className="absolute inset-0 bg-opacity-50 bg-gradient-to-r from-green-700 to-green-400"></div>
                        <div className="relative z-10 text-center px-4">
                            <motion.h1
                                className="text-5xl md:text-6xl font-bold text-white mb-4"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                About GreenFields
                            </motion.h1>
                            <motion.p
                                className="text-xl text-green-100 max-w-2xl mx-auto"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                Cultivating the future of sustainable agriculture
                            </motion.p>
                        </div>
                    </div>

                    {/* Content */}
                    <motion.div
                        className="py-12 px-6 sm:px-12"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                    >
                        <motion.p
                            className="text-lg leading-8 mb-8 text-gray-700 bg-green-50 p-6 rounded-lg border-l-4 border-green-500"
                            variants={fadeIn}
                        >
                            Welcome to <span className="font-bold text-green-600">GreenFields</span>, your trusted partner in modern farming and sustainable agriculture. We are committed to empowering farmers, agribusinesses, and consumers with high-quality products, expert advice, and digital tools to thrive in today's evolving agricultural world.
                        </motion.p>

                        <div className="grid md:grid-cols-2 gap-8 mb-12">
                            <motion.div
                                className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-sm border border-green-100"
                                variants={fadeIn}
                            >
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 p-3 rounded-full mr-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Our Mission</h2>
                                </div>
                                <p className="text-gray-600">
                                    At GreenFields, our mission is to revolutionize agriculture through innovation, technology, and accessibility. We aim to make quality farming products and services available to every corner of India — from seed to harvest.
                                </p>
                            </motion.div>

                            <motion.div
                                className="bg-gradient-to-br from-green-50 to-white p-6 rounded-xl shadow-sm border border-green-100"
                                variants={fadeIn}
                            >
                                <div className="flex items-center mb-4">
                                    <div className="bg-green-100 p-3 rounded-full mr-4">
                                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                        </svg>
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-800">Our Vision</h2>
                                </div>
                                <p className="text-gray-600">
                                    We envision a future where every farmer is digitally empowered, every crop is grown sustainably, and every consumer has access to fresh, locally sourced food — all with the support of GreenFields.
                                </p>
                            </motion.div>
                        </div>

                        <motion.div
                            className="mb-12 bg-white p-6 rounded-xl shadow-sm border border-green-100"
                            variants={fadeIn}
                        >
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                                <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                What We Offer
                            </h2>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                                {[
                                    "Top-quality fertilizers, seeds, and farming tools",
                                    "Personalized crop advice from agricultural experts",
                                    "Real-time weather and soil insights",
                                    "Secure payment and fast delivery",
                                    "Support for local farmers and eco-friendly practices",
                                    "Digital tools for farm management"
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        className="flex items-start p-3 bg-green-50 rounded-lg"
                                        variants={fadeIn}
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <svg className="w-5 h-5 text-green-600 mt-0.5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span className="text-gray-700">{item}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            className="mb-12 p-6 bg-gradient-to-r from-green-600 to-green-700 rounded-xl text-white"
                            variants={fadeIn}
                        >
                            <h2 className="text-2xl font-bold mb-4 flex items-center">
                                <svg className="w-6 h-6 text-green-200 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Where We Are
                            </h2>
                            <p className="text-green-100 leading-7">
                                Headquartered in India, we serve a growing community of farmers, agri-entrepreneurs, and rural customers across the country. Whether you're in a city or a remote village, GreenFields is just a click away.
                            </p>
                        </motion.div>

                        <motion.div
                            className="text-center py-8 border-t border-green-100"
                            variants={fadeIn}
                        >
                            <h3 className="text-2xl font-bold text-green-700 mb-4">Join us on this journey 🌾</h3>
                            <p className="text-gray-600 max-w-2xl mx-auto leading-7">
                                Thank you for being a part of GreenFields. Together, we can grow smarter, live healthier, and support a greener planet.
                            </p>
                            <motion.button
                                className="mt-6 px-8 py-3 bg-green-600 text-white font-medium rounded-full hover:bg-green-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Connect With Us
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </Layout>

    );
}



export default About;