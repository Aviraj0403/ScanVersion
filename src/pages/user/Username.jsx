import { useSelector } from "react-redux";
import './username.css'; // Adjust the path if necessary

const Username = () => {
  const name = useSelector((state) => state.user.name);

  if (!name) return null;

  return (
    <p className="text-sm text-gray-400 animate-fade-in transition duration-300 ease-in-out transform hover:scale-105">
      Hey, {name}!
    </p>
  );
};

export default Username;
