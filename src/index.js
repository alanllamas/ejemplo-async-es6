import './index.scss';
let characters;

const root = document.getElementById('root');
root.addEventListener('click', getClick);

const path = 'https://rickandmortyapi.com/api/character/';

function changeContent(data) {
    root.innerHTML = data;
}
function addContent(data) {
    root.innerHTML += data;
}
function clearContent() {
    root.innerHTML = '';
}

function getClick(event) {
    let card = event.path.filter(e => e.className == 'card');

    if (!!card[0]) {
        let character = characters.results.filter(
            character => character.id == card[0].id,
        );

        generateDetail(character[0]);
    }
    if (event.target.id == 'back') {
        clearContent();
        generateCards(characters);
    }
    if (event.target.id == 'prev' && !!characters.info.prev) {
        clearContent();
        getCharacters(characters.info.prev);
    }
    if (event.target.id == 'next' && !!characters.info.next) {
        clearContent();
        getCharacters(characters.info.next);
    }
    if (event.target.id.includes('?page=')) {
        clearContent();
        getCharacters(path.concat(event.target.id));
    }
}

async function getCharacters(path) {
    let rawCharacters = await fetch(path);
    characters = await rawCharacters.json();
    generateCards(characters);
}

function generateCards(data) {
    data.results.map(d => {
        const { image, name, gender, status, id } = d;
        let card = `<div class="card" id="${id}">
                        <img src="${image}" alt="" class="card-img">
                        <div class="data-container">
                            <h1  class="name">${name}</h1>
                            <p>Genero: ${gender}</p>
                            <p>Status: ${status}</p>
                        </div>
                    </div>`;
        addContent(card);
    });
    generatePagination(data);
}

function generateDetail(data) {
    const {
        image,
        name,
        gender,
        status,
        origin,
        location,
        species,
        type,
    } = data;

    let card = `<div class="detail">
                    <div >
                        <img src="${image}" alt="" class="card-img">
                        <h1 class="name">${name}</h1>
                        <p>Genero: ${gender}</p>
                        <p>Status: ${status}</p>
                        <p>Origen: ${origin.name}</p>
                        <p>Ubicación: ${location.name}</p>
                        <p>Especie: ${species}</p>
                        <p>Tipo: ${type}</p>
                        <button id="back"> < Regresar</button>
                    </div>
                </div>
                `;
    changeContent(card);
}

function generatePagination(data) {
    let currentPath = data.info.prev;
    let numbers = '';
    let prev = `<button id="prev">Previous</button>`;
    let next = `<button id="next">Next</button>`;

    let current = !!currentPath
        ? currentPath.indexOf('=') !== -1
            ? Number(
                  currentPath.slice(
                      currentPath.indexOf('=') + 1,
                      currentPath.length,
                  ),
              ) + 1
            : null
        : 1;

    for (let index = 1; index <= data.info.pages; index++) {
        numbers +=
            index === current
                ? `<span class="number current" id="?page=${index}">${index}</span>`
                : `<span class="number" id="?page=${index}">${index}</span>`;
    }

    addContent(
        `<div id="pagination"> ${prev} <div id="numbers">${numbers}</div> ${next} </div>`,
    );
}

getCharacters(path);
