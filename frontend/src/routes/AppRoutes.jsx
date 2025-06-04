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
import Login from '../screens/Login'; // Assuming path is correct
import Register from '../screens/Register'; // Assuming path is correct
import Home from '../screens/Home'; // Assuming path is correct
import Project from '../screens/Project'; // Assuming path is correct
import LandingPage from '../screens/LandingPage'; // Assuming path is correct

import UserAuth from '../auth/UserAuth'; // Wrapper for protected routes
import RedirectIfAuth from '../auth/RedirectIfAuth'; // Wrapper for public routes that redirect if authenticated

// It's crucial that UserProvider wraps BrowserRouter or is at a higher level in your app structure (e.g., in App.js or index.js)
// For example, in your main App.js:
// import { UserProvider } from './context/user.context';
// <UserProvider>
//   <BrowserRouter>
//     <AppRoutes />
//   </BrowserRouter>
// </UserProvider>
// Or if AppRoutes includes BrowserRouter:
// <UserProvider>
//  <AppRoutes />
// </UserProvider>

const AppRoutes = () => {
    return (
        // BrowserRouter should ideally be outside UserProvider or UserProvider outside BrowserRouter,
        // but if UserProvider is already wrapping this component higher up, this is fine.
        // For clarity, ensure UserProvider is at the root.
        <BrowserRouter>
            <Routes>
                {/* Public routes: redirect to /home if user is already authenticated */}
                <Route 
                    path="/" 
                    element={
                        <RedirectIfAuth>
                            <LandingPage />
                        </RedirectIfAuth>
                    } 
                />
                <Route 
                    path="/login" 
                    element={
                        <RedirectIfAuth>
                            <Login />
                        </RedirectIfAuth>
                    } 
                />
                <Route 
                    path="/register" 
                    element={
                        <RedirectIfAuth>
                            <Register />
                        </RedirectIfAuth>
                    } 
                />

                {/* Protected routes: require authentication, redirect to / if not authenticated */}
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
                {/* Add other routes here */}
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;
