import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import { assets } from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts';

const Product = () => {
  const { productId } = useParams();
  const { products, currency, addToCart } = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null;
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, products]);

  return productData ? (
    <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
      {/*Product Data */}
      <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
        {/*Product Images*/}
        <div className="flex-1 flex flex-col-reverse gap-1 sm:flex-row sm:gap-4">
          <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                src={item}
                key={index}
                className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                alt=""
              />
            ))}
          </div>
          <div className="w-full sm:w-[75%] ">
            <img className="w-full h-auto" src={image} alt="" />
          </div>
        </div>

        {/*Product Info*/}
        <div className="flex-1">
          <h1 className="font-medium text-2xl mt-2 uppercase text-[#515F6E] tracking-[0.05em]">
            {productData.name}
          </h1>
          <div className=" flex items-center gap-1 mt-2">
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_icon} alt="" className="w-3 5" />
            <img src={assets.star_dull_icon} alt="" className="w-3 5" />
            <p className="pl-2 text-muted">(12)</p>
          </div>
          <p className="mt-5 text-3xl font-medium text-accent">
            {productData.price}
            <span className="text-[12px] ml-1">{currency}</span>
          </p>
          <p className="mt-5 text-gray-500 md:w-4/5">
            {productData.description}
          </p>

          <button
            onClick={() => addToCart(productData._id)}
            className="text-white px-8 py-3 text-sm bg-[#6385A8] mt-6 uppercase hover:shadow-sm hover:bg-gray-200 transition"
          >
            Adaugă în coș
          </button>
          <hr className="mt-8 sm:w-4/5" />
          <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1 tracking-[0.05em]">
            <p> ✦ Cumpărare instantă </p>
            <p> ✦ Editare text rapida</p>
            <p> ✦ PDF gata de print</p>
          </div>
        </div>
      </div>

      {/*Description & Review Section*/}
      <div className="mt-20">
        <div className="flex">
          <b className="border px-5 py-3 text-sm text-[#515F6E]">Description</b>
          <p className="border px-5 py-3 text-sm text-[#515F6E]">
            Reviews (12)
          </p>
        </div>
        <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
          <p>
            Acest produs face parte dintr-o colecție digitală dedicată nunților
            și altor evenimente speciale. Designul este creat cu grijă pentru a
            adăuga un plus de rafinament și coerență estetică oricărui moment
            important.
          </p>
          <p>
            Poți edita cu ușurință textul — numele mirilor, data, locația sau
            alte detalii personalizabile. După achiziție, vei primi un fișier
            PDF de înaltă calitate, pregătit pentru tipar sau trimitere
            digitală. Totul este optimizat pentru a-ți oferi o experiență
            simplă, elegantă și eficientă.
          </p>
        </div>
      </div>

      {/*display related products*/}

      <RelatedProducts
        category={productData.category}
        subCategory={productData.subCategory}
      />
    </div>
  ) : (
    <div className=" opacity-0"></div>
  );
};

export default Product;
