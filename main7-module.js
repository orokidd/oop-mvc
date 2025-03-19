// class Book {
//     constructor(title, author, pages, read) {
//         this.title = title;
//         this.author = author;
//         this.pages = pages;
//         this.read = read;
//         this.id = crypto.randomUUID();
//     }

//     showBookInfo() {
//         return `<h2>${this.title}</h2><p>${this.author}</p> <p>${this.pages} pages</p> 
//                 <p>${this.read ? 'read' : 'not read yet'}</p>`;
//     }

//     changeReadStatus() {
//         this.read = !this.read;
//     }
// }

const makeBook = (() => {
    function Book(title, author, pages, read) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
        this.id = crypto.randomUUID();
    }

    Book.prototype.showBookInfo = function() {
        return `<h2>${this.title}</h2><p>${this.author}</p> <p>${this.pages} pages</p> 
                <p>${this.read ? 'read' : 'not read yet'}</p>`;
    }

    Book.prototype.changeReadStatus = function() {
        this.read = !this.read;
    }

    return { Book };
} )();

const Library = (() => {
    let books = [];

    const addBook = function(title, author, pages, read) {
        const book = new makeBook.Book(title, author, pages, read);
        books.push(book);
        displayBooks();
    }

    const deleteBook = function(book) {
        books = books.filter(b => b.id !== book.id);
        displayBooks();
    }

    const readBook = function(book) {
        book.changeReadStatus();
        displayBooks();
    }

    const displayBooks = function() {
        const bookContainer = document.querySelector('.books-container');
        bookContainer.innerHTML = '';
        books.forEach(book => {
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
            deleteButton.addEventListener('click', () => deleteBook(book));
            readButton.addEventListener('click', () => readBook(book));
        });
    }

    const populateBooks = function() {
        addBook('1984', 'George Orwell', 328, false);
        addBook('The Great Gatsby', 'F. Scott Fitzgerald', 218, true);
        addBook('The Catcher in the Rye', 'J.D. Salinger', 234, false);
    }

    return { addBook, deleteBook, readBook, displayBooks, populateBooks };
})();

const App = (() => {
    const library = Library;

    const init = function() {
        library.populateBooks();
        library.displayBooks();
        displayNewButton();
        handleDialogForm();
    }

    const displayNewButton = function() {
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

    const handleDialogForm = function() {
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
                library.addBook(title, author, pages, read);
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

    return { init, displayNewButton, handleDialogForm };
})();

App.init();