const mongoose=require('mongoose')

const uschema= new mongoose.Schema(
    {
        recipe  : {
            type: String,
            required : true

        },
        ingrediants:{
            type:String,
            required:true,
        },
        preparation:{
            type:String,
            required:true,
        },
        nutrition : {
            type:String,
            required:true

            
        },
        image : {
            type:String,
            required:true 
        } ,
        category:{
            type:String,
            required : true
        }
            
                
})

module.exports=mongoose.model('recipes',uschema);

