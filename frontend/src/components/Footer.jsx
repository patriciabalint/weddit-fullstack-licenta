import { assets } from '../assets/assets';

const Footer = () => {
  return (
    <div className="bg-white">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm">
        <div>
          <img
            src={assets.logo2}
            className="mb-5 w-32"
            alt="Weddit Design logo"
          />
          <p className="w-full md:w-2/3 text-muted">
            Descoperă designuri de nuntă personalizabile. Invită-ți stilul în
            cele mai speciale momente.
          </p>
          <div className="flex gap-4 mt-4">
            <a
              href="https://www.instagram.com/_patricia_design/?next=%2F"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={assets.instagram_icon}
                alt="Instagram"
                className="w-6"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/patricia-balint-240878294/"
              target="_blank"
              rel="noreferrer"
            >
              <img src={assets.linkedin_icon} alt="LinkedIn" className="w-6" />
            </a>
            <a
              href="https://www.upwork.com/freelancers/~017e06cf423f3e9560"
              target="_blank"
              rel="noreferrer"
            >
              <img src={assets.upwork_icon} alt="Upwork" className="w-6" />
            </a>
          </div>
        </div>

        <div>
          <p className="text-xl font-medium mb-5 text-accent">INFORMAȚII</p>
          <ul className="flex flex-col gap-1 text-muted">
            <li>Home</li>
            <li>About us</li>
            <li>Privacy policy</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5 text-accent">CONTACT:</p>
          <ul className="flex flex-col gap-1 text-muted">
            <li>0736637674</li>
            <li>patricia.balint@yahoo.com</li>
          </ul>
        </div>
      </div>

      <div>
        <hr />
        <p className="py-5 text-xs text-center text-muted opacity-60">
          © 2024 Weddit Design. Toate drepturile rezervate.
        </p>
      </div>
    </div>
  );
};

export default Footer;
