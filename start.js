var express = require('express');
var app = express();
require('dotenv').config();
const port = process.env.API_PORT || 5000;

app.use(express.urlencoded());
app.use(express.json());

// Allow connections from the backend
const cors = require('cors');
app.use(cors({origin: process.env.BACKEND_DOMAIN}));

app.use('/api', require('./api/endpoints'));

app.listen(port, () => console.log(`Database API listening at http://localhost:${port}`));
