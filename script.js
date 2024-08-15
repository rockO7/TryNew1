const chatMessages = document.querySelector(".chat-messages");
const inputField = document.querySelector(".input-field");
const sendButton = document.querySelector(".send-button");

// Function to auto-resize the textarea
function autoResize() {
  this.style.height = 'auto';
  this.style.height = this.scrollHeight + 'px';
}

// Add event listeners for input and keydown events
inputField.addEventListener('input', autoResize);
inputField.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

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
  const codeBlocks = chatContainer.querySelectorAll('pre code');
  codeBlocks.forEach(block => {
    hljs.highlightElement(block);
  });

  chatContainer.scrollTop = chatContainer.scrollHeight; // Scroll to bottom
}

// Function to copy text to clipboard
function copyToClipboard(text, button) {
  navigator.clipboard.writeText(text).then(() => {
    const originalHTML = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.classList.add('copied');
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.classList.remove('copied');
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
    button.innerHTML = '<i class="fas fa-times"></i> Failed!';
    button.classList.add('copy-failed');
    setTimeout(() => {
      button.innerHTML = originalHTML;
      button.classList.remove('copy-failed');
    }, 2000);
  });
}

// Function to send a message
function sendMessage() {
  const userMessage = inputField.value.trim();
  if (userMessage !== "") {
    // Display the user's message
    const newMessage = document.createElement("div");
    newMessage.classList.add("message", "user");
    newMessage.innerHTML = `
      <div class="message-avatar user-avatar">U</div>
      <div class="message-content user">${formatMessage(userMessage)}</div>
    `;
    chatMessages.appendChild(newMessage);

    // ... rest of your sendMessage function ...
    // Create a loading message element
    const loadingMessage = document.createElement("div");
    loadingMessage.classList.add("message", "bot");
    loadingMessage.innerHTML = `
      <div class="message-avatar bot-avatar">AI</div>
      <div class="message-content bot">
        <div class="loading-spinner"></div>
      </div>
    `;
    chatMessages.appendChild(loadingMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Scroll to bottom

    // Make the API call
    fetch("https://localhost:7168/api/OpenAI/chat", {
      method: "POST",
      headers: {
        accept: "*/*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: userMessage }),
    })
      .then((response) => {
        if (!response.body) {
          throw new Error("ReadableStream not yet supported in this browser.");
        }
        const reader = response.body.getReader();
        const decoder = new TextDecoder("utf-8");

        // Clear the loading content before starting to append new content
        loadingMessage.innerHTML = `
          <div class="message-avatar bot-avatar">AI</div>
          <div class="message-content bot"></div>
        `;

        let fullResponse = '';

        function read() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              console.log("Stream complete");
              
              // Render the full response with Markdown
              const contentDiv = loadingMessage.querySelector(".message-content");
              contentDiv.innerHTML = marked.parse(fullResponse);

            // Add copy button for the entire response
            const copyResponseButton = document.createElement('button');
            copyResponseButton.innerHTML = '<i class="fas fa-copy"></i> Copy';
            copyResponseButton.classList.add('copy-button');
            copyResponseButton.addEventListener('click', (e) => copyToClipboard(fullResponse, e.target));
            contentDiv.prepend(copyResponseButton);

            // Highlight code blocks and add copy buttons after appending content
            const codeBlocks = loadingMessage.querySelectorAll('pre code');
            codeBlocks.forEach((block, index) => {
              hljs.highlightElement(block);
              
              const wrapper = document.createElement('div');
              wrapper.classList.add('code-wrapper');
              block.parentNode.insertBefore(wrapper, block);
              wrapper.appendChild(block);

              const languageName = block.classList[0]?.replace('language-', '');
              if (languageName) {
                const languageTag = document.createElement('div');
                languageTag.classList.add('language-tag');
                languageTag.textContent = languageName;
                wrapper.insertBefore(languageTag, block);
              }

              const copyButton = document.createElement('button');
              copyButton.innerHTML = '<i class="fas fa-copy"></i>';
              copyButton.classList.add('copy-button', 'code-copy-button');
              copyButton.addEventListener('click', (e) => copyToClipboard(block.textContent, e.target));
              wrapper.insertBefore(copyButton, block);
            });

              chatMessages.scrollTop = chatMessages.scrollHeight;
              return;
            }

            // Decode the incoming bytes into a string
            const chunk = decoder.decode(value, { stream: true });
            fullResponse += chunk;

            // Update the message content with the current full response
            const contentDiv = loadingMessage.querySelector(".message-content");
            contentDiv.innerHTML = marked.parse(fullResponse);

            // Highlight code blocks
            const codeBlocks = contentDiv.querySelectorAll('pre code');
            codeBlocks.forEach(block => {
              hljs.highlightElement(block);
            });

            chatMessages.scrollTop = chatMessages.scrollHeight;
            inputField.value = ""; // Clear the input field
            inputField.style.height = 'auto'; // Reset the height

            // Keep reading until done
            return read();
          });
        }
        return read();
      })
      .catch((error) => {
        console.error("Error:", error);
        appendBotMessage(
          "Sorry, something went wrong. Please try again later.",
          chatMessages
        );
      });

    inputField.value = ""; // Clear the input field
    inputField.style.height = 'auto'; // Reset the height
  }
}

// Function to format the message (preserve newlines)
function formatMessage(message) {
  return message.replace(/\n/g, '<br>');
}
// Event listener for pressing "Enter" key
inputField.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

// Function to format the message (preserve newlines)
function formatMessage(message) {
  return message.replace(/\n/g, '<br>');
}

// Event listener for send button click
sendButton.addEventListener("click", sendMessage);


