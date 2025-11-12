import { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#3182ce',
    primaryHover: '#2c5282',
    secondary: '#718096',
    success: '#38a169',
    danger: '#e53e3e',
    warning: '#d69e2e',
    info: '#3182ce',
    light: '#f7fafc',
    dark: '#2d3748',
    white: '#ffffff',
    gray: {
      100: '#f7fafc',
      200: '#edf2f7',
      300: '#e2e8f0',
      400: '#cbd5e0',
      500: '#a0aec0',
      600: '#718096',
      700: '#4a5568',
      800: '#2d3748',
      900: '#1a202c'
    }
  },
  fonts: {
    primary: '"Noto Sans KR", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    mono: '"SF Mono", Monaco, Inconsolata, "Roboto Mono", Consolas, monospace'
  },
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem'
  },
  borderRadius: {
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  }
};

export const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    line-height: 1.5;
  }

  body {
    font-family: ${props => props.theme.fonts.primary};
    font-size: ${props => props.theme.fontSizes.md};
    color: ${props => props.theme.colors.gray[800]};
    background-color: ${props => props.theme.colors.gray[100]};
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  h1 {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }

  h2 {
    font-size: ${props => props.theme.fontSizes['2xl']};
  }

  h3 {
    font-size: ${props => props.theme.fontSizes.xl};
  }

  h4 {
    font-size: ${props => props.theme.fontSizes.lg};
  }

  p {
    margin-bottom: ${props => props.theme.spacing.sm};
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }

  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  input, select, textarea {
    font-family: inherit;
    font-size: inherit;
    line-height: inherit;
    border: 1px solid ${props => props.theme.colors.gray[300]};
    border-radius: ${props => props.theme.borderRadius.md};
    padding: ${props => props.theme.spacing.sm};
    &:focus {
      outline: none;
      border-color: ${props => props.theme.colors.primary};
      box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
    }
  }

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing.md};
  }

  .card {
    background: ${props => props.theme.colors.white};
    border-radius: ${props => props.theme.borderRadius.lg};
    box-shadow: ${props => props.theme.shadows.md};
    padding: ${props => props.theme.spacing.lg};
    margin-bottom: ${props => props.theme.spacing.lg};
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
    border-radius: ${props => props.theme.borderRadius.md};
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    border: none;
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }

  .btn-primary {
    background-color: ${props => props.theme.colors.primary};
    color: ${props => props.theme.colors.white};
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.primaryHover};
      text-decoration: none;
    }
  }

  .btn-secondary {
    background-color: ${props => props.theme.colors.gray[200]};
    color: ${props => props.theme.colors.gray[700]};
    &:hover:not(:disabled) {
      background-color: ${props => props.theme.colors.gray[300]};
      text-decoration: none;
    }
  }

  .btn-success {
    background-color: ${props => props.theme.colors.success};
    color: ${props => props.theme.colors.white};
    &:hover:not(:disabled) {
      opacity: 0.9;
      text-decoration: none;
    }
  }

  .btn-danger {
    background-color: ${props => props.theme.colors.danger};
    color: ${props => props.theme.colors.white};
    &:hover:not(:disabled) {
      opacity: 0.9;
      text-decoration: none;
    }
  }

  .text-center {
    text-align: center;
  }

  .text-right {
    text-align: right;
  }

  .mt-1 { margin-top: ${props => props.theme.spacing.sm}; }
  .mt-2 { margin-top: ${props => props.theme.spacing.md}; }
  .mt-3 { margin-top: ${props => props.theme.spacing.lg}; }
  .mb-1 { margin-bottom: ${props => props.theme.spacing.sm}; }
  .mb-2 { margin-bottom: ${props => props.theme.spacing.md}; }
  .mb-3 { margin-bottom: ${props => props.theme.spacing.lg}; }
  .ml-1 { margin-left: ${props => props.theme.spacing.sm}; }
  .ml-2 { margin-left: ${props => props.theme.spacing.md}; }
  .mr-1 { margin-right: ${props => props.theme.spacing.sm}; }
  .mr-2 { margin-right: ${props => props.theme.spacing.md}; }

  .p-1 { padding: ${props => props.theme.spacing.sm}; }
  .p-2 { padding: ${props => props.theme.spacing.md}; }
  .p-3 { padding: ${props => props.theme.spacing.lg}; }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    .container {
      padding: 0 ${props => props.theme.spacing.sm};
    }
    
    .card {
      padding: ${props => props.theme.spacing.md};
      margin-bottom: ${props => props.theme.spacing.md};
    }
  }
`;