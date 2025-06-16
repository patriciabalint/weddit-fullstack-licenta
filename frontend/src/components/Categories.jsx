import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';

const categories = [
  {
    name: 'INVITATII',
    image: assets.cat_invitatii,
    category: 'Invitatii',
  },
  {
    name: 'MENIURI',
    image: assets.cat_meniuri,
    category: 'Meniuri',
  },
  {
    name: 'LISTE INVITATI',
    image: assets.cat_liste,
    category: 'Liste invitati',
  },
  {
    name: 'PENTRU BRIDAL',
    image: assets.cat_bridal,
    category: 'Pentru Bridal',
  },
  {
    name: 'ALTELE',
    image: assets.cat_altele,
    category: 'Altele',
  },
];

const Categories = () => {
  return (
    <div className="flex flex-wrap justify-center gap-[80px] mt-10 mb-20 pt-10">
      {categories.map((cat, index) => (
        <Link
          to="/collection"
          state={{ category: cat.category }}
          key={index}
          className="flex flex-col items-center"
        >
          <img
            src={cat.image}
            alt={cat.name}
            className="w-[160px] h-[160px] object-cover"
          />
          <p className="text-[18px] mt-[28px] text-[#B69165] uppercase text-center tracking-wide">
            {cat.name}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Categories;
