// server.mjs

import express, { json } from 'express';
import bodyParser from 'body-parser';
import ical from 'node-ical';
import cors from 'cors'; // Import the CORS middleware

const app = express();
app.use(bodyParser.raw({ type: 'text/calendar' }));
app.use(cors()); // Enable CORS middleware

app.post('/upload', (req, res) => {
    console.log('Received a POST request');
    console.log('Raw data:', req.body.toString());

    const reqBody = req.body.toString();
    try {
        // utf8 encoded data
        const data = ical.parseICS(reqBody);
        const jsonData = JSON.stringify(data);
        if (jsonData === '{}') {
            jsonData = JSON.stringify(ical.parseICS(unescape(req.body.toString())))
        }
        console.log('Parsed ICS Data:', jsonData);
        res.send(jsonData);
        
        return;
    } catch (err) {
        console.error('Error parsing ICS data:', err);  
    }

    // iso-8859-1 encoded data
    const icsData = unescape(reqBody);
    const data = ical.parseICS(icsData);
    const jsonData = JSON.stringify(data);

    console.log('Parsed ICS Data:', jsonData);
    res.send(jsonData);

});



const port = 3000;
app.listen(port, () => {
    console.log(`Server (backend) is running on http://localhost:${port}`);
});
