import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import PropTypes from 'prop-types';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) return;

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3 className="text-xl text-[#6385A8] uppercase">Pagina Comenzilor</h3>
      <div>
        {orders.map((order, index) => (
          <div
            key={index}
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] gap-0 items-center border-2 border-gray-200 p-5 my-4 text-gray-700"
          >
            {/* Icon box */}
            <img className="w-20 ml-4" src={assets.parcel_icon} alt="Parcel" />

            {/* Items + client */}
            <div>
              <div>
                <p className="text-sm font-medium uppercase text-[#576B7F] mb-1">
                  {order.items?.map((item) => item.name).join(', ') ||
                    'No items'}{' '}
                  ({order.items?.length || 0}{' '}
                  {order.items?.length === 1 ? 'item' : 'items'})
                </p>
              </div>
              <p className="text-gray-400 text-sm font-light leading-tight">
                {order.address?.firstName || 'N/A'}{' '}
                {order.address?.lastName || ''}
              </p>
              <p className="text-gray-400 text-sm font-normal leading-tight">
                {order.address?.email || 'No email'}
              </p>
            </div>

            {/* Amount + date */}
            <div className="text-right">
              <p className="text-lg font-medium text-[#D4BB90]">
                {order.amount} RON
              </p>
              <p className="text-gray-400 text-sm">
                Data: {new Date(order.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

Orders.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Orders;
