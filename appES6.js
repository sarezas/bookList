// book constructor
class Book {
    constructor(title, author, isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI constructor
class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        // create tr el.
        const row = document.createElement('tr');
        // insert columns into tr
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="" class="delete">X</a></td>`; 
        list.appendChild(row);    
    }

    showAlert(msg, className){
        // create div
        const div = document.createElement('div');
        // add class
        div.className = `alert ${className}`;
        // add text
        div.appendChild(document.createTextNode(msg));
        // take oper. elems.
        const container = document.querySelector('.container');
        const form = document.getElementById('book-form');
        // insert alert
        container.insertBefore(div, form);
        // disappear after three secs.
        setTimeout(function(){
            document.querySelector('.alert').remove();
        }, 3000); 
    }

    deleteBook(target){
        if (target.className === 'delete'){
            target.parentElement.parentElement.remove();
        }
    }

    clearFields(){
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
}

// local storage class
class Storage {
    static getBooks(){
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static displayBooks(){
        const books = Storage.getBooks();
        books.forEach(function(book){
            const ui = new UI();
            // add book to UI
            ui.addBookToList(book);
        });
    }

    static addBook(book){
        const books = Storage.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Storage.getBooks();
        books.forEach(function(book, index){
            if (book.isbn === isbn) {
                books.splice(index, 1);
            } 
        });
        localStorage.setItem('books', JSON.stringify(books)); 
    }
}

// DOM load event for adding books from LocSto
document.addEventListener('DOMContentLoaded', Storage.displayBooks);

// event listener for adding a book
document.getElementById('book-form').addEventListener('submit', function(e) {
    // form vals.
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;
    // instantiate a book
    const book = new Book(title, author, isbn);
    // instantiate UI
    const ui = new UI();
    // validate
    if (title === '' || author === '' || isbn === '') {
        // error alert
        ui.showAlert('Please fill in all fields', 'error');
    } else {
        // add book to list
        ui.addBookToList(book);
        // add book to LocSto
        Storage.addBook(book);
        // show success
        ui.showAlert('Book added!', 'success');
        // clear inputs
        ui.clearFields();
    }
    e.preventDefault();
});

// event listener for deleting a book
document.getElementById('book-list').addEventListener('click', function(e){
    // instantiate UI
    const ui = new UI();
    // call deleteBook from prototype
    ui.deleteBook(e.target);
    // remove book from LocSto
    Storage.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // show alert
    ui.showAlert('Book removed from list!', 'success');
    e.preventDefault();
});