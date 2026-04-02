import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import useAuthStore from '../store/useAuthStore';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy load pages
const LoginPage = lazy(() => import('../pages/LoginPage').then(module => ({ default: module.LoginPage })));
const MainDashboard = lazy(() => import('../pages/MainDashboard').then(module => ({ default: module.MainDashboard })));

const LoadingFallback = () => (
    <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
);

export default function AppRoutes() {
    const { isAuthenticated, user } = useAuthStore();

    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route
                    path="/login"
                    element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" replace />}
                />
                
                {/* Protected Routes */}
                <Route
                    path="/*"
                    element={
                        <ProtectedRoute>
                            <MainDashboard userRole={user?.role} />
                        </ProtectedRoute>
                    }
                />

                {/* Default Redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Suspense>
    );
}
