// url api
const jsonFile = "json/league.json";

// Variáveis
var deckFull = [];
var deckMaquina = [];
var deckJogador = [];
var deckMaquinaHand = [];
var deckJogadorHand = [];
var maquinaScore = {
  vitorias: 0,
  empates: 0,
  derrotas: 0,
  pontos: 0,
};
var jogadorScore = {
  vitorias: 0,
  empates: 0,
  derrotas: 0,
  pontos: 0,
};

var countClickDeckJogador = 0;
var countClickStartGame = 0;
var countClickCardHand = 0;

// Gameplay
var cardJogador;
var cardMaquinaSelected;
var cardJogadorSelected;
var tutorialOn = true;

// Referência de tag
var containerTag = document.querySelector(".container");
var initialScreenTag = document.querySelector(".initialScreen");
var game = document.querySelector(".game");

var maquinaTag = document.querySelector(".maquina .hand");
var jogadorTag = document.querySelector(".jogador .hand");

var maquinaDeckTag = document.querySelector(".maquina .cheap");
var jogadorDeckTag = document.querySelector(".jogador .cheap");

// Tag das pontuações
var pontuacaoMaquinaTag = document.querySelector(".maquina .pontuacao");
var pontuacaoJogadorTag = document.querySelector(".jogador .pontuacao");

// Tag das Jogadas
var dropMaquinaTarget = document.querySelector(".maquinaMove");
var dropJogadorTarget = document.querySelector(".jogadorMove");

// DisclaimerTag
var disclaimerTag = document.querySelector(".disclaimer");

// Backgrounds
var backgrounds = [
  {
    image: "img/backgrounds/gameBackground/game_background1.jpg",
  },
  {
    image: "img/backgrounds/gameBackground/game_background2.jpg",
  },
  {
    image: "img/backgrounds/gameBackground/game_background3.jpg",
  },
];
// Emotes
var emoteTutorial = [
  {
    image: "img/emotesImg/tutorial/Hype_Pengu_Blue_Emote.png",
  },
  {
    image: "img/emotesImg/tutorial/Hype_Pengu_Red_Emote.png",
  },
  {
    image: "img/emotesImg/tutorial/Hype_Pengu_Orange_Emote.png",
  },
  {
    image: "img/emotesImg/tutorial/Hype_Pengu_Purple_Emote.png",
  },
];
var emoteVitoria = [
  {
    image: "img/emotesImg/vitoria/Nice_Try_Emote.png",
  },
  {
    image: "img/emotesImg/vitoria/Much_Love_Emote.png",
  },
  {
    image: "img/emotesImg/vitoria/Clean_Emote.png",
  },
  {
    image: "img/emotesImg/vitoria/Maybe_Next_Time_Emote.png",
  },
];
var emoteEmpate = [
  {
    image: "img/emotesImg/empate/Oh_Snap_Poro_Emote.png",
  },
];
var emoteDerrota = [
  {
    image: "img/emotesImg/derrota/Despair_Emote.png",
  },
  {
    image: "img/emotesImg/derrota/Angry_Kitten_Emote.png",
  },
  {
    image: "img/emotesImg/derrota/Goodbye_Friend_Emote.png",
  },
  {
    image: "img/emotesImg/derrota/So_Lame_Emote.png",
  },
];

// Pegando as cartas da api
onload = () => {
  audioPlay("mainAudio", "audio/ornnTheme.mp3", 0.5);
  fetch(jsonFile)
    .then((response) => response.json())
    .then((json) => {
      deckFull = json;
    });
};

// Definindo imagem de acordo com a role do campeão
function setRoleImage(role) {
  if (role == "Fighter") {
    return "img/roleImg/Fighter.png";
  } else if (role == "Mage") {
    return "img/roleImg/Mage.png";
  } else if (role == "Assassin") {
    return "img/roleImg/Assassin.png";
  } else if (role == "Tank") {
    return "img/roleImg/Tank.png";
  } else if (role == "Marksman") {
    return "img/roleImg/Marksman.png";
  } else if (role == "Support") {
    return "img/roleImg/Support.png";
  } else {
    return "";
  }
}

// Verifica se o atributo é igual a zero e define um valor aleatório
function RandomAttr() {
  let attr = Math.floor(Math.random() * (10 - 1)) + 1;
  return attr * 10;
}

