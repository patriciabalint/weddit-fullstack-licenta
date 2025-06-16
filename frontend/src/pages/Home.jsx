import BestSeller from '../components/BestSeller';
import Categories from '../components/Categories';
import Hero from '../components/Hero';
import OurPolicy from '../components/OurPolicy';

const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />

      <BestSeller />
      <OurPolicy />
    </div>
  );
};

export default Home;
