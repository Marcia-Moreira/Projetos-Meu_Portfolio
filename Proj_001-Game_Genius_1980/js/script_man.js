//* ===========================================
//* Armazena informações de todo projeto, tipo uma mémoria:
const _data = {
	gameOn: false,
	timeout: undefined,
	sounds: [],
    isMuted: false,

	strict: false,
	playerCanPlay: false,
	score: 0,
	gameSequence: [],
	playerSequence: [],

    isAccelerating: false,
    intervalSpeed: 650
};
//* ===========================================
//* Seleciona as classes do html:
const _gui = {
	counter: document.querySelector(".gui__counter"),
	switch: document.querySelector(".gui__btn-switch"),
	led: document.querySelector(".gui__led"),
	strict: document.querySelector(".gui__btn--strict"),
	start: document.querySelector(".gui__btn--start"),
	pads: document.querySelectorAll(".game__pad"),
    accelerationButton: document.querySelector(".gui__btn-acceleration")
}
//* ===========================================
//* Sons do Jogo:
const _soundUrls = [
	"audio/simonSound1.mp3",
	"audio/simonSound2.mp3",
	"audio/simonSound3.mp3",
	"audio/simonSound4.mp3"
];
// Inicializando os sons:
_soundUrls.forEach(sndPath => {
	const audio = new Audio(sndPath);
	_data.sounds.push(audio);
});
// Esqueleto das Funções:
//* ===========================================
//* Função: Escuta o click (Muda a posição do botão azul on/off)
_gui.switch.addEventListener("click", () => {
    // Precisamos guardar essa ação dentro do "gameOn"
    _data.gameOn = _gui.switch.classList.toggle("gui__btn-switch--on");
    // Teste Console: True and False
    // console.log(_data.gameOn);

    // Contador Acende e Apaga:
    _gui.counter.classList.toggle("gui__counter--on");
    // Para o jogo sempre que começar deve ser dessa forma:
    _gui.counter.innerHTML = "--";

    // Demais padrões fixos de inicialização do jogo:
    _data.strict = false;
    _data.playerCanPlay = false;
    _data.score = 0;
    _data.gameSequence = [];
    _data.playerSequence = [];

    // Para forçar desabilitar os pads:
    disablePads();
    // seta mouse - usuario nao pode clicar
    changePadCursor("auto");

    // Para forçar apagar o led após off:
    _gui.led.classList.remove("gui__led--active");
});
//* ===========================================
//* Função: Escuta Aceleração
document.addEventListener("DOMContentLoaded", () => {
    const accelerationButton = document.querySelector(".gui__btn-acceleration");

    accelerationButton.addEventListener("click", () => {
        if (!_data.gameOn || !_data.score) return;
        _data.isAccelerating = !_data.isAccelerating;

        if (_data.isAccelerating) {
            accelerationButton.classList.add("active");
            accelerationButton.innerHTML = "⚡";
        } else {
            accelerationButton.classList.remove("active");
            accelerationButton.innerHTML = "🐢";
        }
        // Teste Console:
        console.log(`Aceleração: ${_data.isAccelerating ? "Ativada" : "Desativada"}`);
    });
});
//* ===========================================
//* Função: Escuta o click do Strict, acendendo ou apagando o led
_gui.strict.addEventListener("click", () => {
    // Para verificar se gameOn está Ligado:
    if(!_data.gameOn)
        return;

    _data.strict = _gui.led.classList.toggle("gui__led--active");
    // Teste Console: True and False
    // console.log(_data.strict);
});
//* ===========================================
//* Função: Escuta o click do Start para evitar que execute sem ligar
_gui.start.addEventListener("click", () => {
    if (!_data.gameOn) return;
    startGame();
});
//* ===========================================
//* Função: Verificações para o usuario jogar / ouvir oa pads
const padListener = (e) => {
    // Se ele não puder jogar, pare.
    if(!_data.playerCanPlay)
        return;

    let soundId;
    _gui.pads.forEach((pad, key) => {
        if(pad === e.target)
            soundId = key;
    });
    // Para acender o pad no click do usuario:
    e.target.classList.add("game__pad--active");

    // Verifica acima o som e toca agora:
    _data.sounds[soundId].play();
    // Para armazenar a sequencia do jogador
    _data.playerSequence.push(soundId)

    // setTimeout(() => {
    // }, 200);

    // delay para dar tempo de ver acender:
    setTimeout(() => {
        // depois de armazenar apaga:
        // Arrumado Erro será resolvido no vídeo 8 parou de acender!!!
        e.target.classList.remove("game__pad--active");

        // Agora vamos Comparar as Sequencias: Comparar as posições do array!
        // Array começa em zero e as rodadas em 01, por isso o -1
        const currentMove = _data.playerSequence.length - 1;

        // Se a sequencia for diferente:
        if(_data.playerSequence[currentMove] !== _data.gameSequence[currentMove]) {
            // Impede o jogador de continuar
            _data.playerCanPlay = false;
            disablePads();
            // playSequence();
            resetOrPlayAgain();

        }
        else if(currentMove === _data.gameSequence.length - 1) {
            newColor();
            // Coloquei delay para continuar a sequencia pois estavam muito coladas
            setTimeout(() => {
                playSequence();
            }, 1000);
        }
        waitForPlayerClick();
    }, 250);
}
//* ===========================================
// Adicionando listener aos pads:
_gui.pads.forEach(pad => {
	pad.addEventListener("click", padListener);
});
//* ===========================================
//* Função: Inicia o jogo
const startGame = () => {
    // Chamar a função Blink:
    blink("--", () => {
        // console.log("ok!");

        // Chamada da função: Para escolher Cor
        newColor();
        // Chamada da função:
        playSequence();
    });
}
//* ===========================================
//* Função: Adiciona nova cor à sequência
const newColor = () => {
    // Trecho GameOver opcional Limitando quantidade de Partidas:
    if(_data.score === 99) {
        blink("**", startGame);
        return;
    }

    // Vai escolher uma cor aleatória entre 0 e 3 => 4 pads: e inserindo do arrei gameSequence
    // Math.random sempre traz numero quebrado:
    // Math.random() * 4;
    // Usaremos Math.floor para arredondar pra baixo:
    // Se fosse para arredondar para cima, usariamos "Math.ceil()"
    // Nota de escola: Math.round() => 2.4=2 e 2.6=3
    // Math.floor()
    _data.gameSequence.push(Math.floor(Math.random() * 4));

    // Adiciona score:
    _data.score++;

    setScore();
}
//* ===========================================
//* Função: Define o placar
const setScore = () => {
    const score = _data.score.toString();

    // Para sempre mostrar apenas 2 digitos: Método Substring
    const display = "00".substring(0, 2 - score.length) + score;
    _gui.counter.innerHTML = display;
}
//* ===========================================
// Math.random() retorna um valor entre 0 e 4 quando mult. por 4!
//* ===========================================
//* Função: Toca sequência do jogo
// Responsável por tocar a sequência do jogo após ter sido armazenada no arrei:
const playSequence = () => {
    let counter = 0,
        padOn = true;

    _data.playerSequence = [];
    _data.playerCanPlay = false;

    // Para definir o mouse
    changePadCursor("auto");

    // Atualiza a velocidade com base no nível
    _data.intervalSpeed = calculateSpeed(_data.score);

    const interval = setInterval(() => {
        // Para interromper caso esteja OFF:
        if(!_data.gameOn) {
            clearInterval(interval);
            disablePads();
            return;
        }
        // setInterval executa uma função de acordo com um tempo estabelecido. No caso 650 milesegundos.
        if(padOn) {
            // Para verificar o tamanho dos arreis
            if(counter === _data.gameSequence.length) {
                clearInterval(interval);
                disablePads();
                waitForPlayerClick();
                changePadCursor("pointer");
                _data.playerCanPlay = true;
                return;
            }

            const sndId = _data.gameSequence[counter];
            const pad = _gui.pads[sndId];

            // Vai tocar as músicas das cores conforme a ordem:
            _data.sounds[sndId].play();
            // Para mostrar qual pad estará aceso:
            pad.classList.add("game__pad--active");
            // Para percorrer o arrei:
            counter++;
        }
        else {
            // Para garantir que os pads serão desligados:
            disablePads();
        }
        // Para inverter: true x false
        padOn = !padOn;
    }, _data.intervalSpeed);
}
//* ===========================================
//* Responsável por fazer o display piscar:
const blink = (text, callback) => {
    let counter = 0,
        on = true;
    _gui.counter.innerHTML = text;

    const interval = setInterval(() => {
        // Para desligar display:
        if(!_data.gameOn) {
            clearInterval(interval);
            _gui.counter.classList.remove("gui__counter--one");
            return;
        }
        // Para fazer display piscar:
        if(on) {
            _gui.counter.classList.remove("gui__counter--on");
        }
        else {
            _gui.counter.classList.add("gui__counter--on");

            // ++counter => adiciona primeiro e depois apresenta
            // counter++ => apresenta primeiro e depois acrescenta
            if(++counter === 3) {
                clearInterval(interval);
                callback();
            }
        }
        // quando for true vira false e vice versa:
        on = !on;
    }, 250);
}
//* ===========================================
//* Para esperar o jogador, jogar! 5 segundos
const waitForPlayerClick = () => {
    clearTimeout(_data.timeout);

    _data.timeout = setTimeout(() => {
        if(!_data.playerCanPlay)
            return;

        disablePads();
        // playSequence();
        resetOrPlayAgain();
    }, 5000);
}
//* ===========================================
const resetOrPlayAgain = () => {
    // Garantir que o jogador não possa jogar
    _data.playerCanPlay = false;

    if(_data.strict) {
        blink("!!", () => {
            _data.score = 0;
            _data.gameSequence = [];
            startGame();
        });
    }
    else {
        blink("!!", () => {
            setScore();
            playSequence();
        });
    }
}
//* ===========================================
//* Para o cursor virar pointer quando o jogador puder jogar:
const changePadCursor = (cursorType) => {
    _gui.pads.forEach(pad => {
        pad.style.cursor = cursorType;
    });
}
//* ===========================================
//* Calculos de Velocidade para os Níveis:
const calculateSpeed = (level) => {
    if (!_data.isAccelerating || level < 3) return 650; // Sem aceleração até o nível 3
    const accelerationFactor = Math.floor(level / 3) * 0.20; // Calcula o fator de aceleração 20% a partir do nível 3 se estiver ativo
    return Math.max(200, 650 * (1 - accelerationFactor)); // Limita a velocidade mínima a 200ms
};
//* ===========================================
const disablePads = () => {
    // Desabilita todos pads com certeza para encerrar partidas: chamar essa função onde precisar.
    _gui.pads.forEach(pad => {
        pad.classList.remove("game__pad--active");
    });
}
//* ===========================================

//* ===========================================

//* ===========================================

//* ===========================================