const chatMessages = document.querySelector(".chat-messages");
const inputField = document.querySelector(".input-field");
const sendButton = document.querySelector(".send-button");

// Function to auto-resize the textarea
function autoResize() {
  this.style.height = "auto";
  this.style.height = this.scrollHeight + "px";
}

// Add event listeners for input and keydown events
inputField.addEventListener("input", autoResize);
inputField.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

// Function to send a message
function sendMessage() {
  const userMessage = inputField.value.trim();
  if (userMessage !== "") {
    displayUserMessage(userMessage);
    displayLoadingMessage();
    makeApiCall(userMessage);
    inputField.value = ""; // Clear the input field
    inputField.style.height = "auto"; // Reset the height
  }
}

// Event listener for pressing "Enter" key
inputField.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Event listener for send button click
sendButton.addEventListener("click", sendMessage);

document.addEventListener("DOMContentLoaded", function () {
  const sideNav = document.getElementById("side-nav");
  const toggleBtn = document.getElementById("toggle-btn");
  const closeBtn = document.getElementById("close-btn");
  const chatbox = document.querySelector(".chatbox");

  toggleBtn.addEventListener("click", function () {
    sideNav.classList.toggle("open");
    chatbox.classList.toggle("shifted"); // Shift chatbox when sidebar is open
  });
  // Close sidebar when clicking outside of it
  document.addEventListener("click", function (event) {
    if (!sideNav.contains(event.target) && !toggleBtn.contains(event.target)) {
      sideNav.classList.remove("open");
      chatbox.classList.remove("shifted"); // Reset chatbox position
    }
  });
});
