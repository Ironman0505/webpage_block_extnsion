let allowedWebsites = [];

chrome.storage.sync.get(['websites'], function(result) {
  allowedWebsites = result.websites || [];
  displayAllowedWebsites();
});

function addWebsite() {
  let websiteInput = document.getElementById('websiteInput');
  let website = websiteInput.value.trim();

  if (website !== '') {
    if (!allowedWebsites.includes(website)) {
      allowedWebsites.push(website);

      chrome.storage.sync.set({websites: allowedWebsites}, function() {
        websiteInput.value = '';
        displayStatusMessage(`${website} has been added to the allowed websites list.`);
        displayAllowedWebsites();
      });
    } else {
      displayStatusMessage(`${website} is already in the allowed websites list.`);
    }
  }
}

function removeWebsite() {
  let websiteInput = document.getElementById('websiteInput');
  let website = websiteInput.value.trim();
  let index = allowedWebsites.indexOf(website);

  if (index !== -1) {
    allowedWebsites.splice(index, 1);

    chrome.storage.sync.set({websites: allowedWebsites}, function() {
      websiteInput.value = '';
      displayStatusMessage(`${website} has been removed from the allowed websites list.`);
      displayAllowedWebsites();
    });
  } else {
    displayStatusMessage(`${website} is not in the allowed websites list.`);
  }
}

function displayStatusMessage(message) {
  let statusDiv = document.getElementById('statusDiv');
  statusDiv.innerHTML = message;

  setTimeout(function() {
    statusDiv.innerHTML = '';
  }, 3000);
}

function checkWebsite(url) {
  for (let i = 0; i < allowedWebsites.length; i++) {
    if (url.startsWith(allowedWebsites[i])) {
      return true;
    }
  }

  return false;
}

function displayAllowedWebsites() {
  let allowedList = document.getElementById('allowedList');
  allowedList.innerHTML = '';

  for (let i = 0; i < allowedWebsites.length; i++) {
    let li = document.createElement('li');
    li.textContent = allowedWebsites[i];
    allowedList.appendChild(li);
  }
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status === 'loading') {
    let url = tab.url;

    if (!checkWebsite(url)) {
      chrome.tabs.update(tabId, {url: chrome.extension.getURL('blocked.html')});
    }
  }
});

document.addEventListener('DOMContentLoaded', function() {
  let addButton = document.getElementById('addButton');
  addButton.addEventListener('click', addWebsite);

  let removeButton = document.getElementById('removeButton');
  removeButton.addEventListener('click', removeWebsite);
});
