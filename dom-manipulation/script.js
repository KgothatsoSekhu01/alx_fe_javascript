// script.js

let quotes = [];

// Load quotes from local storage on initialization
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

// Simulate fetching quotes from a server
function fetchQuotesFromServer() {
    // Mock server response
    const serverResponse = [
        { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", category: "inspiration" },
        { text: "The purpose of our lives is to be happy.", category: "happiness" },
        { text: "Life is what happens when you're busy making other plans.", category: "life" }
    ];
    
    handleFetchedQuotes(serverResponse);
}

// Handle fetched quotes from the server
function handleFetchedQuotes(serverQuotes) {
    let newQuotesAdded = false;
    serverQuotes.forEach(serverQuote => {
        const existingQuote = quotes.find(q => q.text === serverQuote.text);
        if (!existingQuote) {
            quotes.push(serverQuote);
            newQuotesAdded = true;
        }
    });
    if (newQuotesAdded) {
        notifyUser("New quotes have been added from the server!");
    }
    saveQuotes();
    populateCategories();
    filterQuotes();
}

// Function to display quotes based on the selected category
function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = ""; // Clear current quotes

    const filteredQuotes = selectedCategory === "all" ? quotes : quotes.filter(quote => quote.category === selectedCategory);

    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = "No quotes available for this category.";
    } else {
        filteredQuotes.forEach(quote => {
            const quoteDiv = document.createElement("div");
            quoteDiv.className = "quote";
            quoteDiv.innerHTML = `"${quote.text}" - <strong>${quote.category}</strong>`;
            quoteDisplay.appendChild(quoteDiv);
        });
    }
}

// Periodically check for new quotes from the server
setInterval(fetchQuotesFromServer, 30000); // Fetch every 30 seconds

// Notify the user about updates
function notifyUser(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.style.backgroundColor = "#f0ad4e"; // Bootstrap warning color
    notification.style.padding = "10px";
    notification.style.margin = "10px 0";
    document.body.prepend(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Populate categories in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset options
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

// Function to display a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        document.getElementById("quoteDisplay").innerHTML = "No quotes available.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `"${quote.text}" - <strong>${quote.category}</strong>`;
    
    // Store the last viewed quote in session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Function to add a new quote to the array and update the DOM
function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value;
    const quoteCategory = document.getElementById("newQuoteCategory").value;

    if (quoteText && quoteCategory) {
        // Add the new quote to the array
        quotes.push({ text: quoteText, category: quoteCategory });
        
        // Clear the input fields
        document.getElementById("newQuoteText").value = '';
        document.getElementById("newQuoteCategory").value = '';

        // Save quotes to local storage
        saveQuotes();
        populateCategories(); // Update the categories dropdown

        // Display all quotes (refresh)
        filterQuotes();

        alert("Quote added!");
    } else {
        alert("Please fill in both fields.");
    }
}

// Event Listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteButton").addEventListener("click", addQuote);

// Load quotes and categories on page load
window.onload = function() {
    loadQuotes();
    populateCategories();
    fetchQuotesFromServer(); // Initial fetch
};
