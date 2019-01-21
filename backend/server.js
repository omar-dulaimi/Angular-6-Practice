const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

import Issue from './models/issue';
import { nextTick } from 'q';

const app = express();
const router = express.Router();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

mongoose.connect('mongodb://test:test123@ds163044.mlab.com:63044/testing');
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully!');
});

router.route('/issues').get((req, res) => {
  Issue.find((err, issues) => {
    if (err) {
      console.log(err);
    } else {
      res.json(issues);
    }
  });
});

router.route('/issues/:id').get((req, res) => {
  Issue.findById(req.params.id, (err, issue) => {
    if (err) {
      console.log(err);
    } else {
      res.json(issue);
    }
  });
});

router.route('/issues/add').post((req, res) => {
  let issue = new Issue(req.body);
  issue
    .save()
    .then(issue => {
      res.status(200).json({ issue: 'Added successfully!' });
    })
    .catch(err => {
      res.status(400).send('Failed to create a new record!');
      console.log(err);
    });
});

router.route('/issues/update/:id').post((req, res) => {
  Issue.findById(req.params.id, (err, issue) => {
    if (!issue) return next(new Error('Could not load document'));
    else {
      issue.title = req.body.title;
      issue.responsible = req.body.responsible;
      issue.description = req.body.description;
      issue.severity = req.body.severity;
      issue.status = req.body.status;

      issue
        .save()
        .then(issue => {
          res.json('Update done');
        })
        .catch(err => {
          res.status(400).send('Update failed');
        });
    }
  });
});

router.route('/issues/delete/:id').get((req, res) => {
  Issue.findByIdAndRemove({ _id: req.params.id }, (err, issue) => {
    if (err) res.json(err);
    else res.json('Remove successfully');
  });
});

app.use('/', router);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(4000, () => {
  console.log('Express server running on port 4000!');
});
