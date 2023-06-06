async function getCharacters () {
    try { 
        let response = await fetch ('https://hp-api.onrender.com/api/characters');
        let data = await response.json();
        return data;
    } catch (err) {
        console.log(`ERROR! -> ${error}`)
    }
}

document.querySelector(".character_card").addEventListener('submit', async function (event) {
  event.preventDefault();

  const input = this.querySelector('input[type="text"]');
  const value = input.value;

  try {
    let characters = await getCharacters();
    const findCharacter = characters.find(character => character.name.toLowerCase() === value);

    if (findCharacter) {
      let container = document.getElementById('character_cont');
      container.innerHTML = '';

      const card = document.createElement('div');
      card.classList.add("character_card");

      const image = document.createElement('img');
      const name = document.createElement('h2');
      const species = document.createElement('p');
      const ancestry = document.createElement('p');
      const house = document.createElement('p');

      image.src = findCharacter.image;
      name.textContent = findCharacter.name;
      species.textContent = `Species: ${findCharacter.species}`;
      ancestry.textContent = `Ancestry: ${findCharacter.ancestry}`;
      house.textContent = `House: ${findCharacter.house}`;

      card.appendChild(image);
      card.appendChild(name);
      card.appendChild(species);
      card.appendChild(ancestry);
      card.appendChild(house);

      container.appendChild(card);

      const searchAgainButton = document.createElement('button');
      searchAgainButton.textContent = 'Buscar de nuevo';
      searchAgainButton.addEventListener('click', function() {
          container.innerHTML = "";
          container.appendChild(form);
      });

      container.appendChild(searchAgainButton);
    } else {
      alert('Personaje no encontrado');
    }
  } catch (error) {
    console.log(`ERROR! -> ${error}`);
  }
});

const form = document.querySelector('.character_card');
const container = document.getElementById('character_cont');

// getCharacters().then(data => {
//     const container = document.getElementById('character_cont');
//     let count = 0; // Variable de control para contar las tarjetas creadas
  
//     data.forEach(character => {
//       if (count >= 1) {
//         return; // Salir del bucle si se alcanza el límite de 3 tarjetas
//       }
  
//       // Crear elementos HTML para cada tarjeta
//       const card = document.createElement('div')
//       card.classList.add("character_card");
      
//       const image = document.createElement('img');
//       const name = document.createElement('h2');
//       const species = document.createElement('p');
//       const ancestry = document.createElement('p');
//       const house = document.createElement('p');
  
//       // Establecer atributos y contenido para cada tarjeta
//       image.src = character.image;
//       name.textContent = character.name;
//       species.textContent = `Species: ${character.species}`;
//       ancestry.textContent = `Ancestry: ${character.ancestry}`;
//       house.textContent = `House: ${character.house}`;
  
//       // Agregar elementos a cada tarjeta
//       card.appendChild(image);
//       card.appendChild(name);
//       card.appendChild(species);
//       card.appendChild(ancestry);
//       card.appendChild(house);
  
//       // Agregar cada tarjeta al contenedor en el DOM
//       container.appendChild(card);
  
//       count++; // Incrementar la variable de control de tarjetas creadas
//     });
//   });
  