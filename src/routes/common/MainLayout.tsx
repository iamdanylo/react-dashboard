import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Sidebar from 'components/sidebar/SideBar';
import sizeConfigs from 'components/sidebar/sizeConfig';

const MainLayout = () => {
  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: `calc(100% - ${sizeConfigs.sidebar.width})`,
          minHeight: '100vh',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
