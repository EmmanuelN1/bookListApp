//Book Class: Represents a Book
    class Book{
        constructor(title, author, isbn ){ //The constructor is a method that run when we instantiate a book..it then takes all the field 
            this.title = title;
            this.author = author;
            this.isbn =isbn;
        }
    }
//UI Class: Handle UI Task
class UI{
   
        static addBookToList(book){
            const list = document.querySelector('#book-list');
            const row = document.createElement('tr'); //creates a variable that stores a tr to be created
            row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>  
            <td>${book.isbn}</td> 
            <td><a href="#" class=" btn btn-danger btn-sm delete">X</a></td> `;
            list.appendChild(row);

        }
        static showAlert(message, className){
            const div =document.createElement('div');
            div.className = `alert alert-${className}`;//this adds class to the div
            div.appendChild(document.createTextNode(message));//this puts something inside the div thats what the append function does..The ccreateTextNode creates the text
            const container =document.querySelector('.container');
            const form = document.querySelector('#book-form');
            container.insertBefore(div, form);//the inserts the div before the form

            //vanish in 3 seconds
            setTimeout(()=>
            document.querySelector('.alert').remove(),3000); //it removes the class whith alert in 3 sec
        }
        static clearFields(){
            document.querySelector('#title').value="";
            document.querySelector('#author').value="";
            document.querySelector('#isbn').value="";
        }
        static deleteBook(el){ //el represent the targted element
            if (el.classList.contains('delete')){  //checks if the targeted element contain a delete class
                el.parentElement.parentElement.remove(); //this remove the selected element and removes it tr tag and content..NOTE>>to select the td alone use.parentElement.remove() once
            }
        }
        static displayBooks(){ //the static word makes the method static
            const books = Store.getBooks();
            books.forEach((book)=> UI.addBookToList(book)); //we called the function addBookTolist while looping through the array books = storedBooks
            //addBookToList
        }
    }

//Store Class: Handdle Storage
class Store{ //localStorage stores basically key value pair// you can't store object in localStorage, you store them as string or stringify it 
   static getBooks(){
        let books;
        if (localStorage.getItem('books')===null){ //this checks if there is an item scalled books in localStorage
            books = [];
        }
        else{
            books= JSON.parse(localStorage.getItem('books'))
        }
        return books;
    }
    static addBook(book){
        const books = Store.getBooks();

        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn){    
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn===isbn){
                books.splice(index, 1)
            } 
        });
        //reset local storage
        localStorage.setItem('books',JSON.stringify(books));
    }  
}
    
//Events: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit',(e)=>{ //it listens for submit on the form
//get form values
e.preventDefault();
const title = document.querySelector('#title').value;
const author = document.querySelector('#author').value;
const isbn = document.querySelector('#isbn').value;
//Validation of  forms
if (title===""||author===""||isbn===""){
    UI.showAlert('Please Fill in all fields', 'danger');
}
    else{
        //instantiate a book
const book = new Book(title, author, isbn);

//Add Book to UI
UI.addBookToList(book);

//add book to store
Store.addBook(book);
//success alert
UI.showAlert('Successfully Added','success')
//clear fields
UI.clearFields();
    }
});
//Remove book from localstorage

//Event:Remove a Book from Ui
    /*
        Event propagtion deals with selection of something above it, then we target what ever is clicked inside of it
    */
   document.querySelector('#book-list').addEventListener('click',(e) =>{
       UI.deleteBook(e.target) //e.target is used to target a particular element in a webpage
       UI.showAlert('Book Deleted','success');

       Store.removeBook(e.parentElement.previousElementSibling.textContent);//this target the value of the td before the button tag
   })