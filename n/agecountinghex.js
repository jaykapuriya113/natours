
const axios = require('axios');
const asyncHandler=require("express-async-handler");
const fs=require('fs');
const crypto=require("crypto")
const countAge = asyncHandler(async () => {
  const data = await axios.get(
    " https://coderbyte.com/api/challenges/json/age-counting "
  );
  const kjk = await data.data;
  const arr = kjk.data.split(", ");
  let obj = [];

  for (let i = 0; i < arr.length; i += 2) {
    let key = arr[i].split("=")[1];
    let age = arr[i + 1].split("=")[1];

    let k = {
      key,
      age,
    };
    obj.push(k);
  }
  let str = "";
  for (let i = 0; i < obj.length; i++) {
    if (obj[i].age == 32) {
      str = str + obj[i].key + "\n";
    }
  }
  console.log(str);

  fs.writeFileSync("text.txt", str);

  const hashedData = crypto
    .createHash("sha256")
    .update(JSON.stringify(str))
    .digest("hex");

  console.log(hashedData);
});

countAge();