import { RouterProvider } from "react-router-dom";
import router from "./Router/Router.jsx";
import Footer from "./components/Footer/footer.jsx"; // Import the Footer component

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Footer /> {/* Add the Footer component here */}
    </>
  );
}

export default App;
