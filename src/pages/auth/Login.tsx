import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { authActions } from 'redux/reducers/auth';
import { loginBg } from 'assets/img';
import { loginBorder, logo } from 'assets/svg';
import { authErrorSelector, authLoadingSelector } from 'redux/selectors/auth';
import { FormikInput } from 'components';

const validationSchema = yup.object().shape({
  email: yup.string().email('Enter a valid email').required('Required'),
  password: yup.string().required('Required'),
});

export interface LoginValuesModel {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authError = useAppSelector(authErrorSelector);
  const authLoading = useAppSelector(authLoadingSelector);

  const submitHandler = useCallback(
    (values: LoginValuesModel): void => {
      dispatch(authActions.login(values));
    },
    [dispatch, navigate]
  );

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: validationSchema,
    onSubmit: submitHandler,
    validateOnBlur: true,
  });

  return (
    <Box className="login-page">
      <Grid container spacing={0} className="login-container">
        <Grid className="login-bg-wrap" item xs={6}>
          <img className="login-bg" src={loginBg} alt="background" />
          <img className="login-overlay" src={loginBorder} alt="overlay" />
        </Grid>
        <Grid className="form-block" item xs={6}>
          <Box className="form-container">
            <Box className="logo-wrap">
              <img className="logo" src={logo} alt="logo" />
            </Box>
            <Typography
              sx={{ fontWeight: '600' }}
              className="form-title"
              variant="h1"
              component="p"
            >
              Login
            </Typography>
            <form onSubmit={formik.handleSubmit}>
              <FormikInput
                className="login-input"
                fullWidth
                id="email"
                name="email"
                label="Email"
                formik={formik}
                systemError={authError}
              />
              <FormikInput
                className="login-input"
                fullWidth
                name="password"
                label="Password"
                type="password"
                formik={formik}
              />
              <Button
                color="custom"
                variant="contained"
                fullWidth
                type="submit"
                className="login-btn"
              >
                {authLoading ? 'Loading...' : 'Login'}
              </Button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
