import { useState, useRef, useEffect, useContext, useCallback } from 'react';
import { Rnd } from 'react-rnd';
import panou from '../assets/panou.png'; // Imaginea de bază pentru template
import { assets } from '../assets/assets';
import { ShopContext } from '../context/ShopContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { generatePDF } from '../utils/generatePDF';
import { toast } from 'react-toastify';

// Asigură-te că ID-urile se potrivesc cu cele din baza ta de date pentru produse
const ALL_PRESETS = {
  '684dae795cfca6cf3db74e43': {
    // Exemplu de Product ID (ID-ul produsului pentru panou)
    image: panou,
    fields: [
      {
        id: 1,
        label: 'Titlu',
        value: 'WELCOME TO',
        x: 100,
        y: 130,
        fontSize: 32,
        fontFamily: 'serif',
        color: '#6b705c',
      },
      {
        id: 2,
        label: 'Nume eveniment',
        value: "Debora's bridal shower",
        x: 10,
        y: 220,
        fontSize: 60,
        fontFamily: 'Amelia Giovani',
        color: '#6b705c',
      },
      {
        id: 3,
        label: 'Dată',
        value: '01 IUNIE 25',
        x: 120,
        y: 460,
        fontSize: 28,
        fontFamily: 'serif',
        color: '#6b705c',
      },
    ],
  },
  // ADAUGĂ AICI ALTE PRESET-URI PENTRU CELELALTE DESIGN-URI ALE TALE
};

