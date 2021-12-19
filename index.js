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
    const database = client.db("user_purchase_info");
    const purchaseInfoCollection = database.collection("purchase_info");
    const usersCollection = database.collection("users");
    // const exploreDatabase = client.db("all_explore");
    // const exploreCollection = exploreDatabase.collection("explore_item");
    const reviewDatabase = client.db("allReviews");
    const reviewCollection = reviewDatabase.collection("reviews");
    const addProductDatabase = client.db("allAddProducts");
    const addProductCollection = addProductDatabase.collection("addProduct");
    // const bookingDatabase = client.db("allAddProducts");
    const bookingCollection = addProductDatabase.collection("booking");
    


    // get
    app.get('/purchase_info', async (req, res) => {
      const email = req.query.email;
      console.log(email);
      const query = { email: email };
      const purchase = await purchaseInfoCollection.find(query).toArray();

      console.log(purchase);
      res.json(purchase);
    })


    // get payment
    app.get('/purchase_info/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id:ObjectId(id)};
      const result = await purchaseInfoCollection.findOne(query);
      res.json(result);
    })

    // app.get("/explore_item/:id", async (req, res) => {
    //   console.log(req.params.id);
    //   const result = await exploreCollection
    //     .find({ _id: ObjectId(req.params.id) })
    //     .toArray();
    //   res.json(result)
    //   console.log(result);
    // });

    


  //   app.get('/explore_item/:id',async(req,res)=>{
  //     const id = req.params.id;
  //     const query = {_id: ObjectId(id)};
  //     const service = await exploreCollection.findOne(query);
  //     res.json(service);
  // })
// single service
// app.get("/explore_item/:id", async (req, res) => {
// const id = req.params.id;
// const query = {_id: ObjectId(id)};
// const result = await exploreCollection.findOne(query)
// res.json(result);
// });

 // insert order and

//  app.post("/addOrders", async (req, res) => {
//   const result = await ordersCollection.insertOne(req.body);
//   res.send(result);
// });

// delete
// app.delete("/explore_item/:id", async (req, res) => {
//   const id = req.params.id;
//   const query = {_id: ObjectId(id)};
//   const result = await exploreCollection.deleteOne(query)
//   res.json(result);
//   });


  //  explore api get
  // app.get('/explore_item',async (req,res)=>{
  //   const result = await exploreCollection.find({}).toArray();
  //   res.send(result);
  // })
    // post
    app.post('/purchase_info', async (req, res) => {
      const purchase = req.body;
      const result = await purchaseInfoCollection.insertOne(purchase)
      console.log(result);
      res.json(result)
    })
    
    // post addProduct
    app.post('/addProduct', async (req, res) => {
      const addProduct = req.body;
      const result = await addProductCollection.insertOne(addProduct)
      console.log(result);
      res.json(result)
    })

    // get add product
    app.get('/getallproduct',async(req,res)=>{
      const result = await addProductCollection.find({}).toArray();
      res.json(result);
    })
    // get single Product
    app.get('/singleProduct/:id',async(req,res)=>{
     const result = await addProductCollection.find({_id:ObjectId(req.params.id)}).toArray(); 
     res.send(result[0]);
    })


    // confirm order
    app.post('/confirmOrder',async(req,res)=>{
      console.log(req.body)
      const result= await bookingCollection.insertOne(req.body);
      res.send(result);
})

    // my order
     app.get('/myOrderItem/:email',async(req,res)=>{
       console.log(req.params.email)
     const result = await bookingCollection.find({email:req.params.email}).toArray()
     res.send(result);
     })

    //  Delete Order

    app.delete('/deleteControl/:id',async(req,res)=>{
      const id = req.params.id;
      const query = {_id: ObjectId(id)};
      const result = await bookingCollection.deleteOne(query)
      console.log(result)
      res.json(result);
    })
    

    // post reviews
    app.post('/reviews', async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review)
      console.log(result);
      res.json(result)
    })

    // get reviews
    app.get('/allreviews',async(req,res)=>{
      const result = await reviewCollection.find({}).toArray();
      res.json(result);
    })
    

    // user post api
    app.post('/users', async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user)
      console.log(result);
      res.json(result)
    })

    // put api 
    app.put('/users', async (req, res) => {
      const user = req.body;
      console.log('put',user);
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(filter,updateDoc,options);
      res.json(result);
    })

    // admin make
  
    app.put('/users/admin',async(req,res)=>{
      const user = req.body;
      console.log('put',user);
      const filter = { email: user.email };
      const updateDoc = { $set: {role:'admin'} };
      const result = await usersCollection.updateOne(filter,updateDoc);
      res.json(result);
     
    })

    app.get('/users/:email',async(req,res)=>{
      const email = req.params.email;
      const query = {email:email};
      const user = await usersCollection.findOne(query);
      let isAdmin = false;
      if(user?.role==='admin'){
         isAdmin = true;
      }
      res.json({admin:isAdmin})
    })

  // // New Way Start---------------------





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