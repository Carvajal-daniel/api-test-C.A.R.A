import { app } from "./App.js";
import "dotenv/config.js";

const PORT = Number(process.env.PORT || 3908) 

export function start(){
  try {
    app.listen({
      port: PORT,
      host: "0.0.0.0"
    })

    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }
}

start()