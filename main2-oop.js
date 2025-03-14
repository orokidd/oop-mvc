// Deepseek refactored code to OOP

class Book {
    constructor(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.id = crypto.randomUUID();
    }

    showBookInfo() {
        return `<h2>${this.title}</h2><p>${this.author}</p> <p>${this.pages} pages</p> 
                <p>${this.read ? 'read' : 'not read yet'}</p>`;
    }

    changeReadStatus() {
        this.read = !this.read;
    }
}

class Library {
    constructor() {
        this.books = [];
    }

    addBook(title, author, pages, read) {
        const book = new Book(title, author, pages, read);
        this.books.push(book);
        this.displayBooks();
    }

    deleteBook(book) {
        this.books = this.books.filter(b => b.id !== book.id);
        this.displayBooks();
    }

    readBook(book) {
        book.changeReadStatus();
        this.displayBooks();
    }

    displayBooks() {
        const bookContainer = document.querySelector('.books-container');
        bookContainer.innerHTML = '';
        this.books.forEach(book => {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            const readButton = document.createElement('button');
            readButton.textContent = 'Read';
            const bookCard = document.createElement('div');
            bookCard.classList.add('book-card');
            bookCard.innerHTML = `
                ${book.showBookInfo()}
            `;

            bookCard.appendChild(deleteButton);
            bookCard.appendChild(readButton);
            bookContainer.appendChild(bookCard);
            deleteButton.addEventListener('click', () => this.deleteBook(book));
            readButton.addEventListener('click', () => this.readBook(book));
        });
    }

    populateBooks() {
        this.addBook('1984', 'George Orwell', 328, false);
        this.addBook('The Great Gatsby', 'F. Scott Fitzgerald', 218, true);
        this.addBook('The Catcher in the Rye', 'J.D. Salinger', 234, false);
    }
}

class App {
    constructor() {
        this.library = new Library();
    }

    init() {
        this.library.populateBooks();
        this.library.displayBooks();
        this.displayNewButton();
        this.handleDialogForm();
    }

    displayNewButton() {
        const bookContainer = document.querySelector('.button-container');
        const newButton = document.createElement('button');
        newButton.classList.add('new-button');
        newButton.textContent = 'New book';
        newButton.addEventListener('click', () => {
            const dialog = document.getElementById('bookDialog');
            dialog.showModal();
        });
        bookContainer.appendChild(newButton);
    }

    handleDialogForm() {
        const dialog = document.getElementById('bookDialog');
        const form = document.getElementById('bookForm');

        form.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent form submission

            // Get form values
            const title = form.title.value;
            const author = form.author.value;
            const pages = parseInt(form.pages.value);
            const read = form.read.checked;

            if (title && author && pages) {
                this.library.addBook(title, author, pages, read);
                dialog.close(); 
                form.reset(); 
            } else {
                alert('Invalid input. Please try again.');
            }
        });

        // Handle cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        cancelBtn.addEventListener('click', () => {
            dialog.close(); 
            form.reset();
        });
    }
}

const app = new App();
app.init();