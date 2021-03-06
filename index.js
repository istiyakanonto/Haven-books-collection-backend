const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const ObjectId = require("mongodb").ObjectID;
const bodyParser = require("express");
const port = process.env.PORT || 5050;
require("dotenv").config();

//middleWire
app.use(cors());
app.use(bodyParser.json());

//hello world
app.get("/", (req, res) => {
  res.send("Hello Assignment!");
});

//My Code
//from MongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uplvf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  console.log("Connection Error", err);
  //first Collection
  const bookCollection = client.db("book").collection("haven");
  //second collection
  const orderCollection = client.db("book").collection("order");
  console.log("Database Connected Successfully");

  //get data
  app.get("/bookCollection", (req, res) => {
    bookCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  //get data for single book
  app.get("/book/:id", (req, res) => {
    bookCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents);
      });
  });

  //post data
  app.post("/addBook", (req, res) => {
    const newBook = req.body;
    bookCollection.insertOne(newBook).then((result) => {
      //  console.log('inserted Count:',result.insertedCount)
      res.send(result.insertedCount > 0);
    });
  });

  //delete data for single book
  app.delete("/itemDelete/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    console.log("Delete this", id);
    bookCollection.findOneAndDelete({ _id: id }).then((documents) => {
      res.send(documents.deleteCount > 0);
      console.log(documents);
    });
  });
  //post data for second collection
  app.post("/addOrders", (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder).then((result) => {
      console.log(result);
      res.send(result.insertedCount > 0);
    });
  });
  //get data for second collection
  app.get("/orders", (req, res) => {
    orderCollection.find({ email: req.query.email }).toArray((err, items) => {
      res.send(items);
    });
  });
  // client.close();
});

//hello world display
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
