// Get the list of allowed websites from storage
chrome.storage.sync.get('allowedWebsites', function(data) {
    var allowedWebsites = data.allowedWebsites;
    
    // Check if the current website is allowed
    if (allowedWebsites.indexOf(window.location.hostname) === -1) {
      // Redirect to a custom "blocked" page
      window.location.href = chrome.runtime.getURL("blocked.html");
    }
  });
  