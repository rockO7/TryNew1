// Function to format the message (preserve newlines)
function formatMessage(message) {
  return message.replace(/\n/g, "<br>");
}

// Function to copy text to clipboard
function copyToClipboard(text, button) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      const originalHTML = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i>';
      button.classList.add("copied");
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove("copied");
      }, 2000);
    })
    .catch((err) => {
      console.error("Failed to copy text: ", err);
      button.innerHTML = '<i class="fas fa-times"></i> Failed!';
      button.classList.add("copy-failed");
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove("copy-failed");
      }, 2000);
    });
}

// Function to add copy button
function addCopyButton(fullResponse, contentDiv) {
  const copyResponseButton = document.createElement("button");
  copyResponseButton.innerHTML = '<i class="fas fa-copy"></i>';
  copyResponseButton.classList.add("copy-button");
  copyResponseButton.addEventListener("click", (e) =>
    copyToClipboard(fullResponse, e.target)
  );
  contentDiv.prepend(copyResponseButton);
}

// Function to highlight code blocks
function highlightCodeBlocks(loadingMessage) {
  const codeBlocks = loadingMessage.querySelectorAll("pre code");
  codeBlocks.forEach((block, index) => {
    hljs.highlightElement(block);

    const wrapper = document.createElement("div");
    wrapper.classList.add("code-wrapper");
    block.parentNode.insertBefore(wrapper, block);
    wrapper.appendChild(block);

    const languageName = block.classList[0]?.replace("language-", "");
    if (languageName) {
      const languageTag = document.createElement("div");
      languageTag.classList.add("language-tag");
      languageTag.textContent = languageName;
      wrapper.insertBefore(languageTag, block);
    }

    const copyButton = document.createElement("button");
    copyButton.innerHTML = '<i class="fas fa-copy"></i>';
    copyButton.classList.add("copy-button", "code-copy-button");
    copyButton.addEventListener("click", (e) =>
      copyToClipboard(block.textContent, e.target)
    );
    wrapper.insertBefore(copyButton, block);
  });
}
