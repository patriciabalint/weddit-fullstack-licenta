import PropTypes from 'prop-types';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Link } from 'react-router-dom';

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      onClick={() => scrollTo(0, 0)}
      to={`/product/${id}`}
      className="text-muted cursor-pointer mb-6"
    >
      <div className="overflow-hidden h-[270px] w-[235px] w-full flex items-center justify-center">
        <img
          className="hover:scale-110 transition ease-in-out duration-300 w-full h-full object-cover"
          src={image[0]}
          alt={name}
        />
      </div>

      <div className="pt-3 pb-1">
        <p className="text-[17px] font-regular mb-1">{name}</p>
        <p className="text-[16px] text-accent font-regular uppercase">
          {price} <span className="text-[12px] ml-1">{currency}</span>
        </p>
      </div>
    </Link>
  );
};

ProductItem.propTypes = {
  id: PropTypes.string.isRequired,
  image: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default ProductItem;
