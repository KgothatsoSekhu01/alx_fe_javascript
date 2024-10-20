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

// Populate categories in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];

    uniqueCategories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
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

    // Save the last selected category to local storage
    localStorage.setItem('lastSelectedCategory', selectedCategory);
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
function addQuote("createAddQuoteForm") {
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

// Function to export quotes to a JSON file
function exportQuotes() {
    const dataStr = JSON.stringify(quotes);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        const importedQuotes = JSON.parse(event.target.result);
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories(); // Update the categories dropdown
        filterQuotes(); // Refresh displayed quotes
        alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
}

// Event Listeners
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
document.getElementById("addQuoteButton").addEventListener("click", addQuote);
document.getElementById("exportButton").addEventListener("click", exportQuotes);

// Load quotes and categories on page load
window.onload = function() {
    loadQuotes();
    populateCategories();

    const lastSelectedCategory = localStorage.getItem('lastSelectedCategory') || "all";
    document.getElementById("categoryFilter").value = lastSelectedCategory;
    filterQuotes(); // Display quotes based on the last selected category

    const lastViewedQuote = sessionStorage.getItem('lastViewedQuote');
    if (lastViewedQuote) {
        const quote = JSON.parse(lastViewedQuote);
        document.getElementById("quoteDisplay").innerHTML = `"${quote.text}" - <strong>${quote.category}</strong>`;
    }

};const quotesContainer = document.getElementById('quotes');
const notificationDiv = document.getElementById('notification');

// Simulated local storage for quotes
let localQuotes = JSON.parse(localStorage.getItem('quotes')) || [];

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await response.json();
        handleNewQuotes(data);
    } catch (error) {
        console.error('Error fetching quotes:', error);
    }
}

// Function to handle new quotes and conflict resolution
function handleNewQuotes(serverQuotes) {
    serverQuotes.forEach(serverQuote => {
        const localQuote = localQuotes.find(q => q.id === serverQuote.id);

        if (!localQuote) {
            // New quote from server
            localQuotes.push(serverQuote);
            showNotification(`New quote added: "${serverQuote.title}"`);
        } else if (localQuote.title !== serverQuote.title || localQuote.body !== serverQuote.body) {
            // Conflict detected
            showConflictResolutionOptions(localQuote, serverQuote);
        }
    });

    // Update local storage and UI
    localStorage.setItem('quotes', JSON.stringify(localQuotes));
    displayQuotes();
}

// Function to display quotes
function displayQuotes() {
    quotesContainer.innerHTML = ''; // Clear previous quotes
    localQuotes.forEach(quote => {
        const quoteDiv = document.createElement('div');
        quoteDiv.innerHTML = `<h3>${quote.title}</h3><p>${quote.body}</p>`;
        quotesContainer.appendChild(quoteDiv);
    });
}

// Function to create a new quote
async function createQuote() {
    const newQuote = {
        title: `Quote Title ${localQuotes.length + 1}`,
        body: 'This is a new quote body.',
        userId: 1,
        id: localQuotes.length + 1 // Simulating unique ID
    };

    localQuotes.push(newQuote);
    localStorage.setItem('quotes', JSON.stringify(localQuotes));
    showNotification(`New quote created: "${newQuote.title}"`);
    displayQuotes();
}

// Function to show notifications
function showNotification(message) {
    notificationDiv.textContent = message;
    setTimeout(() => {
        notificationDiv.textContent = '';
    }, 5000); // Clear message after 5 seconds
}

// Set up periodic fetching of quotes
setInterval(fetchQuotesFromServer, 10000); // Fetch every 10 seconds

// Event listener for the button to create a new quote
document.getElementById('createQuote').addEventListener('click', createQuote);

// Initial fetch of quotes
fetchQuotesFromServer();

