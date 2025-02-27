    const mongoose=require('mongoose')

    const uschema= new mongoose.Schema(
        {
            username  : {
                type: String,
                required : true

            },
            email:{
                type:String,
                required:true,
            },
            password:{
                type:String,
                required:true,
            },
            age : {
                type:Number,
                
            },
            type:{
                type:String,
                
            },
            imagePath:{
                type:String,
                default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
            },
            disease:{
                type:Array,
            },
            favourites:{
            type:Array,
            }
                    
    })

    module.exports=mongoose.model('user',uschema);

