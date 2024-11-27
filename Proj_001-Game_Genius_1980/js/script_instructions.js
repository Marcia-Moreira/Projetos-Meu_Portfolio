// Card Instruções:

document.addEventListener("DOMContentLoaded", () => {
    // Selecionar o contêiner do card
    const cardContainer = document.querySelector('.card');

    // Adicionar o evento de clique
    cardContainer.addEventListener('click', () => {
        // Alternar a classe 'flipped' no card
        cardContainer.classList.toggle('flipped');
    });
});
