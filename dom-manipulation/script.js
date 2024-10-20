const quoteDisplay = document.getElementById('quote-display');
const newQuoteButton = document.getElementById('new-quote');
const addQuoteButton = document.getElementById('add-quote');
const quoteInput = document.getElementById('quote');
const categoryInput = document.getElementById('category');
const categoryFilter = document.getElementById('categoryFilter');
const notification = document.getElementById('notification');

let quotes = JSON.parse(localStorage.getItem('quotes')) || [];
let selectedCategory = localStorage.getItem('selectedCategory') || 'all';

// Simulated server URL
const serverUrl = 'https://jsonplaceholder.typicode.com/posts'; // Mock API
let conflictResolutionQueue = [];

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
    const categories = [...new Set(quotes.map(q => q.category))];
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
        const newQuote = { text: newQuoteText, category: newCategory };
        quotes.push(newQuote);
        saveQuotes();
        postQuoteToServer(newQuote); // Simulate posting to the server
        quoteInput.value = '';
        categoryInput.value = '';
        displayQuotes();
        populateCategories();
    }
}

// Function to save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to post a quote to the server (simulation)
function postQuoteToServer(quote) {
    fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(quote),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Quote posted successfully:', data);
    })
    .catch((error) => {
        console.error('Error posting quote:', error);
    });
}

// Function to fetch quotes from the server periodically
function fetchQuotesFromServer() {
    setInterval(() => {
        fetch(serverUrl)
            .then(response => response.json())
            .then(data => {
                handleFetchedQuotes(data);
            })
            .catch(error => {
                console.error('Error fetching quotes from server:', error);
            });
    }, 30000); // Fetch every 30 seconds
}

// Handle new quotes fetched from the server
function handleFetchedQuotes(serverQuotes) {
    let updated = false;
    serverQuotes.forEach(serverQuote => {
        const existingQuoteIndex = quotes.findIndex(q => q.text === serverQuote.title);
        
        // If quote from server doesn't exist locally, add it
        if (existingQuoteIndex === -1) {
            quotes.push({ text: serverQuote.title, category: 'Imported' });
            updated = true;
        } else {
            // Conflict detected: existing quote with the same text
            const existingQuote = quotes[existingQuoteIndex];
            if (existingQuote.category !== 'Imported') {
                conflictResolutionQueue.push({
                    localQuote: existingQuote,
                    serverQuote: serverQuote.title,
                });
                updated = true;
            }
        }
    });

    if (updated) {
        saveQuotes();
        populateCategories();
        displayQuotes();
        notifyUserOfUpdates();
    }
}

// Notify user of updates and conflicts
function notifyUserOfUpdates() {
    if (conflictResolutionQueue.length > 0) {
        const message = `New quotes have been fetched from the server. ${conflictResolutionQueue.length} conflict(s) detected.`;
        showNotification(message);
        promptConflictResolution();
    } else {
        showNotification('New quotes have been fetched from the server.');
    }
}

// Show notification to the user
function showNotification(message) {
    notification.innerText = message;
    notification.style.display = 'block';
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000); // Hide after 5 seconds
}

// Prompt user for conflict resolution
function promptConflictResolution() {
    conflictResolutionQueue.forEach(conflict => {
        const resolve = confirm(`Conflict detected: "${conflict.localQuote.text}" vs "${conflict.serverQuote}". Accept server version?`);
        if (resolve) {
            const index = quotes.findIndex(q => q.text === conflict.localQuote.text);
            quotes[index] = { text: conflict.serverQuote, category: conflict.localQuote.category };
        }
    });
    conflictResolutionQueue = [];
    saveQuotes();
    populateCategories();
    displayQuotes();
}

// Event listeners
newQuoteButton.addEventListener('click', displayQuotes);
addQuoteButton.addEventListener('click', addQuote);

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

// Start fetching quotes from the server
fetchQuotesFromServer();
