// https://developers.google.com/books/docs/v1/using -> documentacion
// API KEY AIzaSyD2huoVEXt0WEcdZkcUOU2ExDjVoxx2xE4

/* The Google books api does not have an end point for returning Categories that are not associated with a book itself.
The Google Books api is only there to list books. You can
search and browse through the list of books that match a given query.
view information about a book, including metadata, availability and price, links to the preview page.
manage your own bookshelves. */

const apiKey = 'AIzaSyD2huoVEXt0WEcdZkcUOU2ExDjVoxx2xE4';
const API = `https://www.googleapis.com/books/v1/volumes?q=`;

var favorites = [];
var booksApi = [];
var bookApi = {};

async function getBooks(query) {
    try {
        const response = await fetch(`${API}${query}&key=${apiKey}`);
        const data = await response.json();
        console.log(response);
        return data.items;
    } catch (error) {
        console.error('No fue posible conectarse a la API ' + error);
        const showError = document.getElementById('apiError');
        showError.classList.remove('d-none');
        showError.innerHTML = '<h5>Hubo un Error al conectar con Google Books. Por favor, intente nuevamente más tarde.</h5>'
    }
}

// async function callAllBooks() {
//     document.querySelector('.cards').innerHTML = '';
//     const defaultBooks = localStorage.getItem('booksApi');
//     if (defaultBooks) {
//         booksApi = JSON.parse(defaultBooks);
//         console.log('Estoy usando los libros del localstorage:', booksApi);
//     } else {
//         await getBooks('young+adult+romance+fiction&subject:literary&orderBy=relevance&maxResults=12')
//             .then(books => {
//                 booksApi = books;
//                 localStorage.setItem('booksApi', JSON.stringify(booksApi));
//                 console.log('Libros guardados en localStorage:', booksApi);
//             })
//             .catch(error => {
//                 console.log(error);
//             });
//     }
// async function callAllBooks() {
//     document.querySelector('.cards').innerHTML = '';
//     const defaultBooks = localStorage.getItem('booksApi');
    
//     if (defaultBooks) {
//         try {
//             // Ensure the value is defined and valid before parsing
//             booksApi = JSON.parse(defaultBooks);
//             if (!Array.isArray(booksApi)) {
//                 throw new Error("Los datos no son un array válido.");
//             }
//             console.log('Estoy usando los libros del localStorage:', booksApi);
//         } catch (error) {
//             console.error('Error al parsear los libros del localStorage:', error);
//             // Reset the booksApi if parsing fails
//             booksApi = [];
//             localStorage.removeItem('booksApi'); // Remove the corrupted data
//         }
//     } else {
//         try {
//             const books = await getBooks('young+adult+romance+fiction&subject:literary&orderBy=relevance&maxResults=12');
//             if (books) {
//                 booksApi = books;
//                 localStorage.setItem('booksApi', JSON.stringify(booksApi));
//                 console.log('Libros guardados en localStorage:', booksApi);
//             } else {
//                 console.error('La API no devolvió libros válidos.');
//             }
//         } catch (error) {
//             console.log('Error al obtener los libros de la API:', error);
//         }
//     }

async function callAllBooks() {
    document.querySelector('.cards').innerHTML = '';
    const defaultBooks = localStorage.getItem('booksApi');
    if (defaultBooks) {
        booksApi = JSON.parse(defaultBooks);
        if (Array.isArray(booksApi)) {
            console.log('Estoy usando los libros del localstorage:', booksApi);
        } else {
            console.error('Ocurrió un error con los libros guardados en localstorage');
            booksApi = [];
            localStorage.removeItem('booksApi');
        }
    } else {
        const books = await getBooks('young+adult+romance+fiction&subject:literary&orderBy=relevance&maxResults=12');
        if (books) {
            booksApi = books;
            localStorage.setItem('booksApi', JSON.stringify(booksApi));
            console.log('Libros guardados en localstorage:', booksApi);
        } else {
            console.error('Ocurrió un error al traer los libros');
        }
    }

    booksApi.forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.className = 'card col-lg-4 col-md-6 col-sm-12 p-2';
        bookElement.innerHTML = `
            <img src="${book.volumeInfo.imageLinks.thumbnail}" class="card-img-top imagenCard" alt="${book.volumeInfo.title}">
            <div class="card-body">
                <h5 class="card-title"> ${book.volumeInfo.title} </h5>
                <p class="card-text"> ${book.volumeInfo.authors} </p>
                <button class="btn-custom"> Ver Detalle </button>
            </div>
        `;
        bookElement.querySelector('button').addEventListener('click', () => {
            showDetail(book);
        });
        document.querySelector('#showBooks').appendChild(bookElement);
    });
    console.log('Mostrando en pantalla');
}

