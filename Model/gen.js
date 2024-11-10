const mongoose=require("mongoose");
// const { type } = require("os");

const GenSchema=new mongoose.Schema({
    Title:{
        type:String,
        // required:true,
    },
    Content:{
        type:String,
    },
    Image:{
        url:String,
        filename:String,
    },
    Image1:{
        url:String,
        filename:String,
    },
  
    Contents:{
        type:String,
    },
    Content1:{
        type:String,
    },
    Content2:{
        type:String,
    },
    Author:{
        type:String,
    }
})

const GEN=mongoose.model("GEN",GenSchema);
module.exports=GEN;