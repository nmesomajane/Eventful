import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
    console.log(`database URL: ${env.DATABASE_URL}`);   
  console.log(`Server running on port ${env.PORT}`);
});