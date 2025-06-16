import { useState, useRef, useEffect, useContext } from 'react';
import { Rnd } from 'react-rnd';
import panou from '../assets/panou.png'; // Imaginea de bază pentru template
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { Link, useNavigate, useParams } from 'react-router-dom'; // Păstrăm Link și useNavigate, chiar dacă eslint le semnalează ca nefolosite momentan în logica directă a componentei Editor, pot fi utile în antet.
import { generatePDF } from '../utils/generatePDF';
import { toast } from 'react-toastify'; // Pentru notificări

// Asigură-te că ID-urile se potrivesc cu cele din baza ta de date pentru produse
const ALL_PRESETS = {
  '684dae795cfca6cf3db74e43': {
    image: panou,
    fields: [
      {
        id: 1,
        label: 'Titlu',
        value: 'WELCOME TO',
        x: 90,
        y: 120,
        fontSize: 40,
        fontFamily: 'serif',
      },
      {
        id: 2,
        label: 'Nume eveniment',
        value: "Debora's bridal shower",
        x: 50,
        y: 210,
        fontSize: 32,
        fontFamily: 'AmeliaGiovani',
      },
      {
        id: 3,
        label: 'Dată',
        value: '01 IUNIE 25',
        x: 140,
        y: 440,
        fontSize: 36,
        fontFamily: 'serif',
      },
    ],
  },
  // ADAUGĂ AICI ALTE PRESET-URI PENTRU CELELALTE DESIGN-URI ALE TALE
};

