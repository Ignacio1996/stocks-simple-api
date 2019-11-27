const express = require('express');
const app = express();

require('dotenv').config();

app.get('/stocks',(req,res)=>{
  res.json({success: true})
})

app.listen(process.env.PORT || 8080, ()=>{
  console.log('index.js 6 | server started...');
})