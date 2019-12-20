if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const request = require('request');
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
  // Stringify (subsriber) data object
  const jsonData = JSON.stringify(data);

  const options = {
    url: process.env.LIST_URL, // url to our list(incl. list id)
    method: 'POST',
    headers: {
      Authorization: process.env.AUTH_KEY // string needed for authorization (basic auth: myusername apikey)
    },
    body: jsonData // data posted to mailchimp
  };
  request(options, (error, response, body) => {
    if (error) {
      res.render('failure');
    } else {
      if (response.statusCode === 200) {
        res.render('success');
      } else {
        res.render('failure');
      }
    }
  });
});

app.post('/failure', (req, res) => {
  res.redirect('/');
});

app.post('/success', (req, res) => {
  res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
