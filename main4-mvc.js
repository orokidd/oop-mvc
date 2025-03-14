// Deepseek refactored code to MVC

// Model
class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.id = crypto.randomUUID();
    }

    changeReadStatus() {
        this.read = !this.read;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(book) {
        this.books.push(book);
    }

    deleteBook(bookId) {
        this.books = this.books.filter(b => b.id !== bookId);
    }

    getBookById(bookId) {
        return this.books.find(b => b.id === bookId);
    }

    getAllBooks() {
        return this.books;
    }
}

// View
class BookView {
    constructor() {
        this.bookContainer = document.querySelector('.books-container');
        this.dialog = document.getElementById('bookDialog');
        this.form = document.getElementById('bookForm');
    }

    renderBooks(books, deleteHandler, readHandler) {
        this.bookContainer.innerHTML = '';
        books.forEach(book => {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            const readButton = document.createElement('button');
            readButton.textContent = 'Read';
            const bookCard = document.createElement('div');
            bookCard.classList.add('book-card');
            bookCard.innerHTML = `
                <h2>${book.title}</h2>
                <p>${book.author}</p>
                <p>${book.pages} pages</p>
                <p>${book.read ? 'read' : 'not read yet'}</p>
            `;

            bookCard.appendChild(deleteButton);
            bookCard.appendChild(readButton);
            this.bookContainer.appendChild(bookCard);

            deleteButton.addEventListener('click', () => deleteHandler(book.id));
            readButton.addEventListener('click', () => readHandler(book.id));
        });
    }

    showDialog() {
        this.dialog.showModal();
    }

    closeDialog() {
        this.dialog.close();
        this.form.reset();
    }

    bindAddBook(handler) {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            const title = this.form.title.value;
            const author = this.form.author.value;
            const pages = parseInt(this.form.pages.value);
            const read = this.form.read.checked;

            if (title && author && pages) {
                handler(title, author, pages, read);
                this.closeDialog();
            } else {
                alert('Invalid input. Please try again.');
            }
        });

        const cancelBtn = document.getElementById('cancelBtn');
        cancelBtn.addEventListener('click', () => this.closeDialog());
    }
}

// Controller
class BookController {
    constructor(library, view) {
        this.library = library;
        this.view = view;

        this.view.bindAddBook(this.handleAddBook.bind(this));
        this.init();
    }

    init() {
        this.populateBooks();
        this.displayBooks();
        this.displayNewButton();
    }

    populateBooks() {
        this.library.addBook(new Book('1984', 'George Orwell', 328, false));
        this.library.addBook(new Book('The Great Gatsby', 'F. Scott Fitzgerald', 218, true));
        this.library.addBook(new Book('The Catcher in the Rye', 'J.D. Salinger', 234, false));
    }

    displayBooks() {
        const books = this.library.getAllBooks();
        this.view.renderBooks(books, this.handleDeleteBook.bind(this), this.handleReadBook.bind(this));
    }

    displayNewButton() {
        const newButton = document.createElement('button');
        newButton.classList.add('new-button');
        newButton.textContent = 'New book';
        newButton.addEventListener('click', () => this.view.showDialog());
        document.querySelector('.button-container').appendChild(newButton);
    }

    handleAddBook(title, author, pages, read) {
        const book = new Book(title, author, pages, read);
        this.library.addBook(book);
        this.displayBooks();
    }

    handleDeleteBook(bookId) {
        this.library.deleteBook(bookId);
        this.displayBooks();
    }

    handleReadBook(bookId) {
        const book = this.library.getBookById(bookId);
        if (book) {
            book.changeReadStatus();
            this.displayBooks();
        }
    }
}

// App Initialization
const library = new Library();
const view = new BookView();
const controller = new BookController(library, view);