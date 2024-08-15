// Function to make the API call
function makeApiCall(userMessage) {
  fetch("https://localhost:7168/api/OpenAI/chat", {
    method: "POST",
    headers: {
      accept: "*/*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userMessage }),
  })
    .then((response) => handleResponse(response))
    .catch((error) => handleError(error));
}

// Function to handle the API response
function handleResponse(response) {
  if (!response.body) {
    throw new Error("ReadableStream not yet supported in this browser.");
  }
  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  // Clear the loading content before starting to append new content
  const loadingMessage = document.querySelector(".loading-spinner").parentNode;
  loadingMessage.innerHTML = `
    <div class="message-avatar bot-avatar">AI</div>
    <div class="message-content bot"></div>
  `;

  let fullResponse = "";

  function read() {
    return reader.read().then(({ done, value }) => {
      if (done) {
        handleStreamComplete(fullResponse, loadingMessage);
        return;
      }

      // Decode the incoming bytes into a string
      const chunk = decoder.decode(value, { stream: true });
      fullResponse += chunk;

      // Update the message content with the current full response
      updateMessageContent(fullResponse, loadingMessage);

      // Keep reading until done
      return read();
    });
  }
  return read();
}

// Function to handle stream completion
function handleStreamComplete(fullResponse, loadingMessage) {
  console.log("Stream complete");

  // Render the full response with Markdown
  const contentDiv = loadingMessage.querySelector(".message-content");
  contentDiv.innerHTML = marked.parse(fullResponse);

  // Add copy button for the entire response
  addCopyButton(fullResponse, contentDiv);

  // Highlight code blocks and add copy buttons after appending content
  highlightCodeBlocks(loadingMessage);

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Function to update the message content
function updateMessageContent(fullResponse, loadingMessage) {
  const contentDiv = loadingMessage.querySelector(".message-content");
  contentDiv.innerHTML = marked.parse(fullResponse);

  // Highlight code blocks
  const codeBlocks = contentDiv.querySelectorAll("pre code");
  codeBlocks.forEach((block) => {
    hljs.highlightElement(block);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
  inputField.value = ""; // Clear the input field
  inputField.style.height = "auto"; // Reset the height
}

// Function to handle errors
function handleError(error) {
  console.error("Error:", error);
  appendBotMessage(
    "Sorry, something went wrong. Please try again later.",
    chatMessages
  );
}
