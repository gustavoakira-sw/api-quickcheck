document.addEventListener('DOMContentLoaded', function() {
  const inputText = document.getElementById('inputText');
  const urlSelect = document.getElementById('urlSelect');
  const fetchButton = document.getElementById('fetchButton');
  const output = document.getElementById('output');

  fetchButton.addEventListener('click', async () => {
    const selectedUrl = urlSelect.value;
    const inputValue = inputText.value;
    const urlWithInput = selectedUrl + encodeURIComponent(inputValue);

    urlDisplay.textContent = `${urlWithInput}`;

    try {
      const response = await fetch(urlWithInput, { redirect: 'follow' });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Content type is not JSON');
      }

      const jsonData = await response.json();

      // Limit the displayed JSON to a certain number of characters
      const maxDisplayLength = 1000; // You can adjust this value
      const truncatedJson = JSON.stringify(jsonData, null, 2).slice(0, maxDisplayLength);
      
      // Display the truncated JSON within a scrollable area
      output.innerHTML = `<pre style="max-height: 700px; overflow-y: auto;">${truncatedJson}</pre>`;
    } catch (error) {
      output.innerHTML = 'Error fetching or parsing JSON';
      console.error(error);
    }
  });
});
