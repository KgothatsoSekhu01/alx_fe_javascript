const quoteDisplay = document.getElementById('quote-display');
const newQuoteButton = document.getElementById('new-quote');
const addQuoteButton = document.getElementById('add-quote');
const quoteInput = document.getElementById('quote');
const categoryInput = document.getElementById('category');
const exportButton = document.getElementById('export-quotes');
const importInput = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter');

let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let selectedCategory = localStorage.getItem('selectedCategory') || 'all';

// Function to display quotes based on the selected category
function displayQuotes() {
    quoteDisplay.innerText = '';
    const filteredQuotes = selectedCategory === 'all' ? quotes : quotes.filter(q => q.category === selectedCategory);
    if (filteredQuotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
        quoteDisplay.innerText = filteredQuotes[randomIndex].text;
        sessionStorage.setItem('lastViewedQuote', filteredQuotes[randomIndex].text);
    } else {
        quoteDisplay.innerText = 'No quotes available for this category.';
    }
}

// Function to populate categories dynamically
function populateCategories() {
    const categories = [...new Set(quotes.map(q => q.category))]; // Extract unique categories
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to filter quotes based on the selected category
function filterQuotes() {
    selectedCategory = categoryFilter.value;
    localStorage.setItem('selectedCategory', selectedCategory);
    displayQuotes();
}

// Function to add a new quote with a category
function addQuote() {
    const newQuoteText = quoteInput.value.trim();
    const newCategory = categoryInput.value.trim();
    if (newQuoteText && newCategory) {
        quotes.push({ text: newQuoteText, category: newCategory });
        saveQuotes();
        quoteInput.value = '';
        categoryInput.value = '';
        displayQuotes();
        populateCategories(); // Update categories after adding a new quote
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Import function (remains unchanged)
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const importedQuotes = JSON.parse(event.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories(); // Update categories after importing
                displayQuotes();
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
newQuoteButton.addEventListener('click', displayQuotes);
addQuoteButton.addEventListener('click', addQuote);
exportButton.addEventListener('click', exportQuotes);

// Load last viewed quote from session storage and filter preference
if (sessionStorage.getItem('lastViewedQuote')) {
    quoteDisplay.innerText = sessionStorage.getItem('lastViewedQuote');
} else {
    displayQuotes();
}

// Initialize category filter
populateCategories();
categoryFilter.value = selectedCategory; // Restore last selected filter
filterQuotes(); // Display quotes based on the last selected category

