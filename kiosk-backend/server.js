const express = require('express');
const cors = require('cors');

const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// In-memory store for sync sessions
// Map<sessionId, { status: "waiting" | "success", data: any }>
const syncSessions = new Map();

// Endpoint for Mobile App to POST the JSON payload
app.post('/api/complaint-sync/:sessionId', (req, res) => {
  const { sessionId } = req.params;
  const payload = req.body;

  if (!payload) {
    return res.status(400).json({ error: 'Payload is required' });
  }

  // Update session status to success and save the data
  syncSessions.set(sessionId, { status: 'success', data: payload });
  
  console.log(`[SYNC] Received data for session: ${sessionId}`);
  
  res.json({ message: 'Data received successfully', status: 'success' });
});

// Endpoint for Kiosk to POLL for the JSON payload
app.get('/api/complaint-sync/:sessionId', (req, res) => {
  const { sessionId } = req.params;

  // If session doesn't exist yet in the map, it means it's still waiting
  if (!syncSessions.has(sessionId)) {
    return res.json({ status: 'waiting' });
  }

  // Retrieve session data
  const sessionData = syncSessions.get(sessionId);

  // If successfully fetched, optionally clean up memory to prevent memory leaks over time
  // Wait, if the kiosk polls and receives it, we can remove it after short delay, 
  // or just send it immediately. We will send it and let it be overwritten later or cleaned up.
  res.json(sessionData);
});

// Optional: Endpoint to clear session data after Kiosk confirms receipt (to prevent memory leak)
app.post('/api/complaint-sync/:sessionId/clear', (req, res) => {
  const { sessionId } = req.params;
  syncSessions.delete(sessionId);
  res.json({ message: 'Session cleared' });
});

app.listen(PORT, () => {
  console.log(`Kiosk Backend running on http://localhost:${PORT}`);
});
