const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

const mongoose = require('mongoose');

let bodyParser = require('body-parser');
let multer = require('multer');
let upload = multer();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const budgetModel = require('./models/schema');

let url = 'mongodb://localhost:27017/personal_budget';

app.post("/mybudget",upload.array(), (request, response)=> {
  let newData={
      "title":request.body.title,
      "budget": request.body.budget,
      "color":request.body.color
      };
  
  mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
      .then(()=>{
          console.log("Connected to the database...")
           // Insertion
          budgetModel.insertMany(newData)
              .then((data)=>{
                  //response.send("Data inserted successfully into database");
                  response.send(data);
                  mongoose.connection.close()
              })
              .catch((connectionError)=>{
                  console.log(connectionError)
              })
      })
      .catch((connectionError)=>{
          console.log(connectionError)
      })
});

app.get("/budget",upload.array(), (request, response)=> {
mongoose.connect(url,{ useNewUrlParser: true, useUnifiedTopology: true })
      .then(()=>{
          console.log("Connected to database")
          budgetModel.find({})
                  .then((data)=>{
                          response.json(data);
                      mongoose.connection.close()
                  })
                  .catch((connectionError)=>{
                      console.log(connectionError)
                  })
      })
      .catch((connectionError)=>{
          console.log(connectionError)
      })
});

app.use("/", express.static("public"));


app.listen(port, () => {
  console.log(`app served at http://localhost:${port}`);
});
