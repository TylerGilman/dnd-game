import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Notifications } from './components/Notifications';
import { PrivateRoute } from './components/PrivateRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateCampaignPage } from './pages/CreateCampaignPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditCampaignPage } from './pages/EditCampaignPage';
import { CampaignDetailsPage } from './pages/CampaignDetailsPage';
import EditProfilePage from "./pages/EditProfilePage.tsx";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route 
                path="/dashboard" 
                element={
                  <PrivateRoute>
                    <DashboardPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/campaigns/new" 
                element={
                  <PrivateRoute>
                    <CreateCampaignPage />
                  </PrivateRoute>
                } 
              />
              <Route 
                path="/campaigns/:cid" 
                element={<CampaignDetailsPage />} 
              />
              <Route 
                path="/campaigns/edit/:cid" 
                element={
                  <PrivateRoute>
                    <EditCampaignPage />
                  </PrivateRoute>
                } 
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/profile/:username" element={<ProfilePage />} />
                <Route path="/profile/update" element={<EditProfilePage />} />
            </Routes>
            <Notifications />
          </BrowserRouter>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  );
}

export default App;
