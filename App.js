import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, onSnapshot, collection, addDoc, updateDoc, query, where, getDocs, serverTimestamp, writeBatch } from 'firebase/firestore';
import { Heart, Users, CheckCircle, MessageSquare, Sparkles, Clipboard, LogIn, PlusCircle, Award, X, Target, Eye, Shield, MessagesSquare, HeartHandshake, Church, Feather, Star, Globe, Mountain, Sprout } from 'lucide-react';

// --- PASO FINAL: TU PROPIA CONFIGURACIÓN DE FIREBASE ---
// 1. Sigue la guía para crear tu proyecto GRATUITO en Firebase.
// 2. Firebase te dará un objeto `firebaseConfig`. Cópialo y pégalo aquí, reemplazando este de ejemplo.
// ¡Este es el único cambio que necesitas hacer para que el proyecto sea 100% tuyo!
const firebaseConfig = {
    apiKey: "AIzaSyD0bkWaLYBM609v_nj1zU_OjGtDZOwhN9o",
    authDomain: "clics-pulsaciones-de-vida.firebaseapp.com",
    projectId: "clics-pulsaciones-de-vida",
    storageBucket: "clics-pulsaciones-de-vida.firebasestorage.app",
    messagingSenderId: "129744155640",
    appId: "1:129744155640:web:07ca4bbd19ea2ed1bb1c0d",
    measurementId: "G-BJYB4YXTZX"
  };


const appId = 'clics-pulsaciones-vida'; // ID fijo para el proyecto

// --- INICIALIZACIÓN DE FIREBASE ---
let app;
let auth;
let db;
try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
} catch (error) {
    console.error("Error al inicializar Firebase. ¿Pegaste tu configuración?", error);
}


