// Ensure table script runs after the DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  // Grab references to HTML elements
  const tableBody = document.getElementById("tableBody");
  const searchInput = document.getElementById("searchInput");

  // Format a number as currency (e.g., $12.50)
  function formatCurrency(value) {
    const num = Number(value) || 0;
    return `$${num.toFixed(2)}`;
  }

  // Populate the table with the provided list of items
  function renderTable(items) {
    // Clear previous rows
    tableBody.innerHTML = "";

    // Show feedback if no rows match search
    if (items.length === 0) {
      tableBody.innerHTML = `
        <tr>
          <td colspan="6" class="no-results">No transactions found.</td>
        </tr>
      `;
      return;
    }

    // Build and append each table row
    items.forEach((item) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${item.invoiceno}</td>
        <td>${item.description}</td>
        <td class="text-right">${Number(item.quantity).toLocaleString()}</td>
        <td class="text-right">${formatCurrency(item.unitprice)}</td>
        <td>${item.country}</td>
        <td class="text-right">${formatCurrency(item.total_amount)}</td>
      `;

      tableBody.appendChild(row);
    });
  }

  // Filter transactions live based on user input
  function handleSearch() {
    const query = searchInput.value.trim().toLowerCase();

    // Filter by invoice number, product description, or country
    const filteredData = data.filter((item) => {
      const invoice = String(item.invoiceno).toLowerCase();
      const description = String(item.description).toLowerCase();
      const country = String(item.country).toLowerCase();

      return (
        invoice.includes(query) ||
        description.includes(query) ||
        country.includes(query)
      );
    });

    renderTable(filteredData);
  }

  // Attach input event for instant filtering as the user types
  searchInput.addEventListener("input", handleSearch);

  // Initial table render with all data
  if (typeof data !== "undefined" && Array.isArray(data)) {
    renderTable(data);
  } else {
    console.error("Global array 'data' was not found.");
  }
});