if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const https = require('https');
const express = require('express');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('signup');
});

app.post('/', (req, res) => {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;

  // Data obj used by mailchimp api to add data to the list (audience)
  const data = {
    members: [
      {
        email_address: email,
        status: 'subscribed',
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  };

  const jsonData = JSON.stringify(data);
  // url to our list(incl. list id)
  const url = process.env.LIST_URL;

  const options = {
    method: 'POST',
    auth: process.env.AUTH_KEY //  (auth string : 'username:apikey')
  };

  const request = https.request(url, options, response => {
    if (response.statusCode === 200) {
      res.render('success');
    } else {
      res.render('failure');
    }
    response.on('data', data => {
      console.log(JSON.parse(data));
    });
  });

  // post the data to the server
  request.write(jsonData);
  request.end();
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.post('/success', (req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
