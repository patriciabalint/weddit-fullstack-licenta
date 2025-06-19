// frontend/src/context/ShopContext.js
import { createContext, useEffect, useState, useCallback } from 'react'; // Adaugă useCallback
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PropTypes from 'prop-types';
import { jwtDecode } from 'jwt-decode'; // <-- IMPORTĂ ASTA

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = ' RON';
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState('');
  const [userId, setUserId] = useState(null); // <-- ADAUGĂ ASTA: STATE PENTRU userId
  const navigate = useNavigate();

  // FUNCTIE PENTRU LOGIN (este CRITICA pentru setarea tokenului si userId)
  const loginUser = async (url, data) => {
    try {
      const response = await axios.post(backendUrl + url, data);
      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);

        // Decodarea token-ului pentru a obține userId
        const decodedToken = jwtDecode(response.data.token);
        setUserId(decodedToken.id); // <-- SETARE userId AICI
        localStorage.setItem('userId', decodedToken.id); // <-- STOCARE userId ÎN LOCALSTORAGE

        console.log(
          'ShopContext - Login Success - Token:',
          response.data.token
        );
        console.log('ShopContext - Login Success - UserId:', decodedToken.id);

        toast.success(response.data.message);
        navigate('/');
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('ShopContext - Login error:', error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Eroare la autentificare.'
      );
    }
  };

  // FUNCTIE PENTRU LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // <-- ELIMINĂ userId LA LOGOUT
    setToken('');
    setUserId(null); // <-- SETARE userId LA NULL
    setCartItems({}); // Curăță coșul la logout
    toast.success('Te-ai delogat cu succes!');
    navigate('/');
  };

  // Functiile addToCart, getCartCount, getCartAmount raman la fel, dar le voi include pentru completitudine
  const addToCart = async (itemId) => {
    let cartData = structuredClone(cartItems);
    if (!cartData[itemId]) {
      cartData[itemId] = true;
      setCartItems(cartData);
      if (token) {
        try {
          await axios.post(
            backendUrl + '/api/cart/add',
            { itemId },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        } catch (error) {
          toast.error(error.message);
        }
      }
    } else {
      toast.info('Produsul este deja în coș.');
    }
  };

  const getCartCount = () => {
    return Object.keys(cartItems).length;
  };

  const getCartAmount = () => {
    let total = 0;
    for (const itemId in cartItems) {
      const product = products.find((p) => p._id === itemId);
      if (product) {
        total += product.price;
      }
    }
    return total;
  };

  // Funcții care depind de backendUrl sau de alte state-uri, înfășurate în useCallback
  const getProductsData = useCallback(async () => {
    try {
      const response = await axios.get(backendUrl + '/api/product/list');
      if (response.data.success) {
        setProducts(response.data.products.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  }, [backendUrl]); // Dependența: backendUrl

  const getUserCart = useCallback(
    async (current_token) => {
      // Argumentul 'token' redenumit 'current_token' pentru claritate
      try {
        const response = await axios.post(
          backendUrl + '/api/cart/get',
          {},
          { headers: { Authorization: `Bearer ${current_token}` } } // Folosește current_token
        );
        if (response.data.success) {
          setCartItems(response.data.cartData);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    },
    [backendUrl]
  ); // Dependența: backendUrl

  // useEffect pentru a apela getProductsData o singură dată la montare
  useEffect(() => {
    console.log('ShopContext - useEffect [getProductsData] is running.');
    getProductsData();
  }, [getProductsData]); // Dependența: getProductsData (pentru a apela doar când se schimbă funcția)

  // useEffect pentru a verifica token-ul și a încărca coșul la inițializare/schimbare token
  useEffect(() => {
    console.log(
      'ShopContext - useEffect [token, userId, getUserCart] is running.'
    );
    const localToken = localStorage.getItem('token');
    const localUserId = localStorage.getItem('userId'); // Preluăm userId din localStorage

    console.log('ShopContext - localToken from localStorage:', localToken);
    console.log('ShopContext - localUserId from localStorage:', localUserId);

    if (localToken) {
      setToken(localToken);
      if (localUserId) {
        // Dacă userId există deja în localStorage, folosește-l
        setUserId(localUserId);
      } else {
        // Altfel, încearcă să-l decodifici din token (fallback, ar trebui să existe mereu)
        try {
          const decodedToken = jwtDecode(localToken);
          setUserId(decodedToken.id);
          localStorage.setItem('userId', decodedToken.id); // Stochează userId dacă a fost decodat acum
          console.log(
            'ShopContext - UserId decoded from token (fallback):',
            decodedToken.id
          );
        } catch (e) {
          console.error(
            'ShopContext - Eroare la decodarea token-ului din localStorage:',
            e
          );
          // Curăță token-ul invalid
          localStorage.removeItem('token');
          localStorage.removeItem('userId');
          setToken('');
          setUserId(null);
          toast.error(
            'Sesiune expirată sau invalidă. Te rugăm să te autentifici din nou.'
          );
        }
      }
      getUserCart(localToken); // Apelează getUserCart cu token-ul preluat
    }
  }, [getUserCart]); // Dependențe: getUserCart (și eventual token, dar deja e gestionat în if-ul de mai sus)

  // Obiectul `value` expus prin context
  const value = {
    products,
    currency,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    setCartItems,
    getCartCount,
    getCartAmount,
    navigate,
    backendUrl,
    setToken,
    token,
    userId,
    setUserId,
    loginUser,
    logout,
  };

  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;

ShopContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
