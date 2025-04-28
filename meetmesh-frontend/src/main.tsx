import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './index.css'
import App from './App.tsx'
import Login from './pages/login.tsx';
import Signup from './pages/signup.tsx';
import { AuthProvider } from './contexts/auth-context.tsx';
import OnboardingPage from './pages/on-boarding.tsx';
import UserMapFeed from './pages/map-page.tsx';
import FeedLayout from './components/feed-layout.tsx';
import MessagesPage from './pages/message-page.tsx';
import QueryProvider from './contexts/queryProvider.tsx';
import MessagesDetailPage from './pages/message-detail.tsx';
import ProfilePage from './pages/profile/page.tsx';
import PublicProfilePage from "./pages/profile/public.tsx"
import SettingsPage from './pages/settings/page.tsx';


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <QueryProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile-setup" element={<OnboardingPage />} />
            <Route element={<FeedLayout />}>
              <Route path='feed' element={<UserMapFeed />} />
              <Route path="messages" element={<MessagesPage />} />
              <Route path="messages/:id" element={<MessagesDetailPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="profile/:id" element={<PublicProfilePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryProvider>
    </AuthProvider>
  </StrictMode>,
)
