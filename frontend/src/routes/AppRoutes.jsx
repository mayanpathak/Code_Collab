// import React, { Suspense } from 'react'
// import { Route, BrowserRouter, Routes, Navigate } from 'react-router-dom'
// import Login from '../screens/Login'
// import Register from '../screens/Register'
// import Home from '../screens/Home'
// import Project from '../screens/Project'
// import UserAuth from '../auth/UserAuth'
// import LandingPage from '../screens/LandingPage'

// // Loading fallback component
// const LoadingFallback = () => (
//   <div style={{ 
//     display: 'flex', 
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     height: '100vh',
//     fontSize: '18px',
//     color: '#666'
//   }}>
//     Loading...
//   </div>
// )

// // Error boundary component
// class RouteErrorBoundary extends React.Component {
//   constructor(props) {
//     super(props)
//     this.state = { hasError: false }
//   }

//   static getDerivedStateFromError(error) {
//     return { hasError: true }
//   }

//   componentDidCatch(error, errorInfo) {
//     console.error('Route Error:', error, errorInfo)
//   }

//   render() {
//     if (this.state.hasError) {
//       return (
//         <div style={{ 
//           display: 'flex', 
//           flexDirection: 'column',
//           justifyContent: 'center', 
//           alignItems: 'center', 
//           height: '100vh',
//           textAlign: 'center',
//           padding: '20px'
//         }}>
//           <h2>Something went wrong</h2>
//           <p>Please refresh the page or try again later.</p>
//           <button 
//             onClick={() => window.location.reload()}
//             style={{
//               padding: '10px 20px',
//               marginTop: '10px',
//               backgroundColor: '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: 'pointer'
//             }}
//           >
//             Refresh Page
//           </button>
//         </div>
//       )
//     }

//     return this.props.children
//   }
// }

// // 404 Not Found component
// const NotFound = () => (
//   <div style={{ 
//     display: 'flex', 
//     flexDirection: 'column',
//     justifyContent: 'center', 
//     alignItems: 'center', 
//     height: '100vh',
//     textAlign: 'center',
//     padding: '20px'
//   }}>
//     <h2>404 - Page Not Found</h2>
//     <p>The page you're looking for doesn't exist.</p>
//     <a 
//       href="/" 
//       style={{
//         padding: '10px 20px',
//         marginTop: '10px',
//         backgroundColor: '#007bff',
//         color: 'white',
//         textDecoration: 'none',
//         borderRadius: '4px',
//         display: 'inline-block'
//       }}
//     >
//       Go Home
//     </a>
//   </div>
// )

// const AppRoutes = () => {
//   return (
//     <BrowserRouter>
//       <RouteErrorBoundary>
//         <Suspense fallback={<LoadingFallback />}>
//           <Routes>
//             {/* Default route - redirect to landing page */}
//             <Route path="/" element={<Navigate to="/landing" replace />} />
            
//             {/* Main application routes */}
//             <Route path="/landing" element={<LandingPage />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route 
//               path="/main" 
//               element={
//                 <UserAuth>
//                   <Home />
//                 </UserAuth>
//               } 
//             />
//             <Route 
//               path="/project" 
//               element={
//                 <UserAuth>
//                   <Project />
//                 </UserAuth>
//               } 
//             />
            
//             {/* Catch-all route for 404 */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </Suspense>
//       </RouteErrorBoundary>
//     </BrowserRouter>
//   )
// }

// export default AppRoutes
import React from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';

// Import screen components
import Login from '../screens/Login'; // Assuming path is correct
import Register from '../screens/Register'; // Assuming path is correct
import Home from '../screens/Home'; // Assuming path is correct
import Project from '../screens/Project'; // Assuming path is correct
import LandingPage from '../screens/LandingPage'; // Assuming path is correct

// Import auth wrapper
import UserAuth from '../auth/UserAuth'; // Wrapper for protected routes

// Ensure UserProvider wraps this component tree at a higher level (e.g., in App.js or index.js)
// Example in your main App.js or index.js:
// import { UserProvider } from './context/user.context';
// import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
// ReactDOM.render(
//   <React.StrictMode>
//     <UserProvider>
//       <BrowserRouter> {/* BrowserRouter wraps AppRoutes */}
//         <AppRoutes />
//       </BrowserRouter>
//     </UserProvider>
//   </React.StrictMode>,
//   document.getElementById('root')
// );

const AppRoutes = () => {
    return (
        // This component now assumes <BrowserRouter> is wrapping it in a higher-level component (e.g., App.js).
        // If <BrowserRouter> is not outside, you would typically include it here,
        // but ensure UserProvider still wraps BrowserRouter or its contents.
        <Routes>
            {/* Public routes: LandingPage is always the entry point for "/" */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes: require authentication for the current session */}
            <Route
                path="/home"
                element={
                    <UserAuth>
                        <Home />
                    </UserAuth>
                }
            />
            <Route
                path="/project" // Assuming /project is also a protected route
                element={
                    <UserAuth>
                        <Project />
                    </UserAuth>
                }
            />
            {/* Add other routes here. For example, a 404 page */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    );
};

export default AppRoutes;