const express = require('express');
const router = express.Router();
const mainCtrl = require('./APIdemo');

var app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.render('home')
});

app.get('/api/:groupId/:reportId', mainCtrl.embedReportApi);
app.get('/report/:groupId/:reportId', mainCtrl.embedReport);

app.listen(4000, () => console.log('Example app listening on port 4000!'));

module.exports = router;