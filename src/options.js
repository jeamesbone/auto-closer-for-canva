// Saves options to chrome.storage
const saveOptions = () => {
    const delayValue = document.getElementById('delay').value;
  
    chrome.storage.sync.set({ "delay": delayValue }).then(() => {
        // Update status to let user know options were saved.
        const status = document.getElementById('status');
        status.style.display = 'flex'
        setTimeout(() => {
          status.style.display = 'none'
        }, 1000);
      });
  };
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  const restoreOptions = () => {
    chrome.storage.sync.get(["delay"]).then((result) => {
        console.log(result)
        document.getElementById('delay').value = result.delay ?? 5;
      }
    );
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click', saveOptions);
  