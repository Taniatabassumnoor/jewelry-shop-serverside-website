const express = require('express')
const app = express()
const cors = require('cors');
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());
// MONGODB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qa19q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("TwinkleStone");
    const productsCollection = database.collection("products");
    const ordersCollection = database.collection("orders");
    const userCollection = database.collection("users");
    const reviewCollection = database.collection("reviews");
    // blog collection
    app.get("/blog", async (req, res) => {
      const cursor = blogCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    // get all products products
    app.get("/products", async (req, res) => {
      const limit = 6;
      const cursor = productsCollection.find({}).limit(limit);
      const result = await cursor.toArray();
      res.send(result);
    });
    // explore products
    app.get("/allproducts", async (req, res) => {
      const cursor = productsCollection.find({});
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.json(result);
    });
    // orders collection
    app.post("/orders", async (req, res) => {
      const order = req.body;
      const result = await ordersCollection.insertOne(order);
      res.json(result);
    });

    //single user order
    app.get("/myorders", async (req, res) => {
      const email = req.query.email;
      const query = { "orderInfo.email": email };
      const cursor = ordersCollection.find(query);
      const orders = await cursor.toArray();
      res.json(orders);
    });

    //get all user order
    app.get("/allorders", async (req, res) => {
      console.log("Getting all user orders");
      const cursor = ordersCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });

    //update an order
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      updatedOrder = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          status: updatedOrder.status,
        },
      };

      const result = await ordersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });

    //cancel an order
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      console.log("Deleting the order with id ", id);
      const query = { _id: ObjectId(id) };
      const result = await ordersCollection.deleteOne(query);
      res.send(result);
    });

    // add products any admin
    app.post("/products", async (req, res) => {
      const order = req.body;
      console.log(order);
      const result = await productsCollection.insertOne(order);
      res.json(result);
    });


    // users collection insert a user
    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.json(result);
    });
    // find user using email
    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    });
    // set user as a admin
    app.put("/users/admin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await userCollection.updateOne(filter, updateDoc);
      res.json(result);
    });
    // check either user is admin or not 1
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await userCollection.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });

    // post reviews
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review)
      console.log(result);
      res.json(result)
    })

    // get reviews
    app.get('/allreviews', async (req, res) => {
      const result = await reviewCollection.find({}).toArray();
      res.json(result);
    })






  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);
app.get('/', (req, res) => {
  res.send('Hello World from Twinkle stone!')
})

app.listen(port, () => {
  console.log(`listening at ${port}`)
})