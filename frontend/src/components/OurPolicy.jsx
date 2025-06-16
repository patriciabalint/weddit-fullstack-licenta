import { assets } from '../assets/assets';

const OurPolicy = () => {
  return (
    <div className="w-full bg-[#B1C2D3] py-16 px-4 mb-24">
      <div className="flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center text-sm sm:text-base text-white">
        <div className="max-w-xs mx-auto">
          <img
            src={assets.policy_buy}
            className="w-10 h-10 m-auto mb-4 object-contain"
            alt="icon"
          />
          <p className="text-[#416387] uppercase text-[18px] font-medium mb-3">
            Alege designul
          </p>
          <p>
            Răsfoiește colecția noastră de invitații, meniuri, carduri și
            selectează designul dorit.
          </p>
        </div>
        <div className="max-w-xs mx-auto">
          <img
            src={assets.policy_edit}
            className="w-10 h-10 m-auto mb-4 object-contain"
            alt="icon"
          />
          <p className="text-[#416387] uppercase text-[18px] font-medium mb-3">
            Personalizează-l ușor
          </p>
          <p>
            Editează textul direct în platformă – nume, dată, locație. Primești
            sugestii AI și vezi preview instant.
          </p>
        </div>
        <div className="max-w-xs mx-auto">
          <img
            src={assets.policy_download}
            className="w-10 h-10 m-auto mb-4 object-contain"
            alt="icon"
          />
          <p className="text-[#416387] uppercase text-[18px] font-medium mb-3">
            Plătește și descarcă
          </p>
          <p>
            Finalizează comanda și descarcă PDF-ul tău personalizat, gata de
            print sau trimitere digitală.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OurPolicy;
