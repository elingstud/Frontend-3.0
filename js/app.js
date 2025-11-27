// Referenser till HTML-element
const container = document.getElementById('pokemonContainer');
const searchInput = document.querySelector('.search');

// Antal Pokémon att hämta
const limit = 20;

// Funktion för att hämta Pokémon-lista
async function fetchPokemon() {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}`);
        const data = await response.json();
        const results = data.results;

        // Skapa kort för varje Pokémon
        results.forEach(pokemon => {
            createPokemonCard(pokemon);
        });
    } catch (error) {
        container.textContent = 'Oj, något gick fel!'; // Felhantering
        console.error(error);
    }
}

// Funktion som skapar ett Pokémon-kort
async function createPokemonCard(pokemon) {
    try {
        // Hämta detaljerad data för bilden
        const res = await fetch(pokemon.url);
        const details = await res.json();

        // Skapa kort
        const card = document.createElement('div');
        card.classList.add('pokemon-card');

        // Fyll kortet med namn och bild
        card.innerHTML = `
            <h3>${details.name}</h3>
            <img src="${details.sprites.front_default}" alt="${details.name}">
        `;

        container.appendChild(card);
    } catch (error) {
        console.error(error);
    }
}

// Filtrering med sökrutan
searchInput.addEventListener('input', () => {
    const searchValue = searchInput.value.toLowerCase();
    const cards = container.querySelectorAll('.pokemon-card');

    cards.forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        if(name.includes(searchValue)) {
            card.style.display = 'inline-block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Starta appen
fetchPokemon();

