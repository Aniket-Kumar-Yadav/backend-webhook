// In-memory counters (server restart hone par reset ho jaayenge)

// HTTP requests counter
const httpRequests = {};

// Webhook result counter
const webhookRequests = {};

// Helper function: counter badhane ke liye
const increment = (store, key) => {
  store[key] = (store[key] || 0) + 1;
};

// 👉 Har HTTP request ke liye
const recordHttpRequest = (path, status) => {
  const label = `path="${path}",status="${status}"`;
  increment(httpRequests, label);
};

// 👉 Sirf webhook ke result ke liye
const recordWebhookResult = (result) => {
  const label = `result="${result}"`; // created / duplicate / invalid_signature
  increment(webhookRequests, label);
};

// 👉 /metrics endpoint ke liye output
const renderMetrics = () => {
  let output = "";

  // http_requests_total
  for (const [labels, value] of Object.entries(httpRequests)) {
    output += `http_requests_total{${labels}} ${value}\n`;
  }

  // webhook_requests_total
  for (const [labels, value] of Object.entries(webhookRequests)) {
    output += `webhook_requests_total{${labels}} ${value}\n`;
  }

  return output || "# no metrics yet\n";
};

module.exports = {
  recordHttpRequest,
  recordWebhookResult,
  renderMetrics,
};
