import app from "./app";
import { env } from "./config/env";
import { startReminderCron } from "./config/crons";

app.listen(env.PORT, () => {
    console.log(`database URL: ${env.DATABASE_URL}`);   
  console.log(`Server running on port ${env.PORT}`);

  console.log(`Server running on port ${env.PORT}`);
  startReminderCron();
});