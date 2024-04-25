const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config()

//assigning port
const port = process.env.PORT || 8080;

//app creating
const app = express();

// middleware
app.use(cors());
app.use(express.json());

// const uri = "mongodb+srv://<username>:<password>@cluster0.9wkdqn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9wkdqn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    
    const userCollection = client.db("usersDB").collection("users");
    
    app.get('/users',async(req, res)=>{
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })
    app.post('/users', async(req, res)=>{
      const info = req.body;
      const result = await userCollection.insertOne(info)
      res.send(result)
    })

    app.delete('/users/:id', async(req, res)=>{
      const id = req.params.id;
      // console.log(id);
      const query = {_id: new ObjectId(id)}
      const result = await userCollection.deleteOne(query);
      res.send(result);
    })
    
    await client.db("admin").command({ ping: 1 });

    // Send a ping to confirm a successful connection
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send("user namage server is running");
})

app.listen(port, ()=>{
    console.log(`server is running on port ${port}`);
})