const showDetail = (book) => {
    const bookElement = document.querySelector('#detailModal');

    const description = book.volumeInfo.description;
    const maxLength = 200;

    const shortDescription = description.length > maxLength ? description.slice(0, maxLength) + '...' : description;

    const bookId = book.id;

    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    bookApi = book;

    bookElement.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fs-5" id="detailModalLabel">${book.volumeInfo.title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body py-2">
                    <div class="mb-2 d-flex justify-content-center">
                        <img class="card-img-top w-50" src="${book.volumeInfo.imageLinks.smallThumbnail}" alt="${book.volumeInfo.title}">
                    </div>
                    <p><b>Autor:</b> ${book.volumeInfo.authors}</p>
                    <p><b>Cantidad de páginas:</b> ${book.volumeInfo.pageCount}</p>
                    <p><b>Editorial:</b> ${book.volumeInfo.publisher}</p>
                    <p><b>Fecha de publicación:</b> ${book.volumeInfo.publishedDate}</p>
                    <p><b>Sinopsis:</b> 
                        <span id="shortDescription">${shortDescription}</span>
                        <a href="#" id="readMore">Ver más</a>
                    </p>
                    <div class="btn-modal">
                        <a href="${book.volumeInfo.infoLink}" target="_blank">Adquirir Libro</a>
                        <a href="${book.volumeInfo.previewLink}" target="_blank">Ver vista previa</a>
                    </div>
                </div>

                <div class="modal-footer">
                    <div class="container">
                        <div id="successAlert" class="alert alert-success d-none" role="alert">
                            Libro agregado a Favoritos
                        </div>
                    </div>

                    <div class="container">
                        <div id="alreadyExistsAlert" class="alert alert-danger d-none" role="alert">
                            El libro ya está en Favoritos
                        </div>
                    </div>

                    <button type="button" class="btn-modal-footer" data-bs-dismiss="modal">Cerrar</button>

                    <button type="button" onclick="addFavorite()" class="btn-modal-footer" id="#favoriteButton">Agregar a Favoritos</button>
                </div>
            </div>
        </div>
    `

    const readMore = bookElement.querySelector('#readMore');
    const descriptionElement = bookElement.querySelector('#shortDescription');

    let expanded = false;

    readMore.addEventListener('click', (event) => {
        event.preventDefault();

        if (expanded) {
            descriptionElement.textContent = shortDescription;
            readMore.textContent = 'Ver más';
        } else {
            descriptionElement.textContent = description;
            readMore.textContent = 'Ver menos';
        }
        expanded = !expanded;
    });

    const myModal = new bootstrap.Modal('#detailModal', {});
    myModal.show();
}

function showSuccessAlert() {
    const successAlert = document.querySelector('#successAlert');
    successAlert.classList.remove('d-none');

    setTimeout(() => {
        successAlert.classList.add('d-none');
    }, 2000);
}

function showAlreadyExistsAlert() {
    const alreadyExistsAlert = document.querySelector('#alreadyExistsAlert');
    alreadyExistsAlert.classList.remove('d-none');

    setTimeout(() => {
        alreadyExistsAlert.classList.add('d-none');
    }, 2000);
}

function addFavorite() {
    favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (!bookApi || !bookApi.volumeInfo) {
        console.error('El libro a agregar no tiene una estructura válida:', bookApi);
        return;
    }

    if (favorites.length === 0) {
        favorites.push(bookApi);
        localStorage.setItem('favorites', JSON.stringify(favorites));
        console.log(JSON.parse(localStorage.getItem('favorites')));
        showSuccessAlert();
    } else {
        let ids = favorites.map((book) => book.id);
        if (!ids.includes(bookApi.id)) {
            favorites.push(bookApi);
            localStorage.setItem('favorites', JSON.stringify(favorites));
            showSuccessAlert();
        } else {
            showAlreadyExistsAlert();
        }
    }
}

function removeFavorite(id) {
    favorites = JSON.parse(localStorage.getItem('favorites'));

    favorites = favorites.filter(function (book) {
        return book.id != id;
    })

    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
}

function deleteAllFavorites() {
    favorites = JSON.parse(localStorage.getItem('favorites'));
    favorites = [];
    localStorage.setItem('favorites', JSON.stringify(favorites));
    showFavorites();
}

const showDetailFavorites = (book) => {
    const bookElement = document.querySelector('#detailModal');

    const description = book.volumeInfo.description;
    const maxLength = 200;

    const shortDescription = description.length > maxLength ? description.slice(0, maxLength) + '...' : description;

    bookApi = book;

    bookElement.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title fs-5" id="detailModalLabel">${book.volumeInfo.title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body py-2">
                    <div class="mb-2 d-flex justify-content-center">
                        <img class="card-img-top w-50" src="${book.volumeInfo.imageLinks.smallThumbnail}" alt="${book.volumeInfo.title}">
                    </div>
                    <p><b>Autor:</b> ${book.volumeInfo.authors}</p>
                    <p><b>Cantidad de páginas:</b> ${book.volumeInfo.pageCount}</p>
                    <p><b>Editorial:</b> ${book.volumeInfo.publisher}</p>
                    <p><b>Fecha de publicación:</b> ${book.volumeInfo.publishedDate}</p>
                    <p><b>Sinopsis:</b> 
                        <span id="shortDescription">${shortDescription}</span>
                        <a href="#" id="readMore">Ver más</a>
                    </p>
                    <div class="btn-modal">
                        <a href="${book.volumeInfo.infoLink}" target="_blank">Adquirir Libro</a>
                        <a href="${book.volumeInfo.previewLink}" target="_blank">Ver vista previa</a>
                    </div>
                </div>

                <div class="modal-footer">
                    <button type="button" class="btn-modal-footer" data-bs-dismiss="modal">Cerrar</button>
                    <button type="button" onclick="removeFavorite('${book.id}')" class="btn-modal-footer" id="#favoriteButton">Quitar de Favoritos</button>
                </div>

            </div>
        </div>
    `

    const readMore = bookElement.querySelector('#readMore');
    const descriptionElement = bookElement.querySelector('#shortDescription');

    let expanded = false;

    readMore.addEventListener('click', (event) => {
        event.preventDefault();

        if (expanded) {
            descriptionElement.textContent = shortDescription;
            readMore.textContent = 'Ver más';
        } else {
            descriptionElement.textContent = description;
            readMore.textContent = 'Ver menos';
        }
        expanded = !expanded;
    });

    const myModal = new bootstrap.Modal('#detailModal', {});
    myModal.show();
}

