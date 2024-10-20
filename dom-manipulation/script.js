// script.js

// Function to load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        return JSON.parse(storedQuotes);
    }
    return [
        { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
        { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
        { text: "Your time is limited, don't waste it living someone else's life.", category: "Inspiration" }
    ];
}

// Initialize quotes from local storage
let quotes = loadQuotes();

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById('quoteDisplay').innerText = "No quotes available. Please add some!";
        return;
    }
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    document.getElementById('quoteDisplay').innerText = `"${randomQuote.text}" - ${randomQuote.category}`;
    
    // Save last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
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
    saveQuotes();  // Save updated quotes to local storage

    // Clear input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    alert("Quote added!");
}

// Function to export quotes to JSON
function exportQuotes() {
    const dataStr = JSON.stringify(quotes, null, 2); // Format for readability
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from JSON
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();  // Save new quotes to local storage
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid file format. Please upload a valid JSON file.');
            }
        } catch (error) {
            alert('Error parsing JSON: ' + error.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Event listeners
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteBtn').addEventListener('click', addQuote);
document.getElementById('exportBtn').addEventListener('click', exportQuotes);
document.getElementById('importFile').addEventListener('change', importFromJsonFile);

// Load last viewed quote from session storage (if available)
const lastQuote = sessionStorage.getItem('lastViewedQuote');
if (lastQuote) {
    const lastViewedQuote = JSON.parse(lastQuote);
    document.getElementById('quoteDisplay').innerText = `"${lastViewedQuote.text}" - ${lastViewedQuote.category}`;
}
