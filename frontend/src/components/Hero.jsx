import { assets } from '../assets/assets';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-[#F0EEED] w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
      <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between px-4 sm:px-16 pt-10 pb-16">
        <div className="w-full sm:w-[48%] flex flex-col justify-center sm:pt-5">
          <h2 className="text-[#576B7F] font-neacademia italic font-medium text-2xl sm:text-4xl uppercase tracking-wide mb-0">
            Fă-ți nunta unică cu
          </h2>

          <h1 className="text-[#D5BA8B] font-script text-4xl sm:text-6xl leading-snug mb-4">
            Designuri personalizabile
          </h1>

          <p className="text-[#797979] font-neacademia text-base sm:text-lg leading-relaxed max-w-lg mb-10">
            Creează invitații, meniuri și carduri unice. Editezi textul direct,
            folosești AI pentru sugestii creative și descarci PDF-ul gata de
            print.
          </p>

          <div>
            <Link to="/collection">
              <button className="inline-block bg-[#6B87A3] text-white font-semibold px-6 py-3 tracking-wide hover:bg-[#5f7993] transition duration-200">
                ÎNCEPE ACUM
              </button>
            </Link>
          </div>
        </div>

        <div className="w-full sm:w-[42%] flex mt-20 sm:mt-0">
          <img
            src={assets.hero_img}
            alt="mockup invitație"
            className="w-[300px] sm:w-[360px] max-w-full"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
