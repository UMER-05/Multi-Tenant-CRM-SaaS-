import './App.css';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home/Home.jsx';
import LoginPage from './pages/Login/LoginPage.jsx';
import DashboardLayout from './pages/dashboard/DashboardLayout.jsx';
import Tasks from './pages/Tasks/Tasks.jsx';
import TaskDetails from './pages/Tasks/TaskDetails.jsx';
import Tenants from './pages/Tenants/Tenants.jsx';
import { TenantDetails } from './pages/Tenants/TenantDetails.jsx';
import Users from './pages/Users/Users.jsx';
import PipelinesManagment from './pages/Pipelines Managment/PipelinesManagment.jsx';
import PipelineManagmentDetails from './pages/Pipelines Managment/PipelineManagmentDetails.jsx';
import Pipelines from './pages/Pipelines/Piplines.jsx';
import Leads from './pages/Leads/Leads.jsx';
import LeadDetails from './pages/Leads/LeadDetails.jsx';
import Unauthorized from './components/auth/UnAuthorized.jsx';
import RoleGuard from './context/RoleGuard.jsx';
import OAuthSuccess from './components/auth/OAuthSuccess.jsx';
function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/unauthorized' element={<Unauthorized />} />
      <Route path='/oauth-success' element={<OAuthSuccess />} />

      <Route path='/dashboard' element={
          <DashboardLayout />

      }>
        <Route
          path='tasks'
          element={
            <RoleGuard roles={[1, 2]}>
              <Tasks />
            </RoleGuard>
          }
        />
        <Route
          path='tasks/:taskId'
          element={
            <RoleGuard roles={[1, 2]}>
              <TaskDetails />
            </RoleGuard>
          }
        />
        <Route
          path='tenants'
          element={
            <RoleGuard roles={[3]}>
              <Tenants />
            </RoleGuard>
          }
        />
        <Route
          path='tenants/:tenantId'
          element={
            <RoleGuard roles={[3]}>
              <TenantDetails />
            </RoleGuard>
          }
        />
        <Route
          path='users'
          element={
            <RoleGuard roles={[2]}>
              <Users />
            </RoleGuard>
          }
        />
        <Route
          path='pipeline-managment'
          element={
            <RoleGuard roles={[1, 2]}>
              <PipelinesManagment />
            </RoleGuard>
          }
        />
        <Route
          path='pipeline-managment/:pipelineId'
          element={
            <RoleGuard roles={[1, 2]}>
              <PipelineManagmentDetails />
            </RoleGuard>
          }
        />
        <Route
          path='pipelines'
          element={
            <RoleGuard roles={[1, 2]}>
              <Pipelines />
            </RoleGuard>
          }
        />

        <Route
          path='leads'
          element={
            <RoleGuard roles={[2]}>
              <Leads />
            </RoleGuard>
          }
        />
        <Route
          path='leads/:leadId'
          element={
            <RoleGuard roles={[2]}>
              <LeadDetails />
            </RoleGuard>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
