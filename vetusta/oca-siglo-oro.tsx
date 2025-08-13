import React, { useState, useEffect } from 'react';

// Quiz del Siglo de Oro para estudiantes de ELE universitarios
const quizQuestions = [
  {
    question: "¿En qué siglos se desarrolló el Siglo de Oro español?",
    options: ["XV-XVI", "XVI-XVII", "XVII-XVIII", "XIV-XV"],
    correct: 1,
    explanation: "El Siglo de Oro abarca los siglos XVI y XVII, desde el reinado de los Reyes Católicos hasta la muerte de Calderón (1681)."
  },
  {
    question: "¿Cuál es la obra más famosa de Miguel de Cervantes?",
    options: ["La Galatea", "Don Quijote de la Mancha", "Los trabajos de Persiles", "Novelas ejemplares"],
    correct: 1,
    explanation: "Don Quijote de la Mancha (1605-1615) es considerada la primera novela moderna y obra cumbre de la literatura española."
  },
  {
    question: "¿Qué movimiento poético cultivó Luis de Góngora?",
    options: ["Conceptismo", "Culteranismo", "Realismo", "Naturalismo"],
    correct: 1,
    explanation: "Góngora fue el máximo representante del culteranismo, caracterizado por la complejidad sintáctica y las referencias mitológicas."
  },
  {
    question: "¿Cuál de estas obras pertenece a Lope de Vega?",
    options: ["La vida es sueño", "Fuenteovejuna", "El Buscón", "Soledades"],
    correct: 1,
    explanation: "Fuenteovejuna es una de las obras más famosas de Lope de Vega, representante del teatro del Siglo de Oro."
  },
  {
    question: "¿Cómo se llamaba la preceptiva teatral que rompió Lope de Vega?",
    options: ["Las tres unidades", "La regla áurea", "El decoro poético", "La verosimilitud"],
    correct: 0,
    explanation: "Lope rompió con las tres unidades clásicas (acción, tiempo y lugar) en su 'Arte nuevo de hacer comedias'."
  },
  {
    question: "¿Qué autor escribió 'La vida es sueño'?",
    options: ["Lope de Vega", "Tirso de Molina", "Calderón de la Barca", "Francisco de Quevedo"],
    correct: 2,
    explanation: "Pedro Calderón de la Barca escribió este drama filosófico, una de las obras cumbre del teatro barroco."
  },
  {
    question: "¿Cuál es el tema principal del Conceptismo?",
    options: ["La belleza formal", "El juego de conceptos e ideas", "La mitología clásica", "La naturaleza"],
    correct: 1,
    explanation: "El Conceptismo, representado por Quevedo, se basa en el juego ingenioso de conceptos e ideas."
  },
  {
    question: "¿Quién escribió 'El Buscón'?",
    options: ["Mateo Alemán", "Francisco de Quevedo", "Vicente Espinel", "Luis de Góngora"],
    correct: 1,
    explanation: "Quevedo escribió 'Historia de la vida del Buscón llamado don Pablos', novela picaresca satírica."
  },
  {
    question: "¿Cómo se llama el personaje creado por Tirso de Molina?",
    options: ["Don Juan Tenorio", "Don Quijote", "Segismundo", "Pablos"],
    correct: 0,
    explanation: "Tirso de Molina creó el mito de Don Juan Tenorio en 'El burlador de Sevilla'."
  },
  {
    question: "¿Cuál era el pseudónimo de Lope de Vega?",
    options: ["El Divino", "Fénix de los ingenios", "El Príncipe de los poetas", "El Cisne de Mantua"],
    correct: 1,
    explanation: "Lope de Vega era conocido como el 'Fénix de los ingenios' por su extraordinaria capacidad creativa."
  },
  {
    question: "¿En qué consiste la técnica del 'carpe diem'?",
    options: ["Vivir el momento presente", "Recordar la muerte", "Alabar la belleza", "Criticar la sociedad"],
    correct: 0,
    explanation: "El 'carpe diem' ('aprovecha el día') es un tópico que invita a disfrutar del momento presente."
  },
  {
    question: "¿Qué género literario NO cultivó Quevedo?",
    options: ["Poesía", "Prosa satírica", "Teatro", "Ensayo"],
    correct: 2,
    explanation: "Aunque Quevedo fue un genio de la poesía y la prosa, no destacó como dramaturgo teatral."
  },
  {
    question: "¿Cuál es el tema del 'Tempus fugit'?",
    options: ["El amor cortés", "El paso del tiempo", "La crítica social", "La muerte"],
    correct: 1,
    explanation: "El 'tempus fugit' ('el tiempo huye') es un tópico sobre la fugacidad temporal y la brevedad de la vida."
  },
  {
    question: "¿Qué autor escribió 'Soledades'?",
    options: ["Luis de Góngora", "Francisco de Quevedo", "San Juan de la Cruz", "Garcilaso de la Vega"],
    correct: 0,
    explanation: "Las 'Soledades' son poemas mayores de Góngora, ejemplo máximo del culteranismo."
  },
  {
    question: "¿Cuántos actos tenían las comedias de Lope?",
    options: ["Dos", "Tres", "Cuatro", "Cinco"],
    correct: 1,
    explanation: "Lope estableció la comedia nueva de tres actos, rompiendo con la tradición clásica de cinco."
  },
  {
    question: "¿Quién escribió 'Los trabajos de Persiles y Sigismunda'?",
    options: ["Miguel de Cervantes", "Lope de Vega", "Mateo Alemán", "Francisco de Quevedo"],
    correct: 0,
    explanation: "Esta novela bizantina fue la última obra de Cervantes, publicada póstumamente en 1617."
  },
  {
    question: "¿Cuál es el tema central de 'El gran teatro del mundo'?",
    options: ["El amor cortés", "La vida como representación teatral", "La crítica social", "La naturaleza"],
    correct: 1,
    explanation: "Calderón presenta la vida humana como una gran representación teatral dirigida por Dios."
  },
  {
    question: "¿Qué significa 'memento mori' en la literatura barroca?",
    options: ["Recuerda vivir", "Recuerda morir", "Ama y vive", "Tiempo perdido"],
    correct: 1,
    explanation: "El 'memento mori' ('recuerda que morirás') es un tópico barroco sobre la meditación de la muerte."
  },
  {
    question: "¿Cuál fue el primer libro de caballerías español?",
    options: ["Amadís de Gaula", "Tirant lo Blanch", "Palmerín de Oliva", "Las sergas de Esplandián"],
    correct: 0,
    explanation: "Amadís de Gaula, refundido por Garci Rodríguez de Montalvo, fue el modelo del género caballeresco."
  },
  {
    question: "¿Qué autor creó el personaje de la Celestina?",
    options: ["Fernando de Rojas", "Juan Ruiz", "Alfonso X", "Jorge Manrique"],
    correct: 0,
    explanation: "Fernando de Rojas escribió 'La Celestina' o 'Tragicomedia de Calisto y Melibea'."
  },
  {
    question: "¿En qué consiste la técnica del 'in medias res'?",
    options: ["Empezar por el final", "Empezar en medio de la acción", "Narrar cronológicamente", "Usar flashbacks"],
    correct: 1,
    explanation: "El 'in medias res' significa comenzar la narración en el punto medio de los acontecimientos."
  },
  {
    question: "¿Cuál es la obra más importante de San Juan de la Cruz?",
    options: ["Noche oscura del alma", "Subida del Monte Carmelo", "Cántico espiritual", "Llama de amor viva"],
    correct: 2,
    explanation: "El 'Cántico espiritual' es considerado la cumbre de la poesía mística de San Juan de la Cruz."
  },
  {
    question: "¿Qué técnica poética usa Garcilaso en sus églogas?",
    options: ["Octavas reales", "Tercetos", "Silva", "Liras"],
    correct: 3,
    explanation: "Garcilaso popularizó la lira, estrofa de cinco versos (7a-11B-7a-7b-11B) en sus églogas."
  },
  {
    question: "¿Cuál es el tema del soneto 'Mientras por competir con tu cabello'?",
    options: ["El tiempo destructor", "La belleza femenina", "El amor eterno", "La muerte"],
    correct: 0,
    explanation: "Este soneto de Góngora desarrolla el tema del tiempo que destruye la belleza juvenil."
  },
  {
    question: "¿Qué es un 'entremés' en el teatro del Siglo de Oro?",
    options: ["Un acto principal", "Una pieza cómica breve", "Un prólogo", "Una danza"],
    correct: 1,
    explanation: "El entremés es una pieza teatral cómica y breve que se representaba entre los actos de la comedia."
  },
  {
    question: "¿Quién escribió 'Guzmán de Alfarache'?",
    options: ["Francisco de Quevedo", "Mateo Alemán", "Vicente Espinel", "Luis Vélez de Guevara"],
    correct: 1,
    explanation: "Mateo Alemán escribió esta novela picaresca, considerada la segunda después del Lazarillo."
  },
  {
    question: "¿Cuál es la diferencia entre culteranismo y conceptismo?",
    options: ["Forma vs. contenido", "Prosa vs. verso", "Religioso vs. profano", "Clásico vs. popular"],
    correct: 0,
    explanation: "El culteranismo se centra en la forma y el lenguaje, el conceptismo en el contenido y las ideas."
  },
  {
    question: "¿En qué ciudad se desarrolla principalmente 'La Celestina'?",
    options: ["Salamanca", "Toledo", "Sevilla", "No se especifica"],
    correct: 0,
    explanation: "Aunque no se menciona explícitamente, los indicios apuntan a Salamanca como escenario."
  },
  {
    question: "¿Cuál es el nombre completo de Don Juan Tenorio?",
    options: ["Juan Tenorio de Ulloa", "Don Juan Tenorio", "Juan de Tenorio", "Juan Tenorio y Mañara"],
    correct: 1,
    explanation: "En la obra de Tirso, el personaje se llama simplemente Don Juan Tenorio."
  },
  {
    question: "¿Qué significa 'collige, virgo, rosas'?",
    options: ["Coge, doncella, las rosas", "Vive, muchacha, la vida", "Ama, joven, con pasión", "Goza, niña, el momento"],
    correct: 0,
    explanation: "Esta frase latina significa 'coge, doncella, las rosas' y expresa el tema del carpe diem."
  },
  {
    question: "¿Cuántos sonetos escribió aproximadamente Quevedo?",
    options: ["300", "500", "800", "1000"],
    correct: 2,
    explanation: "Quevedo escribió aproximadamente 800 sonetos, siendo uno de los sonetistas más prolíficos."
  },
  {
    question: "¿Qué autor escribió 'El caballero de Olmedo'?",
    options: ["Lope de Vega", "Tirso de Molina", "Calderón de la Barca", "Rojas Zorrilla"],
    correct: 0,
    explanation: "Lope de Vega escribió este drama basado en una cancioncilla popular castellana."
  },
  {
    question: "¿Cuál es el tema principal de 'La vida es sueño'?",
    options: ["El destino", "El libre albedrío", "El poder", "El amor"],
    correct: 1,
    explanation: "Calderón desarrolla el tema del libre albedrío frente al determinismo del destino."
  },
  {
    question: "¿Qué técnica caracteriza los sonetos amorosos de Quevedo?",
    options: ["Idealización platónica", "Pasión desgarrada", "Cortesía medieval", "Sensualidad renacentista"],
    correct: 1,
    explanation: "Los sonetos amorosos de Quevedo se caracterizan por una pasión intensa y desgarrada."
  },
  {
    question: "¿En qué batalla naval participó Cervantes?",
    options: ["Trafalgar", "Lepanto", "Cabo de San Vicente", "La Armada Invencible"],
    correct: 1,
    explanation: "Cervantes luchó en la batalla de Lepanto (1571) donde fue herido en la mano izquierda."
  },
  {
    question: "¿Cuál es el subtítulo de 'Don Quijote'?",
    options: ["El Ingenioso Hidalgo", "El Caballero de la Mancha", "Historia del famoso hidalgo", "El Ingenioso Hidalgo Don Quijote de la Mancha"],
    correct: 3,
    explanation: "El título completo es 'El ingenioso hidalgo don Quijote de la Mancha'."
  },
  {
    question: "¿Qué es la 'disputatio' en el teatro calderoniano?",
    options: ["Un debate teológico", "Una técnica dramática", "Un monólogo", "Una forma métrica"],
    correct: 1,
    explanation: "La disputatio es una técnica dramática donde los personajes debaten ideas filosóficas."
  },
  {
    question: "¿Quién fue conocido como 'El Divino'?",
    options: ["Luis de Góngora", "Francisco de Quevedo", "Lope de Vega", "Garcilaso de la Vega"],
    correct: 0,
    explanation: "Luis de Góngora era conocido como 'El Divino' por su extraordinaria maestría poética."
  },
  {
    question: "¿Cuál es la primera novela picaresca española?",
    options: ["El Buscón", "Guzmán de Alfarache", "La vida de Lazarillo de Tormes", "La pícara Justina"],
    correct: 2,
    explanation: "'La vida de Lazarillo de Tormes' (1554) inaugura el género picaresco en España."
  },
  {
    question: "¿Qué significa 'ut pictura poesis'?",
    options: ["Como la pintura, la poesía", "El arte imita la vida", "La belleza es verdad", "Todo arte es imitación"],
    correct: 0,
    explanation: "Esta frase de Horacio significa que la poesía debe parecerse a la pintura en su capacidad descriptiva."
  },
  {
    question: "¿Cuál es el conflicto central en 'Fuenteovejuna'?",
    options: ["Amor vs. honor", "Pueblo vs. tiranía", "Nobleza vs. burguesía", "Tradición vs. modernidad"],
    correct: 1,
    explanation: "El pueblo de Fuenteovejuna se rebela contra la tiranía del Comendador Mayor."
  },
  {
    question: "¿Qué autor popularizó el teatro religioso en España?",
    options: ["Lope de Vega", "Tirso de Molina", "Calderón de la Barca", "Mira de Amescua"],
    correct: 2,
    explanation: "Calderón de la Barca llevó el teatro religioso y los autos sacramentales a su máxima expresión."
  },
  {
    question: "¿En qué consiste la técnica del 'correlato objetivo'?",
    options: ["Describir objetivamente", "Expresar emociones mediante objetos", "Narrar en tercera persona", "Usar un lenguaje neutro"],
    correct: 1,
    explanation: "El correlato objetivo expresa estados emocionales a través de objetos y situaciones externas."
  },
  {
    question: "¿Cuál es el tema del poema 'A una nariz' de Quevedo?",
    options: ["La belleza física", "La sátira personal", "La fugacidad del tiempo", "El amor platónico"],
    correct: 1,
    explanation: "Este poema es una sátira burlesca dirigida contra Góngora y su prominente nariz."
  },
  {
    question: "¿Qué técnica narrativa usa Cervantes en las Novelas Ejemplares?",
    options: ["Narrador omnisciente", "Múltiples perspectivas", "Monólogo interior", "Epistolar"],
    correct: 1,
    explanation: "Cervantes emplea múltiples perspectivas narrativas para enriquecer la complejidad de sus relatos."
  },
  {
    question: "¿Cuál es el conflicto principal en 'El alcalde de Zalamea'?",
    options: ["Honor villano vs. honor noble", "Amor vs. deber", "Justicia vs. venganza", "Tradición vs. progreso"],
    correct: 0,
    explanation: "Calderón explora el conflicto entre el honor del villano rico y el del noble empobrecido."
  },
  {
    question: "¿Qué significa 'ars moriendi' en la literatura del Siglo de Oro?",
    options: ["Arte de amar", "Arte de morir", "Arte de vivir", "Arte de escribir"],
    correct: 1,
    explanation: "El 'ars moriendi' es el arte de bien morir, tema fundamental en la literatura religiosa barroca."
  },
  {
    question: "¿Quién escribió 'El conde Lucanor'?",
    options: ["Don Juan Manuel", "Alfonso X el Sabio", "Juan Ruiz", "Jorge Manrique"],
    correct: 0,
    explanation: "Don Juan Manuel escribió 'El conde Lucanor', obra didáctica del siglo XIV."
  },
  {
    question: "¿Cuál es la métrica tradicional del villancico?",
    options: ["Octosílabos", "Hexasílabos", "Arte menor variado", "Endecasílabos"],
    correct: 2,
    explanation: "El villancico emplea arte menor con métrica variada, típicamente hexasílabos y octosílabos."
  }
];

