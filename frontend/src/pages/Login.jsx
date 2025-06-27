import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');

  const { setToken, setUserId, backendUrl } = useContext(ShopContext);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const navigate = useNavigate();

  const onSubmitHandler = async (event) => {
    event.preventDefault(); // Oprește reîncărcarea paginii

    try {
      let response;
      if (currentState === 'Sign Up') {
        response = await axios.post(backendUrl + '/api/user/register', {
          name,
          email,
          password,
        });
      } else {
        // Login
        response = await axios.post(backendUrl + '/api/user/login', {
          email,
          password,
        });
      }

      if (response.data.success) {
        setToken(response.data.token);
        localStorage.setItem('token', response.data.token);

        setUserId(response.data.userId);
        localStorage.setItem('userId', response.data.userId); // Salvează userId în localStorage

        toast.success(
          currentState === 'Login'
            ? 'Autentificare reușită!'
            : 'Înregistrare reușită!'
        );
        navigate('/'); // Redirecționează către pagina principală după succes
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'A apărut o eroare necunoscută.'
      );
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');

    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(storedUserId);
      navigate('/');
    }
  }, [setToken, setUserId, navigate]);

  return (
    <div className="pt-10 border-t border-gray-200">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-10 gap-4 text-gray-800"
      >
        <div className="inline-flex items-center gap-2 mb-2 mt-0">
          <p className="text-[30px] uppercase text-[#D4BB90] tracking-[0.1em]">
            {currentState}
          </p>
        </div>
        {currentState === 'Login' ? (
          ''
        ) : (
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            className="w-full px-3 py-2 border border-[#7A8897]"
            placeholder="Name"
            required
          />
        )}
        <input
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          className="w-full px-3 py-2 border border-[#7A8897]"
          placeholder="Email"
          required
        />
        <input
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          className="w-full px-3 py-2 border border-[#7A8897]"
          placeholder="Password"
          required
        />

        <button
          type="submit"
          className="w-full px-3 py-2 bg-[#6385A8] text-white uppercase font-light px-10 py-2 mt-2"
        >
          {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
        </button>
        <div className="w-full flex justify-between text-sm text-muted mt-[-4px]">
          <p className="cursor-pointer">Forgot your password?</p>
          {currentState === 'Login' ? (
            <p
              onClick={() => setCurrentState('Sign Up')}
              className="cursor-pointer"
            >
              Create account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState('Login')}
              className="cursor-pointer"
            >
              Login Here
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default Login;
