const express = require("express");
const cors = require("cors");
const app = express();
const ObjectID = require("mongodb").ObjectID;
require("dotenv").config();
let port = process.env.PORT||3001;
const MongoClient = require("mongodb").MongoClient;
const uri = "mongodb+srv://root:root@cluster0.qeiix.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(express.json());
app.use(cors());

client.connect((err) => {

  const serviceCollection = client.db("Dance-Class").collection("service");
  app.post("/addServices", (req, res) => {
    const services = req.body;
    serviceCollection.insertOne(services).then((result) => res.redirect('/'));
  });

  app.get("/services", (req, res) => {
    serviceCollection.find({}).toArray((error, documents) => res.send(documents));
  });

  app.get("/services/:id", (req, res) => {
    serviceCollection.find({ _id: ObjectID(req.params.id) }).toArray((error, documents) => res.send(documents));
  });

  app.delete('/services/:id',(req,res)=>{
    serviceCollection.findOneAndDelete({_id: ObjectID(req.params.id)});
})

  const reviewCollection = client.db("Dance-Class").collection("review");
  app.post("/addReviews", (req, res) => {
    const reviews = req.body;
    reviewCollection.insertOne(reviews).then((result) => console.log(result.insertedCount));
  });

  app.get("/reviews", (req, res) => {
    reviewCollection.find({}).toArray((error, documents) =>res.send(documents));
  });

  const newAdmissionsCollection = client.db("Dance-Class").collection("admissions");
    app.post("/addAdmissions", (req, res) => {
      const newAdmissions = req.body;
      newAdmissionsCollection.insertOne(newAdmissions).then((result) => console.log(result.insertedCount));
    });

    app.get("/admissions", (req, res) => {
      newAdmissionsCollection.find({}).toArray((error, documents) => res.send(documents));
    });

    app.put("/admissions/:id", (req, res) => {
        const update = req.body.status;
        newAdmissionsCollection.updateOne({ _id: ObjectID(req.params.id) },{
          $set:{status: req.body.status}
        })
        console.log(update);
    });

    app.get('/admission',(req,res)=>{
      const queryData = req.query
      newAdmissionsCollection.find(queryData).toArray((err,documents)=>{res.json(documents)})
    })

 const adminsCollection = client.db("Dance-Class").collection("admin");
  app.post("/addAdmins", (req, res) => {
    const admins = req.body;
    adminsCollection.insertOne(admins).then((result) => console.log(result.insertedCount));
  });

  app.post("/isAdmin", (req, res) => {
    const email = req.body.email;
    adminsCollection.find({email: email}).toArray((err,documents)=>{res.send(documents.length > 0)})
  });

});

app.get("/", (req, res) => {
  res.send("Server working perfectly");
});

app.listen(port);
