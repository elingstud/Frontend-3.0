// Hämta sökruta och ruta för sökresultat
const sokRuta = document.getElementById("search");
const resultatRuta = document.getElementById("pokemon-result");

// Hämta dropdown och ruta för typfilter
const typVal = document.getElementById("type-filter");
const typRuta = document.getElementById("type-results");

// Funktion för att söka Pokémon
async function sokPokemon(event) {
    const namn = event.target.value.toLowerCase().trim(); // Ta text från input
    if (namn === "") { resultatRuta.innerHTML = ""; return; }

    const svar = await fetch(`https://pokeapi.co/api/v2/pokemon/${namn}`);
    if (!svar.ok) { resultatRuta.innerHTML = "<p style='color:white;'>Ingen Pokémon hittades.</p>"; return; }

    const data = await svar.json(); // Konvertera JSON
    visaPokemon(data, resultatRuta); // Visa resultatet i resultatRuta
}

// Funktion som visar Pokémon i en ruta
function visaPokemon(pokemonData, ruta) {
    ruta.innerHTML = `
        <div style="margin-top:20px; color:white; text-align:center;">
            <h2 style="font-family:'Press Start 2P'; color:#FFCB05;">
                ${pokemonData.name.toUpperCase()}
            </h2>
            <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}">
            <p>Typ: ${pokemonData.types.map(t => t.type.name).join(", ")}</p>
        </div>
    `;
}

// Lyssna på när man skriver i sökrutan
sokRuta.addEventListener("keyup", sokPokemon);

// Funktion för att filtrera Pokémon efter typ
async function filtreraTyp() {
    const valdTyp = typVal.value;
    typRuta.innerHTML = "";
    if (valdTyp === "") return;

    const svar = await fetch(`https://pokeapi.co/api/v2/type/${valdTyp}`);
    const data = await svar.json();
    const listaPokemon = data.pokemon.slice(0, 20);

    listaPokemon.forEach(async post => {
        const p = await fetch(post.pokemon.url);
        const detaljer = await p.json();
        visaPokemonDetaljer(detaljer);
    });
}

// Funktion som visar varje Pokémon i typRuta
function visaPokemonDetaljer(pokemon) {
    typRuta.innerHTML += `
        <div style="display:inline-block; margin:15px; text-align:center;">
            <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
            <p style="color:white; font-family:'Press Start 2P'; font-size:12px;">
                ${pokemon.name}
            </p>
        </div>
    `;
}

// Lyssna på när man väljer en typ i dropdown
typVal.addEventListener("change", filtreraTyp);
