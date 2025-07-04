import { assets } from '../assets/assets';
import PropTypes from 'prop-types';

const Navbar = ({ setToken }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="" />
      <button
        onClick={() => setToken('')}
        className="bg-[#6385A8] text-white px-5 py-2 sm:px-7 sm:py-2 rounded-none text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

Navbar.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Navbar;
