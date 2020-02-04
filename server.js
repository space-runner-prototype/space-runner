const express = require('express');
const app = express();
const path = require('path');
const PORT = 8081;

// you'll of course want static middleware so your browser can request things like your 'bundle.js'
app.use(express.static(__dirname));

// Any routes or other various middlewares should go here!

// Make sure this is right at the end of your server logic!
// The only thing after this might be a piece of middleware to serve up 500 errors for server problems
// (However, if you have middleware to serve up 404s, that go would before this as well)
app.get('*', function(req, res, next) {
  res.sendFile(path.join(__dirname, './index.html'));
});

// app.get('/camtest', function (req, res, next) {
//     res.sendFile(path.join(__dirname, './camtest/camtest.html'))
// })

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  app.listen(process.env.PORT || PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  );
};

startListening();
