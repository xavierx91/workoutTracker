const mongoose = require("mongoose");

const express = require("express");
const bodyParser = require('body-parser');
const path = require('path');
let PORT = process.env.PORT || 3001; 
mongoose.connect(
  process.env.MONGODB_URI || 'mongodb://localhost/dbWorkout',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  }
);
const Example = require("./workoutModel");

let app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '/public')));






app.get("/", (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/exercise", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'exercise.html'));
});

app.get("/stats", (req,res) => {
  res.sendFile(path.join(__dirname, 'public', 'stats.html'));
});







app.get("/api/workouts", (req,res) => {
  Example.find({}).sort({day:-1}).limit(1)
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.json(err);
  });
});

app.get("/api/workouts/range", (req,res) => {
  Example.find({})
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.json(err);
  });
});





app.put("/api/workouts/:id", (req,res) => {

let urlData = req.params;
let data = req.body;
Example.updateOne( {_id: urlData.id }, {$push: {exercises:  [
    {
    "type" : data.type,
    "name" : data.name,
    "duration" : data.duration,
    "distance" : data.distance,
    "weight" : data.weight,
    "reps" : data.reps,
    "sets" : data.sets
    }
  ] 
}}).then(dbUpdate => {
  res.json(dbUpdate);
})
.catch(err => {
  res.json(err);
});

});




app.post("/api/workouts", (req,res) => {

  let data = req.body;

  Example.create({
    day: new Date().setDate(new Date().getDate())
}).then(dbUpdate => {
      res.json(dbUpdate);
    })
    .catch(err => {
      res.json(err);
    });
});



app.listen(PORT, function() {

  console.log("Server listening on: http://localhost:" + PORT);
});