const mongoose = require("mongoose");
const BLOG = require("./edit.js");

main().
    then(() => {
        console.log("successful connection");
    }).catch((err) => {
        console.log(err);
    })

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/blog");
};

let tolst = [
    {
    },
   
];
BLOG.insertMany(tolst);

