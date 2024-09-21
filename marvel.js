document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.search-button').addEventListener('click', () => {
        const characterName = document.getElementById('character-input').value;
        console.log('Character name:', characterName);
        if (characterName) {
            fetchCharacter(characterName);
        } else {
            alert('Por favor ingresa el nombre de un personaje.');
        }
    });

    function fetchCharacter(name) {
        const publicKey = '4054add0ee5b04bf709046c26cc850b6';
        const privateKey = '2e52394f7bfaa8dae6757b9c463d2bbab8ac3010';
        const ts = new Date().getTime();
        const hash = CryptoJS.MD5(ts + privateKey + publicKey).toString();
        const baseUrl = 'https://gateway.marvel.com/v1/public/characters';
        const url = `${baseUrl}?nameStartsWith=${name}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
        
        console.log('Fetching character with URL:', url);

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Data received:', JSON.stringify(data, null, 2));
                if (data.data && data.data.results && data.data.results.length > 0) {
                    displayCharacters(data.data.results);
                } else {
                    console.error('No se encontraron resultados.');
                    alert('No se encontraron personajes con ese nombre.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ocurrió un error al obtener los personajes. Verifica los detalles en la consola.');
            });
    }

    function displayCharacters(characters) {
        const characterList = document.getElementById('character-list');
        characterList.innerHTML = ''; // Limpiar la lista

        console.log('Characters to display:', characters);

        characters.forEach(character => {
            const characterDiv = document.createElement('div');
            characterDiv.classList.add('character');

            characterDiv.innerHTML = `
                <img src="${character.thumbnail.path}.${character.thumbnail.extension}" alt="${character.name}">
                <h2>${character.name}</h2>
                <p>${character.description || 'No description available.'}</p>
            `;

            characterList.appendChild(characterDiv);
        });
    }
});
