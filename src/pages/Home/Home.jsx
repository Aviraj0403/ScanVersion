import { useSelector } from "react-redux";
import CreateUser from "../user/CreateUser";
import { Link } from "react-router-dom";
import "./Home.css"; // Import the CSS file

const Home = () => {
  const username = useSelector((state) => state.user.name);

  return (
    <div className="home-container">
      <h1>
        The best Restaurant.
        <br />
        <span>Straight out of the oven, straight to you.</span>
      </h1>
      {username === "" ? (
        <CreateUser />
      ) : (
        <Link
          to="/menu"
          className="link-button"
        >
          Continue ordering, {username}!
        </Link>
      )}
    </div>
  );
};

export default Home;
