const express=require('express');
const cors=require('cors');
require("dotenv").config();
const app=(express());
const { MongoClient } = require("mongodb");
const { query } = require('express');

app.use(cors());

app.use(express.json());




const port=process.env.PORT||5000;


app.get('/',(req,res)=> {

    res.send('server running')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0qtlc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {

  
  try {
    await client.connect();
    console.log("connected");
    const database = client.db('Ema-john');
    const ProductsCollection = database.collection('products');
    const ordersCollection = database.collection('orders');
    // Query for a movie that has the title 'Back to the Future'
   
    // GEt Products 
                           
              app.get('/products', async (req,res)=>{
                             console.log(req.query);
                const cursor=ProductsCollection.find({});

                let page=req.query.page;
                let size=req.query.size;
                const count=await cursor.count()

                if(page){
              products=await cursor.skip(page*size).limit(parseInt(size)).toArray()
 
                }
                else{
                  products=await cursor.toArray();
                }
               
              

                res.json({
                  count,
                  products});
              });

              app.post('/orders',async (req,res)=>{
                const orders=req.body;
                console.log(req.body);

                const result=await ordersCollection.insertOne(orders)
                console.log('orders',orders);


                 res.json(result)

              })

              app.get('/orders',async (req,res)=>{
                         
              
                res.send('orders')
              })

    
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port,()=>{

    console.log('running on port',port);
})