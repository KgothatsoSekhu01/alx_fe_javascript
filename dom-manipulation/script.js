// script.js

// Initialize an array to hold quote objects
let quotes = [];

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    if (quotes.length === 0) {
        quoteDisplay.innerText = "No quotes available. Please add some!";
        return;
    }

    const filteredQuotes = getFilteredQuotes();
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerText = "No quotes available for this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.innerText = `"${randomQuote.text}" - ${randomQuote.category}`;
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
    saveQuotes();
    populateCategories();  // Update category options

    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';
    alert("Quote added!");
}

// Function to populate categories in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById('categoryFilter');
    const categories = [...new Set(quotes.map(q => q.category))];

    // Clear existing options
    categoryFilter.innerHTML = '<option value="all">All Categories</option>';

    // Populate with new categories
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.innerText = category;
        categoryFilter.appendChild(option);
    });

    // Restore the last selected category
    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || 'all';
    categoryFilter.value = lastSelectedCategory;
}

// Function to filter quotes based on selected category
function filterQuotes() {
    const categoryFilter = document.getElementById('categoryFilter');
    const selectedCategory = categoryFilter.value;
    localStorage.setItem('lastSelectedCategory', selectedCategory);  // Save the last selected category
    showRandomQuote();  // Update the displayed quote based on the new filter
}

// Get filtered quotes based on selected category
function getFilteredQuotes() {
    const categoryFilter = document.getElementById('categoryFilter').value;
    if (categoryFilter === 'all') {
        return quotes;
    }
    return quotes.filter(quote => quote.category === categoryFilter);
}

// Load quotes when the page is loaded
window.onload = function() {
    loadQuotes();
    populateCategories();  // Populate categories when the page loads
};