// --- CONFIGURACIÓN DE HITOS ---
const milestonesConfig = {
  nuestrosPrimerosClic: [
    {
      id: "npc_hito_1",
      title: "Los Cimientos de la Confianza",
      description: "Este primer paso se centra en construir una base sólida de seguridad y conocimiento mutuo, donde la vulnerabilidad es bienvenida.",
      pointThreshold: 100,
      badge: { name: "Constructores de Confianza", icon: "shield" },
      quests: [
        { title: "Te confío mi mayor miedo", description: "En un momento de tranquilidad, comparte un miedo o una inseguridad que no sueles revelar. El objetivo es escuchar sin juzgar.", points: 30, type: "confio" },
        { title: "Atrévete a preguntar '¿cómo estás realmente?'", description: "Busca un momento para hacer esta pregunta y dedica al menos 10 minutos a escuchar activamente la respuesta, sin interrupciones.", points: 30, type: "atrevete" },
        { title: "Veo a través de tus ojos: Tu pasión", description: "Pídele a tu pareja que te hable sobre algo que le apasione profundamente. Intenta entender qué es lo que le emociona de ello.", points: 40, type: "perspectiva" }
      ]
    },
    {
      id: "npc_hito_2",
      title: "Comunicación que Une",
      description: "Este hito se enfoca en desarrollar habilidades de comunicación asertiva y resolución de conflictos de baja intensidad.",
      pointThreshold: 250,
      badge: { name: "Tejedores de Diálogo", icon: "chat" },
      quests: [
        { title: "Practica 'Las Bombas' en un desacuerdo menor", description: "Utilicen una técnica para abordar un desacuerdo de baja intensidad, expresando un anhelo serenamente.", points: 60, type: "perspectiva" },
        { title: "Diálogo constructivo: '¿Qué me quisiste decir?'", description: "Elige un momento de posible malentendido y, en lugar de asumir, pregunta '¿qué me quisiste decir realmente?'.", points: 50, type: "perspectiva" },
        { title: "Una lección del pasado en pareja", description: "Compartan una experiencia pasada en la que un conflicto les haya enseñado algo importante sobre su relación.", points: 40, type: "confio" }
      ]
    },
    {
      id: "npc_hito_3",
      title: "Aceptación y Perdón Diarios",
      description: "Este hito cultiva el perdón y la aceptación mutua como pilares fundamentales del amor.",
      pointThreshold: 450,
      badge: { name: "Maestros del Perdón", icon: "dove" },
      quests: [
        { title: "Un gesto de perdón o aceptación concreto", description: "Identifica un área donde necesites perdonar o aceptar a tu pareja y realiza un gesto concreto.", points: 80, type: "atrevete" },
        { title: "Historia de reconciliación que nos fortalece", description: "Compartan una experiencia en la que el perdón (dado o recibido) haya transformado una dificultad en su relación.", points: 60, type: "confio" },
        { title: "Mi 'regla de vida' para el amor", description: "Cada uno elabore y se comprometa con una pequeña 'regla de vida' personal enfocada en la paciencia o generosidad.", points: 60, type: "atrevete" }
      ]
    }
  ],
  clicSostenido: [
    {
      id: "cs_hito_1",
      title: "Profundizando en la Espiritualidad",
      description: "Este hito invita a la pareja a integrar una dimensión más profunda en su vida conyugal.",
      pointThreshold: 300,
      badge: { name: "Almas Unidas", icon: "holy_spirit" },
      quests: [
        { title: "Lectura y Reflexión en Pareja", description: "Escojan un texto relevante para las relaciones (ej. Eclesiastés 4:9-12) y reflexionen juntos sobre él.", points: 100, type: "perspectiva" },
        { title: "Nuestro 'Deber de Sentarse' espiritual", description: "Realicen un diálogo conyugal de 30 mins, enfocándose en cómo la espiritualidad se manifiesta en su vida.", points: 100, type: "confio" },
        { title: "Reflejo del amor en nuestro amor", description: "Dialoguen sobre cómo su amor puede ser un reflejo tangible de valores más grandes (generosidad, perdón).", points: 100, type: "perspectiva" }
      ]
    },
    {
      id: "cs_hito_2",
      title: "Crecimiento en la Santidad Cotidiana",
      description: "Este hito desafía a la pareja a vivir la santidad como una actitud diaria encarnada en sus acciones.",
      pointThreshold: 650,
      badge: { name: "Custodios de lo Sagrado", icon: "star" },
      quests: [
        { title: "Ascesis conyugal: una 'pequeña cosa'", description: "Elijan una 'pequeña cosa' para practicar la mortificación en beneficio del otro o de la familia durante una semana.", points: 120, type: "atrevete" },
        { title: "Viviendo una 'idea inspiradora'", description: "Seleccionen una virtud o 'idea inspiradora' (ej. humildad, paciencia) y esfuércense en vivirla como pareja.", points: 110, type: "atrevete" },
        { title: "Nuestro amor conyugal: un testimonio", description: "Reflexionen sobre cómo su amor puede ser un testimonio para su entorno y planifiquen una acción concreta.", points: 120, type: "perspectiva" }
      ]
    },
    {
      id: "cs_hito_3",
      title: "Resiliencia y Recomienzo Constante",
      description: "Este hito se enfoca en la capacidad de la pareja para superar desafíos y crecer en madurez.",
      pointThreshold: 1100,
      badge: { name: "Caminantes Fieles", icon: "mountain" },
      quests: [
        { title: "Nuestra historia de superación y 'recomienzo'", description: "Reflexionen sobre un desafío significativo que hayan enfrentado e identifiquen cómo 'recomenzaron'.", points: 150, type: "confio" },
        { title: "Nuestro proyecto de vida conyugal", description: "Elaboren o revisen un 'proyecto de vida' concreto como pareja, guiados por sus valores.", points: 150, type: "atrevete" },
        { title: "Reunión Balance: Evaluando nuestro 'Camino'", description: "Realicen una 'reunión balance' (revisión de vida), evaluando su progreso y fijando nuevas metas.", points: 150, type: "perspectiva" }
      ]
    }
  ]
};

const getBadgeIcon = (iconName) => {
    const props = { className: "w-16 h-16" };
    switch(iconName) {
        case 'shield': return <Shield {...props} color="blue" />;
        case 'chat': return <MessagesSquare {...props} color="teal" />;
        case 'dove': return <HeartHandshake {...props} color="pink" />;
        case 'holy_spirit': return <Feather {...props} color="purple" />;
        case 'star': return <Star {...props} color="orange" />;
        case 'mountain': return <Mountain {...props} color="gray" />;
        default: return <Award {...props} color="gold" />;
    }
}

// --- COMPONENTES DE LA INTERFAZ ---

