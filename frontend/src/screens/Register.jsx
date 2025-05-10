import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { setUser, clearUser } = useContext(UserContext);
    const navigate = useNavigate();

    function submitHandler(e) {
        e.preventDefault();
        setError(''); // Clear any previous errors
        clearUser(); // Clear any existing user data

        axios.post('/users/register', {
            email,
            password
        }).then((res) => {
            if (res.data.user) {
                // No need to manually save token - server sets it as an HTTP-only cookie
                setUser(res.data.user);
                navigate('/home');
            } else {
                throw new Error('Invalid response from server');
            }
        }).catch((err) => {
            if (err.response?.data?.error?.includes('duplicate key')) {
                setError('Email already exists. Please use a different email or login.');
            } else {
                setError(err.response?.data?.error || 'Registration failed. Please try again.');
            }
            clearUser(); // Clear user data on error
        });
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.2,
                duration: 0.5
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-violet-800 p-4">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute top-1/2 right-1/4 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            </div>

            <motion.div 
                className="bg-gray-900/90 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-md z-10 border border-gray-800/50"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div 
                    className="flex items-center justify-center mb-6"
                    variants={itemVariants}
                >
                    <div className="p-3 bg-indigo-600 rounded-xl">
                        <UserPlus size={30} className="text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white ml-3">Sign Up</h2>
                </motion.div>

                <motion.p 
                    className="text-gray-400 text-center mb-6"
                    variants={itemVariants}
                >
                    Create an account to get started
                </motion.p>

                {error && (
                    <motion.div 
                        className="mb-6 p-4 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg flex items-center"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <AlertCircle className="mr-2 flex-shrink-0" size={18} />
                        <span>{error}</span>
                    </motion.div>
                )}

                <form onSubmit={submitHandler}>
                    <motion.div className="mb-5" variants={itemVariants}>
                        <label className="block text-indigo-300 mb-2 font-medium" htmlFor="email">Email</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Mail size={18} />
                            </span>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="email"
                            id="email"
                                className="w-full p-3 pl-10 rounded-lg bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                placeholder="your.email@example.com"
                                required
                        />
                    </div>
                    </motion.div>

                    <motion.div className="mb-6" variants={itemVariants}>
                        <label className="block text-indigo-300 mb-2 font-medium" htmlFor="password">Password</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <Lock size={18} />
                            </span>
                        <input
                                onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            id="password"
                                className="w-full p-3 pl-10 rounded-lg bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                placeholder="••••••••••••"
                                required
                        />
                    </div>
                    </motion.div>

                    <motion.button
                        type="submit"
                        className="w-full p-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30"
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                    >
                        Create Account
                    </motion.button>
                </form>

                <motion.div 
                    className="mt-8 border-t border-gray-800 pt-6 text-center"
                    variants={itemVariants}
                >
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <motion.span
                            whileHover={{ color: '#a5b4fc' }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                                Sign in
                            </Link>
                        </motion.span>
                    </p>
                </motion.div>

                <motion.div 
                    className="mt-8 flex justify-center space-x-4"
                    variants={itemVariants}
                >
                    <motion.div 
                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 cursor-pointer"
                        whileHover={{ scale: 1.1, backgroundColor: '#1f2937' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                        </svg>
                    </motion.div>
                    <motion.div 
                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 cursor-pointer"
                        whileHover={{ scale: 1.1, backgroundColor: '#1f2937' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                        </svg>
                    </motion.div>
                    <motion.div 
                        className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center border border-gray-700 cursor-pointer"
                        whileHover={{ scale: 1.1, backgroundColor: '#1f2937' }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Register;