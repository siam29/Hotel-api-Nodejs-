const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const PORT = 3001;
app.use(express.json());

const DATA_FILE = "./hotels.json";

// Utility function to check if the file exists
const fileExists = (filePath) => fs.existsSync(filePath);

// Utility function to read the JSON file
const readData = () => {
  try {
    if (!fileExists(DATA_FILE)) {
      // If the file doesn't exist, create a default structure
      writeData({ hotels: [] });
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading data:", error);
    return { hotels: [] }; // Return an empty structure on error
  }
};

// Utility function to write to the JSON file
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Error writing data:", error);
  }
};

// 1. Get all hotels
app.get("/hotels", (req, res) => {
  const data = readData();
  res.json(data);
});

// 2. Get a hotel by ID
app.get("/hotels/:id", (req, res) => {
  const data = readData();
  const hotel = data.hotels.find((h) => h.id === parseInt(req.params.id));
  if (hotel) {
    res.json(hotel);
  } else {
    res.status(404).send("Hotel not found");
  }
});

// 3. Add a new hotel
app.post("/hotels", (req, res) => {
  const data = readData();
  const newHotel = {
    id: data.hotels.length + 1,
    name: req.body.name,
    location: req.body.location,
    rooms: req.body.rooms,
    rating: req.body.rating,
  };
  data.hotels.push(newHotel);
  writeData(data);
  res.status(201).json(newHotel);
});

// 4. Update an existing hotel
app.put("/hotels/:id", (req, res) => {
  const data = readData();
  const hotelIndex = data.hotels.findIndex((h) => h.id === parseInt(req.params.id));
  if (hotelIndex !== -1) {
    data.hotels[hotelIndex] = { ...data.hotels[hotelIndex], ...req.body };
    writeData(data);
    res.json(data.hotels[hotelIndex]);
  } else {
    res.status(404).send("Hotel not found");
  }
});

// Start the server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app; // This is necessary for testing

