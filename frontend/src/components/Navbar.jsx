import { useContext, useState } from 'react';
import { assets } from '../assets/assets';
import { Link, NavLink } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate('/login');
    localStorage.removeItem('token');
    setToken('');
    setCartItems({});
  };

  return (
    <div className="flex items-center justify-between py-3 font-medium">
      <Link to="/">
        <img src={assets.logo2} className="w-28" alt="" />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p className="text-muted tracking-wider uppercase text-sm">ACASĂ</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-muted hidden" />
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p className="text-muted tracking-wider uppercase text-sm">
            TEMPLATE-URI
          </p>
          <hr className="w-2/4 border-none h-[1.5px] bg-muted hidden" />
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p className="text-muted tracking-wider uppercase text-sm">
            DESPRE & CONTACT
          </p>
          <hr className="w-2/4 border-none h-[1.5px] bg-muted hidden" />
        </NavLink>
      </ul>

      <div className="flex items-center gap-6">
        <img
          onClick={() => {
            setShowSearch(true);
            navigate('/collection');
          }}
          src={assets.search_icon}
          className="w-4 cursor-pointer"
          alt=""
        />

        {token ? (
          <div className="group relative">
            <img
              className="w-4 cursor-pointer"
              src={assets.profile_icon}
              alt=""
            />
            {/* Dropdown Menu */}
            <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-2 z-50">
              <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                <p
                  onClick={() => navigate('/orders')}
                  className="cursor-pointer hover:text-black"
                >
                  Comenzi
                </p>
                <p onClick={logout} className="cursor-pointer hover:text-black">
                  Logout
                </p>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="text-sm px-3 py-1 bg-[#8AA4BE] text-white hover:bg-[#5f7993] hover:text-white transition px-6 py-2"
          >
            LOGIN
          </button>
        )}
        <Link to="/cart" className="relative">
          <img src={assets.cart_icon} className="w-4 min-w-4" alt="" />
          <p className="absolute right-[-5px] bottom-[-5px] bg-[#6385A8] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
          alt=""
        />
      </div>

      {/* Sidebar menu - small screens */}
      <div
        className={`fixed inset-0 z-50 bg-white transition-all duration-300 ${
          visible ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon} alt="" />
            <p>Back</p>
          </div>
          <NavLink
            to="/"
            onClick={() => setVisible(false)}
            className={({ isActive }) =>
              `py-2 pl-6 border transition-colors duration-200 ${
                isActive ? 'bg-[#6385A8] text-white' : 'text-[#576B7F]'
              }`
            }
          >
            ACASĂ
          </NavLink>

          <NavLink
            to="/collection"
            onClick={() => setVisible(false)}
            className={({ isActive }) =>
              `py-2 pl-6 border transition-colors duration-200 ${
                isActive ? 'bg-[#6385A8] text-white' : 'text-[#576B7F]'
              }`
            }
          >
            COLECȚII
          </NavLink>

          <NavLink
            to="/about"
            onClick={() => setVisible(false)}
            className={({ isActive }) =>
              `py-2 pl-6 border transition-colors duration-200 ${
                isActive ? 'bg-[#6385A8] text-white' : 'text-[#576B7F]'
              }`
            }
          >
            DESPRE & CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
