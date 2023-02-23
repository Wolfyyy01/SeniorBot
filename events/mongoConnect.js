const mongoose = require("mongoose");
const chalk = require("chalk");

mongoose.connect(
  `mongodb+srv://EMS:${process.env.MONGO_PASS}@cluster0.18hzup7.mongodb.net/test`,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log(chalk.blue(`MongoDB Connected`));
  }
);
