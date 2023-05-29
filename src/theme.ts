import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

const theme = createTheme({
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          input: {
            "&:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 100px #fff inset",
            },
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontSize: 13,
        }
      },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: {
          color: '#1E1E70',
          fontSize: "12px",
          fontWeight: 400,
          '&.Mui-focused': {
            color: '#1E1E70',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          fontSize: '12px',
          borderRadius: 12,
          color: '#1E1E70',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#F7F7FF',
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#262693',
          },
          '&:focus .MuiOutlinedInput-notchedOutline': {
            borderWidth: 1,
          },
        },
      },
      defaultProps: {
        inputProps: {
          style: {
            fontSize: "12px",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontFamily: 'Inter',
          fontSize: '12px',
          color: '#1e1e70',
          height: '10px',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontWeight: 400,
        },
      },
    },
    MuiAutocomplete: {
      styleOverrides: {
        paper: {
          fontWeight: 400,
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: 'rounded' },
          style: {
            width: 32,
            height: 32,
            padding: 0,
            minWidth: 'unset',
            fontSize: 8,
            borderRadius: '50%',
            border: '1px solid #CCCBF5',
            color: '#CCCBF5'
          },
        },
      ],
      styleOverrides: {
        root: {
          fontSize: '14px',
          height: 50,
          borderRadius: 12,
          textTransform: 'none'
        },
        containedPrimary: {
          fontFamily: 'Inter',
          fontSize: '14px',
          fontWeight: 700,
          color: '#1E1E70',
          height: 40,
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#cbcbfb',
          }
        },
        containedSecondary: {
          fontFamily: 'Inter',
          fontSize: '14px',
          fontWeight: 700,
          color: '#CCCBF5',
          height: 40,
          borderRadius: 8,
          textTransform: 'none',
          boxShadow: 'none',
          border: '1px solid #E8E8FF',
          '&:hover': {
            boxShadow: 'none',
            backgroundColor: '#cbcbfb33',
            color: '#1e1e708c',
          }
        },
        outlined: {
          height: 40,
          borderRadius: 8,
        },
        sizeSmall: {
          height: '21px',
          minWidth: '65px',
          padding: '0 8px',
          fontFamily: 'Inter',
          fontWeight: 600,
          fontSize: '8px',
          lineHeight: '21px',
          color: '#1E1E70',
          textTransform: 'uppercase',
          borderRadius: '4px',
        }
      },
    },
  },
  typography: {
    fontFamily: ['Inter'].join(','),
    h1: {
      fontFamily: 'Inter',
      fontWeight: 600,
      fontSize: '32px',
      lineHeight: '39px',
      color: '#1E1E70',
    },
    h2: {
      fontFamily: 'Inter',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '21px',
      color: '#1E1E70',
    },
    body1: {
      color: '#1E1E70',
      fontFamily: 'Inter',
      fontStyle: 'normal',
      fontWeight: 600,
      fontSize: '16px',
      lineHeight: '21px',
    },
    h3: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: '16px',
      lineHeight: '19px',
      color: '#1E1E70',
    },
    h4: {
      fontFamily: 'Inter',
      fontWeight: 700,
      fontSize: '18px',
      lineHeight: '26px',
      color: '#1E1E70',
    },
    h5: {
      fontSize: '10px',
      color: '#1E1E70',
    },
    caption: {
      fontSize: '12px',
      color: 'rgb(116, 116, 129)',
    },
    subtitle1: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '15px',
      letterSpacing: '-0.5px',
      color: '#1E1E70',
    },
    subtitle2: {
      fontFamily: 'Inter',
      fontWeight: 400,
      fontSize: '10px',
      lineHeight: '12px',
      color: '#1E1E70',
    }
  },
  palette: {
    primary: {
      main: '#E8E8FF',
    },
    secondary: {
      main: '#FFFFFF',
    },
    custom: {
      main: '#262693',
    },
    success: {
      main: 'rgb(120, 195, 106)',
    },
    error: {
      main: 'rgba(237, 28, 35, 0.655)',
    },
    info: {
      main: '#262693',
    }
  },
});

export default theme;