export default function Editor() {
  const { productId } = useParams();
  const { token, backendUrl, userId, setToken, setCartItems, getCartCount } =
    useContext(ShopContext); // userId ar trebui să fie disponibil din context/token

  const currentPreset =
    ALL_PRESETS[productId] || ALL_PRESETS['684dae795cfca6cf3db74e43'];

  // State-urile componentei
  const [fields, setFields] = useState(
    currentPreset ? currentPreset.fields : []
  );
  const [pdfName, setPdfName] = useState('Design Personalizat');
  const [selectedId, setSelectedId] = useState(null); // <--- DECLARATIA CORECTA
  const editorRef = useRef();
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showVerticalGuide, setShowVerticalGuide] = useState(false);
  const [showHorizontalGuide, setShowHorizontalGuide] = useState(false);
  const downloadRef = useRef(); // Ref pentru zona de export PDF

  const navigate = useNavigate(); // <--- DECLARATIA CORECTA

  const editorWidth = 400; // Constante pentru ghidaje
  const editorHeight = 600;
  const centerX = editorWidth / 2;
  const centerY = editorHeight / 2;

  // Funcții de manipulare a câmpurilor și Undo/Redo
  const saveStateForUndo = () => {
    setUndoStack((prev) => [...prev, fields]);
    setRedoStack([]);
  };

  const updateField = (id, updates) => {
    saveStateForUndo();
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const last = undoStack[undoStack.length - 1];
      setUndoStack((prev) => prev.slice(0, -1));
      setRedoStack((prev) => [...prev, fields]);
      setFields(last);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];
      setRedoStack((prev) => prev.slice(0, -1));
      setUndoStack((prev) => [...prev, fields]);
      setFields(next);
    }
  };

  const handleAddField = () => {
    // <--- FUNCTIA CORECT DECLARATA IN SCOPE
    saveStateForUndo(); // Salvează starea curentă înainte de a adăuga
    const newField = {
      id: Date.now(),
      label: 'Text nou',
      value: 'Text nou',
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: 'serif',
    };
    setFields((prev) => [...prev, newField]);
    setSelectedId(newField.id); // Selectează automat noul câmp
  };

  // Funcția de Salvare a designului în baza de date
  const handleSaveDesign = async () => {
    if (!token || !userId || !productId) {
      toast.error(
        'Nu ești autentificat sau lipsesc datele necesare pentru salvare.'
      );
      return;
    }
    try {
      const response = await fetch(backendUrl + '/api/design/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({ userId, productId, fields }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Design salvat cu succes!');
      } else {
        toast.error('Eroare la salvarea designului: ' + data.message);
      }
    } catch (error) {
      console.error('Eroare la salvarea designului:', error);
      toast.error('Eroare de rețea la salvarea designului.');
    }
  };

  // Funcția de Încărcare a designului din baza de date
  // MARCAT CA useCallback PENTRU A EVITA WARNING-UL DE DEPENDENTA REACT HOOK
  const loadDesign = async () => {
    if (!token || !userId || !productId) {
      console.log(
        'Nu se poate încărca designul salvat: token, userId sau productId lipsesc.'
      );
      return;
    }
    try {
      const response = await fetch(backendUrl + '/api/design/load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token: token,
        },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await response.json();
      if (data.success && data.fields && data.fields.length > 0) {
        setFields(data.fields);
        toast.info('Designul salvat anterior a fost încărcat.');
      } else {
        setFields(currentPreset.fields); // Asigură-te că se setează preset-ul dacă nu e design salvat
        toast.info(
          data.message ||
            'Nu s-a găsit un design salvat pentru acest produs. Se folosește template-ul implicit.'
        );
      }
    } catch (error) {
      console.error('Eroare la încărcarea designului:', error);
      toast.error('Eroare de rețea la încărcarea designului.');
    }
  };

  // useEffect pentru a încărca designul la montarea componentei
  useEffect(() => {
    loadDesign(); // <--- Apelăm direct funcția
  }, [token, userId, productId, currentPreset, loadDesign]); // <--- ADAUGAT loadDesign CA DEPENDENTA

  // useEffect pentru click în afara editorului
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (editorRef.current && !editorRef.current.contains(event.target)) {
        setSelectedId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // useEffect pentru taste rapide (Undo/Redo)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        handleUndo();
      }
      if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [fields, undoStack, redoStack]); // Dependențele sunt OK aici

  return (
    <div className="w-full bg-white">
      <header className="relative z-10 w-screen">
        <div className="bg-white w-full px-6">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between py-3">
            <img src={assets.logo2} className="w-28 flex-shrink-0" alt="Logo" />
            <div className="flex items-center justify-between flex-grow max-w-[850px] ml-[160px] mr-auto">
              <div className="relative bg-gray-100 flex items-center px-4 py-2">
                <input
                  value={pdfName}
                  onChange={(e) => setPdfName(e.target.value)}
                  placeholder="Nume design"
                  className="bg-transparent text-base w-[240px] outline-none"
                />
                <img
                  src={assets.pencil_icon}
                  className="w-5 h-5 ml-3"
                  alt="pencil"
                />
              </div>
              {/* BUTOANE SEPARATE AICI */}
              <button
                onClick={handleSaveDesign}
                className="bg-[#6385A8] text-white px-6 py-2 text-sm tracking-wide flex items-center gap-2 ml-4"
              >
                <img src={assets.save_icon} alt="Save" className="w-5 h-5" />
                SALVEAZĂ DESIGN
              </button>
              <button
                onClick={() =>
                  generatePDF(downloadRef.current, `${pdfName}.pdf`)
                }
                className="bg-green-600 text-white px-6 py-2 text-sm tracking-wide flex items-center gap-2 ml-4"
              >
                <img src={assets.save_icon} alt="PDF" className="w-5 h-5" />{' '}
                {/* Poți folosi o altă iconiță pentru PDF */}
                GENEREAZĂ PDF
              </button>
            </div>
            <div className="flex items-center gap-6">
              <div className="group relative">
                <img
                  onClick={() => (token ? null : navigate('/login'))}
                  className="w-4 cursor-pointer"
                  src={assets.profile_icon}
                  alt="profile"
                />
                {token && (
                  <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-2 z-50">
                    <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
                      <p className="cursor-pointer hover:text-black">
                        My Profile
                      </p>
                      <p
                        onClick={() => navigate('/orders')}
                        className="cursor-pointer hover:text-black"
                      >
                        Orders
                      </p>
                      <p
                        onClick={() => {
                          navigate('/login');
                          localStorage.removeItem('token');
                          setToken('');
                          setCartItems({});
                        }}
                        className="cursor-pointer hover:text-black"
                      >
                        Logout
                      </p>
                    </div>
                  </div>
                )}
              </div>
              <Link to="/cart" className="relative">
                <img
                  src={assets.cart_icon}
                  className="w-4 min-w-4"
                  alt="cart"
                />
                <span className="absolute right-[-5px] bottom-[-5px] bg-[#6385A8] text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-300 z-10" />
      </header>

      <section className="bg-[#f5f5f5] w-screen relative left-1/2 -ml-[50vw] right-1/2 -mr-[50vw] py-10">
        <div className="flex justify-center">
          <div
            ref={editorRef}
            className="relative w-[400px] h-[600px] bg-white shadow border"
          >
            {/* Buton ADAUGĂ TEXT */}
            <button
              onClick={handleAddField}
              className="absolute top-2 right-2 bg-gray-200 text-sm px-2 py-1 flex items-center gap-1 z-20"
            >
              <span className="text-lg">+</span> ADAUGĂ TEXT
            </button>

            {/* Zona de export PDF */}
            <div
              ref={downloadRef}
              className="relative w-[400px] h-[600px] bg-white shadow border"
            >
              <img
                src={currentPreset.image}
                alt="design"
                className="w-full h-full object-cover absolute top-0 left-0 z-0"
              />

              {fields.map((f) => (
                <Rnd
                  key={f.id}
                  default={{ x: f.x, y: f.y, width: 'auto', height: 'auto' }}
                  position={{ x: f.x, y: f.y }}
                  onDragStop={(e, d) => {
                    const elementWidth = 200;
                    const elementHeight = f.fontSize * 2; // Aproximare
                    const elementCenterX = d.x + elementWidth / 2;
                    const elementCenterY = d.y + elementHeight / 2;

                    const isVerticallyCentered =
                      Math.abs(elementCenterX - centerX) < 5;
                    const isHorizontallyCentered =
                      Math.abs(elementCenterY - centerY) < 5;

                    const snappedX = isVerticallyCentered
                      ? centerX - elementWidth / 2
                      : d.x;
                    const snappedY = isHorizontallyCentered
                      ? centerY - elementHeight / 2
                      : d.y;

                    updateField(f.id, { x: snappedX, y: snappedY });
                    setShowVerticalGuide(isVerticallyCentered);
                    setShowHorizontalGuide(isHorizontallyCentered);
                  }}
                  enableResizing={{
                    top: true,
                    right: true,
                    bottom: true,
                    left: true,
                    topRight: true,
                    bottomRight: true,
                    bottomLeft: true,
                    topLeft: true,
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    const newFontSize = Math.max(
                      12,
                      parseFloat(ref.offsetHeight * 0.5)
                    );
                    updateField(f.id, {
                      fontSize: newFontSize,
                      x: position.x,
                      y: position.y,
                    });
                  }}
                  bounds="parent"
                  style={{
                    border: f.id === selectedId ? '1px dashed #2563eb' : 'none', // <--- selectedId folosit aici
                    padding: '4px',
                    background: 'transparent',
                    display: 'inline-block',
                    resize: 'none',
                    outline: 'none',
                    cursor: 'move',
                  }}
                  onClick={() => setSelectedId(f.id)} // <--- setSelectedId folosit aici
                >
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) =>
                      updateField(f.id, { value: e.target.innerText.trim() })
                    }
                    style={{
                      fontSize: `${f.fontSize}px`,
                      fontFamily: f.fontFamily || 'serif',
                      color: '#6b705c',
                      textAlign: 'center',
                      whiteSpace: 'pre-wrap',
                      minWidth: '10px',
                      minHeight: '10px',
                      outline: 'none',
                    }}
                  >
                    {f.value}
                  </div>

                  {selectedId === f.id && ( // <--- selectedId folosit aici
                    <button
                      onClick={() =>
                        setFields(fields.filter((fld) => fld.id !== f.id))
                      }
                      className="absolute -top-2 -right-2 bg-accent text-white w-5 h-5 text-xs rounded-full shadow hover:bg-[#c35f5f] z-10"
                    >
                      ×
                    </button>
                  )}
                </Rnd>
              ))}
            </div>
            {showVerticalGuide && (
              <div className="absolute top-0 left-1/2 w-[1px] h-full bg-pink-500 opacity-60 pointer-events-none z-10" />
            )}
            {showHorizontalGuide && (
              <div className="absolute top-1/2 left-0 h-[1px] w-full bg-pink-500 opacity-60 pointer-events-none z-10" />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
