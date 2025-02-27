const express = require('express');
const recipeData = require('../models/recipeSchema');
const userData = require('../models/userSchema')
const bcrypt = require('bcrypt')
const diseaseData = require('../models/diseaseSchema')
const multer = require('multer')
const favouriteData = require('../models/favouriteSchema')
const date = Date.now()

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        console.log(file + 'hi');
        // Generating a unique filename, you can modify this as per your requirements
        cb(null, date + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

module.exports = {
    upload,
    home: async (req, res) => {
        try {
            let session
            let success = ''
            let error = ''
            let register = ''
            if (req.session.user) {
                session = req.session.user
                console.log(session.username + 'hello............................................');
            }
            if(req.query.success){
                success = req.query.success
            }
            if(req.query.error){
                error = req.query.error
            }
            if(req.query.register){
                register = req.query.register
            }

            const recipes = await recipeData.find({}).limit(4)

            res.render('user/home', { recipes, session,success,error,register})
        } catch (err) {
            console.log(err.message);
        }
    },
    getLogin: async (req, res) => {
        try {
            if (req.session.user) {
                res.redirect('/')
            } else {
                let Perror = ''
                let Eerror = ''
                let gError = ''
                if (req.query.Eerror) {
                    Eerror = req.query.Eerror
                }
                if (req.query.Perror) {
                    Perror = req.query.Perror
                }
                if (req.query.gError) {
                    gError = req.query.gError
                }
                res.render('user/login', { Perror, Eerror, gError })
            }
        } catch (err) {
            console.log(err);
        }
    },
    getRegister: function (req, res) {
        try {
            if (req.session.user) {
                res.redirect('/')
            } else {

                let Eerror = ''
                let Perror = ''
                let Uerror = ''
                let Aerror = ''
                if (req.query.Eerror) {
                    Eerror = req.query.Eerror
                }
                if (req.query.Perror) {
                    Perror = req.query.Perror
                }
                if (req.query.Uerror) {
                    Uerror = req.query.Uerror
                }
                if (req.query.Aerror) {
                    Aerror = req.query.Aerror
                }
                res.render('user/register', { Eerror, Perror, Uerror, Aerror, Terror: '' })
            }

        } catch (err) {
            console.log(err);
        }
    },
    postLogin: async (req, res) => {
        try {
            const { email, pass } = req.body


            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                res.redirect('/getLogin?Eerror=Invalid email format');
            }

            // Validate password minimum length
            const minLength = 4; // Set your desired minimum password length
            if (!pass || pass.length < minLength) {
                res.redirect(`/getLogin?Perror=Password must be at least ${minLength} characters long`);
            }

            const user = await userData.findOne({ email: email })
            if (user) {
                bcrypt.compare(pass, user.password)
                    .then((isMatch) => {
                        if (isMatch) {
                            const data = {
                                username: user.username,
                                email: user.email,
                                id: user._id,
                                type: user.type
                            }
                            req.session.user = data
                            res.redirect('/')
                        } else {

                            res.redirect('/getLogin?Perror=Invalid password');
                        }
                    })

            } else {
                return res.redirect('/getLogin?Eerror=Invalid email address')
            }


        } catch (err) {
            console.log(err);
        }
    },
    postRegister: async (req, res) => {
        try {
            const { username, email, age, type, pass, cpass } = req.body;

            if (!username || username.trim() === '') {
                return res.redirect('/getRegister?Uerror=Username is required');
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!email || !emailRegex.test(email)) {
                return res.redirect('/getRegister?Eerror=Invalid email format');
            }

            if (age === '' || isNaN(age)) {
                return res.redirect('/getRegister?Aerror=Please provide a valid age (numbers only)');
            }

            if(parseInt(age) <= 0){
                return res.redirect('/getRegister?Aerror=Please provide a valid age (Above 0)');

            }
            

            // Validate password minimum length
            const minLength = 6; 
            if (!pass || pass.length < minLength) {
                return res.redirect("/getRegister?Perror=Password must be at least ${minLength} characters long");
            } 
        
            // Check if password contains at least one uppercase letter, one lowercase letter, and one number
            const hasUpperCase = /[A-Z]/.test(pass);
            const hasLowerCase = /[a-z]/.test(pass);
            const hasNumber = /[0-9]/.test(pass);
        
            if (!(hasUpperCase && hasLowerCase && hasNumber)) {
                return res.redirect('/getRegister?Perror=Password must contain at least one uppercase letter, one lowercase letter, and one number');
            }



            const exist = await userData.findOne({ email: email })

            if (exist) {
                return res.redirect('/getRegister?Eerror= Email address is already registered')
            } else {
                if (pass === cpass) {
                    const hashedPass = await bcrypt.hash(pass, 10)

                    const saveData = new userData({
                        username: username,
                        email: email,
                        password: hashedPass,
                        age: age,
                        type: type
                    })

                    const sData = await saveData.save()

                    const sessionData = {
                        id: sData._id,
                        username: sData.username,
                        email: sData.email,
                        type: sData.type
                    }
                    req.session.user = sessionData
                    return res.redirect('/?register=true')
                } else {
                    return res.redirect('/getRegister?Perror=Password and confirm Password does not match')
                }
            }

        } catch (err) {
            console.log(err);
        }
    },



           
     logout: async (req, res) => {
        try {
            req.session.user = null
            res.redirect('/')
        } catch (err) {
            console.log(err);
        }
    },
    getDisease: async (req, res) => {
        try {
            if (req.session.user) {
                res.render('user/disease')
            } else {
                return res.redirect('/getLogin?Eerror=Please login to get your meal plan !!')
            }
        } catch (err) {
            console.log(err);
        }
    },
    searchValues: async (req, res) => {
        try {
            const value = req.query.query
            const regex = new RegExp(`^${value}`, 'i');
            const getdata = await diseaseData.find({ disease: { $regex: regex }, category: req.session.user.type })

            const data = []
            for (let i = 0; i < getdata.length; i++) {
                if (!data.includes(getdata[i].disease)) {
                    data.push(getdata[i].disease)
                }
            }

            return res.json(data)

        } catch (err) {
            console.log(err);
        }
    },
    getDiet: async (req, res) => {
        try {
            let session = ''
            if(req.session.user){

            
            session = req.session.user
            if (req.query.data) {
                const regexPattern = new RegExp(req.query.data, 'i');
                const data = await diseaseData.find({ disease: { $regex: regexPattern }, category: req.session.user.type })
                const random =Math.floor( Math.random(3) * data.length) 
                const Data = data[random]
                res.render('user/dietPlan', { Data, session })
            } else {
                return res.redirect('/')
            }
        }else{
            res.redirect('/')
        }
        } catch (err) {
            console.log(err);
        }
    },
    postDisease: async (req, res) => {
        try {
            if (req.session.user) {
                let session = req.session.user;
                let value = req.body.query;
                console.log(value);
                const regexPattern = new RegExp(value, 'i');

                const Data = await diseaseData.findOne({ disease: { $regex: regexPattern } });

                if (Data) {
                    console.log(Data);
                    return res.json({ Data, session, value })
                } else {
                    res.redirect('/disease?error=sorry, currently we dont have the disease you searched for');
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
    getProfile: async (req, res) => {
        try {
            if (req.session.user) {
                let plans = false
                const user = await userData.findOne({ _id: req.session.user.id })
                if (user.disease) {

                    const disease = await diseaseData.findOne({ disease: { $in: user.disease }, category: user.type })
                    if (disease) {
                        plans = true
                    }
                }
                res.render('user/profile', { user, plans })
            } else {
                res.redirect('/getLogin?gError=You must have to login to get profile')
            }
        } catch (err) {
            console.log(err);
        }
    }
    ,
    updateImage: async (req, res) => {
        try {

            if (!req.file) {
                return res.status(400).json({ error: 'No file uploaded' });
            }
            const imagePath = `/uploads/${req.file.filename}`;

            const filter = { _id: req.session.user.id };
            const update = { imagePath: imagePath }; // Set the imagePath field with the uploaded file path
            const options = { upsert: true, new: true }; // Set upsert option to true to create the document if it doesn't exist

            // Find and update the document
            const updatedUser = await userData.findOneAndUpdate(filter, update, options);
            if (updatedUser) {
                return res.status(200).json({ message: 'Profile image updated successfully', user: updatedUser });
            } else {
                return res.status(404).json({ error: 'User not found' });
            }

        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal server error' });

        }
    },
    getEdit: async (req, res) => {
        try {
            if (req.session.user) {

                const id = req.query.id
                let error = ''
                if (req.query.error) {
                    error = req.query.error
                }
                const user = await userData.findById(id)
                const getData = await diseaseData.find({ category: req.session.user.type })
                const data = []
                for (let i = 0; i < getData.length; i++) {
                    if (!data.includes(getData[i].disease)) {
                        data.push(getData[i].disease)
                    }
                }
                res.render('user/editProfile', { user, data, error })
            } else {
                res.redirect('/')
            }

        } catch (err) {
            console.log(err);
        }
    },
    setupDisease: async (req, res) => {
        try {

            const { dis, disoption } = req.body
            console.log(req.body);
            if (disoption) {


                if (dis === disoption) {
                    return res.redirect('/edit?error=The selected diseases are same please choose a different one')
                }
                const arr = [dis, disoption] //      
                const data = await userData.findByIdAndUpdate(req.session.user.id, { $push: { disease: { $each: arr } } })
                console.log(data);

            } else {
                await userData.findByIdAndUpdate(req.session.user.id, { $push: { disease: dis } })

            }
            res.redirect('/profile')

        } catch (err) {
            console.log(err);
        }
    },
    dailyProfie: async (req, res) => {
        try {
            if(req.session.user){

            
            function getRandomNumber(min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
            const session = req.session.user
            const user = await userData.findById(req.session.user.id)
            const disease = await diseaseData.find({ disease: { $in: user.disease }, category: req.session.user.type })
            const Data = disease[getRandomNumber(0, disease.length - 1)]
            res.render('user/dietPlan', { Data, session })
        }else{
            res.redirect('/')
        }
        } catch (err) {

        }
    },
    getFavourite: async (req, res) => {
        try {
            if(req.session.user){
                const user = await userData.findOne({_id:req.session.user.id})
                res.render('user/favourite', { session: req.session.user,user })

            }else{
                res.redirect('/getLogin?gError=You must have to login to get favourites')
            }
        } catch (err) {
            console.log(err);
        }
    },
   

     addFavourite : async (req, res) => {
        try {
            const diseaseId = req.query.id;
            const disease = await diseaseData.findById(diseaseId);
    
            let favourite = await userData.findOne({ _id: req.session.user.id });
                const existingFavorite = favourite.favourites.find(fav => fav.diseaseId.toString() === diseaseId);
                if (existingFavorite) {
                    return res.redirect('/?error=The diet plan you are trying to add is already exist ');
                }
           
            const data = {
                diseaseId: diseaseId,
                disease: disease.disease,
                images: disease.image, 
                type: disease.category
            }
    
            await userData.findByIdAndUpdate(req.session.user.id,{$push:{favourites:data}}) 
            res.redirect('/?success=success');
    
        } catch (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
    },
    viewFavourite : async (req,res) =>{
    try{
        if(req.session.user){
            const id = req.query.id
            const disease = await diseaseData.findOne({_id:id})
            res.render('user/dietPlan',{Data:disease,session:req.session.user})
        }else{
            res.redirect('/')
        }
    }catch(err){
        console.log(err);
    }
},
deleteFavourite:async(req,res)=>{
    try{
        const id = req.query.id
        await userData.findByIdAndUpdate(req.session.user.id,{$pull:{favourites:{diseaseId:id}}})
        res.redirect('/favourite')



    }catch(err){
        console.log(err);
    }
},
getRecipes:async(req,res)=>{
    try{
        const recipes = await recipeData.find({})
        res.render('user/recipesListing',{recipes,session:req.session.user})
    }catch(err){
        console.log(err);
    }
},
viewRecipe: async(req,res)=>{
    try{
        const id =  req.query.id
        const recipe = await recipeData.findById(id)
        res.render('user/viewRecipe',{session:req.session.user,recipe})
    }catch(err){
        console.log(err);
    }
}







}