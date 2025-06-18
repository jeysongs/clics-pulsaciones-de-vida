const { useState, useEffect, useCallback, useMemo } = React;

// --- PASO FINAL: TU CONFIGURACIÓN DE FIREBASE ---
// JEY: ¡Listo! Pega aquí la configuración de tu proyecto "ClicsConexionesSignificativas"
// que copiaste de la consola de Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyC4VSUXTz2n8gg5NnaYOX7omYy2yjv9loQ",
  authDomain: "clicsconexionessignificativas.firebaseapp.com",
  projectId: "clicsconexionessignificativas",
  storageBucket: "clicsconexionessignificativas.firebasestorage.app",
  messagingSenderId: "702293551235",
  appId: "1:702293551235:web:d69ca93d39f984ee8013b6",
  measurementId: "G-2RGQKS2VLS"
};


// ADN del proyecto actualizado con tu ID final.
const appId = 'clicsconexionessignificativas';

// --- INICIALIZACIÓN DE FIREBASE ---
let app;
let auth;
let db;
let storage; // Nueva variable para Firebase Storage
try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
    storage = firebase.storage(); // Inicializamos Storage
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
    const icons = { shield: '🛡️', chat: '💬', dove: '🕊️', holy_spirit: '🕊️', star: '⭐', mountain: '⛰️' };
    return <span style={{fontSize: '3rem'}}>{icons[iconName] || '🏆'}</span>;
}

