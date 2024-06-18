const express = require('express');
const fs = require('fs');
const https = require('https');

const app = express();
const port = 3100;

const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

app.use(express.json());

let items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
];

// Get all items
app.get('/api/items', (req, res) => {
    res.json(items);
});

// Get item by ID
app.get('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);

    if (!item) {
        return res.status(404).send('Item not found');
    }

    res.json(item);
});

// Create new item
app.post('/api/items', (req, res) => {
    const newItem = {
        id: items.length + 1,
        name: req.body.name,
    };

    items.push(newItem);
    res.status(201).json(newItem);
});

// Update item by ID
app.put('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const item = items.find(item => item.id === id);

    if (!item) {
        return res.status(404).send('Item not found');
    }

    item.name = req.body.name;
    res.json(item);
});

// Delete item by ID
app.delete('/api/items/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const itemIndex = items.findIndex(item => item.id === id);

    if (itemIndex === -1) {
        return res.status(404).send('Item not found');
    }

    items.splice(itemIndex, 1);
    res.status(204).send();
});

https.createServer(options, app).listen(port, () => {
    console.log(`Server is running securely on https://localhost:${port}`);
});