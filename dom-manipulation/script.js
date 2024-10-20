// script.js

// Initialize an array to hold quote objects
let quotes = [];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');

    // Check if there are quotes available
    if (quotes.length === 0) {
        quoteDisplay.innerText = "No quotes available. Please add some!";
        return;
    }

    // Select a random quote
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Update the DOM with the selected quote
    quoteDisplay.innerText = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    // Validate input
    if (quoteText === "" || quoteCategory === "") {
        alert("Please fill in both fields.");
        return;
    }

    // Create a new quote object
    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };

    // Add the new quote to the array
    quotes.push(newQuote);

    // Save the new quote to local storage
    saveQuotes();

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    // Update the display
    alert("Quote added!");
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Load quotes when the page is loaded
window.onload = loadQuotes;

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
