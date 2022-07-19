const express=require('express');
const dotenv=require('dotenv');
const cors=require('cors');
const axios=require('axios');
const header=require('./helpers/header.js');
const app=express();
const port=3000;
dotenv.config();
app.use(cors());
app.use(express.json());

//endpoints
const orderUrl="https://travellog.myvtex.com/api/oms/pvt/orders/";
const orderId="1246930501700-01";
const db='dblog'

//functions

const user_id=(data)=>{
  return data.clientProfileData.userProfileId
}
const order_price_total=(data)=>{
  return data.value;
}

const client_name=(data)=>{
  return data["clientProfileData"].firstName + " " + data["clientProfileData"].lastName
}

app.get('/',async(req,res)=>{
  
 // const {OrderId, State}=req.body;

  const response=await axios.get(`${orderUrl}${orderId}`,{headers:header.module});

  const data= response.data;
  
 
  const total=order_price_total(data);
  const id_user=user_id(data);
  const name_client=client_name(data);
  const status_order=data.status;
  console.log(status_order);
  let ordem=parseInt(orderId);
  console.log(ordem)
  const json_save={
    "id":"sadfasdfsdafsd",
    "total":total,
    "name":name_client,
    "history":[{ordem:total},{ordem:total}]
   
  }

  try{
    const save_response=await axios.post('http://travellog.myvtex.com/api/dataentities/dblog/documents',json_save,{headers:header.module});

    console.log(save_response.data);
  
  
  }catch(error){
    console.log(error.message);
  }

  
  //CRIA DOCUMENTO  NO MASTER DATA 

  //const savedata=await axios.post(`https://travellog.myvtex.com/api/dataentities/${db}/documents/`,{headers:header.module})

  //JSON PARA SALVAR

  //const master_url = `https://travolog.myvtex.com/api/dataentities/dbtravellog3/documents/`;



})

app.get('/order',async(req,res)=>{
  const {order}=req.body;

  const get_points=await axios.get(`http://travellog.myvtex.com/api/dataentities/dblog/documents/${order}?_fields=_all`, {headers:header.module})
 
  const data=get_points.data;

  const total=data.total;
  const history=data.history;

  console.log(total);
  console.log(history);



  return res.json(data);


})


app.get('/cancel',async(req,res)=>{
    const {order}=req.body;
    const get_points=await axios.get(`http://travellog.myvtex.com/api/dataentities/dblog/documents/${order}?_fields=_all`, {headers:header.module})
    const data=get_points.data;

    const total=data.total;
    let history=data.history;
 


    history.forEach((item,index) => {
     
   });

   console.log(history);
   // console.log(history);
  return res.json(data);


})

app.listen(port,()=>{
  console.log(`Server running in port ${3000}`)
})