// Sorteio da cartas
function RaffleCards() {
  let keysDeckFull = Object.keys(deckFull);
  let keyCard =
    keysDeckFull[Math.floor(Math.random() * (keysDeckFull.length - 1)) + 1];

  let card = deckFull[keyCard];

  // Criando builder das informações da carta
  let builderCard = {
    id: card.id + Math.floor(Math.random() * (keysDeckFull.length - 1)) + 1,
    image: `https://ddragon.leagueoflegends.com/cdn/img/champion/loading/${card.id}_0.jpg`,
    name: card.name,
    title: card.title,
    role: {
      primary: card.tags[0],
      image: setRoleImage(card.tags[0]),
    },
    status: {
      attack: RandomAttr(),
      defense: RandomAttr(),
      movespeed: card.stats.movespeed,
      magic: RandomAttr(),
    },
  };
  return builderCard;
}

// Carregando deck dos jogadores
function PushDeckPlayer(deckPlayer, deckPlayHand) {
  for (let i = 0; i < 5; i++) {
    deckPlayer.push(RaffleCards());
    deckPlayHand.push(RaffleCards());
  }
}

// Criando as cartas na mão do jogador
function BuilderCard(targetTag, deck, deckHand) {
  // Limpando o render no html
  targetTag.innerHTML = "";

  if (deckHand.length < 5 && deck.length > 0) {
    deckHand.push(deck.pop());
  }

  // Renderizando as cartas
  for (let i = 0; i < deckHand.length; i++) {
    let builder = deckHand[i];
    let newCard = `
    <div id="${builder.id}" class="carta" onmouseover="MoveCard(id)">
      <div class="front"></div>
      <div class="back">
        <img src="${builder.image}" alt="">
        <div class="champion">
        <span>${builder.name}</span>
        <span>${builder.title}</span>
        </div>
        <div class="status">
          <div></div>
          <div class="role">
            <span>
              <img src="${builder.role.image}" alt="Role"><span>${builder.role.primary}</span>
            </span>
          </div>
          <div class="attributes">
            <div id="attack" onclick="SelectAttribute(id)">
              <span>
                <img src="img/attributesImg/attack.png" alt="Attack"><small>+</small>${builder.status.attack}
              </span>
            </div>
            <div id="defense" onclick="SelectAttribute(id)">
              <span>
                <img src="img/attributesImg/defense.png" alt="Defense"><small>+</small>${builder.status.defense}
              </span>
            </div>
            <div id="magic" onclick="SelectAttribute(id)">
              <span>
                <img src="img/attributesImg/magic.png" alt="Magic"><small>+</small>${builder.status.magic}
              </span>
            </div>
            <div id="movespeed" onclick="SelectAttribute(id)">
              <span>
                <img src="img/attributesImg/movespeed.png" alt="Movespeed"><small>+</small>${builder.status.movespeed}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

    targetTag.innerHTML += newCard;
  }
}

// Carregar deck da mesa
function StartDeck(targetTag) {
  targetTag.innerHTML = `
  <div class="carta"></div>
  <div class="carta"></div>
  <div class="carta" onclick="GetCard()">
  </div>
  `;
}
// Iniciando o jogo
function Jogar() {
  if (tutorialOn) {
    Tutorial(
      game,
      "tutorial",
      emoteTutorial,
      "Olá, jogador! Você recebeu 10 cartas. Click no deck para colocar cartas na mão e começar o duelo"
    );
  }
  countClickStartGame += 1;
  if (countClickStartGame == 1) {
    audioPlay("mainAudio", "audio/lilliaTheme.mp3", 0.2);
    BackgroundRandom(containerTag, backgrounds);

    initialScreenTag.style.animation = "initialScreen 0.6s linear forwards";
    setTimeout(() => {
      initialScreenTag.style.display = "none";
    }, 1000);
    // Sorteando as cartas no deck do jogador e máquina
    PushDeckPlayer(deckMaquina, deckMaquinaHand);
    PushDeckPlayer(deckJogador, deckJogadorHand);

    // Criando as cartas da mesa
    StartDeck(maquinaDeckTag);
    StartDeck(jogadorDeckTag);

    // Carregar HTML inicial da pontuação
    CarregarPontuacao(pontuacaoMaquinaTag, maquinaScore);
    CarregarPontuacao(pontuacaoJogadorTag, jogadorScore);
  }
}

// Craindo as cartas na mão dos jogadores
function GetCard() {
  BuilderCard(maquinaTag, deckMaquina, deckMaquinaHand);
  BuilderCard(jogadorTag, deckJogador, deckJogadorHand);
  countClickDeckJogador += 1;
  if (countClickDeckJogador == 1) {
    if (tutorialOn) {
      Tutorial(
        game,
        "tutorial",
        emoteTutorial,
        "Agora você tem cartas na mão, escolha uma"
      );
    }
    audioPlay("cardAudio", "audio/flipDeck.mp3", 0.5);
    jogadorDeckTag.lastElementChild.style.animationName = "none";
    jogadorDeckTag.lastElementChild.insertAdjacentHTML(
      "beforeend",
      `<div class="countDeckCard">${deckJogador.length}</div>`
    );
    let i = 1;
    for (const child of jogadorTag.children) {
      i += 1;
      child.style.animation = `moveCardToHand 0.${i}s linear`;
    }
  } else if ((countClickDeckJogador > 1) & (deckJogador.length >= 0)) {
    audioPlay("cardAudio", "audio/flipCard.mp3", 0.1);
    jogadorDeckTag.lastElementChild.innerHTML = "";
    jogadorDeckTag.lastElementChild.insertAdjacentHTML(
      "beforeend",
      `<div class="countDeckCard">${deckJogador.length}</div>`
    );
    jogadorTag.lastElementChild.style.animation = "moveCardToHand 0.6s linear";

    if (deckJogador.length == 0) {
      maquinaDeckTag.style.animation = "opacityOut 2s linear";
      jogadorDeckTag.style.animation = "opacityOut 2s linear";
      setTimeout(() => {
        maquinaDeckTag.style.display = "none";
        jogadorDeckTag.style.display = "none";
      }, 2000);
    }
  }
}

// Remove attibute
function RemoveAttr(tag, attr) {
  tag.removeAttribute(attr);
}

// ================================= Movimentar Carta =================================
function MoveCard(elmnt) {
  let cardTarget = document.getElementById(elmnt);
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  cardTarget.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
    cardJogador = cardTarget;
    if (tutorialOn && countClickCardHand == 0) {
      countClickCardHand += 1;
      Tutorial(
        game,
        "tutorial",
        emoteTutorial,
        "Você pode ver os atributos de cada carta clicando sobre ela. Agora arraste uma para a zona de jogo"
      );
    }
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;

    dropJogadorTarget.style.animation = "startEffect 2s infinite";
    dropJogadorTarget.style.backgroundColor = "#ffffff60";

    // set the element's new position:
    cardTarget.style.top = cardTarget.offsetTop - pos2 + "px";
    cardTarget.style.left = cardTarget.offsetLeft - pos1 + "px";
    dropJogadorTarget.setAttribute("onmouseover", "InDropZone(event)");
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    game.firstElementChild.removeAttribute("class");
    setTimeout(() => {
      dropJogadorTarget.removeAttribute("onmouseover");
    }, 30);

    document.onmouseup = null;
    document.onmousemove = null;

    RemoveAttr(cardTarget, "style");
    RemoveAttr(dropJogadorTarget, "style");
  }
}

// Coloca a carta selecionada para jogo
function DropZoneCardMove(dropZone, cardTarget) {
  dropZone.insertAdjacentElement("beforeend", cardTarget);
  if (dropZone.children.length > 2) {
    dropZone.removeChild(dropZone.lastElementChild);
  }
}

// Se a carta está na zona de drop ele habilita o drop
function InDropZone(ev) {
  if (ev.eventPhase == 2) {
    if (tutorialOn) {
      Tutorial(
        game,
        "tutorial",
        emoteTutorial,
        "Muito bom! Escolha um atributo para o duelo"
      );
    }
    // Adicionando a carta do jogador na rodada
    DropZoneCardMove(dropJogadorTarget, cardJogador);

    deckJogadorHand.forEach((item, index) => {
      if (item.id == cardJogador.id) {
        // Adicionando a carta da rodada para comparar os status depois
        cardJogadorSelected = deckJogadorHand[index];
        // Removendo a carta da rodada da mão
        deckJogadorHand.splice(index, 1);
      }
    });

    // Adicionando a carta da máquina na rodada
    let indexCardMaquina = SortCartMaquina(deckMaquinaHand);
    let cardMaquina = document.getElementById(
      deckMaquinaHand[indexCardMaquina].id
    );
    DropZoneCardMove(dropMaquinaTarget, cardMaquina);
    dropMaquinaTarget.querySelector(".status").style.display = "none";
    // Adicionando a carta da rodada para comparar os status depois
    cardMaquinaSelected = deckMaquinaHand[indexCardMaquina];
    // Removendo a carta da rodada da mão
    deckMaquinaHand.splice(indexCardMaquina, 1);
  }
}

// ================================= Gameplay =================================
function GameplayStart(attrChosen) {
  game.firstElementChild.setAttribute("class", "disabled");
  dropMaquinaTarget.style.animation = "rotate .6s linear";
  dropJogadorTarget.style.animation = "rotate .6s linear";

  dropMaquinaTarget.lastElementChild.querySelector(".front").style.zIndex =
    "-1";
  dropMaquinaTarget.querySelector(".status").style.display = "flex";
  dropJogadorTarget.lastElementChild.querySelector(".front").style.zIndex =
    "-1";

  setTimeout(() => {
    dropMaquinaTarget.style.animation = "combatCardMaquina .2s linear";
    dropJogadorTarget.style.animation = "combatCardJogador .2s linear";
    audioPlay("cardAudio", "audio/cardImpact.mp3", 0.1);
    setTimeout(() => {
      dropMaquinaTarget.querySelector(".status").style.animation =
        "statusMoveRight 0.6s linear forwards";
      dropJogadorTarget.querySelector(".status").style.animation =
        "statusMoveLeft 0.6s linear forwards";
    }, 500);

    setTimeout(() => {
      if (
        cardJogadorSelected.status[attrChosen] >
        cardMaquinaSelected.status[attrChosen]
      ) {
        Emote(dropJogadorTarget, "emoteJogador", emoteVitoria);
        Emote(dropMaquinaTarget, "emoteMaquina", emoteDerrota);
        dropMaquinaTarget.style.animation = "opacityOut 2.5s linear";
        AdicionarVitoria(jogadorScore);
        AdicionarDerrota(maquinaScore);
      } else if (
        cardJogadorSelected.status[attrChosen] ==
        cardMaquinaSelected.status[attrChosen]
      ) {
        Emote(dropJogadorTarget, "emoteJogador", emoteEmpate);
        Emote(dropMaquinaTarget, "emoteMaquina", emoteEmpate);
        dropMaquinaTarget.style.animation = "opacityOut 2.5s linear";
        dropJogadorTarget.style.animation = "opacityOut 2.5s linear";

        AdicionarEmpate(jogadorScore);
        AdicionarEmpate(maquinaScore);
      } else {
        Emote(dropMaquinaTarget, "emoteMaquina", emoteVitoria);
        Emote(dropJogadorTarget, "emoteJogador", emoteDerrota);
        dropJogadorTarget.style.animation = "opacityOut 2.5s linear";
        AdicionarVitoria(maquinaScore);
        AdicionarDerrota(jogadorScore);
      }
      CalcularPontos(maquinaScore);
      CalcularPontos(jogadorScore);
      CarregarPontuacao(pontuacaoMaquinaTag, maquinaScore);
      CarregarPontuacao(pontuacaoJogadorTag, jogadorScore);
      ResetDropZone();
      whoWinner();
    }, 1000);
  }, 1000);
}

// Resetando o local de colocar a carta
function ResetDropZone() {
  setTimeout(() => {
    dropJogadorTarget.removeChild(dropJogadorTarget.lastElementChild);
    dropMaquinaTarget.removeChild(dropMaquinaTarget.lastElementChild);
  }, 2000);
}

// Selecionando o attributo para comparação com a carta da máquina
function SelectAttribute(attr) {
  if (tutorialOn) {
    Tutorial(
      game,
      "tutorial",
      emoteTutorial,
      "Minha missão terminou, boa sorte!"
    );
    // Removendo o tutorial passando o texto em vazio
    setTimeout(() => {
      Tutorial(game, "tutorial", emoteTutorial, "");
      tutorialOn = false
    }, 2000);
  }
  if (attr == "attack") {
    WhichAttribute(attr);
  } else if (attr == "defense") {
    WhichAttribute(attr);
  } else if (attr == "magic") {
    WhichAttribute(attr);
  } else if (attr == "movespeed") {
    WhichAttribute(attr);
  } else {
  }
}

// Aplicando efeito do atributo selecionado
function WhichAttribute(attr) {
  let attrSelectedMaquinaTag = document.querySelector(
    `.game .maquinaMove #${attr}>span>img`
  );
  let attrSelectedJogadorTag = document.querySelector(
    `.game .jogadorMove #${attr}>span>img`
  );
  let statusJogadorCard = document.querySelector(".game .jogadorMove .status");

  ApplyEffect(attrSelectedMaquinaTag);
  ApplyEffect(attrSelectedJogadorTag);

  function ApplyEffect(attrSelectedTag) {
    // Efeito do atributo selecionado
    attrSelectedTag.style.width = "40px";
    attrSelectedTag.style.height = "40px";
    attrSelectedTag.style.left = "-5px";
    attrSelectedTag.style.boxShadow = "0px 0px 4px 4px #fcfbc8";
  }
  // Resetando a animação do atatus da carta
  statusJogadorCard.style.animation =
    "statusMoveLeftReset 0.3s linear forwards";

  // Inicia a rodada
  GameplayStart(attr);
}

