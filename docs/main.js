/* src/main.js */

console.log("JavaScript cargado correctamente.");
const apiUrl = 'https://ddragon.leagueoflegends.com/cdn/13.18.1/data/es_ES/champion.json';

let champions = [];

async function fetchChampions() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    champions = Object.values(data.data); // Guardamos los campeones
    displayChampions(champions);
  } catch (error) {
    console.error('Error al obtener los campeones:', error);
  }
}

function displayChampions(champions) {
  const container = document.getElementById('data-container');
  container.innerHTML = ''; 

  champions.forEach(champion => {
    const div = document.createElement('div');
    div.classList.add('champion');

    // Acceder a las estadísticas desde 'info'
    const attack = champion.info.attack || 'N/A';
    const defense = champion.info.defense || 'N/A';
    const magic = champion.info.magic || 'N/A';
    
    // Obtener la descripción
    const description = champion.blurb || 'No hay descripción disponible';

    div.innerHTML = `
      <h3>${champion.name}</h3>
      <img src="https://ddragon.leagueoflegends.com/cdn/13.18.1/img/champion/${champion.id}.png" alt="${champion.name}">
      <p>${champion.title}</p>
      <div class="champion-info">
        <p><strong>Descripción:</strong> ${description}</p>
        <p><strong>Ataque:</strong> ${attack}</p>
        <p><strong>Defensa:</strong> ${defense}</p>
        <p><strong>Magia:</strong> ${magic}</p>
      </div>
    `;

    div.addEventListener('mouseover', () => {
      const infoBox = div.querySelector('.champion-info');
      infoBox.style.display = 'block';  

      // Comprobar si el cuadro se desborda de la pantalla y ajustar la posición
      const rect = div.getBoundingClientRect();
      const infoBoxRect = infoBox.getBoundingClientRect();
      
      // Si el cuadro se está saliendo de la pantalla, ajustarlo hacia la izquierda
      if (rect.right + infoBoxRect.width > window.innerWidth) {
        infoBox.style.left = `-${infoBoxRect.width + 20}px`;  // Ajustar el cuadro a la izquierda
      } else {
        infoBox.style.left = '100%';  // Posicionarlo al lado del campeón
      }
    });

    div.addEventListener('mouseout', () => {
      const infoBox = div.querySelector('.champion-info');
      infoBox.style.display = 'none';  // Ocultar la información extra
      infoBox.style.left = '100%';  // Restablecer la posición original
    });

    container.appendChild(div);
  });
}

function filterChampions(position) {
  const positionMap = {
    "top": ["Fighter", "Tank", "Bruiser"],
    "mid": ["Mage", "Assassin", "Fighter"],
    "bot": ["Marksman"],
    "supp": ["Support"],
    "jungle": ["Fighter", "Assassin"]
  };

  const filteredChampions = champions.filter(champion => {
    return positionMap[position].some(role => champion.tags.includes(role));
  });

  displayChampions(filteredChampions);
}

function showAllChampions() {
  displayChampions(champions);
}

// Función para filtrar campeones por nombre (en tiempo real)
function searchChampions() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase(); // Obtener el texto ingresado
    const filteredChampions = champions.filter(champion => {
      return champion.name.toLowerCase().startsWith(searchTerm);  
    });
  
    displayChampions(filteredChampions);  // Muestra los campeones filtrados
  }
  

function setupFilterButtons() {
  const buttons = document.querySelectorAll('.filter-buttons button');
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const position = button.getAttribute('data-position');
      if (button.id === 'all-button') {
        showAllChampions();
      } else {
        filterChampions(position);
      }
    });
  });

  // Agregar el evento de búsqueda
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value;
    searchChampions(query);  // Filtrar los campeones en tiempo real
  });
}

window.onload = () => {
  fetchChampions();
  setupFilterButtons();
};
