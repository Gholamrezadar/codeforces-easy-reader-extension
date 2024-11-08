"use strict";

console.log("Hello, world from ghd popup!")

function setBadgeText(enabled) {
    const text = enabled ? "On" : "Off"
    void chrome.action.setBadgeText({text: text})
}

document.addEventListener("DOMContentLoaded", () => {
    const checkbox = document.getElementById("applyChanges");
  
    // Load stored checkbox state
    chrome.storage.local.get("applyChanges", (data) => {
      checkbox.checked = !!data.applyChanges;
      setBadgeText(!!data.applyChanges);
    });
  
    // Listen for checkbox changes
    checkbox.addEventListener("change", () => {
      const isChecked = checkbox.checked;
  
      // Save state to local storage
      chrome.storage.local.set({ applyChanges: isChecked });

      void setBadgeText(isChecked);
  
      // Send message to content script to update page
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { applyChanges: isChecked });
      });
    });
  });
  