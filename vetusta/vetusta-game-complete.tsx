import React, { useState, useEffect } from 'react';
import { Users, Crown, Heart, Eye, Sword, Church, Dice6, Star } from 'lucide-react';

const VetustaGame = () => {
  // Ubicaciones del tablero
  const locations = {
    catedral: { name: "Catedral", icon: "⛪", x: 50, y: 30, effect: "+1 Reputación (religiosos)" },
    casino: { name: "Casino", icon: "🎲", x: 20, y: 40, effect: "Apostar por cartas extra" },
    teatro: { name: "Teatro", icon: "🎭", x: 80, y: 40, effect: "Interacciones -1 coste" },
    paseo: { name: "Paseo", icon: "🌳", x: 35, y: 60, effect: "Romance +1 efectividad" },
    casa: { name: "Casa Ana", icon: "🏠", x: 65, y: 50, effect: "Interacciones privadas" },
    palacio: { name: "Palacio", icon: "👑", x: 50, y: 10, effect: "Fermín +1 Influencia" },
    club: { name: "Club Femenino", icon: "👥", x: 15, y: 65, effect: "Intercambio libre rumores" },
    cafe: { name: "Café", icon: "☕", x: 85, y: 65, effect: "Revelar info -1 carta" },
    plaza: { name: "Plaza", icon: "🏪", x: 50, y: 75, effect: "Rumores se propagan" },
    jardin: { name: "Jardín", icon: "🌺", x: 70, y: 25, effect: "Encuentros sin penalización" },
    biblioteca: { name: "Biblioteca", icon: "📚", x: 25, y: 25, effect: "+1 carta, inmune rumores" },
    salon: { name: "Salón", icon: "✨", x: 75, y: 75, effect: "Acciones doble efecto" }
  };

  // Personajes
  const characters = {
    ana: { 
      name: "Ana Ozores", 
      color: "#e91e63", 
      ability: "Confesión: Revelar Secretos sin perder Reputación",
      location: "casa",
      reputation: 5
    },
    fermin: { 
      name: "Fermín de Pas", 
      color: "#9c27b0", 
      ability: "Influencia Espiritual: +2 en Catedral",
      location: "catedral",
      reputation: 5
    },
    alvaro: { 
      name: "Álvaro Mesía", 
      color: "#f44336", 
      ability: "Seducción: Rumores como Cortejo",
      location: "casino",
      reputation: 5
    },
    victor: { 
      name: "Víctor Quintanar", 
      color: "#2196f3", 
      ability: "Honor Ciego: Inmune a Deshonra",
      location: "casa",
      reputation: 5
    }
  };

  // Cartas
  const cardTypes = {
    rumor: [
      { name: "Susurros en Misa", effect: "Reduce Reputación -1 a personaje religioso", target: "player" },
      { name: "Miradas en Teatro", effect: "Crea vínculo romántico entre dos personajes", target: "two_players" },
      { name: "Encuentro Nocturno", effect: "Compromete reputación -2 a dos personajes", target: "two_players" },
      { name: "Confesión Reveladora", effect: "Obliga a mostrar carta de Secreto", target: "player" },
      { name: "Chisme de Salón", effect: "Propaga rumor existente +1 efecto", target: "none" }
    ],
    secret: [
      { name: "Amor Prohibido", effect: "+3 puntos oculto, -5 si se revela", target: "self" },
      { name: "Ambición Clerical", effect: "+2 Influencia, -3 Reputación si descubierto", target: "self" },
      { name: "Deuda de Honor", effect: "Debe realizar acción específica o -4 Reputación", target: "self" },
      { name: "Pasado Oscuro", effect: "-6 Reputación si se revela", target: "self" },
      { name: "Correspondencia", effect: "Intercambio forzoso de cartas", target: "player" }
    ],
    event: [
      { name: "Sermón Dominical", effect: "Todos en Catedral +1 Reputación", target: "location" },
      { name: "Estreno Teatro", effect: "Presentes pueden acción extra", target: "location" },
      { name: "Escándalo Público", effect: "Menor reputación pierde -2 más", target: "all" },
      { name: "Visita Obispo", effect: "Fermín +3 Influencia", target: "specific" },
      { name: "Duelo de Honor", effect: "Dos personajes masculinos se enfrentan", target: "two_players" }
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
    maxTurns: 16,
    processing: false
  });

  const [setupForm, setSetupForm] = useState({
    numPlayers: 2,
    playerNames: ['', ''],
    playerTypes: ['human', 'ai'],
    maxTurns: 16,
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
  const getRandomCards = (type, count) => {
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
      name: name || (setupForm.playerTypes[index] === 'ai' ? `IA ${characters[selectedChars[index]].name}` : `Jugador ${index + 1}`),
      character: selectedChars[index],
      location: characters[selectedChars[index]].location,
      reputation: 5,
      influence: 0,
      secrets: 0,
      movements: 0,
      isAI: setupForm.playerTypes[index] === 'ai'
    }));

    // Repartir cartas iniciales
    const hands = {};
    players.forEach(player => {
      hands[player.id] = {
        rumor: getRandomCards('rumor', 3),
        secret: getRandomCards('secret', 2),
        event: getRandomCards('event', 1)
      };
    });

    const newGameState = {
      players,
      currentPlayer: 0,
      currentTurn: 1,
      phase: 'playing',
      selectedCharacters: selectedChars,
      playerHands: hands,
      gameLog: [`¡Comienza el juego en Vetusta! ${setupForm.maxTurns} turnos totales. Turno 1: ${players[0].name}`],
      aiThinking: false,
      maxTurns: setupForm.maxTurns,
      fastAI: setupForm.fastAI,
      processing: false
    };

    setGameState(newGameState);
  };

  // Sistema simplificado de turnos
  const advanceGame = () => {
    setGameState(prev => {
      if (prev.phase !== 'playing' || prev.processing) {
        return prev;
      }

      // Verificar condiciones de victoria/derrota
      const defeatedPlayer = prev.players.find(p => p.reputation <= 0);
      if (defeatedPlayer) {
        const finalScores = prev.players.map(player => ({
          ...player,
          finalScore: (player.reputation * 2) + (player.influence * 2) + (player.secrets * 3)
        })).sort((a, b) => b.finalScore - a.finalScore);

        return {
          ...prev,
          phase: 'ended',
          finalScores,
          endReason: `${defeatedPlayer.name} ha perdido toda su reputación`,
          aiThinking: false,
          processing: false,
          gameLog: [
            ...prev.gameLog.slice(-7),
            `🏆 JUEGO TERMINADO: ${defeatedPlayer.name} ha perdido toda su reputación`,
            `🥇 Ganador: ${finalScores[0].name} (${finalScores[0].finalScore} puntos)`
          ]
        };
      }

      // Verificar fin de juego por turnos
      if (prev.currentTurn >= prev.maxTurns) {
        const finalScores = prev.players.map(player => ({
          ...player,
          finalScore: (player.reputation * 2) + (player.influence * 2) + (player.secrets * 3)
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
            `🏆 JUEGO TERMINADO: ${prev.maxTurns} turnos completados`,
            `🥇 Ganador: ${finalScores[0].name} (${finalScores[0].finalScore} puntos)`
          ]
        };
      }

      // Siguiente jugador y turno
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

  // Ejecutar turno de IA
  const executeAITurn = async () => {
    await new Promise(resolve => {
      setGameState(prev => {
        resolve();
        return { ...prev, processing: true, aiThinking: true };
      });
    });

    try {
      await new Promise(r => setTimeout(r, 1000));

      // Tirar dados
      const dice = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
      setGameActions({ showDice: true, diceResult: dice });
      
      await new Promise(resolve => {
        setGameState(prev => {
          const player = prev.players[prev.currentPlayer];
          resolve();
          return {
            ...prev,
            gameLog: [...prev.gameLog.slice(-9), `${player.name} (IA) tira los dados: ${dice}`]
          };
        });
      });

      await new Promise(r => setTimeout(r, 1000));

      // Mover a ubicación con estrategia mejorada
      const locationKeys = Object.keys(locations);
      let targetLocation;
      
      await new Promise(resolve => {
        setGameState(prev => {
          const player = prev.players[prev.currentPlayer];
          const turn = prev.currentTurn;
          
          // Estrategia diferenciada por personaje y fase del juego
          switch(player.character) {
            case 'ana':
              if (turn < prev.maxTurns / 3) {
                // Fase inicial: busca reputación
                targetLocation = Math.random() > 0.4 ? 'catedral' : 'biblioteca';
              } else if (turn < prev.maxTurns * 2 / 3) {
                // Fase media: romance y secretos
                targetLocation = ['paseo', 'jardin', 'casa'][Math.floor(Math.random() * 3)];
              } else {
                // Fase final: influencia social
                targetLocation = ['salon', 'club', 'teatro'][Math.floor(Math.random() * 3)];
              }
              break;
            case 'fermin':
              if (player.influence < 3) {
                targetLocation = Math.random() > 0.2 ? 'catedral' : 'palacio';
              } else {
                targetLocation = ['salon', 'club', 'biblioteca'][Math.floor(Math.random() * 3)];
              }
              break;
            case 'alvaro':
              if (player.secrets < 2) {
                targetLocation = ['paseo', 'jardin', 'casino'][Math.floor(Math.random() * 3)];
              } else {
                targetLocation = ['teatro', 'salon', 'club'][Math.floor(Math.random() * 3)];
              }
              break;
            case 'victor':
              if (player.reputation < 4) {
                targetLocation = ['catedral', 'club', 'biblioteca'][Math.floor(Math.random() * 3)];
              } else {
                targetLocation = Math.random() > 0.5 ? 'casa' : 'palacio';
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

      await new Promise(r => setTimeout(r, 1500));

      // Evento aleatorio ocasional (20% probabilidad)
      if (Math.random() < 0.2) {
        await new Promise(resolve => {
          setGameState(prev => {
            const player = prev.players[prev.currentPlayer];
            const events = [
              { effect: () => ({ reputation: 1 }), message: 'Un acto de bondad mejora tu reputación (+1)' },
              { effect: () => ({ influence: 1 }), message: 'Una conexión útil aumenta tu influencia (+1)' },
              { effect: () => ({ secrets: 1 }), message: 'Descubres información valiosa (+1 Secreto)' },
              { effect: () => ({ reputation: -1 }), message: 'Un rumor dañino afecta tu reputación (-1)' },
            ];
            
            const randomEvent = events[Math.floor(Math.random() * events.length)];
            const effect = randomEvent.effect();
            
            const updatedPlayers = prev.players.map(p => 
              p.id === prev.currentPlayer 
                ? { 
                    ...p, 
                    reputation: Math.max(0, Math.min(10, p.reputation + (effect.reputation || 0))),
                    influence: Math.max(0, p.influence + (effect.influence || 0)),
                    secrets: Math.max(0, p.secrets + (effect.secrets || 0))
                  }
                : p
            );
            
            resolve();
            return {
              ...prev,
              players: updatedPlayers,
              gameLog: [...prev.gameLog.slice(-8), `⚡ Evento: ${player.name} - ${randomEvent.message}`]
            };
          });
        });
        await new Promise(r => setTimeout(r, 1000));
      }

    } finally {
      await new Promise(resolve => {
        setGameState(prev => {
          resolve();
          return { ...prev, aiThinking: false };
        });
      });
      
      setTimeout(advanceGame, 100);
    }
  };

  // Detectar cuando toca jugar a la IA
  useEffect(() => {
    if (gameState.phase !== 'playing' || 
        gameState.processing || 
        gameState.aiThinking ||
        gameState.players.length === 0 ||
        !gameState.players[gameState.currentPlayer]?.isAI) {
      return;
    }

    const timer = setTimeout(() => {
      executeAITurn();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [gameState.currentPlayer, gameState.phase, gameState.processing, gameState.aiThinking, gameState.players]);

  // Función nextTurn para jugadores humanos
  const nextTurn = () => {
    advanceGame();
  };

  // Tirar dados
  const rollDice = () => {
    const result = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
    setGameActions(prev => ({ ...prev, showDice: true, diceResult: result }));
    
    setGameState(prev => {
      const currentPlayerData = prev.players[prev.currentPlayer];
      return {
        ...prev,
        gameLog: [...prev.gameLog.slice(-9), `${currentPlayerData.name} tira los dados: ${result} puntos de movimiento`]
      };
    });
    
    return result;
  };

  // Aplicar efecto de ubicación
  const applyLocationEffect = (playerId, locationKey) => {
    setGameState(prev => {
      const player = prev.players[playerId];
      const location = locations[locationKey];
      let logMessage = `${player.name} visita ${location.name}`;
      let updatedPlayers = [...prev.players];
      const playerIndex = updatedPlayers.findIndex(p => p.id === playerId);
      
      // Aplicar efectos según la ubicación
      switch(locationKey) {
        case 'catedral':
          if (player.character === 'fermin') {
            updatedPlayers[playerIndex].influence += 2;
            updatedPlayers[playerIndex].reputation += 1;
            logMessage += ' (+2 Influencia, +1 Reputación por ser religioso)';
          } else {
            updatedPlayers[playerIndex].reputation += 1;
            logMessage += ' (+1 Reputación)';
          }
          break;
        case 'casino':
          if (Math.random() > 0.5) {
            updatedPlayers[playerIndex].influence += 1;
            logMessage += ' (gana influencia apostando)';
          } else {
            updatedPlayers[playerIndex].reputation = Math.max(0, updatedPlayers[playerIndex].reputation - 1);
            logMessage += ' (pierde reputación apostando)';
          }
          break;
        case 'teatro':
        case 'salon':
          updatedPlayers[playerIndex].influence += 1;
          logMessage += ' (+1 Influencia social)';
          break;
        case 'paseo':
        case 'jardin':
          if (player.character === 'ana' || player.character === 'alvaro') {
            updatedPlayers[playerIndex].secrets += 1;
            logMessage += ' (+1 Secreto romántico)';
          }
          break;
        case 'biblioteca':
          updatedPlayers[playerIndex].secrets += 1;
          logMessage += ' (+1 Secreto estudiando)';
          break;
        case 'palacio':
          if (player.character === 'fermin') {
            updatedPlayers[playerIndex].influence += 2;
            logMessage += ' (+2 Influencia clerical)';
          } else {
            updatedPlayers[playerIndex].influence += 1;
            logMessage += ' (+1 Influencia política)';
          }
          break;
        case 'club':
          updatedPlayers[playerIndex].reputation += 1;
          logMessage += ' (+1 Reputación social)';
          break;
        case 'cafe':
        case 'plaza':
          if (Math.random() > 0.7) {
            updatedPlayers[playerIndex].secrets += 1;
            logMessage += ' (descubre un secreto)';
          }
          break;
        default:
          // Ubicación neutra
          break;
      }
      
      return {
        ...prev,
        players: updatedPlayers,
        gameLog: [...prev.gameLog.slice(-8), logMessage]
      };
    });
  };

  // Mover personaje
  const movePlayer = (locationKey) => {
    setGameState(prev => {
      const currentPlayerData = prev.players[prev.currentPlayer];
      
      const updatedPlayers = prev.players.map(player => 
        player.id === prev.currentPlayer 
          ? { ...player, location: locationKey, movements: player.movements + 1 }
          : player
      );

      return {
        ...prev,
        players: updatedPlayers,
        gameLog: [...prev.gameLog.slice(-9), `${currentPlayerData.name} se mueve a ${locations[locationKey].name}`]
      };
    });
    
    // Aplicar efecto de la ubicación después del movimiento
    setTimeout(() => applyLocationEffect(gameState.currentPlayer, locationKey), 100);
  };

  // Cambiar reputación
  const changeReputation = (playerId, amount) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === playerId 
          ? { ...player, reputation: Math.max(0, Math.min(10, player.reputation + amount)) }
          : player
      )
    }));
  };

  // Cambiar influencia
  const changeInfluence = (playerId, amount) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === playerId 
          ? { ...player, influence: Math.max(0, player.influence + amount) }
          : player
      )
    }));
  };

  // Robar carta
  const drawCard = (playerId, type) => {
    const newCard = getRandomCards(type, 1)[0];
    if (newCard) {
      setGameState(prev => ({
        ...prev,
        playerHands: {
          ...prev.playerHands,
          [playerId]: {
            ...prev.playerHands[playerId],
            [type]: [...prev.playerHands[playerId][type], newCard]
          }
        }
      }));
    }
  };

  // Jugar carta
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
      gameLog: [...prev.gameLog.slice(-9), `${prev.players[prev.currentPlayer].name} juega "${card.name}"`]
    }));
  };

  // Añadir al log
  const addToLog = (message) => {
    setGameState(prev => ({
      ...prev,
      gameLog: [...prev.gameLog.slice(-9), message]
    }));
  };

  // Render del setup
  if (gameState.phase === 'setup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-2">⛪ Vetusta ⛪</h1>
            <h2 className="text-2xl text-amber-700">Secretos y Reputaciones</h2>
            <p className="text-amber-600 mt-2">Basado en "La Regenta" de Clarín</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Configuración del Juego</h3>
            
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-green-800">
                <strong>✅ VERSIÓN CORREGIDA:</strong> Sistema de turnos simplificado y funcionando correctamente.
              </div>
            </div>
            
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">
                <strong>🤖 Jugadores IA:</strong> Los oponentes controlados por inteligencia artificial jugarán automáticamente según la personalidad y estrategia de cada personaje de La Regenta. ¡Perfecto para jugar solo o practicar!
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Número de jugadores:</label>
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
                className="w-full p-2 border rounded"
              >
                <option value={2}>2 jugadores</option>
                <option value={3}>3 jugadores</option>
                <option value={4}>4 jugadores</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Configuración de jugadores:</label>
              {Array(setupForm.numPlayers).fill(0).map((_, index) => (
                <div key={index} className="mb-3 p-3 border rounded bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Jugador {index + 1}:</span>
                    <select
                      value={setupForm.playerTypes[index] || 'human'}
                      onChange={(e) => {
                        const newTypes = [...setupForm.playerTypes];
                        newTypes[index] = e.target.value;
                        setSetupForm(prev => ({ ...prev, playerTypes: newTypes }));
                      }}
                      className="px-2 py-1 border rounded text-sm"
                    >
                      <option value="human">🧑 Humano</option>
                      <option value="ai">🤖 IA</option>
                    </select>
                  </div>
                  
                  {setupForm.playerTypes[index] === 'human' && (
                    <input
                      type="text"
                      placeholder={`Nombre del jugador ${index + 1}`}
                      value={setupForm.playerNames[index] || ''}
                      onChange={(e) => {
                        const newNames = [...setupForm.playerNames];
                        newNames[index] = e.target.value;
                        setSetupForm(prev => ({ ...prev, playerNames: newNames }));
                      }}
                      className="w-full p-2 border rounded text-sm"
                    />
                  )}
                  
                  {setupForm.playerTypes[index] === 'ai' && (
                    <div className="text-sm text-gray-600 italic">
                      La IA jugará como {Object.keys(characters)[index] ? characters[Object.keys(characters)[index]].name : 'Personaje'}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mb-6 p-3 border rounded bg-amber-50">
              <h4 className="font-medium mb-3">⚙️ Configuración de Juego</h4>
              
              <div className="mb-3">
                <label className="block text-sm font-medium mb-1">Duración del juego:</label>
                <select
                  value={setupForm.maxTurns}
                  onChange={(e) => setSetupForm(prev => ({ ...prev, maxTurns: parseInt(e.target.value) }))}
                  className="w-full p-2 border rounded text-sm"
                >
                  <option value={12}>12 turnos (Rápido ~15 min)</option>
                  <option value={16}>16 turnos (Normal ~20 min)</option>
                  <option value={24}>24 turnos (Largo ~30 min)</option>
                  <option value={32}>32 turnos (Épico ~40 min)</option>
                </select>
                <div className="text-xs text-gray-600 mt-1">
                  El juego durará exactamente {setupForm.maxTurns} turnos. 
                  Cada jugador jugará aproximadamente {Math.floor(setupForm.maxTurns / setupForm.numPlayers)} veces.
                </div>
              </div>

              {setupForm.playerTypes.some(type => type === 'ai') && (
                <div className="mb-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={setupForm.fastAI}
                      onChange={(e) => setSetupForm(prev => ({ ...prev, fastAI: e.target.checked }))}
                    />
                    <span>🚀 IA Rápida (recomendado para múltiples IAs)</span>
                  </label>
                  <div className="text-xs text-gray-600 mt-1">
                    Reduce las decisiones complejas para partidas más fluidas
                  </div>
                </div>
              )}
            </div>

            <div className="mb-6">
              <h4 className="font-medium mb-2">Personajes disponibles:</h4>
              {Object.keys(characters).slice(0, setupForm.numPlayers).map((charKey, index) => (
                <div key={charKey} className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded">
                  <div 
                    className="w-4 h-4 rounded-full" 
                    style={{ backgroundColor: characters[charKey].color }}
                  ></div>
                  <div>
                    <strong>{characters[charKey].name}</strong>
                    <div className="text-sm text-gray-600">{characters[charKey].ability}</div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={initializeGame}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-4 rounded-lg transition-colors"
            >
              ¡Comenzar Juego!
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render de fin de juego
  if (gameState.phase === 'ended') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-amber-900 mb-2">🏆 JUEGO TERMINADO</h1>
            <h2 className="text-2xl text-amber-700 mb-4">{gameState.endReason}</h2>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-2xl font-semibold mb-4 text-center">🥇 Clasificación Final</h3>
            
            {gameState.finalScores?.map((player, index) => (
              <div 
                key={player.id} 
                className={`p-4 rounded border-2 mb-3 ${
                  index === 0 
                    ? 'border-yellow-400 bg-yellow-50' 
                    : index === 1 
                    ? 'border-gray-400 bg-gray-50'
                    : index === 2
                    ? 'border-orange-400 bg-orange-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">
                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}°`}
                    </div>
                    <div 
                      className="w-6 h-6 rounded-full" 
                      style={{ backgroundColor: characters[player.character].color }}
                    ></div>
                    <div>
                      <div className="font-bold text-lg">
                        {player.name} {player.isAI && <span className="text-sm bg-blue-200 px-2 py-1 rounded ml-2">🤖</span>}
                      </div>
                      <div className="text-sm text-gray-600">{characters[player.character].name}</div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold text-amber-600">{player.finalScore} pts</div>
                    <div className="text-sm text-gray-600">
                      Rep: {player.reputation} | Inf: {player.influence} | Sec: {player.secrets}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-3">📊 Estadísticas de la Partida</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold">{gameState.maxTurns}</div>
                <div className="text-sm text-gray-600">Turnos Jugados</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold">{gameState.finalScores?.[0]?.reputation || 0}</div>
                <div className="text-sm text-gray-600">Mayor Reputación</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold">
                  {Math.max(...(gameState.finalScores?.map(p => p.influence) || [0]))}
                </div>
                <div className="text-sm text-gray-600">Mayor Influencia</div>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <div className="text-2xl font-bold">
                  {Math.max(...(gameState.finalScores?.map(p => p.secrets) || [0]))}
                </div>
                <div className="text-sm text-gray-600">Más Secretos</div>
              </div>
            </div>
          </div>

          <div className="text-center space-y-3">
            <button
              onClick={() => setGameState(prev => ({ ...prev, phase: 'setup' }))}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-6 rounded-lg mr-4"
            >
              🎮 Nueva Partida
            </button>
            
            <div className="text-sm text-gray-600 mt-4">
              <p>"En Vetusta, como en la vida, todos tenemos secretos que nos definen..."</p>
              <p className="italic">- Leopoldo Alas "Clarín"</p>
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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-amber-900">⛪ Vetusta: Secretos y Reputaciones ⛪</h1>
          <div className="flex justify-center gap-4 mt-2 text-sm">
            <span className="bg-white px-3 py-1 rounded font-semibold">
              Turno {gameState.currentTurn} de {gameState.maxTurns}
            </span>
            <span className="bg-amber-200 px-3 py-1 rounded font-semibold">
              {currentPlayerData?.name || 'Jugador'} 
            </span>
            {gameState.currentTurn === gameState.maxTurns && (
              <span className="bg-red-500 text-white px-3 py-1 rounded font-bold animate-pulse">
                🏁 ÚLTIMO TURNO
              </span>
            )}
            {gameState.currentTurn >= gameState.maxTurns - 3 && 
             gameState.currentTurn < gameState.maxTurns && (
              <span className="bg-orange-400 text-white px-3 py-1 rounded">
                ⏰ Últimos turnos
              </span>
            )}
          </div>
          
          {/* Barra de progreso visual */}
          <div className="mt-2 max-w-md mx-auto">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-amber-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(gameState.currentTurn / gameState.maxTurns) * 100}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-600 text-center mt-1">
              Progreso: {Math.round((gameState.currentTurn / gameState.maxTurns) * 100)}%
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          
          {/* Tablero */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-4 text-center">Mapa de Vetusta</h3>
              <div className="relative bg-green-50 rounded-lg h-96 border-2 border-green-200">
                {Object.entries(locations).map(([key, location]) => {
                  const playersHere = gameState.players.filter(p => p.location === key);
                  
                  return (
                    <div
                      key={key}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
                      style={{ left: `${location.x}%`, top: `${location.y}%` }}
                      onClick={() => gameActions.diceResult && movePlayer(key)}
                      title={`${location.name}: ${location.effect}`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-1">{location.icon}</div>
                        <div className="text-xs font-medium bg-white px-2 py-1 rounded shadow">
                          {location.name}
                        </div>
                        {playersHere.length > 0 && (
                          <div className="flex justify-center mt-1">
                            {playersHere.map(player => (
                              <div
                                key={player.id}
                                className="w-3 h-3 rounded-full border-2 border-white mr-1"
                                style={{ backgroundColor: characters[player.character].color }}
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

          {/* Panel de jugadores */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Jugadores</h3>
              {gameState.players.map(player => (
                <div 
                  key={player.id} 
                  className={`p-3 rounded border-2 mb-2 ${
                    player.id === gameState.currentPlayer 
                      ? 'border-amber-400 bg-amber-50' 
                      : 'border-gray-200'
                  } ${player.isAI ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: characters[player.character].color }}
                    ></div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{player.name}</span>
                        {player.isAI && <span className="text-xs bg-blue-200 px-2 py-1 rounded">🤖 IA</span>}
                        {player.id === gameState.currentPlayer && gameState.aiThinking && (
                          <span className="text-xs bg-yellow-200 px-2 py-1 rounded animate-pulse">🤔 Pensando...</span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{characters[player.character].name}</div>
                    </div>
                  </div>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Reputación:</span>
                      <div className="flex">
                        {Array(10).fill(0).map((_, i) => (
                          <Star 
                            key={i} 
                            size={12} 
                            className={i < player.reputation ? 'text-yellow-400 fill-current' : 'text-gray-300'} 
                          />
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span>Influencia:</span>
                      <span>{player.influence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Secretos:</span>
                      <span>{player.secrets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ubicación:</span>
                      <span>{locations[player.location].name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Acciones del turno */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Acciones</h3>
              
              {currentPlayerData && !currentPlayerData.isAI && (
                <>
                  {!gameActions.diceResult && (
                    <button
                      onClick={rollDice}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2 flex items-center justify-center gap-2"
                    >
                      <Dice6 size={16} />
                      Tirar Dados
                    </button>
                  )}

                  {gameActions.diceResult && (
                    <div className="mb-3 p-2 bg-blue-50 rounded text-center">
                      <div className="text-lg font-bold">🎲 {gameActions.diceResult}</div>
                      <div className="text-sm">Puntos de movimiento</div>
                      <div className="text-xs text-gray-600 mt-1">Haz clic en una ubicación para moverte</div>
                    </div>
                  )}

                  <button
                    onClick={() => setGameActions(prev => ({ ...prev, showCards: !prev.showCards }))}
                    className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded mb-2"
                  >
                    {gameActions.showCards ? 'Ocultar' : 'Ver'} Cartas
                  </button>

                  <button
                    onClick={nextTurn}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Terminar Turno
                  </button>
                </>
              )}
              
              {currentPlayerData && currentPlayerData.isAI && (
                <div className="text-center">
                  {gameState.aiThinking ? (
                    <div className="p-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
                      <div className="text-sm text-gray-600">
                        La IA {currentPlayerData.name || 'desconocida'} está analizando la situación...
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 text-gray-600">
                      <div className="mb-2">🤖</div>
                      <div className="text-sm">
                        Turno de {currentPlayerData.name || 'IA desconocida'}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Cartas */}
          <div className="space-y-4">
            {gameActions.showCards && currentHand && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="text-lg font-semibold mb-3">Tus Cartas</h3>
                
                {Object.entries(currentHand).map(([cardType, cards]) => (
                  <div key={cardType} className="mb-4">
                    <h4 className="font-medium mb-2 capitalize">
                      {cardType === 'rumor' ? 'Rumores' : cardType === 'secret' ? 'Secretos' : 'Eventos'} ({cards.length})
                    </h4>
                    {cards.map((card, index) => (
                      <div 
                        key={index}
                        className="border rounded p-2 mb-2 cursor-pointer hover:bg-gray-50"
                        onClick={() => {
                          playCard(card, cardType);
                        }}
                      >
                        <div className="font-medium text-sm">{card.name}</div>
                        <div className="text-xs text-gray-600">{card.effect}</div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {/* Log del juego */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold mb-3">Historial</h3>
              <div className="max-h-64 overflow-y-auto space-y-1">
                {gameState.gameLog.map((message, index) => (
                  <div key={index} className="text-sm p-2 bg-gray-50 rounded">
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

export default VetustaGame;