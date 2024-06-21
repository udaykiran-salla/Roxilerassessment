const axios = require('axios')
const Product = require("../models/productModel")
const { response } = require('express')


exports.createData = async(req,res)=>{
    try {
         response = await axios.get("https://s3.amazonaws.com/roxiler.com/product_transaction.json")
         console.log(response)
         let products=response.data
        console.log(products)
         let product = await Product.insertMany(products)

         res.status(201).send({message:"data fetched and stored successfully",product})
    } catch (error) {

        res.status(400).send({message:error.message})
        
    }
}

exports.listData = async (req, res) => {
    const { search = '', page = 1, perPage = 10, month } = req.query;
    const monthInt = parseInt(month, 10);
  
    try {
      let pipeline = [];
  
      // Match stage to filter by month
      pipeline.push({
        $match: {
          $expr: { $eq: [{ $month: "$dateOfSale" }, monthInt] }
        }
      });
  
      // Add search conditions if search string is provided
      if (search) {
        pipeline.push({
          $match: {
            $or: [
              { title: new RegExp(search, 'i') },
              { description: new RegExp(search, 'i') }
            ]
          }
        });
      }
  
      // Pagination and projection stage
      pipeline.push(
        { $skip: (page - 1) * perPage },
        { $limit: Number(perPage) }
      );
  
      // Count total matching documents for pagination
      const countPipeline = [...pipeline]; // Clone pipeline for counting
      countPipeline.push({ $count: "total" });
  
      const [products, countResult] = await Promise.all([
        Product.aggregate(pipeline),
        Product.aggregate(countPipeline)
      ]);
  
      const totalProducts = countResult.length > 0 ? countResult[0].total : 0;
      const totalPages = Math.ceil(totalProducts / perPage);
  
      res.json({
        products,
        totalProducts,
        totalPages,
        currentPage: Number(page)
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  


exports.transectionStatistics=async (req,res)=>{
 const month = req.params.month

 if (!month) {
    return res.status(400).json({ error: 'Month is required' });
  }
  
  try {
    const pipeline = [
      {
        $match: {
          $expr: {
            $eq: [{ $month: "$dateOfSale" }, parseInt(month, 10)]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalSaleAmount: {
            $sum: {
              $cond: [{ $eq: ["$sold", true] }, "$price", 0]
            }
          },
          totalSoldItems: {
            $sum: {
              $cond: [{ $eq: ["$sold", true] }, 1, 0]
            }
          },
          totalNotSoldItems: {
            $sum: {
              $cond: [{ $eq: ["$sold", false] }, 1, 0]
            }
          }
        }
      }
    ];

    const result = await Product.aggregate(pipeline);

    if (result.length > 0) {
        delete result[0]._id
      res.send(result[0]);
    } else {
      res.send({
        totalSaleAmount: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0
      });
    }
  } catch (error) {
    res.status(500).send({ error: 'Server error',message:error.message });
  }
}





exports.bargraph=async (req,res)=>{
    const month = parseInt(req.params.month , 10)
    if(month<1 || month>12){
        res.send({message:"invalid month"})
    }else{
   
    try {
        const pipeline = [
            {
              $match: {
                $expr: {
                  $eq: [{ $month: "$dateOfSale" }, month]
                }
              }
            },
          ];
          
        
          
          const priceRanges = [
            { range: '0 - 100', min: 0, max: 100 },
            { range: '101 - 200', min: 101, max: 200 },
            { range: '201 - 300', min: 201, max: 300 },
            { range: '301 - 400', min: 301, max: 400 },
            { range: '401 - 500', min: 401, max: 500 },
            { range: '501 - 600', min: 501, max: 600 },
            { range: '601 - 700', min: 601, max: 700 },
            { range: '701 - 800', min: 701, max: 800 },
            { range: '801 - 900', min: 801, max: 900 },
            { range: '901 - above', min: 901, max: Infinity },
          ];
          
        
        
          
        const products= await Product.aggregate(pipeline)
        // console.log(products)
        var response = priceRanges.map(range=>({
            range:range.range,
            count: products.filter(product=>product.price>=range.min && product.price<= range.max ).length
           
        }))
        res.send(response)
    } catch (error) {
        res.send({message:error.message,err:"server error"})
    }
}
    
}



exports.pieChart=async(req,res)=>{
    const month = parseInt(req.params.month,10)

    if(month<1 || month>12){
        res.send({message:"invalid month"})
    }else{
        try {
            const pipeline=[
                {
                    $match:{
                        $expr:{
                            $eq:[{$month:"$dateOfSale"},month]
                        }
                    }
                },
                {
                    $group:{
                        _id:'$category',
                        count:{$sum:1}
                    }
                }
            ]

            const details = await Product.aggregate(pipeline)
            const pieChart= details.map(category=>({
                category: category._id,
                count: category.count
            }))
            res.send(pieChart)
        } catch (error) {
            console.log(error)
            res.send({message:error.message})
        }
    }
}



exports.completeDetails=async (req,res)=>{
    const month= parseInt(req.params.month,10)
    try {
         transectionStatistics=await axios.get(`http://localhost:8000/api/product/transectionStatistics/${month}`)
         bargraph= await axios.get(`http://localhost:8000/api/product/bargraph/${month}`)
         pieChart=await axios.get(`http://localhost:8000/api/product/pieChart/${month}`)
        
        const details ={
            transectionStatistics:transectionStatistics.data,
            bargraph:bargraph.data,
            pieChart:pieChart.data
        }
        res.send({details:details})
    } catch (error) {
        
        res.send({message:error.message})
        
    }

}