// server.mjs

import express from 'express';
import bodyParser from 'body-parser';
import ical from 'node-ical';
import cors from 'cors'; // Import the CORS middleware

const app = express();
app.use(bodyParser.raw({ type: 'text/calendar' }));
app.use(cors()); // Enable CORS middleware

app.post('/upload', (req, res) => {
    console.log('Received a POST request');
    const icsData = req.body.toString('utf-8');
    const data = ical.parseICS(icsData, function (err, data) {
        if (err) console.log(err);
        const jsonData = JSON.stringify(data);
        //console.log(jsonData);
        res.send(jsonData);
    });

});



const port = 3000;
app.listen(port, () => {
    console.log(`Server (backend) is running on http://localhost:${port}`);
});
