import mongoose from "mongoose";
import dotenv from 'dotenv'
dotenv.config();
const username=process.env.DB_USERNAME || '';
const password=process.env.DB_PASSWORD || '';
const dbName=process.env.DB_NAME || '';
const clusterName=process.env.DB_CLUSTER || '';
const cloudMongoUrl=`mongodb+srv://${username}:${password}@${clusterName}/${dbName}?retryWrites=true&w=majority`
const localDB='mongodb://localhost:27017/studentandmentor';
const connectDb=async ()=>{
    try{
        const connect=await mongoose.connect(cloudMongoUrl,
        {useNewUrlParser:true})
        console.log("DB connected successfully")
    }catch(e){
        console.log(e.message);
        process.exit(1);
    }
}
export default connectDb;