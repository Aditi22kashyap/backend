
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectToDatabase = require('./database');
const axios = require('axios');
const Product  = require('./productmodel'); // Update the filename to productModel.js

dotenv.config({ path: './.env' });
// require("dotenv").config()

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

// Connect to the database
connectToDatabase()
  .then(() => {
    // Define a route to initialize the database
    app.get('/initialize-database', async (req, res) => {
      try {
        // Fetch the JSON data from the third-party API URL
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        
        // Parse the JSON response into JavaScript objects
        const data = response.data;
        
        // Iterate over the parsed data and create new instances of the Product model
        for (const item of data) {
          const product = new Product({
            id: item.id,
            title: item.title,
            price: item.price,
            description: item.description,
            category: item.category,
            image: item.image,
            sold: item.sold,
            dateOfSale: item.dateOfSale
          });
          
          // Save the product to the database
          await product.save();
        }
        
        res.send('Database initialized successfully');
      } catch (error) {
        console.error(error);
        res.status(500).send('Error initializing database');
      }
    });
   app.get("/getproducts", async (req, res) => {
      const allproducts = await Product.find();
      res.send({
        status: "success",
        data: allproducts
      });

   });
   // Define a route to fetch transaction statistics
app.get('/statistics', async (req, res) => {
  try {
    // Retrieve the necessary statistics from the database
    const totalTransactions = await Product.countDocuments();
    const totalRevenue = await Product.aggregate([{ $group: { _id: null, total: { $sum: "$price" } } }]);
    
    // Construct the statistics object
    const statistics = {
      totalTransactions,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    };
    
    res.send(statistics);
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).send('Error fetching statistics');
  }
});

app.get('/chartdata', async (req, res) => {
  try {
    // Fetch the chart data from the database or any other source
    const chartData = [
      { month: 'January', revenue: 500 },
      { month: 'February', revenue: 750 },
      { month: 'March', revenue: 1000 },
      // Add more data as needed
    ];

    res.send(chartData);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).send('Error fetching chart data');
  }
});

    // Start the server
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
