import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import Title from '../components/Title';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Orders = () => {
  const { backendUrl, token, currency } = useContext(ShopContext);

  const [orderData, setorderData] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null;
      }

      const response = await axios.post(
        backendUrl + '/api/order/userorders',
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.map((order) => {
          order.items.map((item) => {
            item['status'] = order.status;
            item['payment'] = order.payment;

            item['date'] = order.date;
            allOrdersItem.push(item);
          });
        });
        setorderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.error('Error loading order data:', error);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, [token]);

  return (
    <div className="border-t pt-12">
      <div className="mb-8">
        <div className="text-2xl mb-4">
          <Title text1={'Designurile'} text2={'cumpărate'} />
        </div>
        <p className="text-lg text-gray-500 text-center mb-6">
          Acum îți poți personaliza designul și descărca PDF-ul apăsând pe
          butonul „Editează”.
        </p>
      </div>

      <div>
        {orderData.map((item) => (
          <div
            key={item._id}
            className="py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
          >
            <div className="flex items-start gap-6 text-sm">
              <img className="w-16 sm:w-20" src={item.image[0]} alt="" />
              <div>
                <p className="text-[17px] font-medium uppercase mb-1 tracking-wider">
                  {item.name}
                </p>
                <div className="flex items-center gap-1 mt-1 text-base text-gray-500 ">
                  <p>
                    {item.price}
                    {currency}
                  </p>
                </div>
                <p className="mt-1 text-gray-400 ">
                  Date:{' '}
                  <span className=" text-gray-400">
                    {new Date(item.date).toDateString()}
                  </span>
                </p>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-between">
              <div className="flex items-center gap-2"></div>
              <Link to={`/editor/${item._id}`}>
                <button className="text-white px-8 py-2.5 text-sm bg-[#6385A8] tracking-wider mt-6 uppercase hover:shadow-sm hover:bg-gray-200 transition">
                  Editează
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
