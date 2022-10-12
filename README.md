# TestCreateApi
This was my first experience for create API. Stack: Node.js, Express, JWT, GraphQL, Postman.

Task : 
Create an API to manage a virtual library.

The main functionalities should include:

- user registration (login, name, password)

- user login (login, password)


- administrator registration (login, name, password)

- administrator login (login, password)



- adding a book (name, ISBN, author) to the pool of books (by the administrator)

- removing a book from the pool of books (by the administrator)

- editing data details of the selected book (by the administrator)



- listing all books (by the user and administrator)

- listing of books available for borrowing (by the user and administrator)



- borrowing a book (by the user)

- return of the book (by the user)



The user should not be able to perform administrator actions and vice versa.

A borrowed book cannot be borrowed again, unless the user who borrowed it returns it.
