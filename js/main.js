const express = require('express');
const app = express();
const router = require('./router');

app.set('view engine', 'html');
app.engine('html', require('express-art-template'));
app.use(router);

app.listen(3000, () => console.log('Server running on port 3000'));