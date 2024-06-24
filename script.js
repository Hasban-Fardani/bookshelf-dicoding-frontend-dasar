const RENDER_EVENT = 'onrender'

const books = [
]

// elements
// const searchBookForm = document.getElementById('searchBook')

const saveBooks = () => {
    localStorage.setItem('books', JSON.stringify(books))
    dispatchEvent(new Event(RENDER_EVENT));
}

const findBookById = (bookID) => {
    return books.filter((book) => book.id == bookID)[0] ?? null;
}

const searchBookByTitle = (bookTitle) => {
    if (bookTitle == '') return;

    const lowercaseBookTitle = bookTitle.toLowerCase();
    for (let i = books.length - 1; i >= 0; i--) {
        if (!books[i].title.toLowerCase().includes(lowercaseBookTitle)) {
            books.splice(i, 1);
        }
    }
    console.log('selesai mencari', bookTitle, books);
}

const createBookObject = (title, author, year, isComplete) => {
    const id = +new Date();
    return  {
        id,
        title,
        author,
        year,
        isComplete
    }
}

const storeBook = (bookObject) => {
    books.push(bookObject)
    saveBooks()
}

const editBook = (bookID, newBookObject) => {
    const selectedBook = findBookById(bookID);
    if (!selectedBook) return;
    
    selectedBook = {...newBookObject}
    saveBooks()
}

const editBookStatus = (bookID, isComplete = true) => {
    const selectedBook = findBookById(bookID);
    if (!selectedBook) return; 

    selectedBook.isComplete = isComplete
    saveBooks()
}

const deleteBook = (bookID) => {
    const bookIndex = books.findIndex(book => book.id == bookID)
    if (bookIndex == -1) return;
    
    document.getElementById("dialog").style.display = "block";  
    document.getElementById('selectedBookDelete').innerText = books[bookIndex].title
    document.getElementById('confirmDelete').onclick = () => deleteItem(bookIndex);
}
  
const closeDialog = () => document.getElementById("dialog").style.display = "none";

function deleteItem(bookIndex) {
    books.splice(bookIndex)
    saveBooks()
    closeDialog();
}

// event ketika web diload
addEventListener('DOMContentLoaded', () => {
    // load books from localstorage if exist
    const bookSaved = JSON.parse(localStorage.getItem('books'));
    if (bookSaved) {
        books.push(...bookSaved)
    }

    // change the text of submit add book if iscomplete checked/unchecked
    const bookIsCompleteInput = document.getElementById('inputBookIsComplete')
    const textConfirm = document.getElementById('textConfirm')
    bookIsCompleteInput.onchange = (ev) => {
        if (ev.target.checked) {
            textConfirm.innerText = 'Sudah selesai dibaca'
        } else {
            textConfirm.innerText = 'Belum selesai dibaca'
        }
    }

    // add book form event submit
    const inputBookForm = document.getElementById('inputBook')
    inputBookForm.onsubmit = (ev) => {
        ev.preventDefault()

        const title = ev.target[0].value
        const author = ev.target[1].value
        const year = ev.target[2].value
        const isComplete = ev.target[3].checked
        const book = createBookObject(title, author, year, isComplete)

        storeBook(book)
        dispatchEvent(new Event(RENDER_EVENT));
    }

    // search book
    const searchBook = document.getElementById('searchBook')
    const searchBookTitle = document.getElementById('searchBookTitle')
    searchBook.onsubmit = (ev) => {
        ev.preventDefault()
        searchBookByTitle(searchBookTitle.value)
        console.log('cari buku', searchBookTitle.value);
        dispatchEvent(new Event(RENDER_EVENT));
    }
    
    dispatchEvent(new Event(RENDER_EVENT));
})

// event render 
addEventListener(RENDER_EVENT, () => {
    const incompleteBooksList = document.getElementById('incompleteBookshelfList')
    const completeBooksList = document.getElementById('completeBookshelfList')

    incompleteBooksList.innerHTML = ''
    completeBooksList.innerHTML = ''
    
    for (let book of books) {
        const container = document.createElement('article')
        container.classList.add('book_item')

        const title = document.createElement('h3')
        title.innerText = book.title

        const author = document.createElement('p')
        author.innerText = book.author

        const year = document.createElement('p')
        year.innerText = 'Tahun: ' + book.year

        const actions = document.createElement('div')
        actions.classList.add('action')
        
        const deleteBookBtn = document.createElement('button')
        deleteBookBtn.classList.add('btn-red')
        deleteBookBtn.innerText = 'Hapus Buku'
        deleteBookBtn.onclick = () => deleteBook(book.id)
        
        if (book.isComplete) {
            const uncompleteBookBtn = document.createElement('button')
            uncompleteBookBtn.classList.add('btn-green')
            uncompleteBookBtn.innerText = 'Belum selesai'
            uncompleteBookBtn.onclick = () => editBookStatus(book.id, false)

            actions.append(uncompleteBookBtn, deleteBookBtn)
            container.append(title, author, year, actions)   
            completeBooksList.appendChild(container)
        } else {
            const completeBookBtn = document.createElement('button')
            completeBookBtn.classList.add('btn-green')
            completeBookBtn.innerText = 'Selesai dibaca'
            completeBookBtn.onclick = () => editBookStatus(book.id)

            actions.append(completeBookBtn, deleteBookBtn)
            container.append(title, author, year, actions)
            incompleteBooksList.appendChild(container)
        }
    }

    if (completeBooksList.innerHTML == '') {
        const noCompleteBook = document.createElement('p')
        noCompleteBook.innerText = 'Tidak ada buku yang selesai dibaca'
        completeBooksList.appendChild(noCompleteBook)
    }

    if (incompleteBooksList.innerHTML == '') {
        const noIncompleteBook = document.createElement('p')
        noIncompleteBook.innerText = 'Tidak ada buku yang belum selesai dibaca'
        incompleteBooksList.appendChild(noIncompleteBook)
    }
})

