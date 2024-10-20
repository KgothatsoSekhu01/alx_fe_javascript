// script.js

// Array to hold quotes
let quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "Your time is limited, don't waste it living someone else's life.", category: "Inspiration" }
];

// Function to show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').innerText = "No quotes available. Please add some!";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `"${randomQuote.text}" - ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteCategory = document.getElementById('newQuoteCategory').value;

    if (quoteText === "" || quoteCategory === "") {
        alert("Please fill in both fields.");
        return;
    }

    const newQuote = {
        text: quoteText,
        category: quoteCategory
    };
    
    quotes.push(newQuote);

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    alert("Quote added!");
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
