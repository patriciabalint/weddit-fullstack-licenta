import BestSeller from '../components/BestSeller';
import Categories from '../components/Categories';
import Hero from '../components/Hero';
import StepsSection from '../components/StepsSection';

const Home = () => {
  return (
    <div>
      <Hero />
      <Categories />
      <BestSeller />
      <StepsSection />
    </div>
  );
};

export default Home;