function getRandomQuiz(usedQuestions: number[] = []) {
  const availableQuestions = quizQuestions.filter((_, index) => !usedQuestions.includes(index));
  
  // Si no hay preguntas disponibles, reiniciar el pool
  if (availableQuestions.length === 0) {
    return {
      question: quizQuestions[0],
      index: 0,
      resetUsed: true
    };
  }
  
  const randomAvailableIndex = Math.floor(Math.random() * availableQuestions.length);
  const selectedQuestion = availableQuestions[randomAvailableIndex];
  const originalIndex = quizQuestions.indexOf(selectedQuestion);
  
  return {
    question: selectedQuestion,
    index: originalIndex,
    resetUsed: false
  };
}

// Escritores del Siglo de Oro como jugadores
const players = [
  { id: 0, name: "Luis de Góngora", color: "#663399", position: 0 },
  { id: 1, name: "Francisco de Quevedo", color: "#8b0000", position: 0 },
  { id: 2, name: "Lope de Vega", color: "#556b2f", position: 0 },
  { id: 3, name: "Calderón de la Barca", color: "#d4a574", position: 0 }
];

// Definición del tablero (63 casillas + El Parnaso como meta)
const boardCells = [
  { id: 0, type: 'inicio', icon: '🏠', name: 'Inicio', description: 'El viaje hacia el Parnaso comienza' },
  { id: 1, type: 'normal', icon: '📜', name: 'Primera Obra' },
  { id: 2, type: 'normal', icon: '✍️', name: 'Ejercicio Poético' },
  { id: 3, type: 'normal', icon: '📚', name: 'Biblioteca' },
  { id: 4, type: 'normal', icon: '🎭', name: 'Teatro' },
  { id: 5, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 6, type: 'puente', icon: '🌉', name: 'Puente de los Versos' },
  { id: 7, type: 'normal', icon: '🏛️', name: 'Academia' },
  { id: 8, type: 'normal', icon: '👑', name: 'Corte Real' },
  { id: 9, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 10, type: 'normal', icon: '⛪', name: 'Templo de Apolo' },
  { id: 11, type: 'normal', icon: '🗣️', name: 'Declamación' },
  { id: 12, type: 'puente', icon: '🌉', name: 'Puente del Ingenio' },
  { id: 13, type: 'normal', icon: '🎨', name: 'Arte Poético' },
  { id: 14, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 15, type: 'normal', icon: '📖', name: 'Manuscrito' },
  { id: 16, type: 'normal', icon: '🏆', name: 'Certamen' },
  { id: 17, type: 'normal', icon: '🌟', name: 'Inspiración' },
  { id: 18, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 19, type: 'posada', icon: '🏨', name: 'Posada del Poeta' },
  { id: 20, type: 'normal', icon: '💎', name: 'Piedra Preciosa' },
  { id: 21, type: 'normal', icon: '🎼', name: 'Composición Musical' },
  { id: 22, type: 'normal', icon: '🕊️', name: 'Paloma de Venus' },
  { id: 23, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 24, type: 'normal', icon: '🌙', name: 'Luna de Plata' },
  { id: 25, type: 'normal', icon: '⚔️', name: 'Duelo Literario' },
  { id: 26, type: 'normal', icon: '🌸', name: 'Jardín de Flores' },
  { id: 27, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 28, type: 'normal', icon: '🔥', name: 'Fuego Sagrado' },
  { id: 29, type: 'normal', icon: '🎪', name: 'Representación' },
  { id: 30, type: 'normal', icon: '💫', name: 'Estrella Polar' },
  { id: 31, type: 'pozo', icon: '🕳️', name: 'Pozo del Olvido' },
  { id: 32, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 33, type: 'normal', icon: '🦢', name: 'Cisne de Apolo' },
  { id: 34, type: 'normal', icon: '🌺', name: 'Rosa de Pasión' },
  { id: 35, type: 'normal', icon: '⚖️', name: 'Balanza de la Justicia' },
  { id: 36, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 37, type: 'normal', icon: '🎯', name: 'Diana Cazadora' },
  { id: 38, type: 'normal', icon: '🌊', name: 'Fuente Castalia' },
  { id: 39, type: 'normal', icon: '🏺', name: 'Ánfora Sagrada' },
  { id: 40, type: 'normal', icon: '🦅', name: 'Águila de Júpiter' },
  { id: 41, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 42, type: 'laberinto', icon: '🌀', name: 'Laberinto de Versos' },
  { id: 43, type: 'normal', icon: '🎭', name: 'Máscara Trágica' },
  { id: 44, type: 'normal', icon: '🎨', name: 'Pincel de Oro' },
  { id: 45, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 46, type: 'normal', icon: '🌈', name: 'Arco de Iris' },
  { id: 47, type: 'normal', icon: '⚡', name: 'Rayo de Júpiter' },
  { id: 48, type: 'normal', icon: '🍇', name: 'Racimo de Baco' },
  { id: 49, type: 'normal', icon: '🌿', name: 'Laurel de Apolo' },
  { id: 50, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 51, type: 'normal', icon: '🎺', name: 'Trompeta de la Fama' },
  { id: 52, type: 'carcel', icon: '⛓️', name: 'Cárcel de la Crítica' },
  { id: 53, type: 'normal', icon: '👸', name: 'Musa Calíope' },
  { id: 54, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 55, type: 'normal', icon: '🌟', name: 'Constelación' },
  { id: 56, type: 'normal', icon: '🏰', name: 'Castillo de Versos' },
  { id: 57, type: 'normal', icon: '🔔', name: 'Campana de Oro' },
  { id: 58, type: 'muerte', icon: '💀', name: 'Muerte del Poeta' },
  { id: 59, type: 'oca', icon: '🪿', name: 'Oca Áurea' },
  { id: 60, type: 'normal', icon: '🌞', name: 'Sol de Justicia' },
  { id: 61, type: 'normal', icon: '🎪', name: 'Gran Teatro' },
  { id: 62, type: 'normal', icon: '👑', name: 'Corona Poética' },
  { id: 63, type: 'parnaso', icon: '🏔️', name: 'PARNASO', description: '¡La morada de las Musas te espera!' }
];

