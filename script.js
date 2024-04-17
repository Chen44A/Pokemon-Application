let getData = async (url) => {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}
//------------------------------ variables
const selectElement = document.querySelector('#pokemons');
const submitBtn = document.querySelector('#submitBtn');
const pokemon_Info = document.querySelector('#pokemon_Info');
const overlay = document.querySelector('.overlay')
const overlay_mask = document.querySelector('.overlay-mask');
const pokemonOne = document.querySelector('#pokemonOne');
const pokemonTwo = document.querySelector('#pokemonTwo');
const compareConfirmBtn = document.querySelector('#compareConfirmBtn')


let toggleOverlay = () => {
    overlay_mask.style.display = 'none'
    overlay.style.display = 'none'
}

//------------------------------ generate all of pokemon at dropdown
let genderPokemonsInDropdown = async (element) => {
    let pokemonsData = await getData('https://pokeapi.co/api/v2/pokemon?limit=151');
    // console.log(pokemonsData);
    let allPokemonsName = pokemonsData.results.map(pokemon => pokemon.name);
    // console.log(allPokemonsName)
    allPokemonsName.forEach((pokemon,index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.innerText = pokemon;
        element.appendChild(option);
    })
}
genderPokemonsInDropdown(selectElement);

//generate compare dropdown
genderPokemonsInDropdown(pokemonOne);
genderPokemonsInDropdown(pokemonTwo);

//funcktion for set pokemonOnes default value
 let setDefaultPokemonOneValue = () => {
    const pokemonOneOptions = pokemonOne.querySelectorAll('option');
    pokemonOneOptions.forEach(option => {
        if (option.value === selectElement.value) {
            // Set the selected option as default
            option.selected = true;
        } 
    });
 }

//------------------------------ Unit conversion
let unitChange = (x) => x/10;

//------------------------------ get pokemon information
submitBtn.addEventListener('click', async() => {
    let pokemonsId = selectElement.value;
    // console.log(pokemonsId);
    
    //fetch data
    let choosedPokemon = await getData(`https://pokeapi.co/api/v2/pokemon/${pokemonsId}/`)
    console.log(choosedPokemon);
    
    //set pokemonOne in defalut value
    setDefaultPokemonOneValue();
    
    pokemon_Info.classList.add('pokemon_Info');
    //set type of color
    const mainType = choosedPokemon.types[0].type.name;
    const typeColors = {
        normal: "#A8A878",
        fire: "#F08030",
        water: "#6890F0",
        electric: "#F8D030",
        grass: "#78C850",
        ice: "#98D8D8",
        fighting: "#C03028",
        poison: "#A040A0",
        ground: "#E0C068",
        flying: "#A890F0",
        psychic: "#F85888",
        bug: "#A8B820",
        rock: "#B8A038",
        ghost: "#705898",
        dragon: "#7038F8",
        dark: "#705848",
        steel: "#B8B8D0",
        dark: "#EE99AC",
      };      

    //generate type names
    let typeNames = choosedPokemon.types.map(type => type.type.name);
    console.log(typeNames);
    let eachTypeName = '';

    typeNames.forEach((name)=> {
        eachTypeName += `<p  style='background:${typeColors[mainType]}'>${name}</p>`
    })

    //generate abilities
    let abilities = choosedPokemon.abilities.map(ability => ability.ability.name);
    let eachAbility = '';

    abilities.forEach((ability)=> {
        eachAbility += `<p >${ability}</p>`
    })
 
    //generate stats
    let stats = choosedPokemon.stats.map(stat => stat.base_stat);
    console.log(stats);
    pokemon_Info.innerHTML = `
    <img src = ${choosedPokemon.sprites.other.dream_world.front_default} class="pokemonImg" style="width: 220px; max-height:300px">
    <h2>${choosedPokemon.name}</h2>
    <div class="type">${eachTypeName} </div>
    <div class = "basic_info">
        <i class="fa-solid fa-weight-hanging" id ='weight' style="height: 20px;"> ${unitChange(choosedPokemon.weight)} kg</i> 
        <i class="fa-solid fa-ruler-vertical" id ='height' style="height: 20px;"> ${unitChange(choosedPokemon.height)} m</i> 
        <div class="abilities">${eachAbility}</div>
    </div>
    <h3>Base Stats</h3>
    <div class='base_stats'>
        <div class='stats_wrapper' >
        <p class="statsName" style='color: ${typeColors[mainType]}'>HP</p>
        <progress class="progress-bar" value='${stats[0]}' max="255" style="background: ${typeColors[mainType]};"></progress>
        <p class="statsValue" style='color: ${typeColors[mainType]}'>${stats[0]}</p>
        </div>
        <div class='stats_wrapper' >
        <p class="statsName" style="color: ${typeColors[mainType]};">ATK</p>
        <progress class="progress-bar" value='${stats[1]}' max="255"></progress>
        <p class="statsValue" style='color: ${typeColors[mainType]}'>${stats[1]}</p>
        </div>
        <div class='stats_wrapper' >
        <p class="statsName" style="color: ${typeColors[mainType]};">DEF</p>
        <progress class="progress-bar" value='${stats[2]}' max="255"></progress>
        <p class="statsValue" style='color: ${typeColors[mainType]}'>${stats[2]}</p>
        </div>
        <div class='stats_wrapper' >
        <p class="statsName" style="color: ${typeColors[mainType]};">SATK</p>
        <progress class="progress-bar" value='${stats[3]}' max="255"></progress>
        <p class="statsValue" style='color: ${typeColors[mainType]}'>${stats[3]}</p>
        </div>
        <div class='stats_wrapper' >
        <p class="statsName" style="color: ${typeColors[mainType]};">SDEF</p>
        <progress class="progress-bar" value='${stats[4]}' max="255"></progress>
        <p class="statsValue" style='color: ${typeColors[mainType]}'>${stats[4]}</p>
        </div>
        <div class='stats_wrapper' >
        <p class="statsName" style="color: ${typeColors[mainType]};">SPD</p>
        <progress class="progress-bar" value='${stats[5]}' max="255"></progress>
        <p class="statsValue" style='color: ${typeColors[mainType]}'>${stats[5]}</p>
        </div>
    </div>
    `
    const compareBtn = document.createElement('button');
    compareBtn.id = 'compareBtn';
    compareBtn.innerText = 'Compare'
    pokemon_Info.appendChild(compareBtn);

    compareBtn.addEventListener('click', ()=> {
        overlay_mask.style.display = 'block'
        overlay.style.display = 'block'
    })
})


compareConfirmBtn.addEventListener('click',() => {
    let pokemon1 = pokemonOne.value
    let pokemon2 = pokemonTwo.value;
    if (pokemon1 === pokemon2){
        alert('You selected the same Pokémon, please choose another one!')
    }else {
        localStorage.setItem('pokemonOne',pokemon1);
        localStorage.setItem('pokemonTwo',pokemon2);
        window.location.href = "compare.html";
    }
} )