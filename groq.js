// Function to make the API call
function makeApiCall(userMessage) {
  fetch("https://localhost:7168/api/OpenAI/groq", {
    method: "POST",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userMessage }),
  })
    .then((response) => response.json())
    .then((data) => handleResponse(data))
    .catch((error) => handleError(error));
}

// Function to handle the API response
function handleResponse(data) {
  const chatMessages = document.getElementById("chatbox");

  // Clear the loading content before starting to append new content
  const loadingMessage = document.querySelector(".loading-spinner").parentNode;
  const content = marked.parse(data.choices[0].message.content); // Markdown parsing

  loadingMessage.innerHTML = `
    <div class="message-avatar bot-avatar">AI</div>
    <div class="message-content bot">${content}</div>
  `;

  // Add copy button for the entire response
  addCopyButton(
    data.choices[0].message.content,
    loadingMessage.querySelector(".message-content")
  );

  // Highlight code blocks and add copy buttons after appending content
  highlightCodeBlocks(loadingMessage);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to handle errors
function handleError(error) {
  console.error("Error:", error);
  appendBotMessage(
    "Sorry, something went wrong. Please try again later.",
    document.getElementById("chatbox")
  );
}

// Function to highlight code blocks and add copy button

// Function to append bot message
function appendBotMessage(message, chatMessages) {
  const botMessage = document.createElement("p");
  botMessage.textContent = `AI: ${message}`;
  chatMessages.appendChild(botMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
