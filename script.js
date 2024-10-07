const apiUrl = "http://localhost:9000/books";

// Add a book
document.getElementById("book-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const bookData = {
    name: document.getElementById("name").value,
    year: Number(document.getElementById("year").value),
    author: document.getElementById("author").value,
    summary: document.getElementById("summary").value,
    publisher: document.getElementById("publisher").value,
    pageCount: Number(document.getElementById("pageCount").value),
    readPage: Number(document.getElementById("readPage").value),
    reading: document.getElementById("reading").checked
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData)
  });

  const data = await response.json();

  if (data.status === "success") {
    document.getElementById("message").innerText = "Book added successfully!";
    fetchBooks();
  } else {
    document.getElementById("message").innerText = data.message;
  }
});

// Fetch all books
async function fetchBooks() {
  const response = await fetch(apiUrl);
  const data = await response.json();

  const bookList = document.getElementById("books");
  bookList.innerHTML = "";

  data.data.books.forEach((book) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${book.name}</strong> by ${book.publisher}
      <button class="update" onclick="updateBook('${book.id}')">Update</button>
      <button class="delete" onclick="deleteBook('${book.id}')">Delete</button>
    `;
    bookList.appendChild(li);
  });
}

// Delete a book
async function deleteBook(id) {
  const response = await fetch(`${apiUrl}/${id}`, {
    method: "DELETE",
  });

  const data = await response.json();
  document.getElementById("message").innerText = data.message;
  fetchBooks();
}

// Update a book (Placeholder for now)
function updateBook(id) {
  const bookName = prompt("Enter new book name:");
  if (bookName) {
    alert(`You can implement PUT request for book ID: ${id} with new name: ${bookName}`);
  }
}

// Initial fetch when the page loads
fetchBooks();
