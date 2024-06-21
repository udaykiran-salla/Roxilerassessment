const route = require('express').Router()
const product= require('../controllers/storeData')
route.get("/createData",product.createData)

route.get("/list",product.listData)

route.get('/transectionStatistics/:month',product.transectionStatistics)

route.get('/bargraph/:month',product.bargraph)

route.get('/pieChart/:month',product.pieChart)

route.get('/completeDetails/:month',product.completeDetails)

module.exports = route;