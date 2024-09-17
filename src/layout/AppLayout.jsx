import React, { useEffect, useState } from "react";
import { Outlet, useNavigation } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import Loader from "../components/Loader/Loader.jsx";

const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  const [headerHeight, setHeaderHeight] = useState("60px"); // Default value, will be updated

  useEffect(() => {
    // Function to calculate header height dynamically
    const calculateHeaderHeight = () => {
      const headerElement = document.querySelector('.header');
      if (headerElement) {
        const height = getComputedStyle(headerElement).getPropertyValue('height');
        setHeaderHeight(height);
      }
    };

    // Calculate height on mount
    calculateHeaderHeight();

    // Add resize listener to handle changes in header height on window resize
    window.addEventListener('resize', calculateHeaderHeight);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', calculateHeaderHeight);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      {isLoading && <Loader />}

      <Header />

      <main
        style={{ marginTop: headerHeight }}
        className="mx-auto max-w-screen "
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
