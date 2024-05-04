// Import necessary modules
import express from 'express';
import { readFile, writeFile } from 'fs/promises';
import path from "path";

// Create an Express application
const app = express();

// Define the path to the data file
const __dirname = import.meta.dirname;
const pathFile = path.join(__dirname, '/data/data.deportes.json');

// Middleware to serve static files from the 'public' directory
app.use(express.static(__dirname + '/public'));

// Middleware to parse JSON requests
app.use(express.json());

// Middleware to parse URL-encoded requests
app.use(express.urlencoded({ extended: true }));

// Route to add a new sport
app.get('/agregar', async (req, res) => {
    const { nombre, precio } = req.query;

    // Validate input parameters
    if (!nombre || !precio) {
        return res.status(400).json({ ok: false, msg: "Todos los campos son obligatorios" });
    }

    try {
        // Read the existing data file
        const data = await readFile(pathFile, 'utf8');
        const deportes = JSON.parse(data);

        // Add the new sport
        deportes.push({ nombre, precio });

        // Write the updated data back to the file
        await writeFile(pathFile, JSON.stringify(deportes, null, 2));

        return res.json({ Mensaje: "Deporte agregado correctamente" });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: "Error, intente nuevamente" });
    }
});

// Route to get all sports
app.get('/deportes', async (req, res) => {
    try {
        // Read the data file and send the list of sports
        const data = await readFile(pathFile, 'utf8');
        const deportes = JSON.parse(data);
        return res.json({ deportes });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: "Error no hay deportes registrados" });
    }
});

// Route to edit the price of a sport
app.put('/editar', async (req, res) => {
    try {
        // Extract parameters from the request
        const { nombre, precio, precioNuevo } = req.query;

        // Read the data file
        const data = await readFile(pathFile, 'utf8');
        let deportes = JSON.parse(data);

        // Find the index of the sport to be edited
        const indexSports = deportes.findIndex(item => item.nombre === nombre && item.precio === precio);

        // If the sport is not found, return 404
        if (indexSports === -1) {
            return res.status(404).json({ ok: false, Mensaje: "No se encontró el deporte" });
        }

        // Update the price of the sport
        deportes[indexSports].precio = precioNuevo;

        // Write the updated data back to the file
        await writeFile(pathFile, JSON.stringify(deportes, null, 2));

        return res.json({ mensaje: "Precio actualizado", deportes });
    } catch (error) {
        return res.status(500).json({ ok: false, msg: "Error" });
    }
});

// Route to delete a sport
app.get('/eliminar', async (req, res) => {
    try {
        // Extract parameters from the request
        const { nombre } = req.query;

        // Read the data file
        const data = await readFile(pathFile, 'utf8');
        let deportes = JSON.parse(data);

        // Find the sport to be deleted
        const deporte = deportes.find(item => item.nombre === nombre);

        // If the sport is not found, return 404
        if (!deporte) return res.status(404).json({ ok: false, msg: "deporte no encontrado" });

        // Filter out the deleted sport
        const newDeporte = deportes.filter(item => item !== deporte);

        // Write the updated data back to the file
        await writeFile(pathFile, JSON.stringify(newDeporte));

        return res.json(newDeporte);
    } catch (error) {
        return res.status(500).json({ ok: false, msg: "Error" });
    }
});

// Set up the server to listen on the specified port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('Server running on port: ' + PORT);
});
