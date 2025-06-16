import { useContext, useEffect, useState } from 'react';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';

import ProductItem from '../components/ProductItem';
import { useLocation } from 'react-router-dom';

const Collection = () => {
  const { products, search, showSearch } = useContext(ShopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relavent');

  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const toggleSubCategory = (e) => {
    if (subCategory.includes(e.target.value)) {
      setSubCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setSubCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let productsCopy = products.slice();

    if (showSearch && search) {
      productsCopy = productsCopy.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // ✨ Filtrare după categoria primită din homepage

    // Filtrare după checkboxuri (dacă sunt selectate)
    if (category.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        category.includes(item.category)
      );
    }

    if (subCategory.length > 0) {
      productsCopy = productsCopy.filter((item) =>
        subCategory.includes(item.subCategory)
      );
    }

    setFilterProducts(productsCopy);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();

    switch (sortType) {
      case 'low-high':
        setFilterProducts(fpCopy.sort((a, b) => a.price - b.price));
        break;

      case 'high-low':
        setFilterProducts(fpCopy.sort((a, b) => b.price - a.price));
        break;

      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  const location = useLocation();

  // Preluăm categoria inițială doar la montare
  useEffect(() => {
    if (location.state?.category) {
      setCategory((prev) => {
        if (!prev.includes(location.state.category)) {
          return [...prev, location.state.category];
        }
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t">
      {/* Filter Options */}
      <div className="min-w-60">
        <p
          onClick={() => setShowFilter(!showFilter)}
          className="my-2 text-xl flex items-center cursor-pointer gap-2 text-primary uppercase"
        >
          Filtrare
          <img
            className={`h-3 sm:hidden ${showFilter ? 'rotate-90' : ''}`}
            src={assets.dropdown_icon}
            alt=""
          />
        </p>
        {/* Category Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 mt-6 ${
            showFilter ? '' : 'hidden'
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium text-primary uppercase">
            Categorii
          </p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2 ">
              <input
                className="w-3"
                type="checkbox"
                value={'Invitatii'}
                checked={category.includes('Invitatii')}
                onChange={toggleCategory}
              />{' '}
              Invitatii
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Meniuri'}
                checked={category.includes('Meniuri')}
                onChange={toggleCategory}
              />{' '}
              Meniuri
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Liste invitati"
                checked={category.includes('Liste invitati')}
                onChange={toggleCategory}
              />{' '}
              Liste invitati
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Pentru Bridal'}
                checked={category.includes('Pentru Bridal')}
                onChange={toggleCategory}
              />{' '}
              Pentru Bridal
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Altele'}
                checked={category.includes('Altele')}
                onChange={toggleCategory}
              />{' '}
              Altele
            </p>
          </div>
        </div>
        {/* SubCategory Filter */}
        <div
          className={`border border-gray-300 pl-5 py-3 my-5 ${
            showFilter ? '' : 'hidden'
          } sm:block`}
        >
          <p className="mb-3 text-sm font-medium text-primary uppercase">
            {' '}
            Stiluri
          </p>
          <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Floral'}
                onChange={toggleSubCategory}
              />{' '}
              Floral
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Minimalist'}
                onChange={toggleSubCategory}
              />{' '}
              Minimalist
            </p>
            <p className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value={'Elegant'}
                onChange={toggleSubCategory}
              />{' '}
              Elegant
            </p>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-4">
          <p className="text-[20px] sm:text-[24px] text-[#576B7F] font-medium tracking-wide uppercase">
            Templaturile de design
          </p>
          {/* Porduct Sort */}
          <select
            onChange={(e) => setSortType(e.target.value)}
            className="border border-[#B0C4D8] text-[#576B7F] text-sm px-3 py-2 bg-white focus:outline-none"
          >
            <option value="low-high">Preț: Mic → Mare</option>
            <option value="high-low">Preț: Mare → Mic</option>
          </select>
        </div>

        {/* Map Products */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 gap-y-6">
          {filterProducts.map((item, index) => (
            <ProductItem
              key={index}
              name={item.name}
              id={item._id}
              price={item.price}
              image={item.image}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Collection;
