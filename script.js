
// funcion fetch a la API de los personajes
async function getCharacters () {
    try { 
        let response = await fetch ('https://hp-api.onrender.com/api/characters');
        let data = await response.json();
        return data;
    } catch (err) {
        console.log(`ERROR! -> ${error}`)
    }
}

// logica para pintar tarjeta de personaje por buscador
const form = document.querySelector('.character_card');

if(document.querySelector('.character_card')){
  document.querySelector('.character_card').addEventListener('submit', async function (event) {
  event.preventDefault();

  const input = this.querySelector('input[type="text"]');
  const value = input.value;

  try {
    let characters = await getCharacters();
    const findCharacter = characters.find(character => character.name.toLowerCase() === value);

    if (findCharacter) {
      let container = document.getElementById('character_cont');

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
      
      // Limpiar tarjeta cada vez que hace busqueda
      form.addEventListener('click', function() {
          container.innerHTML = "";
          container.appendChild(form);
      });

      // boton para añadir a favoritos
      const addToFavoritesButton = document.createElement('button');
      addToFavoritesButton.textContent = 'Agregar a favoritos';
      if (firebase.auth().currentUser){
        card.appendChild(addToFavoritesButton);
      }
      addToFavoritesButton.addEventListener('click', function() {
          addCharacterToFavorites(findCharacter);
});
      
    } else {
      alert('Personaje no encontrado');
    }
  } catch (error) {
    console.log(`ERROR! -> ${error}`);
  }
});
}

// FIREBASE:

const firebaseConfig = {
  apiKey: "AIzaSyCkEtB9DIiyIALls6s4BqMrq8LArU8ZRfM",
  authDomain: "harry-potter-proyect.firebaseapp.com",
  projectId: "harry-potter-proyect",
  storageBucket: "harry-potter-proyect.appspot.com",
  messagingSenderId: "703481783201",
  appId: "1:703481783201:web:028ddf741e3f92155921e0"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

// Sign in en Authentication y firestore
const signForm = document.getElementById('signForm');

if(document.getElementById('signForm')){
signForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = signForm.querySelector('input[type="text"]').value;
  const password = signForm.querySelector('input[type="password"]').value;

  firebase.auth().createUserWithEmailAndPassword(email, password)
  .then((userCredential) => {
      
      const user = userCredential.user;
      const userId = user.uid; 

  firebase.firestore().collection('usuarios').doc(userId).set(
  {
    email: email,
    characters: []
  })
  .then(() => {
    console.log('Datos guardados en Firestore');
  })
  .catch((error) => {
    console.log('Error al guardar datos en Firestore:', error);
  });
    })
.catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
});
}

let userId = null;

// Log in
const loginForm = document.querySelector('#loginForm');

if(document.querySelector('#loginForm')){
loginForm.addEventListener('submit', function (event) {
  event.preventDefault(); 
 
const email = loginForm.querySelector('#loginEmail').value;
const password = loginForm.querySelector('#loginPass').value;

firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
      const user = userCredential.user;
      userId = user.uid;
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
  });
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    // window.location.href = "main.html"
  } else {
    console.log('Usuario no logueado');
  }
})
};

// Boton de Cerrar Sesion
const logoutButton = document.getElementById('logoutButton');

if(document.getElementById('logoutButton')){
logoutButton.addEventListener('click', function() {
  firebase.auth().signOut()
    .then(() => {
      console.log('Usuario desconectado');
      window.location.href = "index.html";
    })
    .catch((error) => {
      console.log('Error al cerrar sesión:', error);
    });
});
};

// Boton de continuar sin registro/login
const contButton = document.getElementById('continueButton');

if(document.getElementById('continueButton')){
contButton.addEventListener('click', function() {
  window.location.href= "main.html";
});
};

// Google Log In
const provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('profile');
provider.addScope('email');

const googleSignInButton = document.getElementById('googleSignInButton');

if(document.getElementById('googleSignInButton')) {
googleSignInButton.addEventListener('click', function() {
 
  firebase.auth().signInWithPopup(provider)
    .then((result) => {
      window.location.href = "main.html";
      console.log('Inicio de sesión con Google exitoso');
    })
    .catch((error) => {
      console.log('Error en el inicio de sesión con Google:', error);
    });
});
};

