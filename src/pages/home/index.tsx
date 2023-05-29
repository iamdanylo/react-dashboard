import { useAppDispatch } from 'app/hooks';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Page } from 'components';

const Home: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Page title='Dashboard' className="home-page">
      <Box></Box>
    </Page>
  );
};

export default Home;