// Sorteando a carta para máquina
function SortCartMaquina(deck) {
  let index = Math.floor(Math.random() * (deck.length - 0)) + 0;
  return index;
}

// ================================= Funções de pontuação =================================
// Carregar pontuação
function CarregarPontuacao(pontuacaoTag, objetoScore) {
  pontuacaoTag.innerHTML = "";

  let pontuacao = `
    <div class="vitorias">
      <img src="img/scoreImg/victories.png" alt="">
      Vitorias: <span>${objetoScore.vitorias}</span>
    </div>
    <div class="empates">
      <img src="img/scoreImg/ties.png" alt="">
      Empates: <span>${objetoScore.empates}</span>
    </div>
    <div class="derrotas">
      <img src="img/scoreImg/defeats.png" alt="">
      Derrotas: <span>${objetoScore.derrotas}</span>
    </div>
    <div class="pontos">
      <img src="img/scoreImg/points.png" alt="">
      Pontos: <span>${objetoScore.pontos}</span>
    </div>
  `;

  pontuacaoTag.innerHTML = pontuacao;
}
// Adicionar vitória
function AdicionarVitoria(objetoScore) {
  objetoScore.vitorias++;
  objetoScore.jogos++;
}

// Adicionar empate
function AdicionarEmpate(objetoScore) {
  objetoScore.empates++;
  objetoScore.jogos++;
}

