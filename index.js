const app = require("./app");
const logger = require("./config/logger");
const db = require("./config/db");
const {saveForAllGroups} = require("./utils/saveMoney");

const port = process.env.PORT;

app.listen(port, async (req, res, next) => {
  await db(); //await connection to the database instance
  logger.info(`\n#### Server listening on PORT: ${port} #### \n
    #### Server in ${process.env.NODE_ENV} mode ####`);
});

// a script to automatically help members save #5000 every week
const amt = process.env.WEEKLY_SAVE_AMT;

// setTimeout((amt) => {
//   try {
//     if (saveForAllGroups(amt)) {
//       logger.info("Saving cron job is complete for now!");
//       return true;
//     }
//     return false;
//   } catch (err) {
//     throw new Error(err.message);
//   }
// }, 100);
