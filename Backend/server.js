const express=require('express')
const mongoose = require('mongoose')
const dbconfig = require('./dbconfig/dbconfig')
const stroeRoute = require('./routes/routes')

const app=express()


// ADD THIS
var cors = require('cors');
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/product',stroeRoute)
mongoose.connect(dbconfig.url,{  
    useNewUrlParser: true,
    useUnifiedTopology: true
  
}).then(console.log("db connected sucessfully"))
.catch(err=>{
console.log("Cannot connect to the database!", err);
process.exit();
})



app.get('/',(req,res)=>{

    res.send({message:"Welcome"})

})

app.listen(8000,()=>{
    console.log("port is running at 8000")
})