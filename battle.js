class Pokemon {
    constructor(_name, _image, _ph, _atk, _def, _satk, _sdef, _speed, _moves) {
        this.name = _name;
        this.image = _image;
        this.ph = _ph;
        this.atk = _atk;
        this.def = _def;
        this.satk = _satk;
        this.sdef = _sdef;
        this.speed = _speed;
        this.moves = _moves;
    }

    async battle(opponent){
        let winnerImg = document.querySelector('#winnerImg');
        let battle_log = document.querySelector('#battle_log');
        let whoIsWinner = document.querySelector('#whoIsWinner');

        battle_log.innerText = `${this.name} vs ${opponent.name}!`;

        if (this.speed >= opponent.speed){
            while (this.ph > 0 && opponent.ph > 0 ) {
               await this.attack(opponent,battle_log);
               await opponent.attack(this,battle_log);
            } 

            if (this.ph <= 0){
                winnerImg.src = opponent.image
                whoIsWinner.textContent = `${opponent.name} wins!`
            } else {
                winnerImg.src = this.image
                whoIsWinner.textContent = `${this.name} wins!`
            }

        } else if (opponent.speed > this.speed){
            while (this.ph > 0 && opponent.ph > 0 ) {
                await opponent.attack(this,battle_log);
                await this.attack(opponent,battle_log);
            } 

            if (this.ph <= 0){
                winnerImg.src = opponent.image
                whoIsWinner.textContent = `${opponent.name} wins!`
            } else {
                winnerImg.src = this.image
                whoIsWinner.textContent = `${this.name} wins!`
            }
        }
    }
   async attack (opponent, battle_log){
        for (let i = 0; i <this.moves.length; i++ ){
            let damage = Math.max(10,(this.atk + this.satk) - (opponent.def + opponent.sdef) * 0.8)
            opponent.ph = Math.max(0, opponent.ph -damage);

            let p = document.createElement('p');
            p.innerHTML = `<br/>${this.name} used ${this.moves[i].name} and did ${damage} damage. ${opponent.name} remaining HP: ${opponent.ph}`;
            battle_log.appendChild(p);
        }
    }

}

let getData = async (url) => {
    let response = await fetch(url);
    let data = await response.json();
    return data;
}

let getPokemons = async (name, opponentName) => {
        let pokemonId = localStorage.getItem(name); 
        let opponentId = localStorage.getItem(opponentName);
    
        let pokemonData = await getData(`https://pokeapi.co/api/v2/pokemon/${pokemonId}/`);
        let opponentData = await getData(`https://pokeapi.co/api/v2/pokemon/${opponentId}/`);
    
        let moves = pokemonData.moves.map(move => {
            return {
                name: move.move.name,
            };
        });
    
        let opponentMoves = opponentData.moves.map(move => {
            return {
                name: move.move.name,
            };
        });
    
    
        let pokemon = new Pokemon(
            pokemonData.name,
            pokemonData.sprites.other.dream_world.front_default,
            pokemonData.stats[0].base_stat,
            pokemonData.stats[1].base_stat,
            pokemonData.stats[2].base_stat,
            pokemonData.stats[3].base_stat,
            pokemonData.stats[4].base_stat,
            pokemonData.stats[5].base_stat,
            moves
        );
        
    console.log(pokemon);
        let opponent = new Pokemon(
            opponentData.name,
            opponentData.sprites.other.dream_world.front_default,
            opponentData.stats[0].base_stat,
            opponentData.stats[1].base_stat,
            opponentData.stats[2].base_stat,
            opponentData.stats[3].base_stat,
            opponentData.stats[4].base_stat,
            opponentData.stats[5].base_stat,
            opponentMoves
        );

    console.log(opponent);
    
    pokemon.battle(opponent);
}

getPokemons('pokemonOne', 'pokemonTwo');
