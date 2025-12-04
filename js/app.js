// =========================
// SÖKFUNKTION
// =========================

// Hitta sökrutan och rutan där resultat visas
const sokRuta = document.getElementById("search");
const resultatRuta = document.getElementById("pokemon-result");

// =========================
// FUNKTION FÖR SÖK
// =========================
async function sokPokemon(event) {
    // Ta texten som användaren skrev
    const namn = event.target.value.toLowerCase().trim();

    // Om rutan är tom → rensa resultatet och sluta
    if (namn === "") {
        resultatRuta.innerHTML = "";
        return;
    }

    try {
        // Hämta Pokémon-data från PokéAPI
        const svar = await fetch(`https://pokeapi.co/api/v2/pokemon/${namn}`);

        // Om inget hittades → visa meddelande
        if (!svar.ok) {
            resultatRuta.innerHTML = "<p style='color:white;'>Ingen Pokémon hittades.</p>";
            return;
        }

        // Öppnar det vi fått från API:et och gör det till något vi kan använda i koden
        const data = await svar.json();

        // Visa namn, bild och typ av Pokémon
        resultatRuta.innerHTML = `
      <div style="margin-top:20px; color:white; text-align:center;">
        <h2 style="font-family:'Press Start 2P'; color:#FFCB05;">${data.name.toUpperCase()}</h2>
        <img src="${data.sprites.front_default}" alt="${data.name}">
        <p>Typ: ${data.types.map(t => t.type.name).join(", ")}</p>
      </div>
    `;

    } catch (fel) {
        // Om något går fel (t.ex. nätverksproblem)
        console.error(fel);
        resultatRuta.innerHTML = "<p style='color:white;'>Fel vid hämtning.</p>";
    }
}

// Koppla funktionen till sökrutan
sokRuta.addEventListener("keyup", sokPokemon);



// =========================
// FILTERFUNKTION (Pokémon-typ)
// =========================

// Hitta dropdown-menyn och rutan för resultat
const typVal = document.getElementById("type-filter");
const typResultat = document.getElementById("type-results");

// =========================
// NAMNGIVEN FUNKTION FÖR FILTER
// =========================
async function filtreraTyp() {
    const valdTyp = typVal.value;

    // Rensa resultat varje gång
    typResultat.innerHTML = "";

    // Om ingen typ är vald → sluta
    if (valdTyp === "") return;

    try {
        // Hämta alla Pokémon av den valda typen
        const svar = await fetch(`https://pokeapi.co/api/v2/type/${valdTyp}`);
        const data = await svar.json();

        // Ta bara de första 20 Pokémon för snabbhet
        const listaPokemon = data.pokemon.slice(0, 20);

        // Hämta detaljer för varje Pokémon
        for (const post of listaPokemon) {
            const p = await fetch(post.pokemon.url);
            const detaljer = await p.json();

            // Visa bild och namn
            typResultat.innerHTML += `
        <div style="display:inline-block; margin:15px; text-align:center;">
          <img src="${detaljer.sprites.front_default}" alt="${detaljer.name}">
          <p style="color:white; font-family:'Press Start 2P'; font-size:12px;">
            ${detaljer.name}
          </p>
        </div>
      `;
        }

    } catch (fel) {
        console.error(fel);
        typResultat.innerHTML = "<p style='color:white;'>Kunde inte hämta Pokémon.</p>";
    }
}

// Koppla funktionen till dropdown-menyn
typVal.addEventListener("change", filtreraTyp);
