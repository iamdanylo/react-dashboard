import { useEffect } from 'react';
import history from 'utils/route-history';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import MainRouter from 'routes';
import HistoryRouter from 'routes/common/HistoryRouter';
import { authActions } from 'redux/reducers/auth';
import { ACCESS_TOKEN } from 'utils/storageKeys';
import { currentUserSelector } from 'redux/selectors/auth';
import { Toast } from 'components';

const App = () => {
  const dispatch = useAppDispatch();
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const currentUser = useAppSelector(currentUserSelector);

  useEffect(() => {
    if (accessToken) {
      dispatch(authActions.getCurrentUser());
    }
  }, [dispatch, accessToken]);

  return (
    <HistoryRouter history={history}>
      <MainRouter userRole={currentUser?.userType} />
      <Toast />
    </HistoryRouter>
  );
};

export default App;