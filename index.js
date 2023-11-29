const express = require('express')
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
//fitness
//az49cXpwdyXLXnTS
//middleWare
app.use(cors());
app.use(express.json())


// // varifyToken
// const gateman = (req, res, send) => {
//   const authorization = req?.headers?.authorization;
//   if (!authorization) {
//     return res.status(401).send('unAuthorized Access')
//   }
//   const token = authorization.split(' ')[1]
//   jwt.verify(token, process.env.Access_Token, function(err, decoded) {
//   if (err) {
//     return res.status(401).send('unAuthorized Access')
//     }
//     req.decoded = decoded;
//     next();
//   });
  
// }

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
    const forumCollection = client.db('fitness').collection('forum');


    //jwt
   // jwt related api
    app.post('/jwt', async (req, res) => {
      const user = req.body;
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
      res.send({ token });
    })


    // middlewares
    //verifyAdmin
    const verifyAdmin = async(req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.role === 'admin';
      if (!isAdmin) {
        return res.status(403).send({ message: 'forbidden access' });
      }
      next();
    }
    //verify trainer
    const verifyTrainer = async (req, res, next) => {
      const email = req.decoded.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const isTrainer = user?.role === 'trainer';
      if (!isTrainer) {
        return res.status(403).send({ message: 'forbidden access' });
      }
      next()
    }
    
    //verifyToken
    const verifyToken = (req, res, next) => {
      console.log('inside verify token', req.headers.authorization);
      if (!req.headers.authorization) {
        return res.status(401).send({ message: 'unauthorized access' });
      }
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
         next();
      })
     
    }
    
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
    //forum related api
    app.get('/forum', async (req, res) => {
      const query = req.query;
      const page = query.page;
      const pageNumber = parseInt(page);
      const perPage = 6;
      const skip = pageNumber * perPage;
      const result = await forumCollection.find().skip(skip).limit(perPage).toArray();
      const count = await forumCollection.countDocuments();
      res.send({result,count});
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
    app.post('/users',  async (req, res) => {
      const query = { email: req.body.email }
      const existingUser = await usersCollection.findOne(query);
      if (existingUser) {
        return res.send({ message: 'user already exists', insertedId: null })
      }
      const result = await usersCollection.insertOne(req.body);
      res.send(result);
    });

  //   app.get('/users/:id', async (req, res) => {
  //     const id = req.params.id;
  //     const query = { _id: new ObjectId(id) }
  //     const result = await usersCollection.findOne(query);
  //     res.send(result);
  //   });

  //   app.put('/users/:id', async (req, res) => {
  //     const id = req.params.id;
  //           const filter = { _id: new ObjectId(id) }
  //           const options = { upsert: true };
  //           const updateUser = req.body;
  //  const user = {
  //               $set: {
  //                   name: updateUser.name,
  //                   photoURL: updateUser.photoURL,
  //                   password: updateUser.password,
                    
  //               }
  //           }
  //   const result = await usersCollection.updateOne(filter, user, options);
  //           res.send(result);

    //   })
    app.get('/users/admin/:email', verifyToken,  async (req, res) => {
      const email = req.params.email;
      const decEmail = req.decoded.email;
      if (email !== decEmail) {
        return res.status(403).send({ message: 'forbidden access' })

      }
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role === 'admin'
      }
      res.send({admin})
    })

    //trainer
    app.get('/users/trainer/:email', verifyToken, async (req, res) => {
      const email = req.params.email;
      const decEmail = req.decoded.email;
      if (email !== decEmail) {
        return res.status(403).send({ message: 'forbidden access' })
      }
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      let trainer = false;
      if (user) {
        trainer= user?.role === 'trainer'
      }
      res.send({trainer})

    })
    app.get('/users/member', async (req, res) => {
  try {
    const result = await usersCollection.find({ role: 'member' }).toArray();
    res.send(result);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).send('Error fetching members');
  }
});


    app.get('/users',verifyToken, verifyAdmin,  async (req, res) => {
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
    app.patch('/users/trainer/:email',  async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
       const updateDoc = {
      $set: {
        role: 'trainer'
      },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result)
   })
    //new trainer related api
    app.post('/trainerInfo',verifyToken, async (req, res) => {
      const result = await newTrainerCollection.insertOne(req.body);
      res.send(result);
    });
    app.delete('/trainerInfo/:id', verifyToken,verifyAdmin, async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await newTrainerCollection.deleteOne(query);
      res.send(result);
    })
    // app.patch('/trainerInfo/trainer/:id', async (req, res) => {
    //   const id = req.params.id;
    //   const filter = { _id: new ObjectId(id) };
    //   const updateDoc = {
    //   $set: {
    //     role: 'trainer'
    //   },
    //   };
    //   const result = await newTrainerCollection.updateOne(filter, updateDoc);
    //   res.send(result);
      
    // })

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