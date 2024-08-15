// Function to append bot messages to the chat
function appendBotMessage(message, chatContainer) {
  const markdownContent = marked.parse(message);
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", "bot");
  messageElement.innerHTML = `
    <div class="message-avatar bot-avatar">AI</div>
    <div class="message-content bot markdown-body">${markdownContent}</div>
  `;
  chatContainer.appendChild(messageElement);

  // Highlight all code blocks
  const codeBlocks = chatContainer.querySelectorAll("pre code");
  codeBlocks.forEach((block) => {
    hljs.highlightElement(block);
  });

  chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
}

// Function to display user message
function displayUserMessage(userMessage) {
  const newMessage = document.createElement("div");
  newMessage.classList.add("message", "user");
  newMessage.innerHTML = `
    <div class="message-avatar user-avatar">U</div>
    <div class="message-content user">${formatMessage(userMessage)}</div>
  `;
  chatMessages.appendChild(newMessage);
}

// Function to display loading message
function displayLoadingMessage() {
  const loadingMessage = document.createElement("div");
  loadingMessage.classList.add("message", "bot");
  loadingMessage.innerHTML = `
  <div class="message-avatar bot-avatar">AI</div>
      <div class="loading-spinner"></div>
    </div>
  `;
  chatMessages.appendChild(loadingMessage);
  chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom
}
