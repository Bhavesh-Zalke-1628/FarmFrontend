import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CgProfile } from 'react-icons/cg';

function Header() {
    const { isLoggedIn, data } = useSelector((state) => state?.auth);

    const [prevScrollPos, setPrevScrollPos] = useState(window.scrollY);
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollPos = window.scrollY;
            setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
            setPrevScrollPos(currentScrollPos);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [prevScrollPos]);

    return (
        <nav className={`bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 
            transition-transform duration-300 ${visible ? "translate-y-0" : "-translate-y-full"}`}>

            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">

                {/* ✅ Fixed: Changed <a> to <Link> */}
                <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                        Farm++
                    </span>
                </Link>

                {
                    !isLoggedIn ? (
                        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                            <Link to='/signup'>
                                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 
                                    font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 
                                    dark:focus:ring-blue-800">
                                    Sign Up
                                </button>
                            </Link>

                            <Link to='/signin'>
                                <button className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 ml-4 focus:outline-none 
                                    focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 
                                    dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    Sign In
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                            <Link to='/profile'>
                                <button className="text-white capitalize bg-blue-700 hover:bg-blue-800 focus:ring-4 ml-4 focus:outline-none 
                                    focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 
                                    dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                    {
                                        data?.fullName ?
                                            data?.fullName.charAt(0) :
                                            <CgProfile className='object-contain w-full h-full' />
                                    }
                                </button>
                            </Link>
                        </div>
                    )
                }

                <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
                    <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 
                        md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 
                        md:dark:bg-gray-900 dark:border-gray-700">
                        {['Home', 'About', 'Services', 'Contact'].map((item, index) => (
                            <li key={index}>
                                <a href="#" className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 
                                    md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white 
                                    dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent 
                                    dark:border-gray-700">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Header;