// Funcion para añadir a Firestore personajes Favoritos
function addCharacterToFavorites(character) {

  const {name, image, actor, patronus} = character;

  const user = firebase.auth().currentUser;
  
  if (user) {
    const userId = user.uid;

    const userRef = db.collection('usuarios').doc(userId);

    userRef.update({
      characters: firebase.firestore.FieldValue.arrayUnion({name, image, actor, patronus})
    })
    .then(() => {
      console.log('Personaje agregado a favoritos');
    })
    .catch((error) => {
      console.log('Error al agregar personaje a favoritos:', error);
    });
  } else {
    console.log('Usuario no encontrado');
  }
}

// Pintar tarjetas de favoritos
if (document.getElementById('favoritesContainer')) {
const container = document.getElementById('favoritesContainer');

const user = firebase.auth().currentUser;

firebase.auth().onAuthStateChanged(async function(user) {
if (user) {
  const userId = user.uid;

  // referencia al documento del usuario en Firestore
  const userRef = db.collection('usuarios').doc(userId);

  // Consulta el documento del usuario
  userRef.get()
    .then((doc) => {
      if (doc.exists) {
        // Obtiene el array de personajes favoritos del documento
        const favorites = doc.data().characters;

        favorites.forEach((favorite) => {
         
          const card = document.createElement('div');
          card.classList.add('character_card');
 
          const image = document.createElement('img');
          image.src = favorite.image;

          const name = document.createElement('h2');
          name.textContent = favorite.name;

          const actor = document.createElement('h3');
          actor.textContent = favorite.actor;

          const patronus = document.createElement('h4');
          patronus.textContent = favorite.patronus;

          card.appendChild(image);
          card.appendChild(name);
          card.appendChild(actor);
          card.appendChild(patronus);

          container.appendChild(card);
        });
      } else {
        console.log('Documento de usuario no encontrado');
      }
    })
    .catch((error) => {
      console.log('Error al obtener los personajes favoritos:', error);
    });
} else {
  console.log('Usuario no encontrado');
};
});
};

//Leaflet Map
if (window.location.pathname.includes("information.html") && "geolocation" in navigator) {

  navigator.geolocation.getCurrentPosition(position => {
      
      let map = L.map('map').setView([34.048907, -118.227759], 3);
      
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
})      .addTo(map);

      const interestPoints = {
        harryStatue: {
          coord: [51.51083418657746, -0.13033325949331298],
          image: "https://i.insider.com/5f7f3bee282c500018c79618?width=700",
          description: "You can now visit in London the Harry Potter Statue",
          },
        warnerStudioLondon: {
          coord: [51.69035944585027, -0.4179959806349483],
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSmIjxVMQCYJrRALqZyKehwgrHhK8119LyPBQ&usqp=CAU",
          description: "Discover all the tematics of Harry Potter's Saga in this tour located in London",
          },
        platFormNine: {
          coord: [51.5320950588603, -0.12408096540298498],
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyvBahCEabHKQZTgG63qwFOubMXeCLG0Cwiw&usqp=CAU",
          description: "An exciting destination for every Harry Potter fan, the Harry Potter Shop at Platform 9 ¾ is located in London King's Cross Station"
        },
        wizardingWorld: {
          coord: [28.47981435567676, -81.46932057766284],
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAVc6S0KvWo7aaQjKL9RFjaT4YzLY3Epo6pg&usqp=CAU",
          description: "Wizarding World is the new official home of Harry Potter & Fantastic Beasts located in Orlando, USA"
        },
        stealFalls: {
          coord: [56.77052658500331, -4.979620763098782],
          image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRB59HkfWnwFVE2a3Df3KF_UigSyqhlhkgDmA&usqp=CAU",
          description: "This gorgeous waterfall is the second-highest of its kind in Britain, located in Scotland. It was also the location of the Triwizard Tournament where Harry battled the dragon"
        },
      }

      for (const point in interestPoints) {
        const {coord, image, description} = interestPoints[point];
        const marker = L.marker(coord).addTo(map);
        marker.bindPopup(`<b>${point}</b><br><img class="mapImg" src="${image}" alt="${point}"/><br>${description}`).openPopup()
        
      }
});
} else {
console.warn("Tu navegador no soporta Geolocalización!! ");
}