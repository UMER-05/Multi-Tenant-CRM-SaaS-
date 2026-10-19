import dotenv from 'dotenv';
import app from './app.js' ;
import sequelize from './db/db.js';

dotenv.config();

async function connectDB() {
  try {
    await sequelize.sync({alter:true})  //authenticate();
    console.log("✅ Database connected successfully!");

    
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
  }
}

try {
  connectDB();

  app.listen(process.env.Port,()=>{
  console.log(`Server is running on port ${process.env.Port}`);     
  });

} catch (error) {
      console.log('Error in Starting server',error)
}