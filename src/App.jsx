import React, { useState, useEffect } from "react";
import "./App.css";

function PokemonDetails({ pokemon, onChooseAnother }) {
  return (
    <div className="flex flex-col items-center">
      <img src={pokemon.image} alt={pokemon.name} className="mb-4" />
      <div className="text-center">
        <div>Name: {pokemon.name}</div>
        <div>Attack: {pokemon.attack}</div>
        <div>HP: {pokemon.hp}</div>
        <div>Types: {pokemon.types.join(", ")}</div>
        <div>ID: {pokemon.id}</div>
      </div>
      <button
        onClick={onChooseAnother}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Elegir otro Pokémon
      </button>
    </div>
  );
}

function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState(null);

  useEffect(() => {
    fetchPokemonData();
  }, [offset]);

  const fetchPokemonData = () => {
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=50&offset=${offset}`)
      .then((response) => response.json())
      .then((data) => {
        const pokemonData = data.results.map(async (pokemon) => {
          const response = await fetch(pokemon.url);
          const pokemonDetails = await response.json();
          return {
            name: pokemonDetails.name,
            id: pokemonDetails.id,
            attack: pokemonDetails.stats[1].base_stat,
            hp: pokemonDetails.stats[0].base_stat,
            image: pokemonDetails.sprites.front_default,
            types: pokemonDetails.types.map((type) => type.type.name),
          };
        });
        Promise.all(pokemonData).then((pokemonWithDetails) =>
          setPokemonList((prevList) => [...prevList, ...pokemonWithDetails])
        );
      });
  };

  const handleLoadMore = () => {
    setOffset((prevOffset) => prevOffset + 50);
  };

  const handlePokemonClick = (pokemon) => {
    setSelectedPokemon(pokemon);
  };

  const handleChooseAnother = () => {
    setSelectedPokemon(null);
  };

  return (
    <>
      <img
        src="log.png"
        alt=""
        className="mx-auto mb-2"
        style={{ maxWidth: "200px" }}
      />
      <div className="container mx-auto mt-8">
        {selectedPokemon ? (
          <PokemonDetails
            pokemon={selectedPokemon}
            onChooseAnother={handleChooseAnother}
          />
        ) : (
          <div className="grid grid-cols-6 gap-4">
            {pokemonList.map((pokemon) => (
              <div
                key={pokemon.name}
                className="p-2 bg-gray-200 shadow-md rounded-lg card hover:shadow-lg"
                onClick={() => handlePokemonClick(pokemon)}
              >
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className="mx-auto mb-2"
                />
                <div className="text-center">{pokemon.name}</div>
                <div>Attack: {pokemon.attack}</div>
                <div>HP: {pokemon.hp}</div>
                <div>Types: {pokemon.types.join(", ")}</div>
                <div>ID: {pokemon.id}</div>
              </div>
            ))}
          </div>
        )}
        {!selectedPokemon && (
          <div className="text-center mt-4">
            <button
              onClick={handleLoadMore}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Cargar más pokemones
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
