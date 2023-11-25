const express = require('express')
const app = express();
const cors = require('cors');
const jwtToken = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//fitness
//az49cXpwdyXLXnTS
//middleWare
app.use(cors());
app.use(express.json())




const uri = `mongodb+srv://${process.env.NAME_DB}:${process.env.PASS_DB}@cluster0.etfhytw.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const serviceCollection = client.db('fitness').collection('services')
    const teamCollection = client.db('fitness').collection('team')
    const subCollection = client.db('fitness').collection('subscribe')
    const blogCollection = client.db('fitness').collection('blogs')
    const reviewsCollection = client.db('fitness').collection('reviews')
    

    //services related api
    app.get('/services', async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    });
    //reviews related api
    app.get('/reviews', async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });

    

    //team related api
     app.get('/team', async (req, res) => {
      const result = await teamCollection.find().toArray();
      res.send(result);
     });
    //blog related api

     app.get('/blogs', async (req, res) => {
      const result = await blogCollection.find().toArray();
      res.send(result);
     });
    
    app.get('/blogs/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await blogCollection.findOne(query);
      res.send(result);
    })
    //subscribe related api
    app.post('/subUser', async (req, res) => {
      const result = await subCollection.insertOne(req.body);
      res.send(result);
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})