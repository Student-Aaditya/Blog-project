const mongoose=require("mongoose");

const librarySchema= new mongoose.Schema({
    File:{
        typeof:String,
        // filename:String,
    }

})
const Library=mongoose.model("Library",librarySchema);

module.exports =Library;