const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');

const app = express();

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());

app.listen(3000, () => console.log('Example app listening on port 3000!\n'));
