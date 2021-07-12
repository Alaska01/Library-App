// Book Class: represents a book

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
  }
}

// UI Class: to handle UI Task

class UI {
  static displayBooks() {
    const books = Store.getBooks();
    books.forEach((book) => UI.addBookToList(book));
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.pages}</td>
      
      <td><a href="#"><button class='btn btn-info readStatus' onclick="change(this)" >
      ${book.read}</button></a></td>
  
      <td><a href="#" class="btn btn-danger btn-sm delete"> Delete</a></td>
    
      `;

    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));

    const container = document.querySelector(".container");

    const form = document.querySelector("#book-form");
    container.insertBefore(div, form);

    // Vanish in 3seconds, after alert message shows

    setTimeout(() => document.querySelector(".alert").remove(), 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#pages").value = "";
    document.querySelector("#read").value = "";
  }
}

// Store Class: Handles Storage this is local storage

class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(pages) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.pages === pages) {
        books.splice(index, 1);
      }

      localStorage.setItem("books", JSON.stringify(books));
    });
  }
}

// Change status function for Read and Unread

function change(el) {
  const parent = el.parentElement;
  const status = parent.querySelector(".readStatus");
  const index = el.parentElement.parentElement.rowIndex;

  const books = JSON.parse(localStorage.getItem("books"));

  if (status.innerHTML !== "Read") {
    status.innerHTML = "Read";
    books[index - 1].read = "Read";
    localStorage.setItem("books", JSON.stringify(books));
  } else {
    status.innerHTML = "Not read";
    books[index - 1].read = "Not read";
    localStorage.setItem("books", JSON.stringify(books));
  }
}

// Events to Display Book

document.addEventListener("DOMContentLoaded", UI.displayBooks);

// Events to Add a Book

document.querySelector("#book-form").addEventListener("submit", (e) => {
  // Prevent Submit
  e.preventDefault();

  // get form values

  const title = document.querySelector("#title").value;
  const author = document.querySelector("#author").value;
  const pages = document.querySelector("#pages").value;

  // Validate

  if (title === "" || author === "" || pages === "") {
    UI.showAlert("Please fill in all fields", "danger");
  } else {
    // Instanciate Book

    const book = new Book(title, author, pages);

    //   Add Book to List

    UI.addBookToList(book);

    // Add Book to Store

    Store.addBook(book);

    UI.showAlert("Book Added", "success");

    // clear Fields

    UI.clearFields();
  }
});
