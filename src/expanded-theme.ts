import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface PaletteOptions {
    custom: PaletteOptions['primary'];
  }
}
declare module '@mui/material/styles' {
  interface Palette {
    custom: Palette['primary'];
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    custom: true;
  }
}
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    rounded: true;
  }
}