function showFavorites() {
    favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    console.log(favorites);

    if (favorites.length === 0) {
        document.querySelector('#nothingFound').classList.remove('d-none');
        document.querySelector('#showBooks').innerHTML = '';
    } else {
        document.querySelector('#nothingFound').classList.add('d-none');
        document.querySelector('#showBooks').innerHTML = '';
        favorites.forEach(book => {
            const bookElement = document.createElement('div');
            bookElement.className = 'card col-lg-4 col-md-6 col-sm-12 p-2 mb-3';
            bookElement.innerHTML = `
                <img src="${book.volumeInfo.imageLinks.thumbnail}" class="card-img-top imagenCard" alt="${book.volumeInfo.title}">
                <div class="card-body">
                    <h5 class="card-title"> ${book.volumeInfo.title} </h5>
                    <p class="card-text"> ${book.volumeInfo.authors} </p>
                    <button class="btn-custom"> Ver Detalle </button>
                </div>
            `;
            bookElement.querySelector('button').addEventListener('click', () => {
                showDetailFavorites(book)
            });
            document.querySelector('#showBooks').appendChild(bookElement);
        });
    }
}

function search() {
    document.querySelector('.cards').innerHTML = '';
    console.log(document.querySelector('#search').value)
    getBooks(document.querySelector('#search').value)
        .then(books => {
            if (!books || books.length === 0) {
                document.querySelector('#nothingFound').classList.remove('d-none');
                return;
            } else {
                document.querySelector('#nothingFound').classList.add('d-none');
            }
            books.forEach(book => {
                let thumbnail = 'https://via.placeholder.com/223x310.png?text=No+image';
                if (book.volumeInfo.imageLinks && book.volumeInfo.imageLinks.thumbnail) {
                    thumbnail = book.volumeInfo.imageLinks.thumbnail;
                }
                const bookElement = document.createElement('div');
                bookElement.className = 'card col-lg-4 col-md-6 col-sm-12 p-2 mb-3';
                bookElement.innerHTML = `
                <img src="${thumbnail}" class="card-img-top imagenCard" alt="${book.volumeInfo.title}">
                <div class="card-body">
                    <h5 class="card-title"> ${book.volumeInfo.title} </h5>
                    <p class="card-text"> ${book.volumeInfo.authors} </p>
                    <button class="btn-custom"> Ver Detalle </button>
                </div>
            `
                bookElement.querySelector('button').addEventListener('click', () => {
                    showDetail(book)
                })
                document.querySelector('#showBooks').appendChild(bookElement);
            })
        })
        .catch(error => console.error(error))
        .finally(() => console.info('Corrio bien'));
}


window.addEventListener('load', () => {
    const route = window.location.pathname;
    console.log(route);
    if (route.includes('index.html')) {
        callAllBooks();
    } else if (route.includes('favorites.html')) {
        showFavorites();
        console.log('favoritos')
    }
});