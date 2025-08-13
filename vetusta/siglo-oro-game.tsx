import React, { useState, useEffect } from 'react';
import { Crown, BookOpen, Feather, Heart, Sword, Church, Dice6, Star } from 'lucide-react';

const SigloOroGame = () => {
  // Ubicaciones del Madrid del Siglo de Oro
  const locations = {
    alcazar: { name: "Real Alcázar", icon: "👑", x: 50, y: 15, effect: "Favor Real (+2 Prestigio)" },
    corrales: { name: "Corral de Comedias", icon: "🎭", x: 30, y: 40, effect: "Fama Teatral (+1 Ingenio)" },
    mentidero: { name: "Mentidero", icon: "🗣️", x: 70, y: 35, effect: "Rumores y Chismes" },
    universidad: { name: "Universidad", icon: "📚", x: 20, y: 60, effect: "Sabiduría (+1 Erudición)" },
    iglesia: { name: "San Jerónimo", icon: "⛪", x: 80, y: 50, effect: "Piedad (+1 Virtud)" },
    casa_campo: { name: "Casa de Campo", icon: "🌳", x: 15, y: 25, effect: "Inspiración Bucólica" },
    palacio: { name: "Palacio del Duque", icon: "🏰", x: 75, y: 20, effect: "Mecenazgo Aristocrático" },
    convento: { name: "Convento", icon: "📿", x: 25, y: 75, effect: "Retiro Espiritual" },
    libreria: { name: "Librería", icon: "📖", x: 60, y: 65, effect: "Intercambio Literario" },
    taberna: { name: "Taberna del Parnaso", icon: "🍷", x: 45, y: 80, effect: "Tertulias Bohemias" },
    academia: { name: "Academia", icon: "🎨", x: 85, y: 70, effect: "Crítica Literaria" },
    salon: { name: "Salón Noble", icon: "✨", x: 55, y: 30, effect: "Refinamiento Social" }
  };

  // Personajes del Siglo de Oro
  const characters = {
    gongora: { 
      name: "Luis de Góngora", 
      color: "#663399", 
      ability: "Culteranismo: +2 Erudición en Universidad",
      location: "universidad",
      period: "1561-1627",
      style: "Cultiva la oscuridad poética y la complejidad sintáctica"
    },
    quevedo: { 
      name: "Francisco de Quevedo", 
      color: "#8b0000", 
      ability: "Conceptismo: +2 Ingenio en Mentidero",
      location: "mentidero",
      period: "1580-1645",
      style: "Maestro del juego conceptual y la sátira mordaz"
    },
    lope: { 
      name: "Lope de Vega", 
      color: "#556b2f", 
      ability: "Fénix: +2 Prestigio en Corrales",
      location: "corrales",
      period: "1562-1635",
      style: "Fénix de los ingenios, revoluciona el teatro español"
    },
    calderon: { 
      name: "Calderón de la Barca", 
      color: "#d4a574", 
      ability: "Dramaturgo Real: +2 en Alcázar",
      location: "alcazar",
      period: "1600-1681",
      style: "Perfecciona el drama barroco con profundidad filosófica"
    }
  };

  // Tipos de cartas del Siglo de Oro
  const cardTypes = {
    ingenio: [
      { name: "Agudeza Verbal", effect: "Desconcierta a rival con juego de palabras (-1 Prestigio)", target: "player" },
      { name: "Sátira Mordaz", effect: "Reduce Prestigio -2 a personaje específico", target: "player" },
      { name: "Epigrama Certero", effect: "Gana +1 Ingenio y rival pierde -1", target: "player" },
      { name: "Conceptos Sutiles", effect: "Inmune a próximo ataque verbal", target: "self" },
      { name: "Duelo Poético", effect: "Reto directo: ambos tiran dados", target: "player" },
      { name: "Burla Ingeniosa", effect: "Todos los rivales pierden -1 Virtud", target: "all" },
      { name: "Improvisación Brillante", effect: "+2 Ingenio si estás en Mentidero o Taberna", target: "self" }
    ],
    erudicion: [
      { name: "Cita Clásica", effect: "Demuestra sabiduría: +2 Prestigio", target: "self" },
      { name: "Alusión Mitológica", effect: "Confunde rivales menos cultos (-1 Ingenio a todos)", target: "all" },
      { name: "Traducción Perfecta", effect: "Prestigio +1 por cada punto de Erudición", target: "self" },
      { name: "Comentario Docto", effect: "Anula próxima carta de Ingenio rival", target: "player" },
      { name: "Disputa Académica", effect: "Intercambia posiciones con rival", target: "player" },
      { name: "Glosa Magistral", effect: "+2 Erudición si estás en Universidad o Librería", target: "self" },
      { name: "Exégesis Profunda", effect: "Gana Erudición igual a tu Virtud actual", target: "self" }
    ],
    favor: [
      { name: "Mecenazgo Real", effect: "Todos en Palacio/Alcázar +1 Prestigio", target: "location" },
      { name: "Estreno Exitoso", effect: "Corrales: +2 Prestigio para presentes", target: "location" },
      { name: "Escándalo Literario", effect: "Jugador con menor Virtud pierde -2 Prestigio", target: "all" },
      { name: "Bendición Papal", effect: "Todos ganan +1 Virtud", target: "all" },
      { name: "Rivalidad Pública", effect: "Dos escritores pierden -1 Prestigio cada uno", target: "two_players" },
      { name: "Academia Literaria", effect: "Intercambia cartas con otro jugador", target: "player" },
      { name: "Censura Inquisitorial", effect: "Jugador pierde todas las cartas de Erudición", target: "player" }
    ]
  };

  // Estado del juego
  const [gameState, setGameState] = useState({
    players: [],
    currentPlayer: 0,
    currentTurn: 1,
    phase: 'setup',
    selectedCharacters: [],
    playerHands: {},
    gameLog: [],
    aiThinking: false,
    maxTurns: 20,
    processing: false,
    fastAI: false
  });

  const [setupForm, setSetupForm] = useState({
    numPlayers: 2,
    playerNames: ['', ''],
    playerTypes: ['human', 'ai'],
    maxTurns: 20,
    fastAI: false
  });

  const [gameActions, setGameActions] = useState({
    showDice: false,
    diceResult: null,
    selectedCard: null,
    targetPlayer: null,
    showCards: false
  });

  // Obtener cartas aleatorias
  const getRandomCards = (type: string, count: number) => {
    const cards = [...cardTypes[type]];
    const result = [];
    for (let i = 0; i < count; i++) {
      if (cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * cards.length);
        result.push(cards.splice(randomIndex, 1)[0]);
      }
    }
    return result;
  };

  // Inicializar juego
  const initializeGame = () => {
    const selectedChars = Object.keys(characters).slice(0, setupForm.numPlayers);
    const players = setupForm.playerNames.slice(0, setupForm.numPlayers).map((name, index) => ({
      id: index,
      name: name || (setupForm.playerTypes[index] === 'ai' ? `IA ${characters[selectedChars[index]].name}` : `Poeta ${index + 1}`),
      character: selectedChars[index],
      location: characters[selectedChars[index]].location,
      prestigio: 5,
      ingenio: 0,
      erudicion: 0,
      virtud: 5,
      movements: 0,
      isAI: setupForm.playerTypes[index] === 'ai'
    }));

    // Repartir cartas iniciales
    const hands = {};
    players.forEach(player => {
      hands[player.id] = {
        ingenio: getRandomCards('ingenio', 2),
        erudicion: getRandomCards('erudicion', 2),
        favor: getRandomCards('favor', 1)
      };
    });

    const newGameState = {
      players,
      currentPlayer: 0,
      currentTurn: 1,
      phase: 'playing',
      selectedCharacters: selectedChars,
      playerHands: hands,
      gameLog: [`¡Comienza el duelo de ingenios! ${setupForm.maxTurns} turnos en el Madrid del Siglo de Oro. Turno 1: ${players[0].name}`],
      aiThinking: false,
      maxTurns: setupForm.maxTurns,
      fastAI: setupForm.fastAI,
      processing: false
    };

    setGameState(newGameState);
  };

  // Sistema de turnos
  const advanceGame = () => {
    setGameState(prev => {
      if (prev.phase !== 'playing' || prev.processing) {
        return prev;
      }

      // Verificar condiciones de final
      const defeatedPlayer = prev.players.find(p => p.prestigio <= 0);
      if (defeatedPlayer) {
        const finalScores = prev.players.map(player => ({
          ...player,
          finalScore: (player.prestigio * 3) + (player.ingenio * 2) + (player.erudicion * 2) + player.virtud
        })).sort((a, b) => b.finalScore - a.finalScore);

        return {
          ...prev,
          phase: 'ended',
          finalScores,
          endReason: `${defeatedPlayer.name} ha perdido todo su prestigio`,
          aiThinking: false,
          processing: false,
          gameLog: [
            ...prev.gameLog.slice(-7),
            `🏆 DUELO TERMINADO: ${defeatedPlayer.name} ha caído en desgracia`,
            `🥇 Vencedor: ${finalScores[0].name} (${finalScores[0].finalScore} puntos de gloria)`
          ]
        };
      }

      // Verificar fin por turnos
      if (prev.currentTurn >= prev.maxTurns) {
        const finalScores = prev.players.map(player => ({
          ...player,
          finalScore: (player.prestigio * 3) + (player.ingenio * 2) + (player.erudicion * 2) + player.virtud
        })).sort((a, b) => b.finalScore - a.finalScore);

        return {
          ...prev,
          phase: 'ended',
          finalScores,
          endReason: `${prev.maxTurns} turnos completados`,
          aiThinking: false,
          processing: false,
          gameLog: [
            ...prev.gameLog.slice(-7),
            `🏆 DUELO TERMINADO: ${prev.maxTurns} turnos de gloria literaria`,
            `🥇 El más laureado: ${finalScores[0].name} (${finalScores[0].finalScore} puntos)`
          ]
        };
      }

      // Siguiente jugador
      const nextPlayer = (prev.currentPlayer + 1) % prev.players.length;
      const nextTurn = prev.currentTurn + 1;

      return {
        ...prev,
        currentPlayer: nextPlayer,
        currentTurn: nextTurn,
        processing: false,
        gameLog: [...prev.gameLog.slice(-9), `Turno ${nextTurn} de ${prev.maxTurns}: ${prev.players[nextPlayer].name}`]
      };
    });

    setGameActions({ showDice: false, diceResult: null, selectedCard: null, targetPlayer: null, showCards: false });
  };

  // Mover personaje con efectos específicos del Siglo de Oro
  const movePlayer = (locationKey: string) => {
    setGameState(prev => {
      const currentPlayerData = prev.players[prev.currentPlayer];
      const playerId = prev.currentPlayer;
      
      const updatedPlayers = prev.players.map(player => 
        player.id === prev.currentPlayer 
          ? { ...player, location: locationKey, movements: player.movements + 1 }
          : player
      );

      const player = updatedPlayers[playerId];
      const location = locations[locationKey];
      let logMessage = `${player.name} visita ${location.name}`;
      
      // Aplicar efectos según ubicación y personaje (especialización del Siglo de Oro)
      switch(locationKey) {
        case 'alcazar':
          if (player.character === 'calderon') {
            updatedPlayers[playerId].prestigio += 2;
            updatedPlayers[playerId].virtud += 1;
            logMessage += ' (Dramaturgo Real: +2 Prestigio, +1 Virtud)';
          } else {
            updatedPlayers[playerId].prestigio += 1;
            logMessage += ' (+1 Prestigio real)';
          }
          break;
        case 'corrales':
          if (player.character === 'lope') {
            updatedPlayers[playerId].prestigio += 2;
            updatedPlayers[playerId].ingenio += 1;
            logMessage += ' (Fénix de los Ingenios: +2 Prestigio, +1 Ingenio)';
          } else {
            updatedPlayers[playerId].ingenio += 1;
            logMessage += ' (+1 Ingenio teatral)';
          }
          break;
        case 'mentidero':
          if (player.character === 'quevedo') {
            updatedPlayers[playerId].ingenio += 2;
            updatedPlayers[playerId].prestigio += 1;
            logMessage += ' (Maestro del Conceptismo: +2 Ingenio, +1 Prestigio)';
          } else {
            updatedPlayers[playerId].ingenio += 1;
            logMessage += ' (+1 Ingenio satírico)';
          }
          break;
        case 'universidad':
          if (player.character === 'gongora') {
            updatedPlayers[playerId].erudicion += 2;
            updatedPlayers[playerId].prestigio += 1;
            logMessage += ' (Príncipe del Culteranismo: +2 Erudición, +1 Prestigio)';
          } else {
            updatedPlayers[playerId].erudicion += 1;
            logMessage += ' (+1 Erudición académica)';
          }
          break;
        case 'iglesia':
        case 'convento':
          updatedPlayers[playerId].virtud += 1;
          if (player.character === 'calderon') {
            updatedPlayers[playerId].erudicion += 1;
            logMessage += ' (+1 Virtud, +1 Erudición teológica)';
          } else {
            logMessage += ' (+1 Virtud espiritual)';
          }
          break;
        case 'palacio':
        case 'salon':
          updatedPlayers[playerId].prestigio += 1;
          logMessage += ' (+1 Prestigio aristocrático)';
          break;
        case 'libreria':
        case 'academia':
          updatedPlayers[playerId].erudicion += 1;
          if (player.character === 'gongora') {
            updatedPlayers[playerId].ingenio += 1;
            logMessage += ' (+1 Erudición, +1 Ingenio culterano)';
          } else {
            logMessage += ' (+1 Erudición literaria)';
          }
          break;
        case 'taberna':
          if (Math.random() > 0.5) {
            updatedPlayers[playerId].ingenio += 1;
            if (player.character === 'quevedo') {
              updatedPlayers[playerId].ingenio += 1;
              logMessage += ' (inspiración etílica quevedesca: +2 Ingenio)';
            } else {
              logMessage += ' (inspiración etílica: +1 Ingenio)';
            }
          } else {
            updatedPlayers[playerId].virtud = Math.max(0, updatedPlayers[playerId].virtud - 1);
            logMessage += ' (excesos: -1 Virtud)';
          }
          break;
        case 'casa_campo':
          if (Math.random() > 0.6) {
            if (player.character === 'lope') {
              updatedPlayers[playerId].erudicion += 2;
              logMessage += ' (inspiración bucólica lopesca: +2 Erudición)';
            } else {
              updatedPlayers[playerId].erudicion += 1;
              logMessage += ' (inspiración bucólica: +1 Erudición)';
            }
          }
          break;
        default:
          break;
      }

      return {
        ...prev,
        players: updatedPlayers,
        gameLog: [...prev.gameLog.slice(-9), logMessage]
      };
    });
  };

  // Ejecutar turno de IA con personalidades del Siglo de Oro
  const executeAITurn = async () => {
    await new Promise(resolve => {
      setGameState(prev => {
        resolve();
        return { ...prev, processing: true, aiThinking: true };
      });
    });

    try {
      const currentState = await new Promise(resolve => {
        setGameState(prev => {
          resolve(prev);
          return prev;
        });
      });
      
      if (!currentState.fastAI) {
        await new Promise(r => setTimeout(r, 1200));
      } else {
        await new Promise(r => setTimeout(r, 100));
      }

      // Tirar dados
      const dice = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
      setGameActions({ showDice: true, diceResult: dice });
      
      await new Promise(resolve => {
        setGameState(prev => {
          const player = prev.players[prev.currentPlayer];
          resolve();
          return {
            ...prev,
            gameLog: [...prev.gameLog.slice(-9), `${player.name} (IA) consulta las musas: ${dice}`]
          };
        });
      });

      if (!currentState.fastAI) {
        await new Promise(r => setTimeout(r, 1000));
      } else {
        await new Promise(r => setTimeout(r, 50));
      }

      // Estrategias específicas por escritor del Siglo de Oro
      const locationKeys = Object.keys(locations);
      let targetLocation;
      
      await new Promise(resolve => {
        setGameState(prev => {
          const player = prev.players[prev.currentPlayer];
          const turn = prev.currentTurn;
          
          // Estrategias históricamente inspiradas
          switch(player.character) {
            case 'gongora':
              // Góngora busca erudición y prestigio académico
              if (player.erudicion < 4) {
                targetLocation = Math.random() > 0.2 ? 'universidad' : 'libreria';
              } else if (player.prestigio < 7) {
                targetLocation = ['salon', 'academia', 'palacio'][Math.floor(Math.random() * 3)];
              } else {
                targetLocation = ['alcazar', 'convento', 'casa_campo'][Math.floor(Math.random() * 3)];
              }
              break;
              
            case 'quevedo':
              // Quevedo busca ingenio y crítica social
              if (player.ingenio < 4) {
                targetLocation = Math.random() > 0.3 ? 'mentidero' : 'taberna';
              } else if (player.prestigio < 6) {
                targetLocation = ['corrales', 'academia', 'salon'][Math.floor(Math.random() * 3)];
              } else {
                targetLocation = ['palacio', 'alcazar', 'universidad'][Math.floor(Math.random() * 3)];
              }
              break;
              
            case 'lope':
              // Lope busca fama teatral y prestigio popular
              if (player.prestigio < 8) {
                targetLocation = Math.random() > 0.3 ? 'corrales' : 'alcazar';
              } else if (turn < currentState.maxTurns * 2 / 3) {
                targetLocation = ['palacio', 'salon', 'casa_campo'][Math.floor(Math.random() * 3)];
              } else {
                targetLocation = ['iglesia', 'convento', 'academia'][Math.floor(Math.random() * 3)];
              }
              break;
              
            case 'calderon':
              // Calderón equilibra virtud, erudición y prestigio
              if (player.virtud < 7) {
                targetLocation = ['iglesia', 'convento', 'universidad'][Math.floor(Math.random() * 3)];
              } else if (player.erudicion < 3) {
                targetLocation = ['universidad', 'libreria', 'academia'][Math.floor(Math.random() * 3)];
              } else {
                targetLocation = Math.random() > 0.4 ? 'alcazar' : 'palacio';
              }
              break;
              
            default:
              targetLocation = locationKeys[Math.floor(Math.random() * locationKeys.length)];
          }
          
          resolve();
          return prev;
        });
      });
      
      movePlayer(targetLocation);

      if (!currentState.fastAI) {
        await new Promise(r => setTimeout(r, 1500));
      } else {
        await new Promise(r => setTimeout(r, 50));
      }

      // Eventos literarios del Siglo de Oro
      if (Math.random() < 0.3) {
        await new Promise(resolve => {
          setGameState(prev => {
            const player = prev.players[prev.currentPlayer];
            const events = [
              { effect: () => ({ prestigio: 1 }), message: 'Un verso memorable eleva tu fama (+1 Prestigio)' },
              { effect: () => ({ ingenio: 1 }), message: 'Un juego de palabras brillante (+1 Ingenio)' },
              { effect: () => ({ erudicion: 1 }), message: 'Una cita clásica perfecta (+1 Erudición)' },
              { effect: () => ({ virtud: -1 }), message: 'Un escándalo mancha tu reputación (-1 Virtud)' },
              { effect: () => ({ prestigio: 2 }), message: 'El mecenas queda impresionado (+2 Prestigio)' },
              { effect: () => ({ ingenio: -1 }), message: 'Una crítica feroz hiere tu orgullo (-1 Ingenio)' }
            ];
            
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            const effect = randomEvent.effect();
            
            const updatedPlayers = prev.players.map(p => 
              p.id === prev.currentPlayer 
                ? { 
                    ...p, 
                    prestigio: Math.max(0, Math.min(20, p.prestigio + (effect.prestigio || 0))),
                    ingenio: Math.max(0, p.ingenio + (effect.ingenio || 0)),
                    erudicion: Math.max(0, p.erudicion + (effect.erudicion || 0)),
                    virtud: Math.max(0, Math.min(15, p.virtud + (effect.virtud || 0)))
                  }
                : p
            );
            
            resolve();
            return {
              ...prev,
              players: updatedPlayers,
              gameLog: [...prev.gameLog.slice(-8), `⚡ ${player.name} - ${randomEvent.message}`]
            };
          });
        });
        
        if (!currentState.fastAI) {
          await new Promise(r => setTimeout(r, 1000));
        } else {
          await new Promise(r => setTimeout(r, 25));
        }
      }

    } finally {
      await new Promise(resolve => {
        setGameState(prev => {
          resolve();
          return { ...prev, aiThinking: false, processing: false };
        });
      });
      
      setTimeout(advanceGame, 100);
    }
  };

  // Detectar turno de IA
  useEffect(() => {
    if (gameState.phase !== 'playing' || 
        gameState.processing || 
        gameState.aiThinking ||
        gameState.players.length === 0) {
      return;
    }

    const currentPlayer = gameState.players[gameState.currentPlayer];
    if (!currentPlayer || !currentPlayer.isAI) {
      return;
    }

    const timer = setTimeout(() => {
      executeAITurn();
    }, 600);
    
    return () => clearTimeout(timer);
  }, [gameState.currentPlayer, gameState.phase, gameState.processing, gameState.aiThinking]);

  // Funciones para jugadores humanos
  const nextTurn = () => {
    advanceGame();
  };

  const rollDice = () => {
    const result = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
    setGameActions(prev => ({ ...prev, showDice: true, diceResult: result }));
    
    setGameState(prev => {
      const currentPlayerData = prev.players[prev.currentPlayer];
      return {
        ...prev,
        gameLog: [...prev.gameLog.slice(-9), `${currentPlayerData.name} consulta las musas: ${result} puntos de inspiración`]
      };
    });
    
    return result;
  };

  const playCard = (card, cardType, targetPlayerId = null) => {
    setGameState(prev => ({
      ...prev,
      playerHands: {
        ...prev.playerHands,
        [prev.currentPlayer]: {
          ...prev.playerHands[prev.currentPlayer],
          [cardType]: prev.playerHands[prev.currentPlayer][cardType].filter(c => c.name !== card.name)
        }
      },
      gameLog: [...prev.gameLog.slice(-9), `${prev.players[prev.currentPlayer].name} despliega "${card.name}"`]
    }));
  };

  // Render del setup
  if (gameState.phase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-200 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-amber-900 mb-3">✍️ Siglo de Oro ✍️</h1>
            <h2 className="text-3xl text-amber-700 font-serif">Duelo de Ingenios</h2>
            <p className="text-amber-600 mt-3 font-serif italic">Madrid, siglos XVI-XVII</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-2xl p-8 border-2 border-amber-300">
            <h3 className="text-2xl font-semibold mb-6 text-amber-900 text-center">Configuración del Certamen</h3>
            
            <div className="mb-6 p-4 bg-amber-100 rounded-lg border-l-4 border-amber-600">
              <h4 className="font-bold mb-3 text-amber-900 flex items-center gap-2">
                <BookOpen size={20} />
                📜 Reglas del Duelo Literario
              </h4>
              <div className="text-sm text-amber-800 space-y-2">
                <div><strong>Objetivo:</strong> Acumula gloria literaria combinando Prestigio, Ingenio, Erudición y Virtud.</div>
                <div><strong>Movimiento:</strong> Recorre el Madrid áureo visitando lugares que potencien tu genio creativo.</div>
                <div><strong>Especialización:</strong> Cada escritor posee habilidades únicas según su estilo histórico.</div>
                <div className="text-xs mt-3 italic font-semibold">
                  Gloria final: (Prestigio × 3) + (Ingenio × 2) + (Erudición × 2) + Virtud
                </div>
              </div>
            </div>
            
            <div className="mb-6 p-4 bg-purple-100 rounded-lg border-l-4 border-purple-600">
              <div className="text-sm text-purple-800 flex items-center gap-2">
                <Feather size={16} />
                <strong>🤖 Ingenios Artificiales:</strong>
                <span>Las IAs recrean fielmente el estilo y personalidad de cada gran maestro del Siglo de Oro.</span>
              </div>
            </div>
            
            {/* Configuración de jugadores */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-amber-900">Número de ingenios participantes:</label>
              <select 
                value={setupForm.numPlayers}
                onChange={(e) => {
                  const num = parseInt(e.target.value);
                  setSetupForm(prev => ({
                    ...prev,
                    numPlayers: num,
                    playerNames: Array(num).fill('').map((_, i) => prev.playerNames[i] || ''),
                    playerTypes: Array(num).fill('').map((_, i) => prev.playerTypes[i] || 'human')
                  }));
                }}
                className="w-full p-3 border-2 border-amber-300 rounded-lg bg-white font-serif"
              >
                <option value={2}>2 ingenios</option>
                <option value={3}>3 ingenios</option>
                <option value={4}>4 ingenios</option>
              </select>
            </div>

            <div className="mb-8">
              <label className="block text-sm font-medium mb-3 text-amber-900">Configuración de participantes:</label>
              {Array(setupForm.numPlayers).fill(0).map((_, index) => (
                <div key={index} className="mb-4 p-4 border-2 border-amber-200 rounded-lg bg-yellow-50">
                  <div className="flex items-center gap-3 mb-3">
                    <Crown size={16} className="text-amber-600" />
                    <span className="font-medium text-amber-900">Escritor {index + 1}:</span>
                    <select
                      value={setupForm.playerTypes[index] || 'human'}
                      onChange={(e) => {
                        const newTypes = [...setupForm.playerTypes];
                        newTypes[index] = e.target.value;
                        setSetupForm(prev => ({ ...prev, playerTypes: newTypes }));
                      }}
                      className="px-3 py-2 border border-amber-300 rounded text-sm font-serif bg-white"
                    >
                      <option value="human">🧑 Mortal</option>
                      <option value="ai">🤖 IA Literaria</option>
                    </select>
                  </div>
                  
                  {setupForm.playerTypes[index] === 'human' && (
                    <input
                      type="text"
                      placeholder={`Nombre del escritor ${index + 1}`}
                      value={setupForm.playerNames[index] || ''}
                      onChange={(e) => {
                        const newNames = [...setupForm.playerNames];
                        newNames[index] = e.target.value;
                        setSetupForm(prev => ({ ...prev, playerNames: newNames }));
                      }}
                      className="w-full p-3 border-2 border-amber-300 rounded text-sm font-serif"
                    />
                  )}
                  
                  {setupForm.playerTypes[index] === 'ai' && (
                    <div className="text-sm text-amber-700 italic font-serif">
                      La IA encarnará a {Object.keys(characters)[index] ? characters[Object.keys(characters)[index]].name : 'Gran Escritor'} 
                      {Object.keys(characters)[index] && ` (${characters[Object.keys(characters)[index]].period})`}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-8 p-4 border-2 border-amber-300 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50">
              <h4 className="font-medium mb-4 text-amber-900 flex items-center gap-2">
                <Dice6 size={18} />
                ⚙️ Configuración del Certamen
              </h4>
              
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2 text-amber-900">Duración del certamen literario:</label>
                <select
                  value={setupForm.maxTurns}
                  onChange={(e) => setSetupForm(prev => ({ ...prev, maxTurns: parseInt(e.target.value) }))}
                  className="w-full p-3 border-2 border-amber-300 rounded text-sm font-serif bg-white"
                >
                  <option value={16}>16 turnos (Soneto ~20 min)</option>
                  <option value={20}>20 turnos (Romance ~25 min)</option>
                  <option value={24}>24 turnos (Comedia ~30 min)</option>
                  <option value={32}>32 turnos (Auto Sacramental ~40 min)</option>
                </select>
                <div className="text-xs text-amber-700 mt-2 font-serif italic">
                  El certamen se extenderá {setupForm.maxTurns} turnos. 
                  Cada escritor participará aproximadamente {Math.floor(setupForm.maxTurns / setupForm.numPlayers)} veces.
                </div>
              </div>

              {setupForm.playerTypes.some(type => type === 'ai') && (
                <div className="mb-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={setupForm.fastAI}
                      onChange={(e) => setSetupForm(prev => ({ ...prev, fastAI: e.target.checked }))}
                    />
                    <span className="text-amber-900">🚀 Modo Acelerado (recomendado para múltiples IAs)</span>
                  </label>
                  <div className="text-xs text-amber-700 mt-1 font-serif italic">
                    Acelera las deliberaciones de las IAs para partidas más dinámicas
                  </div>
                </div>
              )}
            </div>

            <div className="mb-8">
              <h4 className="font-medium mb-4 text-amber-900">Ingenios del Siglo de Oro disponibles:</h4>
              {Object.keys(characters).slice(0, setupForm.numPlayers).map((charKey, index) => (
                <div key={charKey} className="flex items-start gap-3 mb-4 p-3 bg-white rounded-lg border border-amber-200">
                  <div 
                    className="w-5 h-5 rounded-full mt-1 border-2 border-white shadow-md" 
                    style={{ backgroundColor: characters[charKey].color }}
                  ></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <strong className="text-amber-900">{characters[charKey].name}</strong>
                      <span className="text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded">{characters[charKey].period}</span>
                    </div>
                    <div className="text-sm text-amber-700 mb-1">{characters[charKey].ability}</div>
                    <div className="text-xs text-amber-600 italic">{characters[charKey].style}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={initializeGame}
              className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-lg font-serif"
            >
              ⚔️ ¡Que Comience el Duelo de Ingenios!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render de fin de juego
  if (gameState.phase === 'ended') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-200 p-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-amber-900 mb-3">🏆 CERTAMEN CONCLUIDO</h1>
            <h2 className="text-2xl text-amber-700 mb-6 font-serif italic">{gameState.endReason}</h2>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-2xl p-8 mb-8 border-2 border-amber-300">
            <h3 className="text-3xl font-semibold mb-6 text-center text-amber-900">🏅 Laureados del Parnaso</h3>
            
            {gameState.finalScores?.map((player, index) => (
              <div 
                key={player.id} 
                className={`p-6 rounded-xl border-2 mb-4 transition-all hover:shadow-lg ${
                  index === 0 
                    ? 'border-yellow-400 bg-gradient-to-r from-yellow-50 to-yellow-100' 
                    : index === 1 
                    ? 'border-gray-400 bg-gradient-to-r from-gray-50 to-gray-100'
                    : index === 2
                    ? 'border-orange-400 bg-gradient-to-r from-orange-50 to-orange-100'
                    : 'border-amber-200 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">
                      {index === 0 ? '🏆' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}°`}
                    </div>
                    <div 
                      className="w-8 h-8 rounded-full border-2 border-white shadow-md" 
                      style={{ backgroundColor: characters[player.character].color }}
                    ></div>
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-xl text-amber-900">{player.name}</span>
                        {player.isAI && (
                          <span className="text-sm bg-purple-200 text-purple-800 px-3 py-1 rounded-full">
                            🤖 IA Literaria
                          </span>
                        )}
                      </div>
                      <div className="text-amber-700 font-serif">{characters[player.character].name}</div>
                      <div className="text-sm text-amber-600">{characters[player.character].period}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-3xl font-bold text-amber-600 mb-1">{player.finalScore}</div>
                    <div className="text-sm text-amber-700 mb-2">puntos de gloria</div>
                    <div className="text-xs text-amber-600 font-serif">
                      Prestigio: {player.prestigio} | Ingenio: {player.ingenio}<br/>
                      Erudición: {player.erudicion} | Virtud: {player.virtud}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 rounded-xl shadow-xl p-6 mb-8 border border-amber-300">
            <h3 className="text-xl font-semibold mb-4 text-amber-900 text-center">📊 Crónica del Certamen</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <div className="text-2xl font-bold text-amber-600">{gameState.maxTurns}</div>
                <div className="text-sm text-amber-700">Turnos de Gloria</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <div className="text-2xl font-bold text-amber-600">
                  {Math.max(...(gameState.finalScores?.map(p => p.prestigio) || [0]))}
                </div>
                <div className="text-sm text-amber-700">Mayor Prestigio</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <div className="text-2xl font-bold text-amber-600">
                  {Math.max(...(gameState.finalScores?.map(p => p.ingenio) || [0]))}
                </div>
                <div className="text-sm text-amber-700">Máximo Ingenio</div>
              </div>
              <div className="p-4 bg-white rounded-lg border border-amber-200">
                <div className="text-2xl font-bold text-amber-600">
                  {Math.max(...(gameState.finalScores?.map(p => p.erudicion) || [0]))}
                </div>
                <div className="text-sm text-amber-700">Mayor Erudición</div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-4">
            <button
              onClick={() => setGameState(prev => ({ ...prev, phase: 'setup' }))}
              className="bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700 text-white font-bold py-3 px-8 rounded-xl mr-4 transition-all transform hover:scale-105"
            >
              📜 Nuevo Certamen
            </button>
            
            <div className="text-amber-700 mt-6 font-serif">
              <p className="text-lg italic mb-2">"Que de laurel corona el cielo honrado</p>
              <p className="text-lg italic">a quien las musas dieron su cuidado."</p>
              <p className="text-sm mt-3">— Inspirado en los versos del Siglo de Oro</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render del juego principal
  const currentPlayerData = gameState.players[gameState.currentPlayer];
  const currentHand = gameState.playerHands[gameState.currentPlayer];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-100 to-amber-200 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header del juego */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-amber-900 mb-2">✍️ Siglo de Oro: Duelo de Ingenios ✍️</h1>
          <div className="flex justify-center gap-4 mt-3 text-sm">
            <span className="bg-white px-4 py-2 rounded-lg font-semibold border-2 border-amber-300 shadow">
              Turno {gameState.currentTurn} de {gameState.maxTurns}
            </span>
            <span className="bg-amber-100 px-4 py-2 rounded-lg font-semibold border-2 border-amber-400 shadow">
              {currentPlayerData?.name || 'Escritor'} 
            </span>
            {gameState.currentTurn === gameState.maxTurns && (
              <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold animate-pulse shadow">
                🏁 ÚLTIMO TURNO
              </span>
            )}
          </div>
          
          {/* Barra de progreso */}
          <div className="mt-3 max-w-lg mx-auto">
            <div className="w-full bg-amber-200 rounded-full h-3 border border-amber-400">
              <div 
                className="bg-gradient-to-r from-amber-500 to-yellow-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${(gameState.currentTurn / gameState.maxTurns) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-amber-700 text-center mt-2 font-serif">
              Progreso del Certamen: {Math.round((gameState.currentTurn / gameState.maxTurns) * 100)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Mapa de Madrid del Siglo de Oro */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-6 border-2 border-amber-300">
              <h3 className="text-xl font-semibold mb-4 text-center text-amber-900">Madrid del Siglo de Oro</h3>
              <div className="relative bg-gradient-to-br from-amber-50 to-yellow-100 rounded-xl h-96 border-2 border-amber-200">
                {Object.entries(locations).map(([key, location]) => {
                  const playersHere = gameState.players.filter(p => p.location === key);
                  console.log(`Location ${key}: Players here:`, playersHere.map(p => p.name));
                  
                  return (
                    <div
                      key={key}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-125 transition-transform duration-200"
                      style={{ left: `${location.x}%`, top: `${location.y}%` }}
                      onClick={() => gameActions.diceResult && movePlayer(key)}
                      title={`${location.name}: ${location.effect}`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-1 drop-shadow-md">{location.icon}</div>
                        <div className="text-xs font-medium bg-white px-2 py-1 rounded-lg shadow-md border border-amber-200">
                          {location.name}
                        </div>
                        {playersHere.length > 0 && (
                          <div className="flex justify-center mt-1">
                            {playersHere.map(player => (
                              <div
                                key={player.id}
                                className="w-4 h-4 rounded-full border-2 border-white mr-1 shadow-sm"
                                style={{ backgroundColor: characters[player.character]?.color || '#666' }}
                                title={player.name}
                              ></div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Panel de escritores */}
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-6 border-2 border-amber-300">
              <h3 className="text-xl font-semibold mb-4 text-amber-900">Ingenios del Certamen</h3>
              {gameState.players.map(player => (
                <div 
                  key={player.id} 
                  className={`p-4 rounded-lg border-2 mb-3 transition-all ${
                    player.id === gameState.currentPlayer 
                      ? 'border-amber-400 bg-amber-100 shadow-lg' 
                      : 'border-amber-200 bg-white'
                  } ${player.isAI ? 'bg-purple-50' : ''}`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div 
                      className="w-6 h-6 rounded-full border-2 border-white shadow" 
                      style={{ backgroundColor: characters[player.character].color }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-amber-900">{player.name}</span>
                        {player.isAI && <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded">🤖</span>}
                        {player.id === gameState.currentPlayer && gameState.aiThinking && (
                          <span className="text-xs bg-amber-300 text-amber-800 px-2 py-1 rounded animate-pulse">✍️ Creando...</span>
                        )}
                      </div>
                      <div className="text-sm text-amber-700 font-serif">{characters[player.character].name}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-amber-700">Prestigio:</span>
                      <span className="font-semibold text-amber-800">{player.prestigio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-700">Ingenio:</span>
                      <span className="font-semibold text-red-800">{player.ingenio}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Erudición:</span>
                      <span className="font-semibold text-purple-800">{player.erudicion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-green-700">Virtud:</span>
                      <span className="font-semibold text-green-800">{player.virtud}</span>
                    </div>
                  </div>
                  <div className="text-xs text-amber-600 mt-2 font-serif italic">
                    En: {locations[player.location].name}
                  </div>
                </div>
              ))}
            </div>

            {/* Acciones del turno */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-6 border-2 border-amber-300">
              <h3 className="text-xl font-semibold mb-4 text-amber-900">Acciones</h3>
              
              {currentPlayerData && !currentPlayerData.isAI && (
                <>
                  {!gameActions.diceResult && (
                    <button
                      onClick={rollDice}
                      className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white font-bold py-3 px-4 rounded-lg mb-3 flex items-center justify-center gap-2 transition-all transform hover:scale-105"
                    >
                      <Dice6 size={18} />
                      Consultar las Musas
                    </button>
                  )}

                  {gameActions.diceResult && (
                    <div className="mb-4 p-4 bg-amber-100 rounded-lg text-center border-2 border-amber-300">
                      <div className="text-2xl font-bold text-amber-800">🎲 {gameActions.diceResult}</div>
                      <div className="text-sm text-amber-700">Puntos de inspiración divina</div>
                      <div className="text-xs text-amber-600 mt-2 font-serif italic">Elige tu destino en el Madrid áureo</div>
                    </div>
                  )}

                  <button
                    onClick={() => setGameActions(prev => ({ ...prev, showCards: !prev.showCards }))}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white font-bold py-3 px-4 rounded-lg mb-3 transition-all transform hover:scale-105"
                  >
                    {gameActions.showCards ? 'Ocultar' : 'Desplegar'} Artes Literarias
                  </button>

                  <button
                    onClick={nextTurn}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-3 px-4 rounded-lg transition-all transform hover:scale-105"
                  >
                    Concluir Turno
                  </button>
                </>
              )}
              
              {currentPlayerData && currentPlayerData.isAI && (
                <div className="text-center">
                  {gameState.aiThinking ? (
                    <div className="p-6">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500 mx-auto mb-3"></div>
                      <div className="text-amber-700 font-serif italic">
                        {currentPlayerData.name} forja versos inmortales...
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-amber-700">
                      <div className="mb-3 text-2xl">🤖</div>
                      <div className="font-serif">
                        Turno de {currentPlayerData.name}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cartas literarias e Historial */}
          <div className="space-y-4">
            {gameActions.showCards && currentHand && (
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-6 border-2 border-amber-300">
                <h3 className="text-xl font-semibold mb-4 text-amber-900">Tus Artes Literarias</h3>
                
                {Object.entries(currentHand).map(([cardType, cards]) => (
                  <div key={cardType} className="mb-6">
                    <h4 className="font-medium mb-3 text-amber-800 flex items-center gap-2">
                      {cardType === 'ingenio' && <Sword size={16} />}
                      {cardType === 'erudicion' && <BookOpen size={16} />}
                      {cardType === 'favor' && <Crown size={16} />}
                      {cardType === 'ingenio' ? 'Ingenio' : cardType === 'erudicion' ? 'Erudición' : 'Favor'} ({cards.length})
                    </h4>
                    {cards.map((card, index) => (
                      <div 
                        key={index}
                        className="border-2 border-amber-200 rounded-lg p-3 mb-2 cursor-pointer hover:bg-amber-50 hover:border-amber-400 transition-all transform hover:scale-105"
                        onClick={() => playCard(card, cardType)}
                      >
                        <div className="font-medium text-sm text-amber-800">{card.name}</div>
                        <div className="text-xs text-amber-600 font-serif italic">{card.effect}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Crónica del duelo */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-xl p-6 border-2 border-amber-300">
              <h3 className="text-xl font-semibold mb-4 text-amber-900">Crónica del Certamen</h3>
              <div className="max-h-64 overflow-y-auto space-y-2">
                {gameState.gameLog.map((message, index) => (
                  <div key={index} className="text-sm p-3 bg-white rounded-lg border border-amber-200 font-serif">
                    {message}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigloOroGame;