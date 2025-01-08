require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const MenuItem = require('./menuItem');

const app = express();
const port = 3010;
const MONGO_URI = process.env.MONGO_URI;

// app.use(express.static('static'));
app.use(express.json());

// app.get('/', (req, res) => {
//   res.sendFile(resolve(__dirname, 'pages/index.html'));
// });
mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => console.log('Error connecting to MongoDB:', error));

  app.post('/menu', async (req,res)=>{
    const {name, description, price}=req.body;
    if(!name|| !price){
      return res.status(400).json({message: 'Name and price required.'})
    }
    try {
      const newMenuItem=new MenuItem({
        name,
        description, 
        price
      });
      await newMenuItem.save();
      res.status(201).json({message:'Menu item created successfully', item:newMenuItem})
    } catch (error) {
      res.status(500).json({message: 'Failed to create menu item', error})
    }
  })
  app.get('/menu',async (req,res)=>{
    try {
      const menuItems=await MenuItem.find();
      res.status(200).json(menuItems)
    } catch (error) {
      res.status(500).json({message: 'Failed to fetch menu items', error})
    }
  })

app.put('/menu/:id', async (req, res)=>{
  const {id}= req.params;
  const {name, description, price}=req.body;

  if(!name||!price){
    return res.status(400).json({message: 'Name and price are required'})
  }
  try {
    const updatedMenuItem = await MenuItem.findByIdAndUpdate(
      id,
      { name, description, price },
      { new: true }
    );

    if (!updatedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    res.status(200).json({ message: 'Menu item updated successfully!', item: updatedMenuItem });
  } catch (error) {
    res.status(500).json({ message: 'Error updating menu item', error });
  }
});
app.delete('/menu/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMenuItem = await MenuItem.findByIdAndDelete(id);

    if (!deletedMenuItem) {
      return res.status(404).json({ message: 'Menu item not found.' });
    }

    res.status(200).json({ message: 'Menu item deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting menu item', error });
  }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
