// Ensure chart initializes after the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check if data is available from data.js
  if (typeof data === "undefined" || !Array.isArray(data)) {
    console.error("Global array 'data' was not found for chart generation.");
    return;
  }

  // 1. Group and accumulate total quantity sold by product description
  const productQuantities = {};

  data.forEach((item) => {
    const description = item.description || "Unknown";
    const quantity = Number(item.quantity) || 0;

    // Add quantity to existing sum or start a new key
    if (productQuantities[description]) {
      productQuantities[description] += quantity;
    } else {
      productQuantities[description] = quantity;
    }
  });

  // 2. Convert object to an array of [description, totalQuantity] pairs
  const productArray = Object.keys(productQuantities).map((description) => {
    return {
      description: description,
      totalQuantity: productQuantities[description]
    };
  });

  // 3. Sort descending by quantity and take the top 10 items
  productArray.sort((a, b) => b.totalQuantity - a.totalQuantity);
  const top10Products = productArray.slice(0, 10);

  // 4. Split sorted objects into separate arrays for Chart.js labels & data
  const chartLabels = top10Products.map((p) => p.description);
  const chartData = top10Products.map((p) => p.totalQuantity);

  // 5. Render the bar chart using Chart.js
  const canvasElement = document.getElementById("salesChart");

  new Chart(canvasElement, {
    type: "bar",
    data: {
      labels: chartLabels,
      datasets: [
        {
          label: "Total Units Sold",
          data: chartData,
          backgroundColor: "rgba(49, 130, 206, 0.75)",
          borderColor: "rgba(49, 130, 206, 1)",
          borderWidth: 1,
          borderRadius: 4
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: "top"
        },
        tooltip: {
          callbacks: {
            label: (context) => ` Units sold: ${context.parsed.y.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            // Shorten long labels to keep the chart tidy
            callback: function (value) {
              const label = this.getLabelForValue(value);
              return label.length > 15 ? label.substr(0, 15) + "…" : label;
            }
          }
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: "Quantity"
          }
        }
      }
    }
  });
});