// Adicionar derrota
function AdicionarDerrota(objetoScore) {
  objetoScore.derrotas++;
  objetoScore.jogos++;
}

// Calcular pontos
function CalcularPontos(objetoScore) {
  let calculaPontos = objetoScore.vitorias * 3 + objetoScore.empates;
  objetoScore.pontos = calculaPontos;
}

// Resetando pontos
function ResetarPontos(objetoScore) {
  objetoScore.jogos = 0;
  objetoScore.vitorias = 0;
  objetoScore.empates = 0;
  objetoScore.derrotas = 0;
  objetoScore.pontos = 0;
}

// Condição de vitória
function whoWinner() {
  let finalScreen;
  if ((deckJogador.length == 0) & (deckJogadorHand.length == 0)) {
    if (jogadorScore.pontos > maquinaScore.pontos) {
      finalScreen = `
      <div class='result'>
        <img src="img/emotesImg/result/vendedor.png">
          Vitória
        <img src="img/emotesImg/result/vendedor.png">
      </div>
      <button onclick="Jogar()">Jogar</button>
      `;
    } else if (jogadorScore.pontos < maquinaScore.pontos) {
      finalScreen = `
      <div class='result'>
        <img src="img/emotesImg/result/derrotado.png">
          Derrota
        <img src="img/emotesImg/result/derrotado.png">
      </div>
      <button onclick="Jogar()">Jogar</button>
      `;
    } else {
      finalScreen = `
      <div class='result'>
        <img src="img/emotesImg/result/empatado.png">
          Empate
        <img src="img/emotesImg/result/empatado.png">
      </div>
      <button onclick="Jogar()">Jogar</button>
      `;
    }
    setTimeout(() => {
      countClickStartGame = 0;
      countClickDeckJogador = 0;
      ResetarPontos(maquinaScore);
      ResetarPontos(jogadorScore);
      initialScreenTag.innerHTML = "";
      maquinaDeckTag.style.display = "block";
      jogadorDeckTag.style.display = "block";
      pontuacaoJogadorTag.style.zIndex = "99";
      initialScreenTag.style.display = "flex";
      initialScreenTag.style.animation = "none";
      initialScreenTag.innerHTML = finalScreen;
      audioPlay("mainAudio", "audio/ornnTheme.mp3", 0.5);
    }, 2000);
  }
}

