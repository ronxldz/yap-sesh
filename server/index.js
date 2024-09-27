require("dotenv").config();
const express = require("express");
const cors = require("cors");
const axios = require("axios").default;

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());

// Log all environment variables for debugging
console.log("All environment variables:", process.env);

// Log the YELP_KEY specifically
console.log("YELP_KEY:", process.env.YELP_KEY);

// Endpoint to fetch restaurants from Yelp API
app.get("/api/yelp", async (req, res) => {
  const { location, categories } = req.query;

  // Log received parameters
  console.log(`Received request for location: ${location}, categories: ${categories}`);

  // Construct the Yelp API URL
  const YELP_API_URL = `https://api.yelp.com/v3/businesses/search?location=${encodeURIComponent(location)}&categories=${encodeURIComponent(categories)}&sort_by=best_match&limit=50`;

  try {
    // Make request to Yelp API
    const response = await axios.get(YELP_API_URL, {
      headers: {
        Authorization: `Bearer ${process.env.YELP_KEY}`,
        "Content-Type": "application/json",
      },
    });

    // Log the status and data from the response
    console.log("Yelp API response status:", response.status);
    console.log("Yelp API response data:", response.data);

    // Send back the data to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching data from Yelp:", error.message);

    // Handle specific error messages from Yelp API if needed
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
      res.status(error.response.status).json({ error: error.response.data });
    } else if (error.request) {
      console.error("No response received:", error.request);
      res.status(500).json({ error: "No response received from Yelp API." });
    } else {
      console.error("Error message:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
