// =========================
// SÖKFUNKTION
// =========================

// Hitta sökrutan
const searchInput = document.getElementById("search");
const resultBox = document.getElementById("pokemon-result");

// Lyssna på när användaren skriver
searchInput.addEventListener("keyup", async function (event) {
    const name = event.target.value.toLowerCase().trim();

    // Om tomt fält – rensa rutan
    if (name === "") {
        resultBox.innerHTML = "";
        return;
    }

    try {
        // Hämta från PokéAPI
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

        if (!response.ok) {
            resultBox.innerHTML = "<p style='color:white;'>Ingen Pokémon hittades.</p>";
            return;
        }

        const data = await response.json();

        // Visa Pokémon-info
        resultBox.innerHTML = `
            <div style="margin-top:20px; color:white; text-align:center;">
                <h2 style="font-family:'Press Start 2P'; color:#FFCB05;">${data.name.toUpperCase()}</h2>
                <img src="${data.sprites.front_default}" alt="${data.name}">
                <p>Typ: ${data.types.map(t => t.type.name).join(", ")}</p>
            </div>
        `;

    } catch (error) {
        console.error(error);
        resultBox.innerHTML = "<p style='color:white;'>Fel vid hämtning.</p>";
    }
});


// =========================
// FILTERFUNKTION (Pokémon-typ)
// =========================

// Hitta dropdown och resultatbox
const typeFilter = document.getElementById("type-filter");
const typeResults = document.getElementById("type-results");

// Lyssna när användaren väljer typ
typeFilter.addEventListener("change", async function () {
    const type = typeFilter.value;

    // Rensa tidigare resultat
    typeResults.innerHTML = "";

    // Om "ingen typ" vald, avsluta
    if (type === "") return;

    try {
        // Hämta alla Pokémon av vald typ
        const response = await fetch(`https://pokeapi.co/api/v2/type/${type}`);
        const data = await response.json();

        // Vi tar bara de första 20 för snabbhet
        const pokemonList = data.pokemon.slice(0, 20);

        // Hämta info för varje Pokémon (för att få bild)
        for (const entry of pokemonList) {
            const p = await fetch(entry.pokemon.url);
            const details = await p.json();

            typeResults.innerHTML += `
                <div style="display:inline-block; margin:15px; text-align:center;">
                    <img src="${details.sprites.front_default}" alt="${details.name}">
                    <p style="color:white; font-family:'Press Start 2P'; font-size:12px;">
                        ${details.name}
                    </p>
                </div>
            `;
        }

    } catch (error) {
        console.error(error);
        typeResults.innerHTML = "<p style='color:white;'>Kunde inte hämta Pokémon.</p>";
    }
});
