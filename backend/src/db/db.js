const mongoose= require('mongoose')

console.log("db.js loading")
const connectDB =  async ()=>{
try{
  await mongoose.connect(process.env.MONGO_URI)
  console.log("✅database is connected")
}catch(error){
console.log("database connection failed")

console.error(error)
process.exit(1)

}
};
module.exports= connectDB;  