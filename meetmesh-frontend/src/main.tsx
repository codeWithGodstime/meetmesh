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


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile-setup" element={<OnboardingPage />} />
          <Route element={<FeedLayout />}>
            <Route path='feed' element={<UserMapFeed />} />

          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
