const adminData = require('../models/adminSchema')
const multer = require('multer')
const recipeData = require('../models/recipeSchema')
const diseaseData = require('../models/diseaseSchema');
const userData = require('../models/userSchema')
let date = Date.now();
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
    getadmin: async (req, res) => {
        try {
            if (req.session.admin) {
                res.redirect('/admin/getdashboard');
            }
            let error = req.query.error ? req.query.error : ''
            let perror = req.query.perror ? req.query.perror : ''
            res.render('admin/loginPage', { error, perror })
        } catch (err) {
            console.log(err);
        }
    },



    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const result = await adminData.findOne({ email: email });

            if (result) {
                if (password === result.password) {
                    req.session.admin = true;
                    res.redirect('/admin/getdashboard')
                } else {
                    res.redirect('/admin?perror=*Incorrect password');
                }
            } else {
                res.redirect('/admin?error=*Invalid email address');
            }
        } catch (err) {
            console.log(err);
        }
    }
    ,
logout:async(req,res)=>{
    try{
        req.session.admin = null
        res.redirect('/admin')
    }catch(err){
        console.log(err);
    }
}
    ,
    getDashboard: async (req, res) => {
        try {
            if (req.session.admin) {
                const users = await userData.countDocuments()
                const recipes = await recipeData.countDocuments()
                const diseases = await diseaseData.countDocuments()
                res.render('admin/dashboard',{users,recipes,diseases})
            } else {
                res.redirect('/admin');
            }
        } catch (err) {
            console.log(err);
        }
    },
    getRecipes: async (req, res) => {
        try {
            if (req.session.admin) {
                const data = await recipeData.find({})
                console.log(data);
                res.render('admin/recipes', { data });
            } else {
                res.redirect('/admin');
            }
        } catch (err) {
            console.log(err);
        }
    },





    addRecipe: async (req, res) => {
        try {
            upload.single('images')(req, res, function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Error uploading file' });
                }

                const { recipe, preparation, nutrition, ingrediants, category } = req.body;
                console.log(recipe);
                // Ensure that req.file is available before using it
                if (!req.file) {
                    return res.status(400).json({ error: 'No file uploaded' });
                }

                const imagePath = `/uploads/${req.file.filename}`;

                const data = new recipeData({
                    recipe: recipe,
                    preparation: preparation,
                    nutrition: nutrition,
                    ingrediants: ingrediants,
                    image: imagePath,
                    category: category
                });

                data.save()
                res.redirect('/admin/getrecipes');

            });
        } catch (err) {
            console.log(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    getDisease: async (req, res) => {
        try {
            
            if(req.session.admin){
                const disease = await diseaseData.find({})
                res.render('admin/disease',{disease})
            }else{
                res.redirect('/admin')
            }

        } catch (err) {
            console.log(err);
        }
    },
    addDisease:async(req,res)=>{
        try{
            upload.array('images')(req, res, function (err) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({ error: 'Error uploading files' });
                } const { disease, category, Brecipe,Bingrediants, Bpreparation, Bnutrition,Lrecipe,Lingrediants,Lpreparation,Lnutrition,Drecipe,Dingrediants,Dpreparation,Dnutrition,restricted } = req.body;

                // Ensure that req.files is available before using it
                if (!req.files || req.files.length === 0) {
                    return res.status(400).json({ error: 'No files uploaded' });
                }
    
                const imagePaths = req.files.map(file => `/uploads/${file.filename}`);
                console.log(imagePaths);
                const breakfast = {
                    name:Brecipe,
                    ingredients:Bingrediants,
                    nutrition:Bnutrition,
                    preparation:Bpreparation

                }
                const lunch = {
                    name:Lrecipe,
                    ingredients:Lingrediants,
                    nutrition:Lnutrition,
                    preparation:Lpreparation

                }
                const dinner = {
                    name:Drecipe,
                    ingredients:Dingrediants,
                    nutrition:Dnutrition,
                    preparation:Dpreparation

                }
                const data = new diseaseData({
                    disease:disease,
                    category:category,
                    breakfast:breakfast,
                    lunch:lunch,
                    dinner:dinner,
                    image:imagePaths,
                    restricted:restricted

                });
    
                data.save();
                res.redirect('/admin/getdisease');
            });
        }catch(err){
            console.log(err);
        }
    },
    getView:async(req,res)=>{
        try{

            const id = req.query.id

            const data = await diseaseData.findOne({_id:id})

            res.render('admin/viewDetails',{data})

        }catch(err){
            console.log(err);
        }
    },
    deleteDisease:async(req,res)=>{
        try{
            const id = req.query.id
            const data = await diseaseData.findByIdAndDelete(id)
            res.redirect('/admin/getdisease')
        }catch(err){

        }
    }


}