const quoteDisplay = document.getElementById('quote-display');
const newQuoteButton = document.getElementById('new-quote');
const addQuoteButton = document.getElementById('add-quote');
const quoteInput = document.getElementById('quote');
const exportButton = document.getElementById('export-quotes');
const importInput = document.getElementById('importFile');

let quotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to display a random quote
function displayRandomQuote() {
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteDisplay.innerText = quotes[randomIndex];
        sessionStorage.setItem('lastViewedQuote', quotes[randomIndex]);
    } else {
        quoteDisplay.innerText = 'No quotes available.';
    }
}

// Function to add a new quote
function addQuote() {
    const newQuote = quoteInput.value.trim();
    if (newQuote) {
        quotes.push(newQuote);
        saveQuotes();
        quoteInput.value = '';
        displayRandomQuote();
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to export quotes to a JSON file
function exportQuotes() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                displayRandomQuote();
                alert('Quotes imported successfully!');
            } else {
                alert('Invalid format: The imported file must contain an array of quotes.');
            }
        } catch (e) {
            alert('Error importing quotes: ' + e.message);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}

// Event listeners
newQuoteButton.addEventListener('click', displayRandomQuote);
addQuoteButton.addEventListener('click', addQuote);
exportButton.addEventListener('click', exportQuotes);

// Load last viewed quote from session storage
if (sessionStorage.getItem('lastViewedQuote')) {
    quoteDisplay.innerText = sessionStorage.getItem('lastViewedQuote');
} else {
    displayRandomQuote();
}
