import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code, MessageSquare, Users, Lock, FolderPlus, UserPlus, Zap, Moon, Sun, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../context/user.context';
import axios from '../config/axios';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedTheme === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    
    setIsVisible(true);
  }, []);

  // Toggle theme function
  const toggleTheme = () => {
    if (isDarkMode) {
      // Switch to light mode
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      // Switch to dark mode
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };

  const slideUp = {
    hidden: { y: 60, opacity: 0 },
    visible: i => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const slideRight = {
    hidden: { x: -60, opacity: 0 },
    visible: i => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const featureCards = [
    {
      icon: <Code size={32} />,
      title: "AI-Assisted Coding",
      description: "Get intelligent code suggestions and automate repetitive tasks with AI assistance."
    },
    {
      icon: <MessageSquare size={32} />,
      title: "Real-time Chat",
      description: "Communicate instantly with team members through Redis-powered real-time messaging."
    },
    {
      icon: <Users size={32} />,
      title: "Smooth Collaboration",
      description: "Work together seamlessly on shared projects with intuitive collaboration tools."
    },
    {
      icon: <Lock size={32} />,
      title: "Secure Authentication",
      description: "Keep your projects safe with our robust authentication system."
    },
    {
      icon: <FolderPlus size={32} />,
      title: "Project Management",
      description: "Create and manage multiple projects with powerful organization tools."
    },
    {
      icon: <UserPlus size={32} />,
      title: "Easy Team Building",
      description: "Invite collaborators with a simple link and assign custom permissions."
    },
    {
      icon: <Zap size={32} />,
      title: "Modern Architecture",
      description: "Enjoy lightning-fast performance with our optimized full-stack architecture."
    }
  ];

  const techStack = [
    { name: "React.js", color: "#61DAFB" },
    { name: "Node.js", color: "#68A063" },
    { name: "Redis", color: "#DC382D" },
    { name: "MongoDB", color: "#13AA52" },
    { name: "Framer Motion", color: "#0055FF" },
    { name: "Express.js", color: "#000000" }
  ];

  const howItWorks = [
    {
      title: "Sign Up",
      description: "Create your account in seconds and set up your developer profile.",
      color: "from-gray-700 to-gray-900"
    },
    {
      title: "Create Project",
      description: "Start a new project with our intuitive project creation wizard.",
      color: "from-gray-600 to-gray-800"
    },
    {
      title: "Invite Team",
      description: "Add collaborators and assign roles with custom permissions.",
      color: "from-gray-500 to-gray-700"
    },
    {
      title: "Code & Collaborate",
      description: "Work together in real-time with AI assistance and instant feedback.",
      color: "from-gray-400 to-gray-600"
    }
  ];

  // Handle logout
  const handleLogout = async () => {
    try {
      await axios.get('/users/logout');
      clearUser();
      // No need to navigate since we're already on the landing page
    } catch (error) {
      console.error('Logout error:', error);
      // Even if the server request fails, proceed with logout on client
      clearUser();
    }
  };

  return (
    <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} transition-colors duration-300`}>
      {/* Header/Navbar */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`fixed w-full px-6 py-4 flex justify-between items-center z-50 shadow-sm ${isDarkMode ? 'bg-gray-800 bg-opacity-80 backdrop-blur-md' : 'bg-white bg-opacity-80 backdrop-blur-md'} transition-colors duration-300`}
      >
        <motion.div 
          className={`font-bold text-2xl flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Code className="mr-2" />
          CodeCollab
        </motion.div>
        <div className="flex gap-4 items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300' : 'bg-gray-100 text-gray-700'} transition-colors duration-300`}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>
          
          {user ? (
            <div className="flex gap-3">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/home')}
                className={`px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-black text-white'}`}
              >
                My Projects
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className={`px-6 py-2 rounded-lg transition-all flex items-center gap-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                <LogOut size={16} />
                Logout
              </motion.button>
            </div>
          ) : (
            <>
              <Link to="/login">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg transition-all ${isDarkMode ? 'text-white border border-gray-600 hover:bg-gray-700' : 'text-gray-700 border border-gray-300 hover:bg-gray-50'}`}
                >
                  Login
                </motion.button>
              </Link>
              <Link to="/register">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-black text-white'}`}
                >
                  Sign Up
                </motion.button>
              </Link>
            </>
          )}
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        className="pt-32 pb-20 px-6 md:px-12 lg:px-24 flex flex-col md:flex-row items-center justify-between"
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        variants={fadeIn}
      >
        <motion.div 
          className="w-full md:w-1/2 mb-12 md:mb-0"
          variants={slideRight}
          custom={0}
        >
          <motion.h1 
            className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            variants={slideRight}
            custom={1}
          >
            Collaborate on Code <br />
            <span className={`bg-clip-text text-transparent ${isDarkMode ? 'bg-gradient-to-r from-blue-400 to-purple-500' : 'bg-gradient-to-r from-gray-700 to-gray-900'}`}>With AI Superpowers</span>
          </motion.h1>
          <motion.p 
            className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            variants={slideRight}
            custom={2}
          >
            Build, share, and collaborate on projects in real-time with powerful AI assistance.
          </motion.p>
          <motion.div 
            className="flex gap-4"
            variants={slideRight}
            custom={3}
          >
            {user ? (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/home')}
                className={`px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-lg font-medium ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-black text-white'}`}
              >
                Go to My Projects
              </motion.button>
            ) : (
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all text-lg font-medium ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-black text-white'}`}
              >
                Get Started Free
              </motion.button>
            )}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-6 py-3 rounded-lg transition-all text-lg font-medium ${isDarkMode ? 'border border-gray-600 text-gray-300 hover:bg-gray-800' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              See Demo
            </motion.button>
          </motion.div>
        </motion.div>
        <motion.div 
          className="w-full md:w-1/2"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
        >
          <div className="relative">
            <div className="w-full h-96 rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-gray-100 to-gray-300">
              <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 rounded-2xl p-6">
                <div className="h-6 w-full flex gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex h-5/6">
                  <div className="w-1/4 bg-gray-900 h-full rounded-l-lg p-4">
                    <div className="bg-gray-800 h-8 w-full rounded-md mb-3"></div>
                    <div className="bg-gray-800 h-8 w-full rounded-md mb-3"></div>
                    <div className="bg-gray-800 h-8 w-full rounded-md"></div>
                  </div>
                  <div className="w-2/4 bg-gray-800 h-full p-4">
                    <div className="flex mb-2">
                      <div className="bg-blue-500 h-3 w-12 rounded mr-2"></div>
                      <div className="bg-purple-500 h-3 w-16 rounded mr-2"></div>
                      <div className="bg-green-500 h-3 w-10 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-700 w-full rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 w-5/6 rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 w-4/6 rounded mb-4"></div>
                    <div className="flex mb-2">
                      <div className="bg-yellow-500 h-3 w-14 rounded mr-2"></div>
                      <div className="bg-red-500 h-3 w-10 rounded"></div>
                    </div>
                    <div className="h-4 bg-gray-700 w-full rounded mb-2"></div>
                    <div className="h-4 bg-gray-700 w-3/6 rounded"></div>
                  </div>
                  <div className="w-1/4 bg-gray-700 h-full rounded-r-lg p-4">
                    <div className="bg-gray-600 h-full w-full rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
            <motion.div 
              className={`absolute -bottom-4 -right-4 p-4 rounded-xl shadow-lg ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-yellow-500" />
                <span className="text-sm font-medium">AI suggestions active</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.section>

      {/* Feature Highlights */}
      <section className={`py-20 px-6 md:px-12 lg:px-24 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}>
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Everything You Need to Build & Collaborate
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Powerful features designed to streamline your development workflow and enhance team productivity.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featureCards.map((feature, index) => (
            <motion.div
              key={index}
              className={`rounded-xl p-6 shadow-md hover:shadow-xl transition-all ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <motion.div 
                className={`rounded-full w-16 h-16 flex items-center justify-center mb-6 ${isDarkMode ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700'}`}
                whileHover={{ 
                  scale: 1.1, 
                  boxShadow: "0px 0px 8px rgba(0,0,0,0.2)",
                  backgroundColor: isDarkMode ? "#4B5563" : "#f7f7f7" 
                }}
              >
                {feature.icon}
              </motion.div>
              <h3 className={`text-xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>{feature.title}</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className={`py-20 px-6 md:px-12 lg:px-24 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300`}>
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            How It Works
          </h2>
          <p className={`text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Get started in minutes and transform your development workflow.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {howItWorks.map((step, index) => (
            <motion.div
              key={index}
              className={`rounded-xl overflow-hidden shadow-lg bg-gradient-to-br ${step.color} text-white p-6 relative`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              whileHover={{ y: -10, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
            >
              <div className="text-5xl font-bold opacity-10 absolute top-4 right-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-100">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Testimonial/CTA Section */}
      <motion.section 
        className={`py-20 px-6 md:px-12 lg:px-24 text-white text-center ${isDarkMode ? 'bg-black' : 'bg-gradient-to-br from-gray-900 to-black'}`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Development Workflow?</h2>
          <p className="text-xl mb-8 text-gray-300">
            Join thousands of developers who are building better software, faster.
          </p>
          {user ? (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/home')}
              className={`px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg font-medium ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'}`}
            >
              Go to My Projects
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-lg shadow-lg hover:shadow-xl transition-all text-lg font-medium ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-white text-gray-900'}`}
            >
              Start Building For Free
            </motion.button>
          )}
        </motion.div>
      </motion.section>

      {/* Tech Stack */}
      <section className={`py-16 px-6 md:px-12 lg:px-24 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}>
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-700'}`}>Powered By Modern Technology</h3>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>Our platform is built with the latest and greatest tech stack</p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-6">
          {techStack.map((tech, index) => (
            <motion.div
              key={index}
              className={`px-6 py-4 rounded-lg shadow-sm flex items-center ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}
            >
              <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: tech.color }}></div>
              <span className="font-medium">{tech.name}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-6 md:px-12 lg:px-24 border-t ${isDarkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'} transition-colors duration-300`}>
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div 
            className={`font-bold text-xl flex items-center mb-6 md:mb-0 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
            whileHover={{ scale: 1.05 }}
          >
            <Code className="mr-2" />
            CodeCollab
          </motion.div>
            
          <div className={`flex gap-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            <motion.a href="#" whileHover={{ scale: 1.1 }} className={isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}>About</motion.a>
            <motion.a href="#" whileHover={{ scale: 1.1 }} className={isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}>Features</motion.a>
            <motion.a href="#" whileHover={{ scale: 1.1 }} className={isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}>Pricing</motion.a>
            <motion.a href="#" whileHover={{ scale: 1.1 }} className={isDarkMode ? 'hover:text-white' : 'hover:text-gray-900'}>Contact</motion.a>
          </div>
        </div>
        <div className={`mt-8 pt-8 border-t text-center text-sm ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-100 text-gray-500'}`}>
          © {new Date().getFullYear()} CodeCollab. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;






// import React, { useState, useEffect, useRef } from 'react';
// import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion';
// import { Code, MessageSquare, Users, Lock, FolderPlus, UserPlus, Zap, Moon, Sun, LogOut, ArrowRight, TrendingUp, CheckCircle, Palette } from 'lucide-react';

// // Helper for reduced motion
// const useReducedMotion = () => {
//   const [reducedMotion, setReducedMotion] = useState(false);
//   useEffect(() => {
//     const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
//     setReducedMotion(mediaQuery.matches);
//     const handleChange = () => setReducedMotion(mediaQuery.matches);
//     mediaQuery.addEventListener('change', handleChange);
//     return () => mediaQuery.removeEventListener('change', handleChange);
//   }, []);
//   return reducedMotion;
// };


// const LandingPage = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [user, setUser] = useState(null); // Mock user state, set to an object to simulate logged in user
//   const reducedMotion = useReducedMotion();

//   const { scrollYProgress } = useScroll();

//   // Scroll Progress Indicator
//   const scaleX = useSpring(scrollYProgress, {
//     stiffness: 100,
//     damping: 30,
//     restDelta: 0.001
//   });

//   // Navbar animation
//   const navBgOpacity = useTransform(scrollYProgress, [0, 0.05, 0.1], [0, 0.5, 1]);
//   const navBlur = useTransform(scrollYProgress, [0, 0.05, 0.1], [0, 4, 8]); // For glassmorphism

//   // Parallax for Hero
//   const heroTextY = useTransform(scrollYProgress, [0, 0.15], [0, reducedMotion ? 0 : -50]);
//   const heroImageY = useTransform(scrollYProgress, [0, 0.15], [0, reducedMotion ? 0 : -20]);
//   const heroBgScale = useTransform(scrollYProgress, [0, 0.2], [1, reducedMotion ? 1 : 1.1]);


//   useEffect(() => {
//     const savedTheme = localStorage.getItem('theme');
//     const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
//     if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
//       setIsDarkMode(true);
//       document.documentElement.classList.add('dark');
//     } else {
//       setIsDarkMode(false);
//       document.documentElement.classList.remove('dark');
//     }
//     setIsVisible(true);

//     // Example: Mock user login after 2 seconds
//     // setTimeout(() => setUser({ name: "Demo User" }), 2000);
//   }, []);

//   const toggleTheme = () => {
//     setIsDarkMode(prevMode => {
//       const newMode = !prevMode;
//       if (newMode) {
//         document.documentElement.classList.add('dark');
//         localStorage.setItem('theme', 'dark');
//       } else {
//         document.documentElement.classList.remove('dark');
//         localStorage.setItem('theme', 'light');
//       }
//       return newMode;
//     });
//   };
  
//   const navigate = (path) => console.log(`Navigating to ${path}`); // Mock navigation
//   const handleLogout = () => setUser(null); // Mock logout


//   const heroTitle = "Collaborate on Code";
//   const heroSubtitle = "With AI Superpowers";

//   // Animation Variants
//   const fadeIn = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { duration: reducedMotion ? 0 : 0.6 } }
//   };

//   const slideUp = {
//     hidden: { y: reducedMotion ? 0 : 60, opacity: 0 },
//     visible: i => ({
//       y: 0,
//       opacity: 1,
//       transition: {
//         delay: i * (reducedMotion ? 0 : 0.1),
//         duration: reducedMotion ? 0 : 0.6,
//         ease: "easeOut"
//       }
//     })
//   };
  
//   const staggerChildren = {
//     visible: { transition: { staggerChildren: reducedMotion ? 0 : 0.07 } },
//     hidden: {}
//   };

//   const letterAnimation = {
//     hidden: { opacity: 0, y: reducedMotion ? 0 : 20 },
//     visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.4, ease: "easeOut" } }
//   };
  
//   const buttonAnimation = {
//     rest: { scale: 1 },
//     hover: { scale: reducedMotion ? 1 : 1.05, transition: { type: "spring", stiffness: 400, damping: 10 } },
//     tap: { scale: reducedMotion ? 1 : 0.95, transition: { type: "spring", stiffness: 500, damping: 15 } }
//   };

//   // Data for sections
//   const featureCards = [
//     { icon: <Code size={28} />, title: "AI-Assisted Coding", description: "Intelligent suggestions and task automation." },
//     { icon: <MessageSquare size={28} />, title: "Real-time Chat", description: "Instant Redis-powered team communication." },
//     { icon: <Users size={28} />, title: "Smooth Collaboration", description: "Seamless shared projects and tools." },
//     { icon: <Lock size={28} />, title: "Secure Authentication", description: "Robust project and data protection." },
//     { icon: <FolderPlus size={28} />, title: "Project Management", description: "Organize multiple projects efficiently." },
//     { icon: <UserPlus size={28} />, title: "Easy Team Building", description: "Simple collaborator invites and permissions." },
//   ];

//   const howItWorks = [
//     { title: "Sign Up", description: "Quick account creation and profile setup.", color: "from-sky-500 to-blue-600", icon: <UserPlus/> },
//     { title: "Create Project", description: "Intuitive wizard to start new projects.", color: "from-blue-500 to-indigo-600", icon: <FolderPlus/> },
//     { title: "Invite Team", description: "Add collaborators with custom roles.", color: "from-indigo-500 to-purple-600", icon: <Users/> },
//     { title: "Code & Collaborate", description: "Real-time work with AI assistance.", color: "from-purple-500 to-pink-600", icon: <Code/> }
//   ];

//   const techStack = [
//     { name: "React.js", color: "#61DAFB", icon: <Palette/> }, { name: "Node.js", color: "#68A063", icon: <Zap/> },
//     { name: "Redis", color: "#DC382D", icon: <TrendingUp/> }, { name: "MongoDB", color: "#13AA52", icon: <FolderPlus/> },
//     { name: "Framer Motion", color: "#0055FF", icon: <motion.svg/> }, { name: "Express.js", color: isDarkMode ? "#AAA" : "#000000", icon: <Code/> }
//   ];

//   const navLinks = ["Features", "How It Works", "Pricing", "Contact"];
//   const [activeLink, setActiveLink] = useState(0);


//   // Animated Code Editor Component
//   const AnimatedCodeEditor = () => {
//     const lines = Array.from({ length: 5 }); // Placeholder for dynamic lines
//     const cursors = [ // Paths for collaborative cursors
//       { id: 1, color: 'bg-pink-500', path: ["M2 2 L2 18", "M2 10 L2 2", "M2 5 L2 15"] },
//       { id: 2, color: 'bg-teal-500', path: ["M5 15 L5 3", "M5 8 L5 18", "M5 12 L5 5"] },
//     ];
//     const [typingText, setTypingText] = useState("");
//     const fullText = `function greet() {\n  console.log("Hello, CodeCollab!");\n}`;

//     useEffect(() => {
//       if (reducedMotion) {
//         setTypingText(fullText);
//         return;
//       }
//       let i = 0;
//       const intervalId = setInterval(() => {
//         setTypingText(fullText.substring(0, i));
//         i++;
//         if (i > fullText.length) clearInterval(intervalId);
//       }, 70);
//       return () => clearInterval(intervalId);
//     }, [reducedMotion]); // Added reducedMotion to dependency array


//     return (
//         // Root of AnimatedCodeEditor - No 'style' prop here that could conflict.
//         <motion.div
//             className="w-full h-72 md:h-96 rounded-xl shadow-2xl p-4 overflow-hidden relative bg-gray-800 dark:bg-black border border-gray-700 dark:border-gray-600"
//             initial={{ opacity: 0, scale: 0.9 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ duration: 0.7, delay: reducedMotion ? 0 : 0.3 }}
//         >
//             {/* Editor Header (traffic lights) */}
//             <div className="flex items-center mb-3">
//                 <div className="w-3 h-3 rounded-full bg-red-500 mr-1.5"></div>
//                 <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5"></div>
//                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
//             </div>

//             {/* Code Area with typing effect */}
//             <pre className="text-xs sm:text-sm text-gray-300 dark:text-gray-400 whitespace-pre-wrap">
//                 {typingText.split("\n").map((line, i) => (
//                     <motion.div
//                         key={i}
//                         initial={{ opacity: 0 }}
//                         animate={{ opacity: 1 }}
//                         transition={{ delay: (reducedMotion ? 0 : 0.5) + i * 0.1 }}
//                     >
//                         <span className="text-gray-500 dark:text-gray-600 mr-2 select-none">{i + 1}</span>{line}
//                     </motion.div>
//                 ))}
//             </pre>

//             {/* Floating AI Suggestion Bubble */}
//             {!reducedMotion && (
//             <AnimatePresence>
//                 {typingText.length > 10 && ( // Show suggestion after some text is typed
//                     <motion.div
//                         layout // Enables smooth animation when appearing/disappearing
//                         initial={{ opacity: 0, y: 10, scale: 0.8 }}
//                         animate={{ opacity: 1, y: 0, scale: 1 }}
//                         exit={{ opacity: 0, y: -10, scale: 0.8 }}
//                         transition={{ type: 'spring', stiffness: 300, damping: 20, delay:0.5}}
//                         className="absolute bottom-4 right-4 bg-blue-500 dark:bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg flex items-center"
//                     >
//                         <Zap size={14} className="mr-1.5" /> AI Suggestion: Complete function...
//                     </motion.div>
//                 )}
//             </AnimatePresence>
//             )}

//             {/* Collaborative Cursors */}
//             {!reducedMotion && cursors.map(cursor => (
//                 <motion.div
//                     key={cursor.id}
//                     className={`absolute w-0.5 h-4 ${cursor.color} rounded-sm opacity-70`}
//                     style={{ top: 20 + cursor.id * 20, left: 30 }} // Initial position
//                     animate={{ // Animate x and y for smooth movement. Paths can be complex.
//                         x: [0, 50, 20, 70, 30, 100, 0], // Example x coordinates
//                         y: [0, 10, 5, 20, 15, 25, 0],   // Example y coordinates
//                     }}
//                     transition={{
//                         duration: 15 + cursor.id * 5, // Vary duration for each cursor
//                         repeat: Infinity,
//                         repeatType: "mirror", // Move back and forth
//                         ease: "easeInOut"
//                     }}
//                 />
//             ))}
//         </motion.div>
//     );
// };


//   // Main Return for LandingPage component
//   return (
//     <div className={`min-h-screen font-sans ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-800'} transition-colors duration-300 overflow-x-hidden`}>
//       {/* Scroll Progress Bar */}
//       <motion.div
//         className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-sky-400 dark:to-indigo-500 z-[100]"
//         style={{ scaleX, transformOrigin: '0%' }} // Single style prop
//       />
      
//       {/* Header/Navbar */}
//       <motion.header
//         // Single style prop for header background/blur
//         style={{
//             backdropFilter: `blur(${navBlur.get()}px)`,
//             WebkitBackdropFilter: `blur(${navBlur.get()}px)`, // For Safari
//             backgroundColor: isDarkMode ? `rgba(17, 24, 39, ${navBgOpacity.get()})` : `rgba(255, 255, 255, ${navBgOpacity.get()})`,
//         }}
//         className="fixed w-full px-4 sm:px-6 py-3 flex justify-between items-center z-50 shadow-sm transition-colors duration-300"
//         initial={{ y: reducedMotion ? 0 : -100 }}
//         animate={{ y: 0 }}
//         transition={{ duration: reducedMotion ? 0 : 0.5, ease: "easeOut" }}
//       >
//         {/* Logo */}
//         <motion.div
//           className={`font-bold text-xl sm:text-2xl flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
//           whileHover={{ scale: reducedMotion ? 1 : 1.05 }}
//           transition={{ type: "spring", stiffness: 400, damping: 10 }}
//         >
//           <Code className="mr-2 text-blue-500 dark:text-sky-400" />
//           CodeCollab
//         </motion.div>
        
//         {/* Navigation Links */}
//         <nav className="hidden md:flex gap-1 items-center relative">
//           {navLinks.map((link, index) => (
//             <motion.a
//               key={link}
//               href={`#${link.toLowerCase().replace(/\s+/g, '-')}`} // Create valid href
//               onClick={() => setActiveLink(index)}
//               className={`px-3 py-2 rounded-md text-sm font-medium relative ${
//                 activeLink === index 
//                 ? (isDarkMode ? 'text-sky-300' : 'text-blue-600')
//                 : (isDarkMode ? 'text-gray-300 hover:text-sky-300' : 'text-gray-600 hover:text-blue-600')
//               }`}
//               whileHover={{ y: reducedMotion ? 0 : -2 }}
//             >
//               {link}
//               {activeLink === index && ( // Underline for active link
//                 <motion.div
//                   layoutId="underline" // Morphing underline
//                   className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500 dark:bg-sky-400"
//                   transition={{ type: 'spring', stiffness: 350, damping: 30 }}
//                 />
//               )}
//             </motion.a>
//           ))}
//         </nav>

//         {/* Theme Toggle & Auth Buttons */}
//         <div className="flex gap-2 sm:gap-3 items-center">
//           <motion.button
//             whileHover={{ scale: reducedMotion ? 1 : 1.1 }}
//             whileTap={{ scale: reducedMotion ? 1 : 0.9 }}
//             onClick={toggleTheme}
//             className={`p-2 rounded-full ${isDarkMode ? 'bg-gray-700 text-yellow-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} transition-colors duration-300`}
//             aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
//           >
//             <AnimatePresence mode="wait" initial={false}>
//               <motion.div // Sun/Moon icon morph
//                 key={isDarkMode ? "moon" : "sun"}
//                 initial={{ y: reducedMotion ? 0 : -20, opacity: 0, rotate: reducedMotion ? 0 : -90 }}
//                 animate={{ y: 0, opacity: 1, rotate: 0 }}
//                 exit={{ y: reducedMotion ? 0 : 20, opacity: 0, rotate: reducedMotion ? 0 : 90 }}
//                 transition={{ duration: reducedMotion ? 0 : 0.3 }}
//               >
//                 {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
//               </motion.div>
//             </AnimatePresence>
//           </motion.button>
          
//           {user ? ( // If user is logged in
//             <div className="flex gap-2 sm:gap-3">
//               <motion.button
//                 variants={buttonAnimation} whileHover="hover" whileTap="tap"
//                 onClick={() => navigate('/home')}
//                 className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg shadow-md hover:shadow-lg transition-all ${isDarkMode ? 'bg-sky-500 hover:bg-sky-600 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
//               >
//                 Dashboard
//               </motion.button>
//               <motion.button
//                 variants={buttonAnimation} whileHover="hover" whileTap="tap"
//                 onClick={handleLogout}
//                 className={`p-2 rounded-full transition-all flex items-center gap-2 ${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
//                 aria-label="Logout"
//               >
//                 <LogOut size={16} />
//               </motion.button>
//             </div>
//           ) : ( // If user is not logged in
//             <>
//               <motion.button
//                 variants={buttonAnimation} whileHover="hover" whileTap="tap"
//                 onClick={() => navigate('/login')}
//                 className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg transition-all ${isDarkMode ? 'text-gray-300 border border-gray-600 hover:bg-gray-700 hover:text-white' : 'text-gray-700 border border-gray-300 hover:bg-gray-100'}`}
//               >
//                 Login
//               </motion.button>
//               <motion.button
//                 variants={buttonAnimation} whileHover="hover" whileTap="tap"
//                 onClick={() => navigate('/register')}
//                 className={`px-3 sm:px-4 py-1.5 sm:py-2 text-sm rounded-lg shadow-md hover:shadow-lg transition-all relative overflow-hidden group ${isDarkMode ? 'bg-sky-500 text-white' : 'bg-blue-600 text-white'}`}
//               >
//                  <span className="relative z-10">Sign Up</span>
//                  {!reducedMotion && ( // Subtle hover effect
//                  <motion.span 
//                     className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 dark:bg-black"
//                     transition={{duration:0.3}}
//                  />)}
//               </motion.button>
//             </>
//           )}
//         </div>
//       </motion.header>

//       {/* Hero Section */}
//       <motion.section
//         className="pt-28 pb-16 sm:pt-36 sm:pb-24 px-4 sm:px-6 md:px-12 lg:px-24 flex flex-col lg:flex-row items-center justify-between min-h-[calc(100vh-0px)] relative overflow-hidden"
//         initial="hidden"
//         animate={isVisible ? "visible" : "hidden"}
//         variants={fadeIn}
//       >
//         {/* Animated Gradient Background for Hero Section */}
//         {/* THIS IS THE CORRECTED DIV - ensures only ONE style prop */}
//         <motion.div
//             className="absolute inset-0 z-[-1]"
//             animate={{ // For gradient undulation
//                 backgroundPosition: reducedMotion ? ["0% 50%", "0% 50%"] : ["0% 50%", "100% 50%", "0% 50%"],
//             }}
//             transition={{
//                 duration: reducedMotion ? 0 : 20,
//                 ease: "linear",
//                 repeat: Infinity,
//             }}
//             style={{ // Single, consolidated style prop
//                 scale: heroBgScale, // For parallax zoom
//                 backgroundImage: isDarkMode 
//                     ? 'linear-gradient(120deg, #0f172a 0%, #1e293b 50%, #334155 100%)' 
//                     : 'linear-gradient(120deg, #e0f2fe 0%, #bae6fd 50%, #7dd3fc 100%)',
//                 backgroundSize: "200% 200%", // For gradient animation
//             }}
//         />

//         {/* Hero Text Content */}
//         <motion.div
//           className="w-full lg:w-1/2 mb-10 lg:mb-0 text-center lg:text-left"
//           style={{ y: heroTextY }} // Parallax for text
//           variants={staggerChildren} // For staggered character reveal
//         >
//           <motion.h1
//             className={`text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
//             variants={staggerChildren} // Apply stagger to children (spans)
//           >
//             {heroTitle.split("").map((char, index) => (
//               <motion.span key={index} variants={letterAnimation} className="inline-block">
//                 {char === " " ? "\u00A0" : char}
//               </motion.span>
//             ))}
//             <br />
//             <span className={`bg-clip-text text-transparent ${isDarkMode ? 'bg-gradient-to-r from-sky-400 via-blue-500 to-purple-500' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700'}`}>
//               {heroSubtitle.split("").map((char, index) => (
//                 <motion.span key={index} variants={letterAnimation} custom={heroTitle.length + index} className="inline-block">
//                   {char === " " ? "\u00A0" : char}
//                 </motion.span>
//               ))}
//             </span>
//           </motion.h1>
//           <motion.p
//             className={`text-lg sm:text-xl mb-8 max-w-md mx-auto lg:mx-0 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
//             variants={slideUp} custom={heroTitle.length + heroSubtitle.length + 1} 
//           >
//             Build, share, and collaborate on projects in real-time with powerful AI assistance, modern architecture, and seamless teamwork.
//           </motion.p>
//           {/* Hero Action Buttons */}
//           <motion.div
//             className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start"
//             variants={slideUp} custom={heroTitle.length + heroSubtitle.length + 2}
//           >
//             <motion.button
//               variants={buttonAnimation} whileHover="hover" whileTap="tap"
//               onClick={() => user ? navigate('/home') : navigate('/register')}
//               className={`px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all text-base sm:text-lg font-medium group relative overflow-hidden ${isDarkMode ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white' : 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'}`}
//             >
//               <span className="relative z-10">{user ? "Go to Dashboard" : "Get Started Free"}</span>
//               {!reducedMotion && (<motion.div className="absolute inset-0 bg-white dark:bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />)}
//             </motion.button>
//             <motion.button
//               variants={buttonAnimation} whileHover="hover" whileTap="tap"
//               className={`px-6 py-3 rounded-lg transition-all text-base sm:text-lg font-medium group relative overflow-hidden ${isDarkMode ? 'border-2 border-sky-500 text-sky-400 hover:bg-sky-500 hover:text-white' : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'}`}
//             >
//               <span className="relative z-10">See Demo</span>
//               {!reducedMotion && (<motion.div className="absolute inset-0 bg-blue-500 dark:bg-sky-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />)}
//             </motion.button>
//           </motion.div>
//         </motion.div>
//         {/* Hero Image/Code Editor Visualization */}
//         <motion.div className="w-full lg:w-1/2 mt-10 lg:mt-0 px-2 sm:px-0" style={{ y: heroImageY }}> {/* Parallax for image */}
//             <AnimatedCodeEditor />
//         </motion.div>
//       </motion.section>

//       {/* Feature Highlights Section */}
//       <section id="features" className={`py-16 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-24 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} transition-colors duration-300`}>
//         <motion.div
//           className="text-center mb-12 sm:mb-16"
//           initial={{ opacity: 0, y: reducedMotion ? 0 : 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.3 }}
//           transition={{ duration: reducedMotion ? 0 : 0.6 }}
//         >
//           <h2 className={`text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             Everything You Need, All In One Place
//           </h2>
//           <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//             Powerful features designed to streamline your development workflow and enhance team productivity.
//           </p>
//         </motion.div>
        
//         <motion.div 
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
//           variants={staggerChildren} // For staggered card entrance
//           initial="hidden"
//           whileInView="visible"
//           viewport={{ once: true, amount: 0.1 }} // Trigger when 10% of section is visible
//         >
//           {featureCards.map((feature, index) => (
//             <motion.div
//               key={index}
//               className={`rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 ${isDarkMode ? 'bg-gray-700 text-white hover:border-sky-500' : 'bg-white text-gray-800 hover:border-blue-500'} border-2 border-transparent`}
//               variants={{ // Individual card animation
//                 hidden: { opacity: 0, y: reducedMotion ? 0 : 30 },
//                 visible: { opacity: 1, y: 0, transition: { duration: reducedMotion ? 0 : 0.5, delay: index * (reducedMotion ? 0 : 0.1) } }
//               }}
//               whileHover={reducedMotion ? {} : { y: -8, transition: { type: "spring", stiffness: 300, damping: 15 }}} // Gentle lift on hover
//             >
//               <motion.div
//                 layout // For icon morphing if icon changes state
//                 className={`rounded-full w-14 h-14 flex items-center justify-center mb-5 text-white ${isDarkMode ? 'bg-sky-600' : 'bg-blue-600'}`}
//                 whileHover={reducedMotion ? {} : { scale: 1.1, rotate: [0, -10, 10, 0], transition: { rotate: {duration: 0.4}, scale: {duration:0.2} } }} // Icon transformation
//               >
//                 {React.cloneElement(feature.icon, { size: 28 })}
//               </motion.div>
//               <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{feature.title}</h3>
//               <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{feature.description}</p>
//             </motion.div>
//           ))}
//         </motion.div>
//       </section>

//       {/* How It Works Timeline Section */}
//       <section id="how-it-works" className={`py-16 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-24 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} transition-colors duration-300 relative`}>
//         <motion.div
//           className="text-center mb-12 sm:mb-16"
//           initial={{ opacity: 0, y: reducedMotion ? 0 : 30 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.3 }}
//           transition={{ duration: reducedMotion ? 0 : 0.6 }}
//         >
//           <h2 className={`text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
//             Get Started in Minutes
//           </h2>
//           <p className={`text-lg sm:text-xl max-w-3xl mx-auto ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//             Transform your development workflow with a few simple steps.
//           </p>
//         </motion.div>

//         <div className="relative max-w-3xl mx-auto">
//             {/* Connecting Line - visible only on larger screens */}
//             {!reducedMotion && (
//             <motion.svg 
//                 className="absolute top-0 left-1/2 h-full w-1 hidden md:block" 
//                 style={{translateX: '-50%',}} // Center the line
//                 preserveAspectRatio="none" // Allow svg to stretch
//                 viewBox="0 0 1 100" // Define a unit coordinate system
//             >
//                 <motion.line // Animate stroke-dashoffset for drawing effect
//                     x1="0.5" y1="0" x2="0.5" y2="100" // Line from top to bottom
//                     stroke={isDarkMode ? "#38bdf8" : "#3b82f6"} // Sky/Blue color
//                     strokeWidth="2"
//                     initial={{ pathLength: 0 }} // Start with line not drawn
//                     whileInView={{ pathLength: 1 }} // Draw line when in view
//                     viewport={{ once: true, amount: 0.2 }}
//                     transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
//                 />
//             </motion.svg>
//             )}

//             {howItWorks.map((step, index) => (
//                 <motion.div
//                     key={index}
//                     className="mb-8 md:mb-12 flex items-start md:items-center last:mb-0"
//                     initial={{ opacity: 0, x: reducedMotion ? 0 : (index % 2 === 0 ? -50 : 50) }} // Slide in from sides
//                     whileInView={{ opacity: 1, x: 0 }}
//                     viewport={{ once: true, amount: 0.3 }}
//                     transition={{ duration: reducedMotion ? 0 : 0.6, delay: index * (reducedMotion ? 0 : 0.2) }}
//                 >
//                     {/* Step Content Card */}
//                     <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-8 md:text-right' : 'md:pl-8 md:order-2 md:text-left'}`}>
//                         <motion.div 
//                             className={`p-6 rounded-xl shadow-xl text-white bg-gradient-to-br ${step.color} relative overflow-hidden group`}
//                             whileHover={reducedMotion ? {} : { y: -5, transition: { type: "spring", stiffness: 200 }}} // Lift on hover
//                         >
//                             {/* Decorative Icon Background */}
//                             <div 
//                                 className={`absolute -top-3 -left-3 w-16 h-16 ${isDarkMode ? 'text-sky-300' : 'text-blue-300'} opacity-30 group-hover:opacity-50 transition-opacity duration-300`}
//                             >
//                                 {React.cloneElement(step.icon, {size: 64, strokeWidth:1.5})}
//                             </div>
//                             {/* Decorative Element */}
//                             <motion.div 
//                                 className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full ${isDarkMode ? 'bg-sky-400' : 'bg-blue-400'} opacity-30 group-hover:opacity-40 transition-opacity duration-300`}
//                                 animate={reducedMotion ? {} : { scale: [1, 1.2, 1], rotate: [0, 15, 0]}} // Pulse animation
//                                 transition={{ repeat: Infinity, duration: 3, delay: index * 0.5}}
//                             />

//                             <h3 className="text-xl sm:text-2xl font-bold mb-2 relative z-10">{step.title}</h3>
//                             <p className="text-gray-100 text-sm sm:text-base relative z-10">{step.description}</p>
//                         </motion.div>
//                     </div>
//                     {/* Step Number Badge */}
//                     <motion.div 
//                         className={`hidden md:flex w-12 h-12 rounded-full ${step.color} items-center justify-center text-white text-xl font-bold shadow-md order-1 z-10`}
//                         whileHover={reducedMotion ? {} : {scale:1.2}} // Scale on hover
//                         whileInView={reducedMotion ? {} : { scale: [1, 1.3, 1], transition: { duration: 0.5, delay: (index * 0.2) + 0.5, repeat: 2, repeatType: "mirror" }}} // Pulse on view
//                         viewport={{once: true}}
//                     >
//                         {index + 1}
//                     </motion.div>
//                     <div className="md:w-1/2 order-0 md:order-none"> {/* Spacer for alternating layout */} </div>
//                 </motion.div>
//             ))}
//         </div>
//       </section>

//       {/* Tech Stack Display Section */}
//       <section id="tech-stack" className={`py-16 sm:py-20 px-4 sm:px-6 md:px-12 lg:px-24 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} transition-colors duration-300`}>
//         <motion.div
//           className="text-center mb-12 sm:mb-16"
//           initial={{ opacity: 0, y: reducedMotion ? 0 : 20 }}
//           whileInView={{ opacity: 1, y: 0 }}
//           viewport={{ once: true, amount: 0.3 }}
//           transition={{ duration: reducedMotion ? 0 : 0.5 }}
//         >
//           <h3 className={`text-2xl sm:text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>Powered By Modern Technology</h3>
//           <p className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-lg`}>Our platform leverages a robust and scalable tech stack.</p>
//         </motion.div>

//         <div className="relative">
//           <motion.div 
//             className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar justify-center flex-wrap" 
//             drag={reducedMotion ? undefined : "x"} // Enable horizontal drag
//             dragConstraints={{ left: -200, right: 200 }} // Adjust constraints as needed
//             initial="hidden"
//             whileInView="visible"
//             viewport={{ once: true, amount: 0.1 }}
//             variants={staggerChildren} // Staggered entrance for tags
//           >
//             {techStack.map((tech, index) => (
//               <motion.div
//                 key={index}
//                 className={`px-5 py-3 rounded-lg shadow-md flex items-center min-w-max ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-800'} ${!reducedMotion ? 'cursor-grab active:cursor-grabbing' : ''}`}
//                 variants={{ // Individual tag animation
//                     hidden: { opacity: 0, y: reducedMotion ? 0 : 20},
//                     visible: { opacity: 1, y:0, transition: {duration: reducedMotion ? 0 : 0.4, delay: index * (reducedMotion ? 0 : 0.05)} }
//                 }}
//                 whileHover={reducedMotion ? {} : { // Hover effects: lift and colored shadow
//                     y: -5,
//                     boxShadow: `0px 6px 15px ${tech.color}40`, 
//                     transition: { type: 'spring', stiffness:300 }
//                 }}
//                 animate={reducedMotion ? {} : { // Floating/orbital motion
//                   y: [0, Math.sin(index) * 5, 0], 
//                 }}
//                 transition={reducedMotion ? {} : { // Transition for floating
//                   duration: 2 + Math.random() * 2,
//                   repeat: Infinity,
//                   repeatType: "mirror",
//                   ease: "easeInOut",
//                   delay: index * 0.1
//                 }}
//               >
//                 <motion.div className="w-3 h-3 rounded-full mr-2.5" style={{ backgroundColor: tech.color }} 
//                     whileHover={reducedMotion ? {} : { scale: 1.5, transition: {duration: 0.2}}} // Icon scale on hover
//                 />
//                 <span className="font-medium text-sm sm:text-base">{tech.name}</span>
//               </motion.div>
//             ))}
//           </motion.div>
//            {/* Scroll hint for horizontal drag on mobile */}
//            <p className={`text-center text-xs mt-4 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'} md:hidden`}>
//             Drag horizontally to see more technologies.
//           </p>
//         </div>
//       </section>

//       {/* Testimonial/CTA Section */}
//       <section id="pricing" className={`relative py-20 sm:py-28 px-4 sm:px-6 md:px-12 lg:px-24 text-white text-center overflow-hidden ${isDarkMode ? 'bg-black' : 'bg-gray-900'}`}>
//         {/* Animated Gradient Mesh Background (CSS based for performance) */}
//         <motion.div
//             className="absolute inset-0 z-0 opacity-30 dark:opacity-40"
//             animate={reducedMotion ? {} : { // Animate background position for morphing effect
//                 backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
//             }}
//             transition={reducedMotion ? {} : {
//                 duration: 30,
//                 ease: "linear",
//                 repeat: Infinity,
//             }}
//             style={{ // CSS radial gradients for mesh effect
//                 backgroundImage: isDarkMode
//                     ? `radial-gradient(at 20% 30%, hsla(210,80%,50%,0.3) 0px, transparent 50%),
//                        radial-gradient(at 80% 70%, hsla(280,70%,60%,0.3) 0px, transparent 50%),
//                        radial-gradient(at 50% 90%, hsla(180,60%,50%,0.2) 0px, transparent 50%)`
//                     : `radial-gradient(at 20% 30%, hsla(200,70%,60%,0.4) 0px, transparent 50%),
//                        radial-gradient(at 80% 70%, hsla(260,60%,70%,0.4) 0px, transparent 50%),
//                        radial-gradient(at 50% 90%, hsla(160,50%,60%,0.3) 0px, transparent 50%)`,
//                 backgroundSize: "300% 300%", // Larger size for smooth animation
//             }}
//         />
//         <motion.div
//           className="relative z-10 max-w-3xl mx-auto"
//           initial={{ opacity:0, y: reducedMotion ? 0 : 30 }}
//           whileInView={{ opacity:1, y: 0 }}
//           viewport={{ once: true, amount: 0.3 }}
//           transition={{ duration: reducedMotion ? 0 : 0.6 }}
//         >
//           <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">Ready to Revolutionize Your Workflow?</h2>
//           <p className="text-lg sm:text-xl mb-10 text-gray-300 dark:text-gray-200">
//             Join thousands of developers building better software, faster. Experience the future of collaborative coding.
//           </p>
//           {/* CTA Button with floating and pulse animation */}
//           <motion.button
//             onClick={() => user ? navigate('/home') : navigate('/register')}
//             className={`px-8 py-4 rounded-lg shadow-xl hover:shadow-2xl transition-all text-base sm:text-lg font-semibold relative overflow-hidden group ${isDarkMode ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-purple-600 text-white' : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 text-white'}`}
//             animate={reducedMotion ? {} : { // Gentle floating and gradient pulse
//                 y: [0, -5, 0], 
//                 boxShadow: [ // Simulates a pulse effect
//                     `0 0 0 0px ${isDarkMode ? 'rgba(56, 189, 248, 0.4)' : 'rgba(59, 130, 246, 0.4)'}`, 
//                     `0 0 0 10px ${isDarkMode ? 'rgba(56, 189, 248, 0)' : 'rgba(59, 130, 246, 0)'}`,    
//                     `0 0 0 0px ${isDarkMode ? 'rgba(56, 189, 248, 0)' : 'rgba(59, 130, 246, 0)'}`     
//                 ]
//             }}
//             transition={reducedMotion ? {} : {
//                 y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
//                 boxShadow: { duration: 2, repeat: Infinity, ease: "easeOut", delay:0.5 }
//             }}
//             whileHover={reducedMotion ? {} : { scale: 1.05, y: -2, transition: { type:"spring", stiffness:300}}}
//             whileTap={reducedMotion ? {} : { scale: 0.95 }} // Ripple effect on click can be added with more state
//           >
//             <span className="relative z-10">{user ? "Explore Dashboard" : "Start Building For Free"}</span>
//             {!reducedMotion && <motion.div className="absolute inset-0 bg-white dark:bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300" />}
//           </motion.button>
//         </motion.div>
//       </section>

//       {/* Footer */}
//       <footer id="contact" className={`py-12 px-4 sm:px-6 md:px-12 lg:px-24 border-t ${isDarkMode ? 'bg-gray-900 text-white border-gray-700' : 'bg-gray-50 text-gray-900 border-gray-200'} transition-colors duration-300`}>
//         <div className="flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
//           <motion.div
//             className={`font-bold text-xl flex items-center ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
//             whileHover={reducedMotion ? {} : { scale: 1.05 }} // Subtle scale on hover
//           >
//             <Code className="mr-2 text-blue-500 dark:text-sky-400" />
//             CodeCollab
//           </motion.div>
            
//           <div className={`flex flex-wrap justify-center gap-4 sm:gap-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
//             {navLinks.map(link => ( // Footer navigation links
//                  <motion.a 
//                     key={link} 
//                     href={`#${link.toLowerCase().replace(/\s+/g, '-')}`}
//                     whileHover={reducedMotion ? {} : { scale: 1.1, y: -2, color: isDarkMode ? '#38bdf8' : '#2563eb' }} // Hover effect for links
//                     className={`text-sm ${isDarkMode ? 'hover:text-sky-400' : 'hover:text-blue-600'}`}
//                  >
//                     {link}
//                 </motion.a>
//             ))}
//           </div>
//         </div>
//         <div className={`mt-8 pt-8 border-t text-center text-xs sm:text-sm ${isDarkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'}`}>
//           © {new Date().getFullYear()} CodeCollab. All rights reserved. Built with Passion & Code.
//         </div>
//       </footer>
//     </div>
//   );
// };

// export default LandingPage;
