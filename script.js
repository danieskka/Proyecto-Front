
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

// Guardar registro de registro (firestore) y auth(authentication)
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

  firebase.firestore().collection('usuarios').doc(userId).set({
  email: email
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
const loginForm = document.querySelector('#loginForm');

if(document.querySelector('#loginForm')){
loginForm.addEventListener('submit', function (event) {
  event.preventDefault(); 
 
const email = loginForm.querySelector('#loginEmail').value;
const password = loginForm.querySelector('#loginPass').value;

firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
      const user = userCredential.user;
  })
  .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
  });
});

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    window.location.href = "main.html"
    console.log('Usuario logueado:', user.email);
  } else {
    console.log('Usuario no logueado');
  }
})
};

const logoutButton = document.getElementById('logoutButton');

if(document.getElementById('logoutButton')){
logoutButton.addEventListener('click', function() {
  firebase.auth().signOut()
    .then(() => {
      console.log('Usuario desconectado');
      window.location.href = "index.html"; // Redirige al usuario a la página de inicio de sesión
    })
    .catch((error) => {
      console.log('Error al cerrar sesión:', error);
    });
});
};
const contButton = document.getElementById('continueButton');

if(document.getElementById('continueButton')){
contButton.addEventListener('click', function() {
  window.location.href= "main.html";
});
};

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