const express = require('express');
const db = require('./db');

const app = express();
app.set('port', process.env.PORT || 5000);

const isURL = require('validator').isURL

app.get('/new/:url(*)', (req, res) => {
  const host = req.headers.host;
  let newUrl = req.params.url;
  if (!isURL(newUrl)) {
    res.json({
      error: 'Invalid URL'
    });
    return;
  }
  db.find({url: newUrl}, (err, docs) => {
    if (err) {
      res.json({
        error: 'Something went wrong on the server'
      });
      return;
    }
    let doc = docs[0];
    if (doc) {
      res.json({
        url: host + '/' + doc._id,
        original: doc.url
      });
      return;
    }
    newUrl = newUrl.startsWith('http') ? 
              newUrl :
              'http://' + newUrl;
    db.create({url: newUrl}, (err, doc) => {
      if (err) {
        res.json({
          error: 'Something went wrong on the server'
        });
        return;
      }
      res.json({
        url: host + '/' + doc._id,
        original: doc.url
      });
      return;
    });
  });
});

app.get('/:id', (req, res) => {
  let _id = req.params.id;
  db.find({_id: _id}, (err, docs) => {
    if (err) {
      res.json({
        error: 'Something went wrong on the server'
      });
      return;
    }
    let doc = docs[0];
    if (doc) {
      res.redirect(doc.url);
      return;
    }
    // todo: did you want to create a url?
    // res.json({error: });
  });
});

app.get('/', (req, res) => {

});

app.get('/*', (req, res) => {
  // redirect to landing page
  res.redirect('/');
});

app.listen(app.get('port'), () => {
  console.log(`listening on port ${app.get('port')}...`);
});