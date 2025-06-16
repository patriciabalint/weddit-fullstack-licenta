import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const CartTotal = () => {
  const { currency, getCartAmount } = useContext(ShopContext);

  return (
    <div className="w-full">
      <div className="text-2xl mb-2"></div>

      <hr className="my-2 border-gray-300" />

      <div className="flex justify-between text-sm py-2">
        <b className="text-lg">Total</b>
        <b className="text-lg">
          {getCartAmount()}.00 {currency}
        </b>
      </div>

      <hr className="my-2 border-gray-300" />
    </div>
  );
};

export default CartTotal;