// --- COMPONENTES DE LA INTERFAZ ---
const Modal = ({ children, onClose, size = 'max-w-lg' }) => ( <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4 backdrop-blur-sm animate-fade-in"><div className={`bg-white rounded-2xl shadow-2xl p-6 md:p-8 relative w-full ${size}`}><button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">X</button>{children}</div></div> );
const MilestoneModal = ({ milestone, onClose }) => ( <Modal onClose={onClose} size="max-w-md"><div className="text-center"><div className="flex justify-center mb-4 animate-bounce">{getBadgeIcon(milestone.badge.icon)}</div><h2 className="text-xl font-bold text-gray-800">¡Hito Alcanzado!</h2><p className="text-amber-700 font-semibold mb-4">{milestone.badge.name}</p><h3 className="text-2xl font-bold text-gray-800 mt-6">{milestone.title}</h3><p className="text-gray-600 mt-2">{milestone.description}</p><div className="mt-8"><button onClick={onClose} className="w-full bg-rose-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors">Continuar Aventura</button></div></div></Modal> );
const GraduationModal = ({ onConfirm, onClose }) => ( <Modal onClose={onClose} size="max-w-md"><div className="text-center"><div className="flex justify-center mb-4">🏆</div><h2 className="text-xl font-bold text-gray-800">¡Insignia Desbloqueada!</h2><p className="text-amber-700 font-semibold mb-4">El Camino Compartido</p><h3 className="text-2xl font-bold text-gray-800 mt-6">¡Felicidades por dar el Gran Paso!</h3><p className="text-gray-600 mt-2">Han construido una base maravillosa. Este no es el final, sino el emocionante comienzo de una nueva etapa en su viaje juntos.</p><div className="mt-8"><button onClick={onConfirm} className="w-full bg-rose-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors">Iniciar "Clic Sostenido"</button></div></div></Modal> );
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
            await db.collection(`artifacts/${appId}/public/data/vinculos`).doc(vinculoId).collection('quests').add({ title, description, points: Number(points), type, completedBy: [], status: 'pending', isCustom: true, createdAt: firebase.firestore.FieldValue.serverTimestamp(), milestoneId: currentMilestoneId });
            onClose();
        } catch (err) { console.error("Error creando misión personalizada: ", err); setError('No se pudo crear la misión.'); } finally { setIsLoading(false); }
    };

    return ( <Modal onClose={onClose}><div className="space-y-4"><h2 className="text-2xl font-bold text-gray-800">Proponer un Momento de Verdad</h2><p className="text-sm text-gray-600">Un Momento de Verdad es una oportunidad única para fortalecer su conexión. Creen juntos las aventuras que les ayudarán a crecer.</p><form onSubmit={handleCreateQuest} className="space-y-4 pt-4"><div><label htmlFor="title" className="block text-sm font-medium text-gray-700">Título del Momento</label><p className="text-xs text-gray-500 mb-1">Dale un nombre inspirador a esta experiencia.</p><input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" /></div><div><label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label><p className="text-xs text-gray-500 mb-1">Describe la tarea o el diálogo. Sé claro y motivador.</p><textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"></textarea></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label htmlFor="points" className="block text-sm font-medium text-gray-700">Puntos de Conexión</label><p className="text-xs text-gray-500 mb-1">Asigna un valor al reto (5-100).</p><input type="number" id="points" value={points} onChange={(e) => setPoints(e.target.value)} min="5" max="100" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" /></div><div><label htmlFor="type" className="block text-sm font-medium text-gray-700">Clasifica el Momento</label><p className="text-xs text-gray-500 mb-1">Elige el tipo que mejor lo represente.</p><select id="type" value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"><option value="atrevete">Atrévete a... ✨</option><option value="confio">Te confío que... 💬</option><option value="perspectiva">Veo a través de tus ojos 👀</option></select></div></div><div className="text-xs bg-gray-50 p-3 rounded-lg text-gray-600"><p><strong className="text-amber-600">Atrévete a... ✨</strong> se enfoca en acciones y gestos que demuestran amor.</p><p><strong className="text-blue-600">Te confío que... 💬</strong> es para abrir el corazón y compartir con vulnerabilidad.</p><p><strong className="text-purple-600">Veo a través de tus ojos 👀</strong> busca practicar la empatía y entender la perspectiva del otro.</p></div>{error && <p className="text-red-500 text-sm">{error}</p>}<div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancelar</button><button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">{isLoading ? 'Creando...' : 'Crear Momento'}</button></div></form></div></Modal> );
};
const GoalProgressBar = ({ points = 0, milestones = [], vinculoData = {}, displayContext = "general" }) => {
    const completedMilestones = milestones.filter(m => (vinculoData.progress?.completedMilestones || []).includes(m.id));
    const currentMilestone = milestones.find(m => !(vinculoData.progress?.completedMilestones || []).includes(m.id));
    
    const prevMilestonePoints = completedMilestones.length > 0 ? completedMilestones[completedMilestones.length-1].pointThreshold : 0;
    const goal = currentMilestone ? currentMilestone.pointThreshold : (milestones[milestones.length-1]?.pointThreshold || 1);
    
    const pointsInCurrentMilestone = points - prevMilestonePoints;
    const goalForCurrentMilestone = goal - prevMilestonePoints;
    const progressPercentage = goalForCurrentMilestone > 0 ? Math.min(100, (pointsInCurrentMilestone / goalForCurrentMilestone) * 100) : 100;

    let barTitle = currentMilestone?.title || "Crecimiento Continuo";
    if (displayContext === "myProfile") {
        barTitle = "Trayectoria hacia ti";
    } else if (displayContext === "partnerProfile") {
        barTitle = "Trayectoria hacia mi";
    }
    return ( <div className="w-full bg-white p-4 rounded-2xl shadow-lg border border-gray-200"><div className="flex justify-between items-center mb-1"><h4 className="text-sm font-bold text-gray-700 flex items-center">🎯 {barTitle}</h4><span className="text-sm font-bold text-blue-600">{points} pts</span></div><div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-gradient-to-r from-blue-400 to-teal-400 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progressPercentage}%` }}></div></div></div> );
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
        // Con esta chispa de código, el sistema entiende al instante si tu compañero(a) de aventura
        // ya ha dado su "clic" en esta misión. Así, la magia de la conexión fluye sin tropiezos,
        // mostrándoles a ambos el camino recorrido y el que aún les espera, ¡juntos!
        const partnerHasCompleted = quest.completedBy.some(completerId => completerId !== userId);
        setIsCompletedByPartner(partnerHasCompleted);
    }, [quest, userId]);

    const handleComplete = async () => {
        if (isCompletedByMe) return; setIsLoading(true);
        const vinculoRef = db.collection(`artifacts/${appId}/public/data/vinculos`).doc(vinculoId);
        const questRef = vinculoRef.collection("quests").doc(quest.id);
        try {
            const updatedCompletedBy = [...quest.completedBy, userId];
            await questRef.update({ completedBy: updatedCompletedBy, status: updatedCompletedBy.length === 2 ? 'completed' : 'in_progress' });
            if (updatedCompletedBy.length === 2) { // Ambos han completado
                // Actualizamos también con la fecha de finalización para el historial
                await questRef.update({
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                });
                 const vinculoDoc = await vinculoRef.get();
                 const currentData = vinculoDoc.data();
                 const newPoints = (currentData.progress.points || 0) + quest.points;
                 await vinculoRef.update({ "progress.points": newPoints });
                 onQuestComplete(newPoints);
            }
            setIsCompletedByMe(true);
        } catch (error) { console.error("Error al completar la misión: ", error); } finally { setIsLoading(false); }
    };

    const getIcon = () => {
        const icons = { confio: '💬', atrevete: '✨', perspectiva: '👀' };
        return <span style={{fontSize: '1.5rem'}}>{icons[quest.type] || '❤️'}</span>;
    }
    
    const isFullyCompleted = quest.status === 'completed';

    return ( <div className={`p-4 rounded-xl shadow-lg mb-4 border-l-4 transition-all duration-300 ${isFullyCompleted ? 'bg-green-100 border-green-500' : 'bg-white border-blue-500'}`}><div className="flex items-start"><div className="mr-4 flex-shrink-0">{getIcon()}</div><div className="flex-grow"><div className="flex justify-between items-center"><h4 className="font-bold text-gray-800">{quest.title}</h4>{quest.isCustom && <span className="text-xs font-semibold text-white bg-purple-500 px-2 py-1 rounded-full">Personalizada</span>}</div><p className="text-sm text-gray-600 mt-1">{quest.description}</p><p className="text-xs text-gray-500 mt-2 font-semibold">Recompensa: {quest.points} Puntos de Conexión</p></div></div><div className="mt-4 flex justify-between items-center"><div className="flex items-center space-x-2"><div className={`w-3 h-3 rounded-full ${isCompletedByMe ? 'bg-green-500' : 'bg-gray-300'}`} title="Tú"></div><div className={`w-3 h-3 rounded-full ${isCompletedByPartner ? 'bg-green-500' : 'bg-gray-300'}`} title="Tu pareja"></div></div>{!isFullyCompleted && (<button onClick={handleComplete} disabled={isCompletedByMe || isLoading} className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors ${ isCompletedByMe ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600' }`}>{isLoading ? 'Guardando...' : (isCompletedByMe ? 'Esperando...' : 'Hecho')}</button>)} {isFullyCompleted && ( <div className="flex items-center text-green-600 font-semibold">✔️ ¡Logrado!</div> )}</div></div> );
};
const WelcomeScreen = ({ userId, setVinculoId }) => {
    const [joinCode, setJoinCode] = useState('');
    const [mode, setMode] = useState('Nuestros primeros Clic');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [userName, setUserName] = useState('');

    const handleCreateVinculo = async () => {
        if (!userName.trim() || !userId) { setError("Por favor, ingresa tu nombre."); return; }
        setIsLoading(true); setError('');
        try {
            const newVinculoDoc = await db.collection(`artifacts/${appId}/public/data/vinculos`).add({ mode, participant1: { uid: userId, name: userName }, participant2: null, progress: { points: 0, completedMilestones: [] }, createdAt: firebase.firestore.FieldValue.serverTimestamp() });
            await addInitialQuests(newVinculoDoc.id, mode);
            setVinculoId(newVinculoDoc.id);
        } catch (e) { console.error("Error creando vínculo:", e); setError("No se pudo crear el vínculo. Revisa las reglas de seguridad de Firestore."); } finally { setIsLoading(false); }
    };

    const handleJoinVinculo = async () => {
        if (!joinCode.trim() || !userName.trim() || !userId) { setError("Ingresa tu nombre y un código."); return; }
        setIsLoading(true); setError('');
        try {
            const vinculoRef = db.collection(`artifacts/${appId}/public/data/vinculos`).doc(joinCode);
            const vinculoDoc = await vinculoRef.get();
            if (vinculoDoc.exists) {
                const data = vinculoDoc.data();
                if (data.participant2) { setError("Este vínculo ya está completo."); }
                else if (data.participant1.uid === userId) { setError("No puedes unirte a un vínculo que tú creaste."); }
                else { await vinculoRef.update({ participant2: { uid: userId, name: userName } }); setVinculoId(joinCode); }
            } else { setError("Código de vínculo no encontrado."); }
        } catch (e) { console.error("Error uniéndose a vínculo:", e); setError("No se pudo unir al vínculo. Revisa las reglas de seguridad de Firestore."); } finally { setIsLoading(false); }
    };
    
    return ( 
        <div className="min-h-screen bg-gradient-to-br from-rose-50 to-teal-50 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 space-y-8">
                <div className="mb-6">
                    <h1 className="text-center font-bold">
                        <span className="block text-5xl text-rose-500" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.25)' }}>cliCS</span>
                        <span className="block text-2xl text-gray-800 mt-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.25)' }}>Conexiones Significativas</span>
                    </h1>
                    <p className="text-center text-gray-700 mt-2 font-bold" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.20)' }}>Un clic a la vez 💞</p>
                </div>
                <div className="space-y-4">
                                        <p className="text-justify text-gray-600 text-sm mb-4">Te acompañamos a fortalecer la relación con tu pareja de manera profesional, progresiva, sana y agradable.</p>
                    <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="¿Cómo te gusta que te llame?" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 border/*  */ border-gray-200 rounded-xl space-y-4">
                        <div className="flex items-center space-x-3">➕<h2 className="text-xl font-semibold text-gray-700">Crear un Vínculo</h2></div>
                        <p className="text-sm text-gray-600">Elige el tipo de conexión que mejor resuene con su etapa actual y prepárense para cultivar juntos algo hermoso.</p>
                        <select value={mode} onChange={(e) => setMode(e.target.value)} className="w-full px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-400">
                            <option value="Nuestros primeros Clic">Nuestros primeros Clic</option>
                            <option value="Clic Sostenido">Clic Sostenido</option>
                        </select>
                        <button onClick={handleCreateVinculo} disabled={isLoading || !userName.trim()} className="w-full bg-rose-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-rose-600 transition-colors disabled:bg-rose-300">{isLoading ? 'Creando...' : 'Crear e Invitar'}</button>
                    </div>
                    <div className="p-6 border border-gray-200 rounded-xl space-y-4">
                        <div className="flex items-center space-x-3">➡️<h2 className="text-xl font-semibold text-gray-700">Unirse a un Vínculo</h2></div>
                        <p className="text-sm text-gray-600">¿Tu pareja ya encendió la chispa de los clics? Ingresa aquí el código que te compartió y ¡déjate llevar!</p>
                        <input type="text" value={joinCode} onChange={(e) => setJoinCode(e.target.value.trim())} placeholder="Código del vínculo" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"/>
                        <button onClick={handleJoinVinculo} disabled={isLoading || !userName.trim()} className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition-colors disabled:bg-teal-300">{isLoading ? 'Uniéndome...' : 'Unirme'}</button>
                    </div>
                </div>
            </div>
        </div> 
    );
};
const Dashboard = ({ userId, vinculoId, vinculoData, setVinculoId, onViewProfile }) => {
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
        const unsubscribe = db.collection(`artifacts/${appId}/public/data/vinculos`).doc(vinculoId).collection('quests').where("milestoneId", "==", currentMilestone.id).onSnapshot(querySnapshot => {
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
        const vinculoRef = db.collection(`artifacts/${appId}/public/data/vinculos`).doc(vinculoId);
        await vinculoRef.update({ mode: 'Clic Sostenido', "progress.points": 0, "progress.completedMilestones": [] });
        await addInitialQuests(vinculoId, 'Clic Sostenido'); 
        setIsGraduationModalOpen(false);
    };

    const handleQuestComplete = async (newPoints) => {
        if (currentMilestone && newPoints >= currentMilestone.pointThreshold) {
            const vinculoRef = db.collection(`artifacts/${appId}/public/data/vinculos`).doc(vinculoId);
            const newCompletedMilestones = [...(vinculoData.progress?.completedMilestones || []), currentMilestone.id];
            await vinculoRef.update({ "progress.completedMilestones": newCompletedMilestones });
            setCompletedMilestoneModal(currentMilestone);
        }
    };

    return ( <> {isQuestModalOpen && <QuestCreationModal vinculoId={vinculoId} onClose={() => setIsQuestModalOpen(false)} currentMilestoneId={currentMilestone?.id}/>} {isGraduationModalOpen && <GraduationModal onConfirm={confirmGraduate} onClose={() => setIsGraduationModalOpen(false)} />} {completedMilestoneModal && <MilestoneModal milestone={completedMilestoneModal} onClose={() => setCompletedMilestoneModal(null)} />} <div className="min-h-screen bg-gray-50"><header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-10"><div>
        <h1 className="font-bold">
            <span className="block text-5xl text-rose-500" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.25)' }}>cliCS</span>
            <span className="block text-2xl text-gray-800 mt-1" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.25)' }}>Conexiones Significativas</span>
        </h1>
        <p className="text-sm text-teal-600 font-semibold">{vinculoData.mode}</p></div>
        <div className="text-right">
            <div className="flex items-center space-x-2 text-gray-700 mb-1">👥<span className="font-semibold">{me?.name || 'Tú'} & {partner?.name || 'Tu pareja'}</span></div>
            <button onClick={() => setVinculoId(null)} className="text-sm text-gray-500 hover:text-red-500 mr-2">Salir</button>
            {/* Botón para ir al Perfil */}
            <button onClick={onViewProfile} className="text-sm text-white bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded-md">Cofre</button>
        </div></header><main className="p-4 md:p-8">{!partner && ( <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-700 p-4 rounded-lg mb-6 shadow-lg" role="alert"><p className="font-bold">¡Casi listos!</p><p className="text-sm">Comparte este código con tu pareja para que pueda unirse:</p><div className="mt-2 flex items-center bg-white p-2 rounded-md justify-between"><code className="text-amber-900 font-mono text-lg">{vinculoId}</code><button onClick={handleCopyCode} className="p-2 rounded-md bg-amber-200 hover:bg-amber-300">📋</button></div></div> )} {vinculoData.mode === 'Nuestros primeros Clic' && partner && !currentMilestone && ( <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-800 p-4 rounded-lg mb-6 shadow-lg flex flex-col sm:flex-row items-center justify-between"><div className="mb-3 sm:mb-0"><p className="font-bold">¡Felicidades, han completado todos los hitos!</p><p className="text-sm">Han construido una base sólida. Es momento de celebrar su compromiso.</p></div><button onClick={() => setIsGraduationModalOpen(true)} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2 w-full sm:w-auto">🏆<span>Dimos el Gran Paso</span></button></div> )} 
            {/* El contenedor de Momentos de Verdad ahora ocupa todo el ancho en pantallas grandes */}
            <div className="w-full"> {/* Cambiado de lg:col-span-3 a w-full para ocupar el ancho del main */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-700">Momentos de Verdad</h2>
                    <button onClick={() => setIsQuestModalOpen(true)} className="bg-purple-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors flex items-center space-x-2 text-sm" disabled={!currentMilestone}>➕<span>Proponer Momento</span></button>
                </div>
                {isLoading ? (
                    <p>Cargando Momentos...</p>
                ) : quests.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Columna: Te confío que... */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-blue-600 border-b-2 border-blue-200 pb-2">Te confío que... 💬</h3>
                            {quests.filter(q => q.type === 'confio').map(quest => (
                                <QuestCard key={quest.id} quest={quest} vinculoId={vinculoId} userId={userId} onQuestComplete={handleQuestComplete}/>
                            ))}
                            {quests.filter(q => q.type === 'confio').length === 0 && <p className="text-sm text-gray-500 italic">No hay momentos de este tipo por ahora.</p>}
                        </div>
                        {/* Columna: Atrévete a... */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-amber-600 border-b-2 border-amber-200 pb-2">Atrévete a... ✨</h3>
                            {quests.filter(q => q.type === 'atrevete').map(quest => (
                                <QuestCard key={quest.id} quest={quest} vinculoId={vinculoId} userId={userId} onQuestComplete={handleQuestComplete}/>
                            ))}
                            {quests.filter(q => q.type === 'atrevete').length === 0 && <p className="text-sm text-gray-500 italic">No hay momentos de este tipo por ahora.</p>}
                        </div>
                        {/* Columna: Veo a través de tus ojos */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-purple-600 border-b-2 border-purple-200 pb-2">Veo a través de tus ojos 👀</h3>
                            {quests.filter(q => q.type === 'perspectiva').map(quest => (
                                <QuestCard key={quest.id} quest={quest} vinculoId={vinculoId} userId={userId} onQuestComplete={handleQuestComplete}/>
                            ))}
                            {quests.filter(q => q.type === 'perspectiva').length === 0 && <p className="text-sm text-gray-500 italic">No hay momentos de este tipo por ahora.</p>}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-10 bg-white rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-gray-700">{currentMilestone ? `Próximo Hito: ${currentMilestone.title}` : "¡Aventura Completada!"}</h3>
                        <p className="text-gray-500 mt-2">{currentMilestone ? "Los nuevos Momentos de Verdad aparecerán pronto." : "Han finalizado todos los momentos de esta etapa."}</p>
                    </div>
                )}
            </div>
        </main></div></> );
};
const addInitialQuests = async (vinculoId, mode) => {
    const milestones = milestonesConfig[mode === 'Clic Sostenido' ? 'clicSostenido' : 'nuestrosPrimerosClic'];
    const batch = db.batch();
    milestones.forEach(milestone => {
        milestone.quests.forEach(quest => {
            const questRef = db.collection(`artifacts/${appId}/public/data/vinculos`).doc(vinculoId).collection('quests').doc();
            batch.set(questRef, { ...quest, milestoneId: milestone.id, completedBy: [], status: 'pending', createdAt: firebase.firestore.FieldValue.serverTimestamp(), isCustom: false });
        });
    });
    await batch.commit();
};
// --- NUEVO COMPONENTE: PANTALLA DE PERFIL ---
const ProfileScreen = ({ userId, vinculoId, vinculoData, onBackToDashboard }) => {
    // Estados para los campos del perfil del usuario actual
    const [dob, setDob] = useState(''); 
    const [personalPhrase, setPersonalPhrase] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    // Estados para el perfil de pareja
    const [relationshipStartDate, setRelationshipStartDate] = useState('');
    const [couplePhrase, setCouplePhrase] = useState('');
    // Estados para las URLs de las fotos
    const [myPhotoUrl, setMyPhotoUrl] = useState(null);
    const [couplePhotoUrl, setCouplePhotoUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [myCurrentMood, setMyCurrentMood] = useState(''); // Estado para el ánimo personal
    const [coupleCurrentMood, setCoupleCurrentMood] = useState(''); // Estado para el ánimo de pareja

    const [errorMessage, setErrorMessage] = useState('');
    
    // Estado para el historial de actividad
    const [activityHistory, setActivityHistory] = useState([]);

    // Determinar si el usuario actual es participant1 o participant2
    const currentUserKey = vinculoData.participant1?.uid === userId ? 'participant1' : 'participant2';
    // Determinar la clave del compañero/a
    const partnerUserKey = currentUserKey === 'participant1' ? 'participant2' : 'participant1';
    const partnerProfile = vinculoData[partnerUserKey]?.profile;
    
    // Obtener los hitos actuales y los completados para la barra de progreso y el árbol
    const currentMilestones = useMemo(() => milestonesConfig[vinculoData.mode === 'Clic Sostenido' ? 'clicSostenido' : 'nuestrosPrimerosClic'], [vinculoData.mode]);

    useEffect(() => {
        if (vinculoData && currentUserKey) {
            const userProfile = vinculoData[currentUserKey]?.profile;
            if (userProfile) {
                setDob(userProfile.dob || '');
                setPersonalPhrase(userProfile.personalPhrase || '');
                setMyPhotoUrl(userProfile.photoURL || null);
                setMyCurrentMood(userProfile.currentMood || ''); // Cargar estado anímico personal
            }
            if (vinculoData?.coupleProfile) {
                setRelationshipStartDate(vinculoData.coupleProfile.relationshipStartDate || '');
                setCouplePhrase(vinculoData.coupleProfile.couplePhrase || '');
                setCouplePhotoUrl(vinculoData.coupleProfile.couplePhotoURL || null);
                setCoupleCurrentMood(vinculoData.coupleProfile.currentMood || ''); // Cargar estado anímico de pareja
            }
        }

        const fetchActivityHistory = async () => {
            if (!vinculoId) return;
            let combinedHistory = [];
            try {
                console.log("[Historial] Buscando Momentos de Verdad completados...");
                const questsSnapshot = await db.collection(`artifacts/${appId}/public/data/vinculos`)
                                               .doc(vinculoId)
                                               .collection('quests')
                                               .where('status', '==', 'completed')
                                               .orderBy('updatedAt', 'desc')
                                               .get();
                questsSnapshot.docs.forEach(doc => {
                    const questData = { type: 'quest', id: doc.id, ...doc.data() };
                    console.log("[Historial] Momento encontrado:", questData);
                    combinedHistory.push(questData);
                });

                console.log("[Historial] Buscando Hitos completados...");
                const completedMilestoneIds = vinculoData.progress?.completedMilestones || [];
                const allMilestones = [...milestonesConfig.nuestrosPrimerosClic, ...milestonesConfig.clicSostenido];
                
                completedMilestoneIds.forEach(msId => {
                    const milestoneDetail = allMilestones.find(m => m.id === msId);
                    if (milestoneDetail) {
                        const milestoneData = { type: 'milestone', id: msId, title: milestoneDetail.title, badgeName: milestoneDetail.badge.name, badgeIcon: milestoneDetail.badge.icon, simulatedDate: new Date(Date.now() - completedMilestoneIds.indexOf(msId) * 100000) };
                        console.log("[Historial] Hito encontrado:", milestoneData);
                        combinedHistory.push(milestoneData);
                    }
                });
                
                combinedHistory.sort((a, b) => {
                    const dateA = a.updatedAt?.toDate() || a.simulatedDate;
                    const dateB = b.updatedAt?.toDate() || b.simulatedDate;
                    if (!dateA && !dateB) return 0;
                    if (!dateA) return 1;
                    if (!dateB) return -1;
                    return dateB.getTime() - dateA.getTime();
                });
                console.log("[Historial] Historial combinado y ordenado:", combinedHistory);
                setActivityHistory(combinedHistory);
            } catch (error) {
                console.error("Error al obtener el historial de actividad:", error);
            }
        };
        if (vinculoId) fetchActivityHistory();
    }, [vinculoData, currentUserKey, vinculoId]);

    const handleSaveProfile = async () => {
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const vinculoRef = db.collection(`artifacts/${appId}/public/data/vinculos`).doc(vinculoId);
            const updateData = {};
            updateData[`${currentUserKey}.profile.dob`] = dob;
            updateData[`${currentUserKey}.profile.personalPhrase`] = personalPhrase;
            if (myPhotoUrl) updateData[`${currentUserKey}.profile.photoURL`] = myPhotoUrl;
            updateData[`${currentUserKey}.profile.currentMood`] = myCurrentMood; // Guardar estado anímico personal
            await vinculoRef.update(updateData);
            setSuccessMessage('¡Tu información ha sido guardada en el Cofre!');
        } catch (error) {
            console.error("Error al guardar el perfil:", error);
            setErrorMessage('No pudimos guardar tus cambios. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCoupleProfile = async () => {
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');
        try {
            const vinculoRef = db.collection(`artifacts/${appId}/public/data/vinculos`).doc(vinculoId);
            const updateCoupleData = {
                'coupleProfile.relationshipStartDate': relationshipStartDate,
                'coupleProfile.couplePhrase': couplePhrase,
                'coupleProfile.currentMood': coupleCurrentMood, // Guardar estado anímico de pareja
            };
            if (couplePhotoUrl) updateCoupleData['coupleProfile.couplePhotoURL'] = couplePhotoUrl; // Guardar si existe
            await vinculoRef.update(updateCoupleData);
            setSuccessMessage('¡La información de pareja ha sido guardada en el Cofre!');
        } catch (error) {
            console.error("Error al guardar el perfil de pareja:", error);
            setErrorMessage('No pudimos guardar los cambios de pareja. Inténtalo de nuevo.');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhotoUpload = async (event, type) => {
        const file = event.target.files[0];
        if (!file) return;
        setUploading(true);
        setErrorMessage('');
        setSuccessMessage('');
        const filePath = `profiles/${vinculoId}/${type === 'user' ? userId : 'couple'}/${file.name}`;
        const fileRef = storage.ref(filePath);
        try {
            const snapshot = await fileRef.put(file);
            const photoURL = await snapshot.ref.getDownloadURL();
            const vinculoDocRef = db.collection(`artifacts/${appId}/public/data/vinculos`).doc(vinculoId);
            if (type === 'user') {
                setMyPhotoUrl(photoURL);
                await vinculoDocRef.update({ [`${currentUserKey}.profile.photoURL`]: photoURL });
                setSuccessMessage('¡Tu foto de perfil ha sido actualizada!');
            } else if (type === 'couple') {
                setCouplePhotoUrl(photoURL);
                await vinculoDocRef.update({ 'coupleProfile.couplePhotoURL': photoURL });
                setSuccessMessage('¡La foto de pareja ha sido actualizada!');
            }
        } catch (error) {
            console.error("Error al subir la foto:", error);
            setErrorMessage('No se pudo subir la foto. Inténtalo de nuevo (asegúrate que sea una imagen y no muy pesada).');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <header className="mb-8">
                <button onClick={onBackToDashboard} className="text-yellow-600 hover:text-yellow-700">&larr; Volver al Panel</button>
                <h1 className="text-4xl font-bold text-gray-800 text-center mt-4">Nuestro Cofre 🎁</h1>
            </header>
            {/* Contenedor principal de 4 columnas para el contenido del Cofre (excepto Trayectoria) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {/* Columna 1 (1 de 4): "De Ti" */}
                <div className="md:col-span-1 space-y-8">
                    <section className="bg-white p-6 rounded-lg shadow-md h-full">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">{vinculoData[currentUserKey]?.name || 'Tú'} ⭐</h2>
                        <div className="flex flex-col items-center space-y-4">
                            {myPhotoUrl ? (
                                <img src={myPhotoUrl} alt="Tu perfil" className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow-md"/>
                            ) : (
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">👤</div>
                            )}
                            <label htmlFor="userPhotoUpload" className="cursor-pointer text-sm text-yellow-600 hover:text-yellow-700 font-semibold">
                                {uploading && !myPhotoUrl ? 'Subiendo...' : 'Cambiar mi selfie'}
                            </label>
                            <input type="file" id="userPhotoUpload" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, 'user')} disabled={uploading}/>
                            <div className="w-full text-center">
                                <h4 className="text-sm font-semibold text-gray-500 mb-1">Mis Insignias</h4>
                                <div className="flex justify-center space-x-1 p-1 bg-gray-50 rounded-md">
                                    <span className="text-2xl" title="Aún no hay insignias">▫️</span> 
                                    <span className="text-2xl" title="Aún no hay insignias">▫️</span>
                                    <span className="text-2xl" title="Aún no hay insignias">▫️</span>
                                </div>
                            </div>
                            {/* Barra de Progreso del Vínculo */}
                            <div className="w-full max-w-sm">
                                <GoalProgressBar points={vinculoData.progress?.points || 0} milestones={currentMilestones} vinculoData={vinculoData} displayContext="myProfile"/>
                            </div>
                            <div className="text-xs text-gray-500 italic text-center w-full max-w-sm">
                                <p>Confianza que me genera: (Próximamente)</p>
                                <p>Estabilidad que me genera: (Próximamente)</p>
                            </div>
                            <div className="w-full max-w-sm">
                                <label htmlFor="myCurrentMood" className="block text-yellow-700 text-sm font-bold mb-1">¿Cómo me siento hoy en nuestra conexión?</label>
                                <input 
                                    type="text"
                                    id="myCurrentMood"
                                    value={myCurrentMood}
                                    onChange={(e) => setMyCurrentMood(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                    placeholder="Ej: Alegre, reflexivo/a, con ganas de..."
                                />
                                {/* TODO: Notificar a la pareja y registrar en historial al cambiar */}
                            </div>
                            <div className="w-full max-w-sm">
                                <label htmlFor="dob" className="block text-yellow-700 text-sm font-bold mb-1">Fecha de nacimiento, ¡protagonista de esta historia!</label>
                                <div className="flex items-center">
                                    <input 
                                        type="date" 
                                        id="dob"
                                        value={dob}
                                        onChange={(e) => setDob(e.target.value)}
                                        className="flex-grow p-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                    />
                                    {/* Podríamos añadir un botón de guardar específico para la fecha si se desea, o confiar en el guardado general del perfil */}
                                </div>
                            </div>
                            <div className="w-full max-w-sm">
                                <label htmlFor="personalPhrase" className="block text-yellow-700 text-sm font-bold mb-1">¿Qué frase te inspira y te define en esta increíble aventura?</label>
                                <textarea 
                                    id="personalPhrase"
                                    value={personalPhrase}
                                    onChange={(e) => setPersonalPhrase(e.target.value)}
                                    rows="3"
                                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                    placeholder="Escribe aquí esa joya de sabiduría personal..."
                                ></textarea>
                            </div>
                            <div className="w-full max-w-sm">
                                <button 
                                    onClick={handleSaveProfile}
                                    disabled={isLoading}
                                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-yellow-300"
                                >
                                    {isLoading ? 'Actualizando...' : 'Actualizar mi contenido'}
                                </button>
                                {successMessage && !errorMessage && <p className="text-green-600 text-sm mt-2 text-center">{successMessage}</p>}
                                {errorMessage && <p className="text-red-600 text-sm mt-2 text-center">{errorMessage}</p>}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Columna 2 (1 de 4): "De Tu Pareja" */}
                <div className="md:col-span-1 space-y-8">
                    <section className="bg-white p-6 rounded-lg shadow-md h-full">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">{vinculoData[partnerUserKey]?.name || 'Tu Pareja'} ⭐</h2>
                    <div className="flex flex-col items-center space-y-4">
                        <div className="flex flex-col items-center space-y-2">
                            {vinculoData[partnerUserKey]?.profile?.photoURL ? (
                                <img src={vinculoData[partnerUserKey].profile.photoURL} alt="Perfil de pareja" className="w-32 h-32 md:w-40 md:h-40 rounded-lg object-cover shadow-md"/>
                            ) : (
                                <div className="w-32 h-32 md:w-40 md:h-40 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">👤</div>
                            )}
                            <div className="w-full text-center">
                                <h4 className="text-sm font-semibold text-gray-500 mb-1">Sus Insignias</h4>
                                <div className="flex justify-center space-x-1 p-1 bg-gray-50 rounded-md">
                                    <span className="text-2xl" title="Aún no hay insignias">▫️</span> 
                                    <span className="text-2xl" title="Aún no hay insignias">▫️</span>
                                    <span className="text-2xl" title="Aún no hay insignias">▫️</span>
                                </div>
                            </div>
                        </div>
                        {/* Barra de Progreso del Vínculo para la pareja */}
                        <div className="w-full max-w-sm">
                            <GoalProgressBar points={vinculoData.progress?.points || 0} milestones={currentMilestones} vinculoData={vinculoData} displayContext="partnerProfile"/>
                        </div>
                        <div className="text-xs text-gray-500 italic text-center w-full max-w-sm">
                            <p>Confianza que le genero: (Próximamente)</p>
                            <p>Estabilidad que le genero: (Próximamente)</p>
                        </div>
                        <div className="w-full max-w-sm">
                            <p className="block text-yellow-700 text-sm font-bold mb-1">Su estado anímico actual en la conexión:</p>
                            <p className="text-gray-800 italic">{partnerProfile?.currentMood || "Aún no compartido"}</p>
                        </div>
                        <div className="w-full max-w-sm">
                                <p className="block text-yellow-700 text-sm font-bold mb-1">Su fecha de nacimiento, ¡coprotagonista de esta historia!</p>
                                <p className="text-gray-800">{partnerProfile?.dob ? new Date(partnerProfile.dob + 'T00:00:00').toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) : "Aún no compartido"}</p>
                            </div>
                        <div className="w-full max-w-sm">
                                <p className="block text-yellow-700 text-sm font-bold mb-1">Su frase inspiradora:</p>
                                <p className="text-gray-800 italic">"{partnerProfile?.personalPhrase || "Aún no compartido"}"</p>
                            </div>
                    </div>
                    {!partnerProfile && <p className="text-gray-500 italic mt-4 text-sm text-center">Tu pareja aún no ha añadido detalles a su cofre.</p>}
                    </section>
                </div>

                {/* Columnas 3 y 4 (2 de 4): "De Ambos" con su contenido interno dividido */}
                <section className="bg-white p-6 rounded-lg shadow-md md:col-span-2 h-full">                    <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">Nuestro Núcleo 💖</h2>
                    {/* Grid interno para dividir "De Ambos" en dos columnas: Info | Árbol */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Sub-Columna Izquierda: Foto, Insignias, Campos y Botón (apilados verticalmente) */}
                        <div className="md:col-span-1 space-y-4 flex flex-col items-center">
                            {couplePhotoUrl ? (
                                <img src={couplePhotoUrl} alt="Foto de pareja" className="w-48 h-48 md:w-56 md:h-56 rounded-lg object-cover shadow-md"/>
                            ) : (
                                <div className="w-48 h-48 md:w-56 md:h-56 rounded-lg bg-gray-200 flex items-center justify-center text-gray-500 text-6xl">🖼️</div>
                            )}<label htmlFor="couplePhotoUpload" className="cursor-pointer text-sm text-rose-600 hover:text-rose-700 font-semibold">
                                {uploading && couplePhotoUrl === null ? 'Subiendo...' : 'Cambiemos nuestra selfie'}
                            </label> {/* CORRECCIÓN: Este label ya estaba bien, el cambio era en el texto del botón de guardar */}
                            <input type="file" id="couplePhotoUpload" accept="image/*" className="hidden" onChange={(e) => handlePhotoUpload(e, 'couple')} disabled={uploading}/>
                            
                            <div className="mt-6 w-full text-center">
                                <h3 className="text-md font-semibold text-gray-600 mb-2">Insignias Conjuntas</h3>
                                <div className="flex justify-center space-x-2 p-2 bg-gray-50 rounded-md">
                                    <span className="text-3xl" title="Aún no hay insignias conjuntas">▫️</span> 
                                    <span className="text-3xl" title="Aún no hay insignias conjuntas">▫️</span>
                                    <span className="text-3xl" title="Aún no hay insignias conjuntas">▫️</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">(Próximamente)</p>
                            </div>
                        
                            {/* Campos de texto y botón de guardar (siguen dentro de la sub-columna izquierda) */}
                            <div className="w-full max-w-md space-y-6 self-center">
                                <div className="w-full">
                                    <label htmlFor="coupleCurrentMood" className="block text-yellow-700 text-sm font-bold mb-1">¿Cómo se siente "Nuestro Núcleo" hoy?</label>
                                    <input 
                                        type="text"
                                        id="coupleCurrentMood"
                                        value={coupleCurrentMood}
                                        onChange={(e) => setCoupleCurrentMood(e.target.value)}
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                        placeholder="Ej: Vibrantes, en calma, listos para..."
                                    />
                                    {/* TODO: Notificar y registrar en historial al cambiar */}
                                </div>
                                <div className="w-full">
                                    <label htmlFor="relationshipStartDate" className="block text-yellow-700 text-sm font-bold mb-1">Fecha de inicio de esta hermosa relación:</label>
                                    <div className="flex items-center">
                                        <input 
                                            type="date" 
                                            id="relationshipStartDate"
                                            value={relationshipStartDate}
                                            onChange={(e) => setRelationshipStartDate(e.target.value)}
                                            className="flex-grow p-2 border border-gray-300 rounded-l-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                        />
                                        {/* Podríamos añadir un botón de guardar específico para la fecha si se desea */}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="couplePhrase" className="block text-yellow-700 text-sm font-bold mb-1">¿Cuál es la frase que los inspira y define en esta linda relación?</label>
                                    <textarea 
                                        id="couplePhrase"
                                        value={couplePhrase}
                                        onChange={(e) => setCouplePhrase(e.target.value)}
                                        rows="3"
                                        className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
                                        placeholder="Escriban juntos su lema de amor..."
                                    ></textarea>
                                </div>
                                <button 
                                    onClick={handleSaveCoupleProfile}
                                    disabled={isLoading}
                                    className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:bg-rose-300"
                                >
                                    {isLoading ? 'Actualizando...' : 'Actualizar nuestro contenido'}
                                </button>
                                {successMessage && <p className="text-green-600 text-sm mt-2 text-center">{successMessage}</p>}
                                {errorMessage && <p className="text-red-600 text-sm mt-2 text-center">{errorMessage}</p>}
                            </div>
                        </div>

                        {/* Sub-Columna Derecha: Árbol de la Conexión */}
                        <div className="md:col-span-1 flex justify-center items-start pt-8 md:pt-0">
                            <MataDeLaConexion completedMilestones={vinculoData.progress?.completedMilestones || []} />
                        </div>
                    </div>
                </section>
            </div> {/* Cierre del grid principal de 4 columnas */}

            {/* --- SECCIÓN: NUESTRA TRAYECTORIA DE CLICS (HISTORIAL) --- */}
            <section className="bg-white p-6 rounded-lg shadow-md mt-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Nuestra Trayectoria en Clics 📈</h2> {/* Emoji ya estaba bien */}
                {activityHistory.length > 0 ? (
                    <ul className="space-y-4">
                        {activityHistory.map(item => (
                            <li key={`${item.type}-${item.id}`} className={`p-4 rounded-lg shadow-sm border-l-4 ${item.type === 'quest' ? 'bg-yellow-50 border-yellow-400' : 'bg-green-50 border-green-500'}`}>
                                {item.type === 'quest' && (
                                    <>
                                        <p className="font-semibold text-gray-800">{item.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">Momento completado el: {item.updatedAt ? new Date(item.updatedAt.toDate()).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Fecha no disponible"}</p>
                                    </>
                                )}
                                {item.type === 'milestone' && (
                                    <p className="font-semibold text-green-700">¡Hito Alcanzado! <span className="font-normal text-gray-800">{item.title} ({item.badgeName} {getBadgeIcon(item.badgeIcon)})</span></p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-600 italic">Aún no hay momentos completados para mostrar en su trayectoria. ¡La aventura recién comienza!</p>
                )}
            </section>
        </div>
    );
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
function App() {
    const [appState, setAppState] = useState('AUTHENTICATING'); // AUTHENTICATING, NO_VINCULO, VINCULO_LOADED, PROFILE_VIEW, ERROR
    const [userId, setUserId] = useState(null);
    const [vinculoId, setVinculoId] = useState(null);
    const [vinculoData, setVinculoData] = useState(null);
    
    useEffect(() => {
        if (!auth) {
            setAppState('ERROR');
            return;
        }
        
        const unsubscribe = auth.onAuthStateChanged((user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                auth.signInAnonymously().catch(err => {
                    console.error("Error en el inicio de sesión anónimo:", err);
                    setAppState('ERROR');
                });
            }
        });
        return () => unsubscribe();
    }, []);

    const findUserVinculo = useCallback(async (uid) => {
        if (!uid) return null;
        const vRef = db.collection(`artifacts/${appId}/public/data/vinculos`);
        const q1 = vRef.where("participant1.uid", "==", uid);
        const u1 = await q1.get();
        if (!u1.empty) return u1.docs[0].id;
        const q2 = vRef.where("participant2.uid", "==", uid);
        const u2 = await q2.get();
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
        }
    }, [userId, findUserVinculo]);
    
    useEffect(() => {
        let unsubscribe;
        if (vinculoId) {
            const vinculoRef = db.collection(`artifacts/${appId}/public/data/vinculos`).doc(vinculoId);
            unsubscribe = vinculoRef.onSnapshot(async (docSnap) => {
                if (docSnap.exists) {
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
    
    if(appState === 'ERROR') {
        return <div className="p-4 m-4 bg-red-100 border-l-4 border-red-500 text-red-700"><h1 className="font-bold">Error de Configuración</h1><p>No se pudo conectar con la base de datos. Asegúrate de tener conexión a internet, de haber pegado tu configuración de Firebase en App.js y de haber publicado las reglas de seguridad.</p></div>
    }

    if (appState === 'AUTHENTICATING' || (userId && !vinculoData && appState !== 'NO_VINCULO')) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-100"><p>Autenticando y buscando tu vínculo...</p></div>;
    }

    if (appState === 'NO_VINCULO') {
        return <WelcomeScreen userId={userId} setVinculoId={setVinculoId} />;
    }

    if (appState === 'PROFILE_VIEW' && vinculoData) {
        return <ProfileScreen userId={userId} vinculoId={vinculoId} vinculoData={vinculoData} onBackToDashboard={() => setAppState('VINCULO_LOADED')} />
    }

    if (appState === 'VINCULO_LOADED' && vinculoData) {
        return <Dashboard userId={userId} vinculoId={vinculoId} vinculoData={vinculoData} setVinculoId={setVinculoId} onViewProfile={() => setAppState('PROFILE_VIEW')} />;
    }

    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><p>Cargando Clics...</p></div>;
}

const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(
    <ErrorBoundary>
        <App />
    </ErrorBoundary>
);