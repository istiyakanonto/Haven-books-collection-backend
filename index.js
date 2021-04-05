const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const cors =require('cors')
const bodyParser = require('body-parser')
const port = process.env.PORT || 5050
require('dotenv').config();


//middleWire
app.use(cors());
app.use(bodyParser.json());

//hello world
app.get('/', (req, res) => {
  res.send('Hello Assignment!')
})



//My Code 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uplvf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log("Connection Error",err)
  const bookCollection = client.db("book").collection("haven");
  console.log("Database Connected Successfully")

//get data 
app.get('/bookCollection', (req, res)=>{
  bookCollection.find()
  .toArray((err,items)=>{
      res.send(items)
   
  })
})


  //post data
  app.post('/addBook',(req,res) => {
    const newBook=req.body;
   bookCollection.insertOne(newBook)
   .then(result=>{
     console.log('inserted Count:',result.insertedCount)
     res.send(result.insertedCount> 0)
   })
  })
  
  // client.close();
});



//hello world display
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})