const Modal = ({ children, onClose, size = 'max-w-lg' }) => ( <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in"><div className={`bg-white rounded-2xl shadow-2xl p-6 md:p-8 relative w-full ${size}`}><button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>{children}</div></div> );
const MilestoneModal = ({ milestone, onClose }) => ( <Modal onClose={onClose} size="max-w-md"><div className="text-center"><div className="flex justify-center mb-4 animate-bounce">{getBadgeIcon(milestone.badge.icon)}</div><h2 className="text-xl font-bold text-gray-800">¡Hito Completado!</h2><p className="text-amber-700 font-semibold mb-4">{milestone.badge.name}</p><h3 className="text-2xl font-bold text-gray-800 mt-6">{milestone.title}</h3><p className="text-gray-600 mt-2">{milestone.description}</p><div className="mt-8"><button onClick={onClose} className="w-full bg-rose-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors">Continuar Aventura</button></div></div></Modal> );
const GraduationModal = ({ onConfirm, onClose }) => ( <Modal onClose={onClose} size="max-w-md"><div className="text-center"><div className="flex justify-center mb-4"><Award className="w-24 h-24 text-yellow-400"/></div><h2 className="text-xl font-bold text-gray-800">¡Insignia Desbloqueada!</h2><p className="text-amber-700 font-semibold mb-4">El Camino Compartido</p><h3 className="text-2xl font-bold text-gray-800 mt-6">¡Felicidades por dar el Gran Paso!</h3><p className="text-gray-600 mt-2">Han construido una base maravillosa. Este no es el final, sino el emocionante comienzo de una nueva etapa en su viaje juntos.</p><div className="mt-8"><button onClick={onConfirm} className="w-full bg-rose-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors">Iniciar "Clic Sostenido"</button></div></div></Modal> );
const QuestCreationModal = ({ vinculoId, onClose, currentMilestoneId }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [points, setPoints] = useState(20);
    const [type, setType] = useState('atrevete');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreateQuest = async (e) => {
        e.preventDefault();
        if (!title.trim() || !description.trim() || !currentMilestoneId) { setError('Faltan datos o no hay un hito activo.'); return; }
        setIsLoading(true); setError('');
        try {
            const questsRef = collection(db, `artifacts/${appId}/public/data/vinculos/${vinculoId}/quests`);
            await addDoc(questsRef, { title, description, points: Number(points), type, completedBy: [], status: 'pending', isCustom: true, createdAt: serverTimestamp(), milestoneId: currentMilestoneId });
            onClose();
        } catch (err) { console.error("Error creando misión personalizada: ", err); setError('No se pudo crear la misión.'); } finally { setIsLoading(false); }
    };

    return ( <Modal onClose={onClose}><div className="space-y-4"><h2 className="text-2xl font-bold text-gray-800">Proponer un Momento de Verdad</h2><p className="text-sm text-gray-600">Un Momento de Verdad es una oportunidad única para fortalecer su conexión. Creen juntos las aventuras que les ayudarán a crecer.</p><form onSubmit={handleCreateQuest} className="space-y-4 pt-4"><div><label htmlFor="title" className="block text-sm font-medium text-gray-700">Título del Momento</label><p className="text-xs text-gray-500 mb-1">Dale un nombre inspirador a esta experiencia.</p><input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" /></div><div><label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label><p className="text-xs text-gray-500 mb-1">Describe la tarea o el diálogo. Sé claro y motivador.</p><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="points" className="block text-sm font-medium text-gray-700">Puntos de Conexión</label><p className="text-xs text-gray-500 mb-1">Asigna un valor al reto (5-100).</p><input type="number" id="points" value={points} onChange={(e) => setPoints(e.target.value)} min="5" max="100" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" /></div><div><label htmlFor="type" className="block text-sm font-medium text-gray-700">Clasifica el Momento</label><p className="text-xs text-gray-500 mb-1">Elige el tipo que mejor lo represente.</p><select id="type" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"><option value="atrevete">Atrévete a... ✨</option><option value="confio">Te confío que... 💬</option><option value="perspectiva">Veo a través de tus ojos 👀</option></select></div></div><div className="text-xs bg-gray-50 p-3 rounded-lg text-gray-600"><p><strong className="text-amber-600">Atrévete a... ✨</strong> se enfoca en acciones y gestos que demuestran amor.</p><p><strong className="text-blue-600">Te confío que... 💬</strong> es para abrir el corazón y compartir con vulnerabilidad.</p><p><strong className="text-purple-600">Veo a través de tus ojos 👀</strong> busca practicar la empatía y entender la perspectiva del otro.</p></div>{error && <p className="text-red-500 text-sm">{error}</p>}<div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button><button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{isLoading ? 'Creando...' : 'Crear Momento'}</button></div></form></div></Modal> );
};

const GoalProgressBar = ({ points = 0, milestones = [], vinculoData = {} }) => {
    const completedMilestones = milestones.filter(m => (vinculoData.progress?.completedMilestones || []).includes(m.id));
    const currentMilestone = milestones.find(m => !(vinculoData.progress?.completedMilestones || []).includes(m.id));
    
    const prevMilestonePoints = completedMilestones.length > 0 ? completedMilestones[completedMilestones.length-1].pointThreshold : 0;
    const goal = currentMilestone ? currentMilestone.pointThreshold : (milestones[milestones.length-1]?.pointThreshold || 1);
    
    const pointsInCurrentMilestone = points - prevMilestonePoints;
    const goalForCurrentMilestone = goal - prevMilestonePoints;
    const progressPercentage = goalForCurrentMilestone > 0 ? Math.min(100, (pointsInCurrentMilestone / goalForCurrentMilestone) * 100) : 100;

    return ( <div className="w-full bg-white p-4 rounded-2xl shadow-lg border border-gray-200"><div className="flex justify-between items-center mb-1"><h4 className="text-sm font-bold text-gray-700 flex items-center"><Target className="h-4 w-4 mr-2 text-blue-500" />{currentMilestone?.title || "Crecimiento Continuo"}</h4><span className="text-sm font-bold text-blue-600">{points} pts</span></div><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-gradient-to-r from-blue-400 to-teal-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div></div> );
};

const MataDeLaConexion = ({ completedMilestones = [] }) => {
    const BananaBunch = ({ x, y }) => (<g transform={`translate(${x}, ${y}) rotate(15)`} className="transition-opacity duration-1000"><path d="M0,0 Q10,20 0,40" stroke="#facc15" fill="none" strokeWidth="8" strokeLinecap="round"/><path d="M10,0 Q20,20 10,40" stroke="#facc15" fill="none" strokeWidth="8" strokeLinecap="round"/><path d="M-10,0 Q0,20 -10,40" stroke="#facc15" fill="none" strokeWidth="8" strokeLinecap="round"/></g>);
    const Flower = ({ x, y }) => ( <g transform={`translate(${x}, ${y}) rotate(15)`} className="transition-opacity duration-1000 animate-pulse"><path d="M 0 0 C -15 15, -15 45, 0 60 C 15 45, 15 15, 0 0 Z" fill="#7e22ce"/></g> );
    const milestonePositions = [ { x: 180, y: 150 }, { x: 120, y: 180 }, { x: 180, y: 210 } ];

    return ( <div className="flex flex-col items-center justify-center p-4 bg-green-50/50 rounded-2xl shadow-inner border border-green-200 h-full space-y-4"><h3 className="text-xl font-bold text-green-800">Frutos de Nuestra Conexión</h3><svg width="300" height="300" viewBox="50 0 200 300"><path d="M150,300 C160,250 140,150 150,80" stroke="#789c46" strokeWidth="20" fill="none" strokeLinecap="round"/><path d="M152,300 C162,250 142,150 152,80" stroke="#94b864" strokeWidth="10" fill="none" strokeLinecap="round"/><path d="M150 250 C 50 200, 50 100, 130 80" transform="rotate(10 100 100)" fill="#659a41" stroke="#476e2d" strokeWidth="2"/><path d="M150 250 C 250 200, 250 100, 170 80" transform="rotate(-10 100 100)" fill="#659a41" stroke="#476e2d" strokeWidth="2"/> {completedMilestones.map((msId, index) => ( <g key={msId}><BananaBunch x={milestonePositions[index]?.x || 150} y={milestonePositions[index]?.y || 150} /><Flower x={(milestonePositions[index]?.x || 150) + 5} y={(milestonePositions[index]?.y || 150) - 30} /></g> ))}</svg></div> );
};

const QuestCard = ({ quest, vinculoId, userId, onQuestComplete }) => {
    const [isCompletedByMe, setIsCompletedByMe] = useState(quest.completedBy.includes(userId));
    const [isCompletedByPartner, setIsCompletedByPartner] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsCompletedByMe(quest.completedBy.includes(userId));
        const partnerCompleted = quest.completedBy.length > 0 && !quest.completedBy.includes(userId);
        setIsCompletedByPartner(partnerCompleted || quest.completedBy.length === 2);
    }, [quest, userId]);

    const handleComplete = async () => {
        if (isCompletedByMe) return; setIsLoading(true);
        const vinculoRef = doc(db, `artifacts/${appId}/public/data/vinculos`, vinculoId);
        const questRef = doc(vinculoRef, "quests", quest.id);
        try {
            const updatedCompletedBy = [...quest.completedBy, userId];
            await updateDoc(questRef, { completedBy: updatedCompletedBy, status: updatedCompletedBy.length === 2 ? 'completed' : 'in_progress' });
            if (updatedCompletedBy.length === 2) {
                 const vinculoDoc = await getDoc(vinculoRef);
                 const currentData = vinculoDoc.data();
                 const newPoints = (currentData.progress.points || 0) + quest.points;
                 await updateDoc(vinculoRef, { "progress.points": newPoints });
                 onQuestComplete(newPoints);
            }
            setIsCompletedByMe(true);
        } catch (error) { console.error("Error al completar la misión: ", error); } finally { setIsLoading(false); }
    };

    const getIcon = () => {
        const props = { className: "h-6 w-6" };
        switch(quest.type) {
            case 'confio': return <MessageSquare {...props} color="blue" />;
            case 'atrevete': return <Sparkles {...props} color="orange" />;
            case 'perspectiva': return <Eye {...props} color="purple" />;
            default: return <Heart {...props} color="red" />;
        }
    }
    
    const isFullyCompleted = quest.status === 'completed';

    return ( <div className={`p-4 rounded-xl shadow-lg mb-4 border-l-4 transition-all duration-300 ${isFullyCompleted ? 'bg-green-100 border-green-500' : 'bg-white border-blue-500'}`}><div className="flex items-start"><div className="mr-4 flex-shrink-0">{getIcon()}</div><div className="flex-grow"><div className="flex justify-between items-center"><h4 className="font-bold text-gray-800">{quest.title}</h4>{quest.isCustom && <span className="text-xs font-semibold text-white bg-purple-500 px-2 py-1 rounded-full">Personalizada</span>}</div><p className="text-sm text-gray-600 mt-1">{quest.description}</p><p className="text-xs text-gray-500 mt-2 font-semibold">Recompensa: {quest.points} Puntos de Conexión</p></div></div><div className="mt-4 flex justify-between items-center"><div className="flex items-center space-x-2"><div className={`w-3 h-3 rounded-full ${isCompletedByMe ? 'bg-green-500' : 'bg-gray-300'}`} title="Tú"></div><div className={`w-3 h-3 rounded-full ${isCompletedByPartner ? 'bg-green-500' : 'bg-gray-300'}`} title="Tu pareja"></div></div>{!isFullyCompleted && (<button onClick={handleComplete} disabled={isCompletedByMe || isLoading} className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${ isCompletedByMe ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600' }`}>{isLoading ? 'Guardando...' : (isCompletedByMe ? 'Esperando...' : 'Hecho')}</button>)} {isFullyCompleted && ( <div className="flex items-center text-green-600 font-semibold"><CheckCircle className="h-5 w-5 mr-2" />¡Logrado!</div> )}</div></div> );
};

const WelcomeScreen = ({ userId, setVinculoId }) => {
    const [joinCode, setJoinCode] = useState('');
    const [mode, setMode] = useState('Nuestros primeros Clic');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userName, setUserName] = useState('');

    const handleCreateVinculo = async () => {
        if (!userName.trim()) { setError("Por favor, ingresa tu nombre."); return; }
        setIsLoading(true); setError('');
        try {
            const vinculoRef = collection(db, `artifacts/${appId}/public/data/vinculos`);
            const newVinculoDoc = await addDoc(vinculoRef, { mode, participant1: { uid: userId, name: userName }, participant2: null, progress: { points: 0, completedMilestones: [] }, createdAt: serverTimestamp() });
            await addInitialQuests(newVinculoDoc.id, mode);
            setVinculoId(newVinculoDoc.id);
        } catch (e) { console.error("Error creando vínculo:", e); setError("No se pudo crear el vínculo."); } finally { setIsLoading(false); }
    };

    const handleJoinVinculo = async () => {
        if (!joinCode.trim() || !userName.trim()) { setError("Ingresa tu nombre y un código."); return; }
        setIsLoading(true); setError('');
        try {
            const vinculoRef = doc(db, `artifacts/${appId}/public/data/vinculos`, joinCode);
            const vinculoDoc = await getDoc(vinculoRef);
            if (vinculoDoc.exists()) {
                const data = vinculoDoc.data();
                if (data.participant2) { setError("Este vínculo ya está completo."); }
                else if (data.participant1.uid === userId) { setError("No puedes unirte a un vínculo que tú creaste."); }
                else { await updateDoc(vinculoRef, { participant2: { uid: userId, name: userName } }); setVinculoId(joinCode); }
            } else { setError("Código de vínculo no encontrado."); }
        } catch (e) { console.error("Error uniéndose a vínculo:", e); setError("No se pudo unir al vínculo."); } finally { setIsLoading(false); }
    };
    
    return ( <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 flex items-center justify-center p-4"><div className="w-full max-w-lg mx-auto bg-white rounded-2xl shadow-2xl p-8 space-y-8"><div><h1 className="text-3xl font-bold text-center text-gray-800">Clics, <span className="text-rose-500">Pulsaciones de vida</span></h1><p className="text-center text-gray-500 mt-2">Construyendo conexiones significativas, un clic a la vez.</p></div><div className="space-y-4"><input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Tu nombre o apodo" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>{error && <p className="text-red-500 text-sm text-center">{error}</p>}</div><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="p-6 border border-gray-200 rounded-xl space-y-4"><div className="flex items-center space-x-3"><PlusCircle className="h-8 w-8 text-rose-500"/><h2 className="text-xl font-semibold text-gray-700">Crear un Vínculo</h2></div><p className="text-sm text-gray-600">Inicia una nueva aventura y comparte el código.</p><select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400"><option value="Nuestros primeros Clic">Nuestros primeros Clic</option><option value="Clic Sostenido">Clic Sostenido</option></select><button onClick={handleCreateVinculo} disabled={isLoading || !userName.trim()} className="w-full bg-rose-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors disabled:bg-rose-300">{isLoading ? 'Creando...' : 'Crear e Invitar'}</button></div><div className="p-6 border border-gray-200 rounded-xl space-y-4"><div className="flex items-center space-x-3"><LogIn className="h-8 w-8 text-teal-500"/><h2 className="text-xl font-semibold text-gray-700">Unirse a un Vínculo</h2></div><p className="text-sm text-gray-600">Si tu pareja ya creó un vínculo, ingresa el código.</p><input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.trim())} placeholder="Código del vínculo" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"/><button onClick={handleJoinVinculo} disabled={isLoading || !userName.trim()} className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors disabled:bg-teal-300">{isLoading ? 'Uniéndome...' : 'Unirme'}</button></div></div></div></div> );
};

const Dashboard = ({ userId, vinculoId, vinculoData, setVinculoId }) => {
    const [quests, setQuests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isQuestModalOpen, setIsQuestModalOpen] = useState(false);
    const [isGraduationModalOpen, setIsGraduationModalOpen] = useState(false);
    const [completedMilestoneModal, setCompletedMilestoneModal] = useState(null);

    const partner = vinculoData.participant1?.uid === userId ? vinculoData.participant2 : vinculoData.participant1;
    const me = vinculoData.participant1?.uid === userId ? vinculoData.participant1 : vinculoData.participant2;

    const currentMilestones = useMemo(() => milestonesConfig[vinculoData.mode === 'Clic Sostenido' ? 'clicSostenido' : 'nuestrosPrimerosClic'], [vinculoData.mode]);
    const currentMilestone = useMemo(() => currentMilestones.find(m => !(vinculoData.progress?.completedMilestones || []).includes(m.id)), [currentMilestones, vinculoData.progress]);
    
    useEffect(() => {
        if (!currentMilestone) { setQuests([]); setIsLoading(false); return; }
        setIsLoading(true);
        const questsRef = collection(db, `artifacts/${appId}/public/data/vinculos/${vinculoId}/quests`);
        const q = query(questsRef, where("milestoneId", "==", currentMilestone.id));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const questsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setQuests(questsData);
            setIsLoading(false);
        }, (error) => { console.error("Error fetching quests:", error); setIsLoading(false); });
        return () => unsubscribe();
    }, [vinculoId, currentMilestone]);
    
    const handleCopyCode = () => {
        const el = document.createElement('textarea');
        el.value = vinculoId;
        document.body.appendChild(el);
        el.select();
        try { document.execCommand('copy'); alert('¡Código copiado!'); }
        catch (err) { alert('Error al copiar el código. Por favor, cópialo manualmente.'); }
        document.body.removeChild(el);
    };
    
    const confirmGraduate = async () => {
        const vinculoRef = doc(db, `artifacts/${appId}/public/data/vinculos`, vinculoId);
        await updateDoc(vinculoRef, { mode: 'Clic Sostenido', "progress.points": 0, "progress.completedMilestones": [] });
        await addInitialQuests(vinculoId, 'Clic Sostenido'); 
        setIsGraduationModalOpen(false);
    };

    const handleQuestComplete = async (newPoints) => {
        if (currentMilestone && newPoints >= currentMilestone.pointThreshold) {
            const vinculoRef = doc(db, `artifacts/${appId}/public/data/vinculos`, vinculoId);
            const newCompletedMilestones = [...(vinculoData.progress?.completedMilestones || []), currentMilestone.id];
            await updateDoc(vinculoRef, { "progress.completedMilestones": newCompletedMilestones });
            setCompletedMilestoneModal(currentMilestone);
        }
    };

    return ( <> {isQuestModalOpen && <QuestCreationModal vinculoId={vinculoId} onClose={() => setIsQuestModalOpen(false)} currentMilestoneId={currentMilestone?.id}/>} {isGraduationModalOpen && <GraduationModal onConfirm={confirmGraduate} onClose={() => setIsGraduationModalOpen(false)} />} {completedMilestoneModal && <MilestoneModal milestone={completedMilestoneModal} onClose={() => setCompletedMilestoneModal(null)} />} <div className="min-h-screen bg-gray-50"><header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10"><div><h1 className="text-2xl font-bold text-gray-800">Clics, <span className="text-rose-500">Pulsaciones de vida</span></h1><p className="text-sm text-teal-600 font-semibold">{vinculoData.mode}</p></div><div className="text-right"><div className="flex items-center space-x-2 text-gray-700"><Users className="h-5 w-5"/><span className="font-semibold">{me?.name || 'Tú'} & {partner?.name || 'Tu pareja'}</span></div><button onClick={() => setVinculoId(null)} className="text-sm text-gray-500 hover:text-red-500">Salir</button></div></header><main className="p-4 md:p-8">{!partner && ( <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-lg mb-6 shadow-lg" role="alert"><p className="font-bold">¡Casi listos!</p><p className="text-sm">Comparte este código con tu pareja para que pueda unirse:</p><div className="mt-2 flex items-center bg-white p-2 rounded-md justify-between"><code className="text-amber-900 font-mono text-lg">{vinculoId}</code><button onClick={handleCopyCode} className="p-2 rounded-md bg-amber-200 hover:bg-amber-300"><Clipboard className="h-5 w-5 text-amber-800" /></button></div></div> )} {vinculoData.mode === 'Nuestros primeros Clic' && partner && !currentMilestone && ( <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg mb-6 shadow-lg flex flex-col sm:flex-row items-center justify-between"><div className="mb-3 sm:mb-0"><p className="font-bold">¡Felicidades, han completado todos los hitos!</p><p className="text-sm">Han construido una base sólida. Es momento de celebrar su compromiso.</p></div><button onClick={() => setIsGraduationModalOpen(true)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 w-full sm:w-auto"><Award size={20} /><span>Dimos el Gran Paso</span></button></div> )} <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"><div className="lg:col-span-1 space-y-8"><MataDeLaConexion completedMilestones={vinculoData.progress?.completedMilestones || []} /><GoalProgressBar points={vinculoData.progress?.points || 0} milestones={currentMilestones} vinculoData={vinculoData}/></div><div className="lg:col-span-2"><div className="flex justify-between items-center mb-4"><h2 className="text-2xl font-bold text-gray-700">Momentos de Verdad</h2><button onClick={() => setIsQuestModalOpen(true)} className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2 text-sm" disabled={!currentMilestone}><PlusCircle size={20} /><span>Proponer Momento</span></button></div>{isLoading ? <p>Cargando Momentos...</p> : quests.map(quest => ( <QuestCard key={quest.id} quest={quest} vinculoId={vinculoId} userId={userId} onQuestComplete={handleQuestComplete}/> )) } {!isLoading && quests.length === 0 && (<div className="text-center py-10 bg-white rounded-lg shadow-md"><h3 className="text-lg font-semibold text-gray-700">{currentMilestone ? `Próximo Hito: ${currentMilestone.title}` : "¡Aventura Completada!"}</h3><p className="text-gray-500 mt-2">{currentMilestone ? "Los nuevos Momentos de Verdad aparecerán pronto." : "Han finalizado todos los momentos de esta etapa."}</p></div>) }</div></div></main></div></> );
};

