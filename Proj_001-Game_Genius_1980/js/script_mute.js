// Código para Mutar o Jogo Genius:

//* ===========================================
// Selecionando o botão e definindo estado inicial
const muteButton = document.getElementById("muteButton");
// let isMuted = false;
// Controle do estado

//* ===========================================
muteButton.addEventListener('click', () => {
    _data.isMuted = !_data.isMuted; // Alterna entre mudo e não-mudo

    // Atualiza a propriedade muted de todos os sons
    _data.sounds.forEach(audio => {
        audio.muted = _data.isMuted;
    });

    // Altera o ícone do botão com base no estado de mudo
    muteButton.textContent = _data.isMuted ? '🔈' : '🔇';
});
//* ===========================================