export default function OcaDelParnaso() {
  const [gameState, setGameState] = useState({
    players: [...players],
    currentPlayerIndex: 0,
    diceValue: 0,
    canRollDice: true,
    gameStarted: false,
    winner: null,
    showQuiz: false,
    currentQuiz: null,
    selectedAnswer: null,
    quizAnswered: false,
    usedQuestions: [],
    messages: ['¡Bienvenidos a la Oca del Parnaso del Siglo de Oro!', 'Los grandes escritores compiten por llegar a la morada de las Musas']
  });
  
  const addMessage = (message: string) => {
    setGameState(prev => ({
      ...prev,
      messages: [...prev.messages.slice(-10), message]
    }));
    // Hacer scroll al final después de agregar mensaje
    setTimeout(() => {
      const messageLog = document.querySelector('.message-log');
      if (messageLog) {
        messageLog.scrollTop = messageLog.scrollHeight;
      }
    }, 100);
  };
  
  const startQuiz = () => {
    if (!gameState.canRollDice || gameState.winner) return;
    
    const quizResult = getRandomQuiz(gameState.usedQuestions);
    setGameState(prev => ({
      ...prev,
      showQuiz: true,
      currentQuiz: quizResult.question,
      selectedAnswer: null,
      quizAnswered: false,
      usedQuestions: quizResult.resetUsed ? [quizResult.index] : [...prev.usedQuestions, quizResult.index]
    }));
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    addMessage(`${currentPlayer.name} debe responder una pregunta para lanzar los dados`);
  };
  
  const selectAnswer = (answerIndex: number) => {
    setGameState(prev => ({
      ...prev,
      selectedAnswer: answerIndex
    }));
  };
  
  const submitAnswer = () => {
    const isCorrect = gameState.selectedAnswer === gameState.currentQuiz!.correct;
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (isCorrect) {
      addMessage(`🎉 ¡Correcto! ${currentPlayer.name} puede lanzar los dados`);
      setGameState(prev => ({
        ...prev,
        quizAnswered: true
      }));
      setTimeout(() => rollDice(), 1500);
    } else {
      addMessage(`❌ Incorrecto. ${currentPlayer.name} pierde el turno`);
      addMessage(`💡 ${gameState.currentQuiz!.explanation}`);
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          showQuiz: false,
          currentQuiz: null,
          selectedAnswer: null,
          quizAnswered: false
        }));
        nextPlayerTurn();
      }, 3000);
    }
  };
  
  const rollDice = () => {
    const newDiceValue = Math.floor(Math.random() * 6) + 1;
    setGameState(prev => ({
      ...prev,
      diceValue: newDiceValue,
      canRollDice: false,
      showQuiz: false,
      currentQuiz: null,
      selectedAnswer: null,
      quizAnswered: false
    }));
    
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    addMessage(`${currentPlayer.name} lanza los dados y obtiene: ${newDiceValue}`);
    
    setTimeout(() => movePlayer(newDiceValue), 1000);
  };
  
  const movePlayer = (steps: number) => {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    const newPosition = Math.min(currentPlayer.position + steps, 63);
    
    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      updatedPlayers[gameState.currentPlayerIndex] = {
        ...currentPlayer,
        position: newPosition
      };
      
      return {
        ...prev,
        players: updatedPlayers
      };
    });
    
    setTimeout(() => {
      handleSpecialCells(newPosition, currentPlayer);
    }, 500);
  };
  
  const handleSpecialCells = (position: number, player: any) => {
    const cell = boardCells[position];
    let nextTurn = true;
    let newPosition = position;
    
    switch(cell.type) {
      case 'oca':
        addMessage(`🪿 ${player.name} llega a una Oca Áurea: "De oca a oca y tiro porque me toca"`);
        const nextOca = boardCells.findIndex((c, i) => i > position && c.type === 'oca');
        if (nextOca !== -1 && nextOca < 63) {
          newPosition = nextOca;
          updatePlayerPosition(player.id, newPosition);
          addMessage(`${player.name} vuela hasta la casilla ${nextOca + 1}`);
        }
        nextTurn = false; // Repite turno
        break;
        
      case 'puente':
        addMessage(`🌉 ${player.name} cruza el puente: "De puente a puente y tiro porque me lleva la corriente"`);
        const nextBridge = boardCells.findIndex((c, i) => i > position && c.type === 'puente');
        if (nextBridge !== -1) {
          newPosition = nextBridge;
          updatePlayerPosition(player.id, newPosition);
          addMessage(`${player.name} cruza hasta la casilla ${nextBridge + 1}`);
        }
        nextTurn = false; // Repite turno
        break;
        
      case 'posada':
        addMessage(`🏨 ${player.name} se detiene en la Posada del Poeta y debe descansar un turno`);
        setGameState(prev => ({
          ...prev,
          players: prev.players.map(p => 
            p.id === player.id ? {...p, skipTurns: 1} : p
          )
        }));
        break;
        
      case 'carcel':
        addMessage(`⛓️ ${player.name} es encarcelado por la Crítica y debe esperar a ser liberado`);
        setGameState(prev => ({
          ...prev,
          players: prev.players.map(p => 
            p.id === player.id ? {...p, inPrison: true} : p
          )
        }));
        break;
        
      case 'muerte':
        addMessage(`💀 ${player.name} sufre la muerte del poeta y debe volver al inicio`);
        updatePlayerPosition(player.id, 0);
        newPosition = 0;
        break;
        
      case 'laberinto':
        addMessage(`🌀 ${player.name} se pierde en el Laberinto de Versos y retrocede 12 casillas`);
        newPosition = Math.max(0, position - 12);
        updatePlayerPosition(player.id, newPosition);
        break;
        
      case 'parnaso':
        setGameState(prev => ({
          ...prev,
          winner: player,
          canRollDice: false
        }));
        addMessage(`🏔️ ¡${player.name} ha alcanzado el PARNASO y es coronado como el poeta supremo!`);
        return;
        
      case 'pozo':
        addMessage(`🕳️ ${player.name} cae en el Pozo del Olvido y debe esperar a ser rescatado`);
        setGameState(prev => ({
          ...prev,
          players: prev.players.map(p => 
            p.id === player.id ? {...p, inWell: true} : p
          )
        }));
        break;
        
      default:
        addMessage(`${player.name} se detiene en: ${cell.name}`);
        break;
    }
    
    if (nextTurn) {
      setTimeout(() => nextPlayerTurn(), 1500);
    } else {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, canRollDice: true }));
      }, 1500);
    }
  };
  
  const updatePlayerPosition = (playerId: number, newPosition: number) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(p => 
        p.id === playerId ? {...p, position: newPosition} : p
      )
    }));
  };
  
  const nextPlayerTurn = () => {
    setGameState(prev => {
      let nextIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      
      // Saltar jugadores que tienen penalizaciones
      let attempts = 0;
      while (attempts < 4) {
        const nextPlayer = prev.players[nextIndex];
        
        if (nextPlayer.skipTurns > 0) {
          // Reducir turnos a saltar
          const updatedPlayers = [...prev.players];
          updatedPlayers[nextIndex] = {
            ...nextPlayer,
            skipTurns: nextPlayer.skipTurns - 1
          };
          
          return {
            ...prev,
            players: updatedPlayers,
            currentPlayerIndex: (nextIndex + 1) % prev.players.length,
            canRollDice: true
          };
        }
        
        if (nextPlayer.inPrison) {
          // Intentar salir de prisión (50% probabilidad)
          if (Math.random() > 0.5) {
            addMessage(`${nextPlayer.name} es liberado de la Cárcel de la Crítica`);
            const updatedPlayers = [...prev.players];
            updatedPlayers[nextIndex] = {
              ...nextPlayer,
              inPrison: false
            };
            
            return {
              ...prev,
              players: updatedPlayers,
              currentPlayerIndex: nextIndex,
              canRollDice: true
            };
          } else {
            addMessage(`${nextPlayer.name} permanece en la Cárcel de la Crítica`);
            nextIndex = (nextIndex + 1) % prev.players.length;
            attempts++;
            continue;
          }
        }
        
        if (nextPlayer.inWell) {
          // Puede ser rescatado si otro jugador cae en el pozo
          addMessage(`${nextPlayer.name} sigue en el Pozo del Olvido`);
          nextIndex = (nextIndex + 1) % prev.players.length;
          attempts++;
          continue;
        }
        
        break;
      }
      
      return {
        ...prev,
        currentPlayerIndex: nextIndex,
        canRollDice: true
      };
    });
  };
  
  const startGame = () => {
    setGameState(prev => ({
      ...prev,
      gameStarted: true
    }));
    addMessage('¡La carrera hacia el Parnaso ha comenzado!');
  };
  
  const restartGame = () => {
    setGameState({
      players: players.map(p => ({ ...p, position: 0, skipTurns: 0, inPrison: false, inWell: false })),
      currentPlayerIndex: 0,
      diceValue: 0,
      canRollDice: true,
      gameStarted: false,
      winner: null,
      messages: ['¡Bienvenidos a la Oca del Parnaso del Siglo de Oro!']
    });
  };
  
  const renderBoard = () => {
    return boardCells.map((cell, index) => {
      const playersInCell = gameState.players.filter(p => p.position === index);
      
      return (
        <div
          key={index}
          className={`cell cell-${cell.type}`}
          title={cell.description || cell.name}
        >
          <div className="cell-icon">{cell.icon}</div>
          <div className="cell-number">{index + 1}</div>
          {cell.type === 'parnaso' && (
            <div style={{ fontSize: '0.4rem', fontWeight: 'bold', color: 'gold' }}>
              PARNASO
            </div>
          )}
          {playersInCell.length > 0 && (
            <div className="players-in-cell">
              {playersInCell.map(player => (
                <div
                  key={player.id}
                  className="player-token"
                  style={{ backgroundColor: player.color }}
                  title={player.name}
                />
              ))}
            </div>
          )}
        </div>
      );
    });
  };
  
  if (!gameState.gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-700 to-orange-600 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-2xl p-12 text-center border-4 border-amber-700">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-amber-800 to-orange-700 bg-clip-text text-transparent">
              🪿 La Oca del Parnaso
            </h1>
            <h2 className="text-2xl mb-8 text-amber-900">Siglo de Oro Español</h2>
            <p className="text-lg mb-8 leading-relaxed text-amber-800">
              Los grandes escritores del Siglo de Oro español compiten por llegar al Parnaso, 
              la mítica morada de las Musas. Supera los obstáculos del camino poético y 
              alcanza la gloria literaria eterna.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {gameState.players.map(player => (
                <div
                  key={player.id}
                  className="flex items-center gap-3 p-4 bg-white/80 rounded-xl shadow-lg border-l-4"
                  style={{ borderLeftColor: player.color }}
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: player.color }}
                  />
                  <strong className="text-amber-900">{player.name}</strong>
                </div>
              ))}
            </div>
            
            <button
              onClick={startGame}
              className="px-8 py-4 bg-gradient-to-r from-amber-700 to-orange-600 text-white text-xl font-bold rounded-xl hover:from-amber-600 hover:to-orange-500 transform hover:scale-105 transition-all duration-300 shadow-xl"
            >
              🚀 ¡Comenzar la Carrera al Parnaso!
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-yellow-700 to-orange-600 p-4">
      {gameState.showQuiz && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-8 rounded-2xl shadow-2xl border-4 border-amber-700 max-w-2xl w-full mx-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-amber-900">📚 Quiz del Siglo de Oro</h2>
            
            <div className="mb-6 p-6 bg-white/90 rounded-xl border border-amber-200">
              <p className="text-lg mb-6 font-semibold text-amber-900">
                {gameState.currentQuiz?.question}
              </p>
              
              <div className="space-y-3">
                {gameState.currentQuiz?.options.map((option, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 border-2 ${
                      gameState.selectedAnswer === index
                        ? 'bg-gradient-to-r from-yellow-200 to-amber-200 border-amber-600 transform scale-105'
                        : 'bg-gradient-to-r from-gray-50 to-gray-100 border-gray-300 hover:border-amber-400'
                    } ${gameState.quizAnswered ? 'cursor-not-allowed opacity-70' : ''}`}
                    onClick={() => !gameState.quizAnswered && selectAnswer(index)}
                  >
                    <div className="flex items-center">
                      <span className="font-bold text-amber-800 mr-3">
                        {String.fromCharCode(65 + index)})
                      </span>
                      <span className="text-amber-900">{option}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {!gameState.quizAnswered && (
              <button
                onClick={submitAnswer}
                disabled={gameState.selectedAnswer === null}
                className="w-full px-6 py-3 bg-amber-700 text-white font-bold rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
              >
                ✅ Confirmar Respuesta
              </button>
            )}
            
            {gameState.quizAnswered && (
              <div className="text-center text-xl font-bold text-green-600">
                🎯 Lanzando dados...
              </div>
            )}
          </div>
        </div>
      )}
      
      {gameState.winner && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-yellow-300 to-amber-400 p-12 rounded-2xl text-center shadow-2xl border-4 border-amber-700">
            <div className="text-8xl mb-6">🏆</div>
            <h2 className="text-3xl font-bold mb-4 text-amber-900">
              ¡{gameState.winner.name} ha alcanzado el PARNASO!
            </h2>
            <p className="text-xl mb-8 text-amber-800">
              Las Musas te coronan como el poeta supremo del Siglo de Oro
            </p>
            <button
              onClick={restartGame}
              className="px-6 py-3 bg-amber-800 text-white font-bold rounded-lg hover:bg-amber-700 transform hover:scale-105 transition-all duration-300"
            >
              🔄 Nueva Partida
            </button>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(280px,320px)_minmax(300px,350px)] md:grid-cols-[minmax(0,1fr)_minmax(320px,400px)] gap-3 md:gap-6 items-start min-h-[calc(100vh-2rem)]">
        <div className="w-full">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl shadow-xl p-6 border-4 border-amber-700">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 text-amber-900">
              🏔️ Camino al Parnaso
            </h2>
            <div className="grid grid-cols-10 gap-1 md:gap-2 p-2 md:p-4 bg-gradient-to-br from-yellow-200 to-amber-200 rounded-xl">
              {renderBoard()}
            </div>
          </div>
          
          {/* Controles de juego en móviles */}
          <div className="md:hidden mt-4 space-y-4">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-6 border-3 border-amber-600">
              <h3 className="text-lg font-bold mb-4 text-center text-amber-900">🎯 Panel de Juego</h3>
              
              <div className="mb-6">
                <h4 className="font-semibold mb-3 text-amber-800">Turno actual:</h4>
                <div
                  className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-lg shadow-lg border-l-4 transform scale-105"
                  style={{ borderLeftColor: gameState.players[gameState.currentPlayerIndex].color }}
                >
                  <div
                    className="w-5 h-5 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: gameState.players[gameState.currentPlayerIndex].color }}
                  />
                  <strong className="text-amber-900">{gameState.players[gameState.currentPlayerIndex].name}</strong>
                  <span className="ml-auto text-sm text-amber-700">
                    Casilla {gameState.players[gameState.currentPlayerIndex].position + 1}
                  </span>
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-white border-4 border-amber-700 rounded-xl flex items-center justify-center text-3xl font-bold text-amber-800 shadow-lg mb-4">
                  {gameState.diceValue || '🎲'}
                </div>
                <button
                  onClick={startQuiz}
                  disabled={!gameState.canRollDice || !!gameState.winner || gameState.showQuiz}
                  className="px-6 py-3 bg-amber-700 text-white font-bold rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
                >
                  {gameState.showQuiz ? 'Respondiendo...' : '📚 Responder Quiz'}
                </button>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-6 border-3 border-amber-600">
              <h3 className="text-lg font-bold mb-4 text-amber-900">📜 Posiciones</h3>
              <div className="space-y-2">
                {gameState.players
                  .sort((a, b) => b.position - a.position)
                  .map((player, index) => (
                    <div
                      key={player.id}
                      className="flex items-center gap-3 p-2 bg-white/70 rounded-lg shadow-sm border-l-4"
                      style={{ borderLeftColor: player.color }}
                    >
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: player.color }}
                      />
                      <span className="text-sm text-amber-900">{player.name}</span>
                      <span className="ml-auto font-bold text-amber-800">{player.position + 1}</span>
                      {(player as any).inPrison && <span className="text-red-600">🔒</span>}
                      {(player as any).inWell && <span className="text-blue-600">🕳️</span>}
                      {(player as any).skipTurns > 0 && <span className="text-orange-600">💤</span>}
                    </div>
                  ))}
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-6 border-3 border-amber-600">
              <h3 className="text-lg font-bold mb-4 text-amber-900">📰 Crónica del Juego</h3>
              <div className="message-log h-48 overflow-y-auto bg-white/90 rounded-lg p-4 text-sm space-y-2 border border-amber-200">
                {gameState.messages.map((message, index) => (
                  <div key={index} className="p-2 bg-amber-50 rounded text-amber-900">
                    {message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex flex-col gap-6 h-full">
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-6 border-3 border-amber-600">
            <h3 className="text-lg font-bold mb-4 text-center text-amber-900">🎯 Panel de Juego</h3>
            
            <div className="mb-6">
              <h4 className="font-semibold mb-3 text-amber-800">Turno actual:</h4>
              <div
                className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-200 to-amber-200 rounded-lg shadow-lg border-l-4 transform scale-105"
                style={{ borderLeftColor: gameState.players[gameState.currentPlayerIndex].color }}
              >
                <div
                  className="w-5 h-5 rounded-full border-2 border-white shadow-md"
                  style={{ backgroundColor: gameState.players[gameState.currentPlayerIndex].color }}
                />
                <strong className="text-amber-900">{gameState.players[gameState.currentPlayerIndex].name}</strong>
                <span className="ml-auto text-sm text-amber-700">
                  Casilla {gameState.players[gameState.currentPlayerIndex].position + 1}
                </span>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto bg-white border-4 border-amber-700 rounded-xl flex items-center justify-center text-3xl font-bold text-amber-800 shadow-lg mb-4">
                {gameState.diceValue || '🎲'}
              </div>
              <button
                onClick={startQuiz}
                disabled={!gameState.canRollDice || !!gameState.winner || gameState.showQuiz}
                className="px-6 py-3 bg-amber-700 text-white font-bold rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 transition-all duration-300"
              >
                {gameState.showQuiz ? 'Respondiendo...' : '📚 Responder Quiz'}
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-6 border-3 border-amber-600">
            <h3 className="text-lg font-bold mb-4 text-amber-900">📜 Posiciones</h3>
            <div className="space-y-2">
              {gameState.players
                .sort((a, b) => b.position - a.position)
                .map((player, index) => (
                  <div
                    key={player.id}
                    className="flex items-center gap-3 p-2 bg-white/70 rounded-lg shadow-sm border-l-4"
                    style={{ borderLeftColor: player.color }}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                      style={{ backgroundColor: player.color }}
                    />
                    <span className="text-sm text-amber-900">{player.name}</span>
                    <span className="ml-auto font-bold text-amber-800">{player.position + 1}</span>
                    {(player as any).inPrison && <span className="text-red-600">🔒</span>}
                    {(player as any).inWell && <span className="text-blue-600">🕳️</span>}
                    {(player as any).skipTurns > 0 && <span className="text-orange-600">💤</span>}
                  </div>
                ))}
            </div>
          </div>
          
          {/* Crónica del juego - Solo en pantallas medianas (no móviles ni XL) */}
          <div className="hidden md:block xl:hidden bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-6 border-3 border-amber-600">
            <h3 className="text-lg font-bold mb-4 text-amber-900">📰 Crónica del Juego</h3>
            <div className="message-log h-[min(30vh,300px)] max-h-96 min-h-48 overflow-y-auto bg-white/90 rounded-lg p-4 text-sm space-y-2 border border-amber-200">
              {gameState.messages.map((message, index) => (
                <div key={index} className="p-2 bg-amber-50 rounded text-amber-900">
                  {message}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Tercera columna - Solo en pantallas extra grandes (Crónica del juego) */}
        <div className="hidden xl:block bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-6 border-3 border-amber-600">
          <h3 className="text-lg font-bold mb-4 text-amber-900">📰 Crónica del Juego</h3>
          <div className="message-log h-[calc(100vh-200px)] max-h-[600px] min-h-[400px] overflow-y-auto bg-white/90 rounded-lg p-4 text-sm space-y-2 border border-amber-200">
            {gameState.messages.map((message, index) => (
              <div key={index} className="p-2 bg-amber-50 rounded text-amber-900">
                {message}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}