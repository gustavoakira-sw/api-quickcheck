document.addEventListener('DOMContentLoaded', function() {
  const inputText = document.getElementById('inputText');
  const urlSelect = document.getElementById('urlSelect');
  const fetchButton = document.getElementById('fetchButton');
  const output = document.getElementById('output');
  const urlDisplay = document.getElementById('urlDisplay');
  const urlLink = document.createElement('a');

  urlSelect.addEventListener('change', updateButtonState);
  inputText.addEventListener('input', updateButtonState);

  // Add event listener for Enter key press in the inputText
  inputText.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!fetchButton.disabled) {
        fetchJson();
      }
    }
  });

  // Add event listener for Fetch button click
  fetchButton.addEventListener('click', fetchJson);

  // Function to update button state based on selected option and input text
  function updateButtonState() {
    const selectedOption = urlSelect.value;
    const inputValue = inputText.value;
    const isInputBlank = inputValue.trim() === '';

    fetchButton.disabled = selectedOption === '' || isInputBlank;
  }

  async function fetchJson() {
    const selectedUrl = urlSelect.value;
    const inputValue = inputText.value;
    const urlWithInput = selectedUrl + encodeURIComponent(inputValue);

    urlLink.textContent = urlWithInput;
    urlLink.href = urlWithInput;
    urlLink.target = '_blank';

    urlDisplay.appendChild(urlLink);

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

      // Process output JSON
      const maxDisplayLength = 1000; // Adjust at will
      const truncatedJson = JSON.stringify(jsonData, null, 2).slice(0, maxDisplayLength);
      
      // Display the truncated JSON within a scrollable area
      output.innerHTML = `<pre style="max-height: 700px; overflow-y: auto;">${truncatedJson}</pre>`;
    } catch (error) {
      output.innerHTML = 'Error fetching or parsing JSON';
      console.error(error);
    }
  }
});
