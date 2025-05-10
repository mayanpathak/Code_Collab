import React, { useContext, useState, useEffect } from 'react';
import { UserContext } from '../context/user.context';
import axios from "../config/axios";
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiUser, FiFolder, FiX, FiLogOut } from 'react-icons/fi';

const Home = () => {
    const { user, clearUser } = useContext(UserContext);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectName, setProjectName] = useState("");
    const [projects, setProjects] = useState([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const navigate = useNavigate();

    const colors = [
        "bg-indigo-600", "bg-purple-600", "bg-pink-600", 
        "bg-blue-600", "bg-emerald-600", "bg-amber-600"
    ];

    // Handle logout
    const handleLogout = async () => {
        try {
            await axios.get('/users/logout');
            clearUser();
            navigate('/');
        } catch (error) {
            console.error('Logout error:', error);
            // Even if the server request fails, proceed with logout on client
            clearUser();
            navigate('/');
        }
    };

    function createProject(e) {
        e.preventDefault();
        
        if (!projectName.trim()) {
            setError("Project name cannot be empty");
            return;
        }

        axios.post('/projects/create', {
            name: projectName,
        })
            .then((res) => {
                setIsModalOpen(false);
                setProjectName("");
                // Refresh project list
                fetchProjects();
            })
            .catch((error) => {
                setError(error.response?.data?.error || error.response?.data || "Failed to create project");
            });
    }

    const fetchProjects = () => {
        setIsLoading(true);
        axios.get('/projects/all')
            .then((res) => {
                setProjects(res.data.projects);
                setIsLoading(false);
            })
            .catch(err => {
                console.log(err);
                setIsLoading(false);
            });
    }

    useEffect(() => {
        fetchProjects();
    }, []);

    // Get initials for the avatar
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    // Get a random color from our palette
    const getRandomColor = (id) => {
        const index = id.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { type: "spring", damping: 25, stiffness: 500 }
        },
        exit: { 
            opacity: 0, 
            scale: 0.8,
            transition: { duration: 0.2 } 
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                <div className="flex justify-between items-center mb-10">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-3xl font-bold text-slate-800"
                    >
                        Your Projects
                    </motion.h1>
                    
                    <div className="flex items-center gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg transition-all duration-200"
                        >
                            <FiLogOut className="text-lg" />
                            <span>Logout</span>
                        </motion.button>
                        
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setIsModalOpen(true);
                                setError("");
                            }}
                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-200"
                        >
                            <FiPlus className="text-lg" />
                            <span>New Project</span>
                        </motion.button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-10 h-10 border-4 border-indigo-300 border-t-indigo-600 rounded-full"
                        />
                    </div>
                ) : projects.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-white rounded-xl shadow-xl p-10 text-center"
                    >
                        <img 
                            src="/api/placeholder/300/200" 
                            alt="No projects" 
                            className="mx-auto mb-6 opacity-70"
                        />
                        <h2 className="text-2xl font-semibold text-slate-700 mb-2">No projects yet</h2>
                        <p className="text-slate-500 mb-6">Create your first project to get started with collaboration</p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                setIsModalOpen(true);
                                setError("");
                            }}
                            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg shadow-md transition-all duration-200"
                        >
                            <FiPlus className="text-lg" />
                            <span>Create Project</span>
                        </motion.button>
                    </motion.div>
                ) : (
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.03, y: -5 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => {
                                setIsModalOpen(true);
                                setError("");
                            }}
                            className="bg-white flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 p-8 cursor-pointer h-64 shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <motion.div 
                                whileHover={{ rotate: 90 }}
                                transition={{ duration: 0.2 }}
                                className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-4"
                            >
                                <FiPlus className="text-indigo-600 text-2xl" />
                            </motion.div>
                            <h3 className="text-lg font-medium text-slate-700">New Project</h3>
                            <p className="text-sm text-slate-500 mt-2 text-center">Create a new collaboration space</p>
                        </motion.div>

                        {projects.map((project, index) => (
                            <motion.div 
                                key={project._id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.03, y: -5 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    navigate(`/project`, {
                                        state: { project }
                                    });
                                }}
                                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-200 cursor-pointer h-64 flex flex-col"
                            >
                                <div className={`h-28 ${getRandomColor(project._id)} p-6 relative`}>
                                    <FiFolder className="text-white/20 text-8xl absolute -right-4 -top-4 transform rotate-12" />
                                    <h2 className="text-xl font-bold text-white relative">
                                        {project.name}
                                    </h2>
                                    <p className="text-xs text-white/80 mt-2 relative">
                                        Created {new Date(project.createdAt || Date.now()).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="p-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <div className="flex items-center text-slate-600 mb-2">
                                            <FiUser className="mr-2 text-slate-400" />
                                            <span className="text-sm">{project.users.length} Collaborators</span>
                                        </div>
                                    </div>
                                    <div className="flex -space-x-2 overflow-hidden mt-4">
                                        {project.users.slice(0, 3).map((userId, i) => (
                                            <div 
                                                key={i} 
                                                className={`${colors[i % colors.length]} w-8 h-8 rounded-full flex items-center justify-center text-xs text-white font-medium ring-2 ring-white`}
                                            >
                                                {getInitials(userId.substring(0, 6))}
                                            </div>
                                        ))}
                                        {project.users.length > 3 && (
                                            <div className="bg-slate-200 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ring-2 ring-white">
                                                +{project.users.length - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </motion.div>

            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                                <h2 className="text-xl font-bold">Create New Project</h2>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-white/80 hover:text-white"
                                >
                                    <FiX className="text-xl" />
                                </button>
                            </div>
                            
                            <div className="p-6">
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded-md"
                                    >
                                        {error}
                                    </motion.div>
                                )}
                                
                                <form onSubmit={createProject} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Project Name</label>
                                        <input
                                            onChange={(e) => setProjectName(e.target.value)}
                                            value={projectName}
                                            type="text" 
                                            placeholder="Enter project name" 
                                            className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all" 
                                            required 
                                        />
                                    </div>
                                    
                                    <div className="flex justify-end gap-3 pt-2">
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="button" 
                                            className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors" 
                                            onClick={() => setIsModalOpen(false)}
                                        >
                                            Cancel
                                        </motion.button>
                                        <motion.button 
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit" 
                                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition-colors"
                                        >
                                            Create Project
                                        </motion.button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
};

export default Home;