// Audio play
function audioPlay(audioID, audio, volume) {
  let audioTag = document.querySelector(`#${audioID}`);
  audioTag.setAttribute("src", audio);
  audioTag.volume = volume;
  audioTag.play();
}

// Background random
function BackgroundRandom(backgroundTag, backgroundArray) {
  let backgroundIndex =
    Math.floor(Math.random() * (backgroundArray.length - 0)) + 0;
  let image = backgroundArray[backgroundIndex].image;
  backgroundTag.style.background = `url("${image}") no-repeat center`;
  backgroundTag.style.backgroundSize = "cover";
}

// Emote
function Emote(dropZone, emoteClassName, emoteArray) {
  let emoteIndex = Math.floor(Math.random() * (emoteArray.length - 0)) + 0;
  let emote = `
    <p></p>
    <img src="${emoteArray[emoteIndex].image}">
  `;
  let emoteTag;
  emoteTag = dropZone.querySelector(`.${emoteClassName}`);
  emoteTag.innerHTML = `${emote}`;
  setTimeout(() => {
    emoteTag.innerHTML = "";
  }, 1500);
}

// Tutorial
function Tutorial(dropZone, emoteClassName, emoteArray, tutorialText) {
  let emoteIndex = Math.floor(Math.random() * (emoteArray.length - 0)) + 0;
  let emote = `
    <p>${tutorialText}</p>
    <img src="${emoteArray[emoteIndex].image}">
  `;
  let emoteTag;
  emoteTag = dropZone.querySelector(`.${emoteClassName}`);
  emoteTag.innerHTML = `${emote}`;
  if (tutorialText == "" || tutorialText == undefined) {
    emoteTag.innerHTML = "";
  }
}

