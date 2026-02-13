import React from 'react';
import { useNavigate } from 'react-router-dom';

const navigationBar: React.FC = () => {
  const navigate = useNavigate();


  const styles: { [key: string]: React.CSSProperties } = {
    navBar: {
      position: 'absolute', 
      top: '0',
      left: '0',
      zIndex: 1000,
      display: 'flex',
      justifyContent: 'flex-start', 
      alignItems: 'center', 
      backgroundColor: 'transparent', 
      color: 'white',
      padding: '1rem 2rem', 
      cursor: 'pointer',
    },
    backBtn: {
      position: 'relative',
      zIndex: 1100,
      background: 'transparent', 
      border: 'none',
      color: '#ccc', 
      fontSize: '1.1rem',
      cursor: 'pointer',
    },
  };

  return (
    <nav style={styles.navBar} onClick={() => navigate(-1)}>
      ← Back
    </nav>
  );
};
export default navigationBar;
