import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import CartTotal from '../components/CartTotal';
import axios from 'axios';
import { toast } from 'react-toastify';

const Cart = () => {
  const {
    products,
    currency,
    cartItems,
    setCartItems,
    backendUrl,
    token,
    getCartAmount,
  } = useContext(ShopContext);

  const [cartData, setCartData] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    if (products.length > 0) {
      const tempData = [];
      for (const itemId in cartItems) {
        if (cartItems[itemId]) {
          tempData.push({ _id: itemId });
        }
      }
      setCartData(tempData);
    }
  }, [cartItems, products]);

  const removeFromCart = (itemId) => {
    const newCart = { ...cartItems };
    delete newCart[itemId];
    setCartItems(newCart);
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProceedToCheckout = async () => {
    if (!token) {
      toast.error('Te rugăm să te autentifici înainte de a finaliza comanda.');
      return;
    }

    const orderItems = Object.keys(cartItems)
      .map((id) => products.find((p) => p._id === id))
      .filter(Boolean);

    if (orderItems.length === 0) {
      toast.error('Coșul este gol.');
      return;
    }

    try {
      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount(),
      };

      const response = await axios.post(
        backendUrl + '/api/order/stripe',
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        window.location.replace(response.data.session_url);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="border-t pt-10">
      <div className="text-2xl mb-4">
        <Title text1={'COȘUL'} text2={'TĂU'} />
      </div>

      <div>
        {cartData.map((item) => {
          const productData = products.find(
            (product) => product._id === item._id
          );

          return (
            <div
              key={item._id}
              className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr] sm:grid-cols-[4fr_0.5fr] items-center gap-4"
            >
              <div className="flex items-start gap-6">
                <img
                  className="w-16 sm:w-20"
                  src={productData?.image?.[0] || '/placeholder.png'}
                  alt={productData?.name || 'product'}
                />
                <div>
                  <p className="text-xs sm:text-lg font-medium">
                    {productData?.name}
                  </p>
                  <div className="flex items-center gap-5 mt-2 text-accent">
                    <p>
                      {productData?.price}
                      <span className="text-[12px] ml-1">{currency}</span>
                    </p>
                  </div>
                </div>
              </div>

              <img
                onClick={() => removeFromCart(item._id)}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                src={assets.bin_icon}
                alt="delete"
              />
            </div>
          );
        })}
        {cartData.length === 0 && (
          <p className="text-center text-gray-500">Coșul este gol.</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-20 md:ml-8">
        <div className="flex flex-col gap-4 w-full">
          <h2 className="text-xl sm:text-2xl text-gray-600 my-3">
            Completează informațiile de contact:
          </h2>
          <div className="flex gap-3">
            <input
              required
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full max-w-[250px]"
              type="text"
              placeholder="First name"
            />
            <input
              required
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full max-w-[250px]"
              type="text"
              placeholder="Last name"
            />
          </div>
          <input
            required
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full max-w-[514px]"
            type="email"
            placeholder="Email address"
          />
        </div>

        <div className="w-full sm:w-[500px] mt-6 ">
          <CartTotal />
          <div className="w-full">
            <button
              onClick={handleProceedToCheckout}
              className="bg-[#6385A8] text-white text-lg text-bold tracking-wider my-4 px-4 py-2 w-full"
            >
              CUMPĂRĂ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