export default function Editor() {
  const { productId } = useParams();
  // Extragem doar ce este folosit DIRECT în Editor.js din context.
  // setToken și setCartItems sunt folosite în ShopContext.jsx, nu aici.
  const { token, backendUrl, getCartCount, logout } = useContext(ShopContext);

  const currentPreset =
    ALL_PRESETS[productId] || ALL_PRESETS['684dae795cfca6cf3db74e43'];

  const [fields, setFields] = useState(
    currentPreset ? currentPreset.fields : []
  );
  const [pdfName, setPdfName] = useState('Design Personalizat');
  const [selectedId, setSelectedId] = useState(null);
  const editorRef = useRef();
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showVerticalGuide, setShowVerticalGuide] = useState(false);
  const [showHorizontalGuide, setShowHorizontalGuide] = useState(false);
  const downloadRef = useRef();

  const navigate = useNavigate();

  const editorWidth = 400;
  const editorHeight = 600;
  const centerX = editorWidth / 2;
  const centerY = editorHeight / 2;

  // Funcții de manipulare a câmpurilor și Undo/Redo
  const saveStateForUndo = () => {
    setUndoStack((prev) => [...prev, fields]);
    setRedoStack([]);
  };

  const updateField = (id, updates) => {
    const oldField = fields.find((f) => f.id === id);
    if (
      oldField &&
      Object.keys(updates).some((key) => oldField[key] !== updates[key])
    ) {
      saveStateForUndo();
    }
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const handleUndo = useCallback(() => {
    if (undoStack.length > 0) {
      const last = undoStack[undoStack.length - 1];
      setUndoStack((prev) => prev.slice(0, -1));
      setRedoStack((prev) => [...prev, fields]);
      setFields(last);
    }
  }, [undoStack, fields]);

  const handleRedo = useCallback(() => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];
      setRedoStack((prev) => prev.slice(0, -1));
      setUndoStack((prev) => [...prev, fields]);
      setFields(next);
    }
  }, [redoStack, fields]);

  const handleAddField = useCallback(() => {
    saveStateForUndo();
    const newField = {
      id: Date.now(),
      label: 'Text nou',
      value: 'Text nou',
      x: 50,
      y: 50,
      fontSize: 24,
      fontFamily: 'serif',
      color: '#6b705c',
    };
    setFields((prev) => [...prev, newField]);
    setSelectedId(newField.id);
  }, [fields]); // Adaugă 'fields' ca dependență pentru a asigura saveStateForUndo corect

  // DEFINIREA FUNCȚIEI deleteField (rezolvă 'deleteField is not defined')
  const deleteField = useCallback(
    (id) => {
      saveStateForUndo();
      setFields((prevFields) => prevFields.filter((field) => field.id !== id));
      setSelectedId(null);
    },
    [fields]
  ); // Adaugă 'fields' ca dependență pentru a asigura saveStateForUndo corect

  const handleSaveDesign = async () => {
    if (!token || !productId) {
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, designData: fields }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Design salvat cu succes!');
      } else {
        toast.error(
          'Eroare la salvarea designului: ' +
            (data.message || 'Eroare necunoscută.')
        );
        if (data.message && data.message.includes('token') && logout) {
          logout();
        }
      }
    } catch (error) {
      console.error('Eroare la salvarea designului:', error);
      toast.error('Eroare de rețea la salvarea designului.');
    }
  };

  const loadDesign = useCallback(async () => {
    if (!token || !productId) {
      setFields(
        ALL_PRESETS[productId]?.fields ||
          ALL_PRESETS['684dae795cfca6cf3db74e43'].fields
      );
      toast.info(
        'Nu ești autentificat sau nu s-a găsit un design salvat pentru acest produs.'
      );
      return;
    }
    try {
      const response = await fetch(backendUrl + '/api/design/load', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId }),
      });

      const data = await response.json();
      if (data.success && data.designData && data.designData.length > 0) {
        setFields(data.designData);
        //toast.info('Designul salvat anterior a fost încărcat.');
      } else {
        setFields(
          ALL_PRESETS[productId]?.fields ||
            ALL_PRESETS['684dae795cfca6cf3db74e43'].fields
        );
        //toast.info('Nu s-a găsit un design salvat pentru acest produs.');
      }
    } catch (error) {
      console.error('Eroare la încărcarea designului:', error);
      //toast.error('Eroare de rețea la încărcarea designului.');
    }
  }, [token, productId, backendUrl]);

  // useEffect pentru a încărca designul la montarea componentei
  useEffect(() => {
    console.log('Editor - useEffect [loadDesign] is running.');
    loadDesign();
  }, [loadDesign]);

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
  }, [handleUndo, handleRedo]);

  return (
    <div className="w-full bg-white">
      <header className="relative z-10 w-screen">
        <div className="bg-white w-full px-6">
          <div className="max-w-[1280px] mx-auto flex items-center justify-between py-3">
            <Link to="/">
              <img
                src={assets.logo2}
                className="w-28 flex-shrink-0"
                alt="Logo"
              />
            </Link>
            <div className="flex items-center w-full">
              {/* INPUT */}
              <div className="relative bg-gray-100 flex items-center px-4 py-2 ml-40">
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

              {/* GRUP BUTOANE */}
              <div className="flex items-center gap-3 ml-40">
                <button
                  onClick={handleSaveDesign}
                  className="bg-[#D4BB90] text-white px-6 py-2 text-sm tracking-wide flex items-center gap-2"
                >
                  <img src={assets.save_icon} alt="Save" className="w-5 h-5" />
                  SALVEAZĂ DESIGN
                </button>
                <button
                  onClick={() =>
                    generatePDF(downloadRef.current, `${pdfName}.pdf`)
                  }
                  className="bg-[#6385A8] text-white px-6 py-2 text-sm tracking-wide flex items-center gap-2"
                >
                  <img
                    src={assets.download_icon}
                    alt="PDF"
                    className="w-5 h-5"
                  />
                  GENEREAZĂ PDF
                </button>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="group relative">
                <img
                  onClick={() => (token ? null : navigate('/login'))}
                  className="w-4 min-w-4"
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
                          logout();
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
                    const elementHeight = f.fontSize * 2;
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
                    border: f.id === selectedId ? '1px dashed #2563eb' : 'none',
                    padding: '4px',
                    background: 'transparent',
                    display: 'inline-block',
                    resize: 'none',
                    outline: 'none',
                    cursor: 'move',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(f.id);
                  }}
                >
                  <div
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      updateField(f.id, { value: e.target.innerText.trim() });
                      setSelectedId(null);
                    }}
                    style={{
                      fontSize: `${f.fontSize}px`,
                      fontFamily: f.fontFamily || 'serif',
                      color: f.color || '#6b705c',
                      textAlign: 'center',
                      whiteSpace: 'pre-wrap',
                      minWidth: '10px',
                      minHeight: '10px',
                      outline: 'none',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    {f.value}
                  </div>

                  {selectedId === f.id && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteField(f.id); // Apelăm funcția definită
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 text-xs rounded-full shadow hover:bg-red-700 z-10 flex items-center justify-center"
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
