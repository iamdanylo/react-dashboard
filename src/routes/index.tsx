import React from 'react';
import { Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import PublicRoute from './common/PublicRoute';
import PrivateRoute from './common/PrivateRoute';
import MainLayout from 'routes/common/MainLayout';
import Login from 'pages/auth/Login';
import HomeDashboard from 'pages/home';
import UpcomingExperiences from 'pages/experiences/upcomingExperiences';
import CreateExperience from 'pages/experiences/experienceProfile/CreateExperience';
import EditExperience from 'pages/experiences/experienceProfile/EditExperience';
import ExperiencesHistory from 'pages/experiences/experiencesHistory';
import ExperienceDetails from 'pages/experiences/experienceDetails';

interface Props {
  userRole: string;
};

const MainRouter: React.FC<Props> = ({ userRole }) => {
  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<HomeDashboard />} />
          <Route path="/experiences/upcoming" element={<UpcomingExperiences />} />
          <Route path="/experiences/new" element={<CreateExperience />} />
          <Route path="/experiences/edit/:experienceId" element={<EditExperience />} />
          <Route path="/experiences/details/:experienceId" element={<ExperienceDetails />} />
          <Route path="/experiences/history" element={<ExperiencesHistory />} />
          <Route path="/" element={<Navigate to={'/dashboard'} />} />
        </Route>
      </Routes>
    </>
  );
};

export default MainRouter;