// Disclaimer
disclaimerTag.onmouseenter = () => {
  let license = `
  <div>
    <h2>Aviso Legal</h2>
    <p>Esse projeto foi feito com o principal intuito de estudar HTML, CSS e JS. Os direitos sobre os ativo utilizados nesse projeto pertencem exclusivamente ao detentores dos direito autorais explicitados abaixo:</p>
    <br>
    <h3>Ativos protegidos por direitos autorais</h3>
    <p>A maioria dos ativos desse projeto tem os direitos autorais pertencentes a <a href="https://www.riotgames.com/pt-br" target="_blank">Riot Games Inc.</a></p>
    <br>
    <p><strong>League of Trunfo</strong> foi criado sob a política "Legal Jibber Jabber" da Riot Games usando ativos de propriedade da Riot Games. A Riot Games não endossa nem patrocina este projeto.</p>
    <br>
    <h3>Vídeo</h3>
    <a href="https://universe.leagueoflegends.com/pt_BR/region/ionia/" target="_blank">Região de Ionia</a>
    <br><br>
    <h3>Músicas</h3>
    <a href="https://soundcloud.com/leagueoflegends/ornn-the-fire-beneath-the-mountain-login-theme" target="_blank">Ornn Theme</a> |
    <a href="https://soundcloud.com/leagueoflegends/lillia-the-bashful-bloom" target="_blank">Lillia Theme</a>
    <br><br>
    <h3>Efeitos sonoros</h3>
    <a href="https://freesound.org/s/240776/" target="_blank">f4ngy</a> |
    <a href="https://freesound.org/s/319590/" target="_blank">Hybrid_V</a> |
    <a href="https://freesound.org/s/523948/" target="_blank">BlueCircleSounds</a>
    <br><br>
    <h3>Movendo a carta</h3>
    <a href="https://www.w3schools.com/howto/howto_js_draggable.asp" target="_blank">Crie um elemento HTML arrastável</a>
  </div>
  `;
  disclaimerTag.innerHTML = "";
  disclaimerTag.innerHTML = license;
};

disclaimerTag.onmouseleave = () => {
  disclaimerTag.innerHTML = "";
  disclaimerTag.innerHTML = "<div>!</div>";
};
