import React from 'react';
import { Outlet } from 'react-router-dom';
import NavigationBar from './components/ui/navigationBar'; 

const Layout: React.FC = () => {

  return (
    <div>
      <NavigationBar />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
