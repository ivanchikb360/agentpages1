import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import LandingPage from './whole/public/LandingPage';
import SignUpPage from './whole/public/auth/SignUp';
import LoginPage from './whole/public/auth/LogIn';
import UserDashboard from './whole/app/dashboard/layout';
import ProfilePage from './whole/app/dashboard/profile/page';
import SettingsPage from './whole/app/dashboard/settings/page';
import BillingPage from './whole/app/dashboard/billing/page';
import SiteDashboard from './whole/app/dashboard/site/[id]/page';
import PageBuilder from './whole/app/dashboard/page-builder/[id]/page';
import AllPages from './whole/app/dashboard/page';
import { Toaster } from 'react-hot-toast';
import AdminLayout from './whole/app/admin/layout';
import WaitlistPage from './whole/app/admin/waitlist/page';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import AdminLogin from './whole/app/admin/auth/login';
import BlogPage from './whole/public/BlogPage';
import BlogPostPage from './whole/public/BlogPostPage';
import DashboardLayout from './whole/app/dashboard/layout';
import CreateProperty from './whole/app/create-property/page';
import PreviewPage from './whole/app/preview/[id]/page';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

// import WebsiteBuilder from './Components/Routes/Websitebuilder';
// import SignUp from './Components/public/SignUp';
// import LogIn from './Components/public/LogIn';

function App() {
  useEffect(() => {
    console.log('Environment check:', {
      hasUrl: !!process.env.REACT_APP_SUPABASE_URL,
      hasKey: !!process.env.REACT_APP_SUPABASE_ANON_KEY,
      url: process.env.REACT_APP_SUPABASE_URL?.substring(0, 10) + '...',
    });
  }, []);

  return (
    <AuthProvider children={undefined}>
      <DndProvider backend={HTML5Backend}>
        <BrowserRouter>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/preview/:id" element={<PreviewPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute children={undefined}>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AllPages />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="billing" element={<BillingPage />} />
              <Route path="page-builder/:id" element={<PageBuilder />} />
            </Route>
            <Route
              path="/site/:id"
              element={
                <ProtectedRoute children={undefined}>
                  <SiteDashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute children={undefined}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<WaitlistPage />} />
              <Route path="waitlist" element={<WaitlistPage />} />
            </Route>
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<BlogPostPage />} />
            <Route path="/create-property" element={<CreateProperty />} />
          </Routes>
          <Analytics />
          <SpeedInsights />
        </BrowserRouter>
      </DndProvider>
    </AuthProvider>
  );
}

export default App;
