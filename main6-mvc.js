// This is not the right way of doing MVC because the view and controller is still connected
// but it demonstrate how the code look if .bind(this) wasn't used

// Model
class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID();
  }

  toggleReadStatus() {
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
    this.books = this.books.filter((book) => book.id !== bookId);
  }

  getBooks() {
    return this.books;
  }
}

// View
class LibraryView {
  constructor() {
    this.bookContainer = document.querySelector(".books-container");
    this.buttonContainer = document.querySelector(".button-container");
    this.dialog = document.getElementById("bookDialog");
    this.form = document.getElementById("bookForm");
    this.cancelBtn = document.getElementById("cancelBtn");
  }

  renderBooks(books) {
    this.bookContainer.innerHTML = "";
    books.forEach((book) => {
      const bookCard = document.createElement("div");
      bookCard.classList.add("book-card");
      bookCard.innerHTML = `
                <h2>${book.title}</h2>
                <p>${book.author}</p>
                <p>${book.pages} pages</p>
                <p>${book.read ? "Read" : "Not read yet"}</p>
            `;

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => controller.handleDelete(book.id));

      const readButton = document.createElement("button");
      readButton.textContent = "Toggle Read";
      readButton.addEventListener("click", () => controller.handleToggleRead(book.id));

      bookCard.appendChild(deleteButton);
      bookCard.appendChild(readButton);
      this.bookContainer.appendChild(bookCard);
    });
  }

  displayNewButton() {
    const newButton = document.createElement("button");
    newButton.classList.add("new-button");
    newButton.textContent = "New book";
    newButton.addEventListener("click", ()=> this.dialog.showModal());
    this.buttonContainer.appendChild(newButton);
  }

  handleDialogForm() {
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      const title = this.form.title.value;
      const author = this.form.author.value;
      const pages = parseInt(this.form.pages.value);
      const read = this.form.read.checked;

      if (title && author && pages) {
        controller.addBook(title, author, pages, read);
        this.dialog.close();
        this.form.reset();
      } else {
        alert("Invalid input. Please try again.");
      }
    });

    this.cancelBtn.addEventListener("click", () => {
      this.dialog.close();
      this.form.reset();
    });
  }
}

// Controller
class LibraryController {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }

  init() {
    this.view.displayNewButton();
    this.view.handleDialogForm();
    this.populateBooks();
    this.render();
  }

  populateBooks() {
    this.model.addBook(new Book("1984", "George Orwell", 328, false));
    this.model.addBook(
      new Book("The Great Gatsby", "F. Scott Fitzgerald", 218, true)
    );
    this.model.addBook(
      new Book("The Catcher in the Rye", "J.D. Salinger", 234, false)
    );
  }

  addBook(title, author, pages, read) {
    this.model.addBook(new Book(title, author, pages, read));
    this.render();
  }

  handleDelete(bookId) {
    this.model.deleteBook(bookId);
    this.render();
  }

  handleToggleRead(bookId) {
    const book = this.model.books.find((b) => b.id === bookId);
    if (book) book.toggleReadStatus();
    this.render();
  }

  render() {
    this.view.renderBooks(
      this.model.getBooks()
    );
  }
}
const model = new Library();
const view = new LibraryView();
const controller = new LibraryController(model, view);
controller.init();
