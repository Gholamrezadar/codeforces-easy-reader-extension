// Store original content of each <p> tag
let originalContent = [];

// Function to save original content of each <p> in .problem-statement
function saveOriginalContent() {
  const paragraphs = document.querySelectorAll(".problem-statement p");
  originalContent = Array.from(paragraphs).map(paragraph => paragraph.innerHTML);
}

// Function to revert content to original
function revertContent() {
  const paragraphs = document.querySelectorAll(".problem-statement p");
  paragraphs.forEach((paragraph, index) => {
    if (originalContent[index] !== undefined) {
      paragraph.innerHTML = originalContent[index];
    }
  });
}

function transformWord(word) {
    // words of length 1
    if(word.length == 1) {
        return `<span class="bold">${word}</span>`;
    }
    // words of length 2
    else if(word.length == 2) {
        return `<span class="bold">${word}</span>`;
    }
    // 'this'
    else if(word.toLowerCase() == "d") {
        return `<span class="bold">${word}</span>`;
    }
    
    if (word.length > 2 && word.length < 7) {
        // Wrap the first letter in a span for bold styling
        return `<span class="bold">${word.slice(0, 2)}</span>${word.slice(2)}`;
    }

    if (word.length >= 7) {
        // Wrap the first letter in a span for bold styling
        return `<span class="bold">${word.slice(0, word.length/3)}</span>${word.slice(word.length/3)}`;
    }
    return word;
}


function makeFirstLetterBold() {
    const paragraphs = document.querySelectorAll(".problem-statement p");

    let index = 0;
    paragraphs.forEach((paragraph) => {
        console.log(`Processing paragraph: ${index}`);
        index++;
        // create an empty paragraph. we will add the updated content to this paragraph
        let newParagraph = document.createElement("p");

        // Traverse all child nodes of the paragraph
        paragraph.childNodes.forEach((node) => {
            // Only process text nodes (nodeType 3)
            if (node.nodeType === Node.TEXT_NODE) {
                // Split the text content by spaces to get words
                const words = node.textContent.split(" ");
                const transformedWords = words.map((word) => {
                    return transformWord(word);
                });

                // Replace the text node content with transformed HTML
                const newHTML = transformedWords.join(" ");
                const tempDiv = document.createElement("span");
                tempDiv.innerHTML = newHTML;

                // console.log(tempDiv.innerHTML);

                // add the transformed HTML to the new paragraph
                newParagraph.appendChild(tempDiv);
            }
            else {
                // add the original node to the new paragraph
                newParagraph.appendChild(node.cloneNode(true));
            }

        });

        // add the new paragraph to the end of body
        // document.body.appendChild(newParagraph);
        // replace the original paragraph with the new paragraph
        paragraph.parentNode.replaceChild(newParagraph, paragraph);
    });
}

// Helper function to add or remove CSS file
function toggleStylesheet(isChecked) {
    const cssLinkId = "custom-style";

    if (isChecked) {
        // Inject CSS if it's not already added
        if (!document.getElementById(cssLinkId)) {
            const link = document.createElement("link");
            link.id = cssLinkId;
            link.rel = "stylesheet";
            link.href = chrome.runtime.getURL("styles.css");
            document.head.appendChild(link);
        }
        saveOriginalContent();
        makeFirstLetterBold();
    } else {
        // Remove CSS if checkbox is unchecked
        const link = document.getElementById(cssLinkId);
        if (link) link.remove();
        revertContent();
    }
}

// Load state from storage and apply changes on page load
chrome.storage.local.get("applyChanges", (data) => {
    toggleStylesheet(!!data.applyChanges);
});

// Listen for messages from the popup to apply or remove changes dynamically
chrome.runtime.onMessage.addListener((message) => {
    if (message.applyChanges !== undefined) {
        toggleStylesheet(message.applyChanges);
    }
});