const addInitialQuests = async (vinculoId, mode) => {
    const milestones = milestonesConfig[mode === 'Clic Sostenido' ? 'clicSostenido' : 'nuestrosPrimerosClic'];
    const batch = writeBatch(db);
    milestones.forEach(milestone => {
        milestone.quests.forEach(quest => {
            const questRef = doc(collection(db, `artifacts/${appId}/public/data/vinculos/${vinculoId}/quests`));
            batch.set(questRef, { ...quest, milestoneId: milestone.id, completedBy: [], status: 'pending', createdAt: serverTimestamp(), isCustom: false });
        });
    });
    await batch.commit();
};

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, errorInfo) { console.error("Error capturado:", error, errorInfo); }
  render() {
    if (this.state.hasError) {
      return (<div className="p-4 m-4 bg-red-100 border-l-4 border-red-500 text-red-700"><h1 className="font-bold">¡Ups! Algo salió mal.</h1><p>Por favor, intenta refrescar la página. Si el error persiste, contacta al soporte.</p><pre className="mt-2 text-xs">{this.state.error?.toString()}</pre></div>);
    }
    return this.props.children;
  }
}

function AppContent() {
    const [appState, setAppState] = useState('AUTHENTICATING'); // AUTHENTICATING, NO_VINCULO, VINCULO_LOADED, ERROR
    const [userId, setUserId] = useState(null);
    const [vinculoId, setVinculoId] = useState(null);
    const [vinculoData, setVinculoData] = useState(null);
    
    useEffect(() => {
        if (!auth) {
            setAppState('ERROR');
            return;
        }
        const initAuth = async () => {
            try {
                await signInAnonymously(auth);
            } catch (error) {
                console.error("Auth Error:", error);
                setAppState('ERROR');
            }
        };
        initAuth();

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUserId(user ? user.uid : null);
            if (!user) {
              setAppState('AUTHENTICATING');
              setVinculoId(null);
              setVinculoData(null);
            }
        });
        return () => unsubscribe();
    }, []);

    const findUserVinculo = useCallback(async (uid) => {
        if (!uid) return null;
        const vRef = collection(db, `artifacts/${appId}/public/data/vinculos`);
        const q1 = query(vRef, where("participant1.uid", "==", uid));
        const u1 = await getDocs(q1);
        if (!u1.empty) return u1.docs[0].id;
        const q2 = query(vRef, where("participant2.uid", "==", uid));
        const u2 = await getDocs(q2);
        if (!u2.empty) return u2.docs[0].id;
        return null;
    }, []);

    useEffect(() => {
        if (userId) {
            findUserVinculo(userId).then(id => {
                if (id) {
                    setVinculoId(id);
                } else {
                    setAppState('NO_VINCULO');
                }
            });
        } else if(appState === 'AUTHENTICATING' && auth.currentUser === null) {
           // Still waiting for auth to complete
        } else if (!userId) {
            setAppState('NO_VINCULO');
        }
    }, [userId, findUserVinculo, appState]);
    
    useEffect(() => {
        let unsubscribe;
        if (vinculoId) {
            const vinculoRef = doc(db, `artifacts/${appId}/public/data/vinculos`, vinculoId);
            unsubscribe = onSnapshot(vinculoRef, async (docSnap) => {
                if (docSnap.exists()) {
                    setVinculoData(docSnap.data());
                    setAppState('VINCULO_LOADED');
                } else {
                    setVinculoId(null);
                    setAppState('NO_VINCULO');
                }
            }, (error) => {
                console.error("Error en Snapshot:", error);
                setAppState('ERROR');
            });
        }
        return () => { if (unsubscribe) unsubscribe(); };
    }, [vinculoId]);

    if (appState === 'AUTHENTICATING' || (userId && !vinculoData && appState !== 'NO_VINCULO')) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100"><p>Autenticando y buscando tu vínculo...</p></div>;
    }

    if (appState === 'NO_VINCULO') {
        return <WelcomeScreen userId={userId} setVinculoId={setVinculoId} />;
    }

    if (appState === 'VINCULO_LOADED' && vinculoData) {
        return <Dashboard userId={userId} vinculoId={vinculoId} vinculoData={vinculoData} setVinculoId={setVinculoId} />;
    }
    
    if (appState === 'ERROR') {
         return <div className="p-4 m-4 bg-red-100 border-l-4 border-red-500 text-red-700"><h1 className="font-bold">Error de Configuración</h1><p>No se pudo conectar con la base de datos. Si estás en Visual Studio Code, asegúrate de haber pegado tu configuración de Firebase en el archivo App.js.</p></div>
    }

    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><p>Cargando Clics...</p></div>;
}

export default function App() {
    return (
        <ErrorBoundary>
            <AppContent />
        </ErrorBoundary>
    )
}
