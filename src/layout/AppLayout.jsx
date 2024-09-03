import { Outlet, useNavigation } from "react-router-dom";
import Header from "../components/Header/Header.jsx";
import Loader from "../components/Loader/Loader.jsx";

const AppLayout = () => {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  // Get header height from CSS variable
  const headerHeight = getComputedStyle(document.documentElement).getPropertyValue('--header-height');

  return (
    <div className="min-h-screen bg-slate-50">
      {isLoading && <Loader />}

      <Header />

      <main
        style={{ marginTop: headerHeight }}
        className="mx-auto max-w-screen-xl p-4"
      >
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
