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
    const priceCollection = client.db('fitness').collection('price')
    const serviceCollection = client.db('fitness').collection('services')
    const teamCollection = client.db('fitness').collection('team')
    const subCollection = client.db('fitness').collection('subscribe')
    const blogCollection = client.db('fitness').collection('blogs')
    const reviewsCollection = client.db('fitness').collection('reviews')
    const usersCollection = client.db('fitness').collection('users')
    const galleryCollection = client.db('fitness').collection('gallery')
    const classesCollection = client.db('fitness').collection('classes')
    const gymClassesCollection = client.db('fitness').collection('gymclass')
    const trainerCollection = client.db('fitness').collection('trainer')
    const newTrainerCollection = client.db('fitness').collection('newTrainer')
    const bookingCollection = client.db('fitness').collection('booking')
    
    //booking related api
    app.post('/booking', async (req,res) => {
      const result = await bookingCollection.insertOne(req.body);
      res.send(result);
    })

    //services related api
    app.get('/services', async (req, res) => {
      const result = await serviceCollection.find().toArray();
      res.send(result);
    });
    //price related api
    app.get('/price', async (req, res) => {
      const result = await priceCollection.find().toArray();
      res.send(result);
    });
    //trainer related api
    app.get('/trainer', async (req, res) => {
      const result = await trainerCollection.find().toArray();
      res.send(result);
    });
    app.get('/trainer/:id', async (req, res) => {
      const id = req.params.id;
      const query = {_id : new ObjectId(id)}
      const result = await trainerCollection.findOne(query)
      res.send(result);
    });
    //gym class related api
    app.post('/gymClasses', async (req, res) => {
      const result = await gymClassesCollection.insertOne(req.body);
      res.send(result);
    })
    app.get('/gymClasses', async (req, res) => {
      const result = await gymClassesCollection.find().toArray();
      res.send(result);
    });
    app.get('/gymClasses/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await gymClassesCollection.findOne();
      res.send(result);
    });
    //class related api
    app.get('/classes', async (req, res) => {
      const result = await classesCollection.find().toArray();
      res.send(result);
    });
    //services related api
    app.get('/gallery', async (req, res) => {
      const result = await galleryCollection.find().toArray();
      res.send(result);
    });
    //reviews related api
    app.get('/reviews', async (req, res) => {
      const result = await reviewsCollection.find().toArray();
      res.send(result);
    });
    //user related api
    app.post('/users', async (req, res) => {
      const query = { email: req.body.email }
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user already exists', insertedId: null })
      }
      const result = await usersCollection.insertOne(req.body);
      res.send(result);
    });

    app.get('/users', async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    app.patch('/users/admin/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
       const updateDoc = {
      $set: {
        role: 'admin'
      },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result)
   })
    //new trainer related api
    app.post('/trainerInfo', async (req, res) => {
      const result = await newTrainerCollection.insertOne(req.body);
      res.send(result);
    });
    app.patch('/trainerInfo/trainer/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
      $set: {
        role: 'trainer'
      },
      };
      const result = await newTrainerCollection.updateOne(filter, updateDoc);
      res.send(result);
      
    })

    app.get('/trainerInfo', async (req, res) => {
      const result = await newTrainerCollection.find().toArray();
      res.send(result);
    })

    

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
    });
    //get sub
    app.get('/subUser', async (req, res) => {
      const result = await subCollection.find().toArray();
      res.send(result)
    });


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
   
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