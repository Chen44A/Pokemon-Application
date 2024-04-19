//pokemon class
class Pokemon {
    constructor(_name,_image,_types,_weight,_height,_stats) {
        this.name = _name
        this.image = _image
        this.types = _types
        this.weight = _weight
        this.stats = _stats
    }
}

let getData = async (url) => {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

let displayPokemon = (div,pokemon) => {
    const pokemonDiv = document.querySelector(div);

    const pokemonContainer = document.createElement('div');
    pokemonContainer.classList.add('pokemonInfo');

    const img = document.createElement('img');
    img.id = 'pokemonImg'
    img.src = pokemon.image;
    img.alt = pokemon.name;
    pokemonContainer.appendChild(img);
    
    const nameH2 = document.createElement('h2');
    nameH2.classList.add('compare_pokemonName')
    nameH2.innerText = pokemon.name;
    pokemonContainer.appendChild(nameH2);
    
    const typeDiv = document.createElement('div');
    typeDiv.classList.add('types');
    pokemon.types.forEach(type => {
        const eachType = document.createElement('p');
        eachType.innerText = type;
        typeDiv.appendChild(eachType);
    });
    pokemonContainer.appendChild(typeDiv);

    pokemonDiv.appendChild(pokemonContainer);
}


let addValuesToComparisonTable = (name, height, weight, baseStats) => {
    // add height and weight value to the table
    const heightRow = document.querySelector('.compare_height');
    const heightTd = document.createElement('td');
    heightTd.innerText = height/10 + 'm'
    heightRow.appendChild(heightTd);

    const weightRow = document.querySelector('.compare_weight');
    const weightTd = document.createElement('td');
    weightTd.innerText = weight/10 + 'kg'
    weightRow.appendChild(weightTd);
    

    // add base stats value
    const baseStatsTable = document.querySelector('.Base_stats');
    baseStats.forEach((value, index) => {
        const statRow = baseStatsTable.querySelector(`.${Object.keys(value)[0]}`);
        const statTd = document.createElement('td');
        statTd.innerText = Object.values(value)[0];
        statRow.appendChild(statTd);
    });
}



let getPokemons = async (name) => {
    //get Id
    let pokemonId = localStorage.getItem(name); 
    console.log(pokemonId);

    //fetch data
    let pokemonData = await getData(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`)
    console.log(pokemonData);

    // 创建 Pokemon 对象
    let pokemon = new Pokemon(
        pokemonData.name,
        pokemonData.sprites.other.dream_world.front_default,
        pokemonData.types.map(type => type.type.name),
        pokemonData.weight,
        pokemonData.height,
        pokemonData.stats
    );
    console.log(pokemon);

    displayPokemon('.pokemon_wrapper',pokemon)


    // fetch data till table
    let pokemonName = pokemonData.name;
    let height = pokemonData.height;
    let weight = pokemonData.weight;
    let getStatData = (stat)=>{
        let statObj = {};
        statObj[stat.stat.name] = stat.base_stat;
        return statObj;
    }
    let baseStats = pokemonData.stats.map(getStatData);

    addValuesToComparisonTable(pokemonName, height, weight, baseStats);
}


let renderHighestValue = (tag) => {
    const table = document.querySelector(tag);
    const rows = table.getElementsByTagName('tr');
    let leftPoints = 0
    let rightPoints = 0
  
    //go into each value on every row and count point
    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].getElementsByTagName('td');
        
        let cellValueLeft = parseFloat(cells[0].innerText);
        let cellValueRight = parseFloat(cells[1].innerText);

        if (cellValueLeft > cellValueRight) {
            cells[0].classList.add('highlight');
            leftPoints++;
        } else {
            cells[1].classList.add('highlight');
            rightPoints++;
        }
    }
    return {left: leftPoints, right: rightPoints}
}

 


getPokemons('pokemonOne').then(() => {
    getPokemons('pokemonTwo').then(() => {
        const firstTablePoints = renderHighestValue('.specifications')
        const secondTablePoints = renderHighestValue('.Base_stats')        

        const totalPointsLeft = firstTablePoints.left + secondTablePoints.left
        const totalPointsRight = firstTablePoints.right + secondTablePoints.right

        //Get winners name
        const left = document.querySelectorAll('.compare_pokemonName')[0].textContent
        const right = document.querySelectorAll('.compare_pokemonName')[1].textContent

        const winner = totalPointsLeft > totalPointsRight ? left : right
        const messageEl = document.querySelector('.message')
        messageEl.innerHTML=`<span> ${winner} </span> is stronger! Dare to battle?`
    });
});

       
       
