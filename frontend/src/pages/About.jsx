import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className="pt-6 border-t border-gray-200">
      <div className="my-10 flex flex-col md:flex-row gap-10 md:ml-10">
        <img
          className="w-full md:max-w-[450px]"
          src={assets.about_img}
          alt=""
        />
        <div className="flex flex-col justify-start gap-6 md:w-2/4 text-[#6385A8] md:pl-10">
          <h2 className="text-[28px] sm:text-[44px] text-accent font-script mt-0 mt-2">
            Despre mine
          </h2>
          <p>
            Prima invitație am creat-o acum trei ani, pentru sora mea. A fost un
            proiect de suflet care a stârnit admirație — oamenii au remarcat
            stilul meu și au început să-mi ceară designuri pentru propriile
            evenimente.
          </p>
          <p>
            Sunt Patricia, designer de produse digitale personalizate pentru
            nunți și evenimente speciale. Cu timpul, am adunat în portofoliu
            zeci de template-uri elegante și în urmă cu un an am lansat o pagină
            de Instagram unde am început să le împărtășesc publicului. De
            atunci, tot mai mulți clienți mi-au încredințat povestea lor.
          </p>
          <p>
            Acum, am creat acest site tocmai pentru a simplifica tot procesul —
            ca tu să îți poți alege cu ușurință un model care îți place, să-l
            personalizezi rapid și să primești instant un fișier PDF gata de
            print.
          </p>
          <p>
            Cred că fiecare eveniment merită atenție și stil, iar designul
            potrivit face diferența.
          </p>
        </div>
      </div>
      {/* Contact Section */}
      <div className="my-20 px-4 md:px-10 max-w-[1100px] mx-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          {/* Left Column: Text */}
          <div className="text-[#878F97] md:max-w-[450px]">
            <p className="text-[20px] sm:text-[24px] text-[#6385A8] font-medium tracking-wide uppercase mb-4">
              Contactează-mă
            </p>
            <p className="mb-2">
              Ai o întrebare despre un produs, vrei o personalizare diferită sau
              pur și simplu vrei să colaborăm?
            </p>
            <p>Scrie-mi un mesaj, răspund cu drag în cel mai scurt timp.</p>
          </div>

          {/* Right Column: Contact Image */}
          <img
            src={assets.img_contact}
            alt="Contact Info"
            className="w-full md:w-[500px] md:h-auto object-contain"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
