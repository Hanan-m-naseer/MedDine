const express = require('express')
const router = express.Router()
const userController  =  require('../controllers/userController');
const upload = require('../controllers/userController')


router.get('/',userController.home);
router.get('/getLogin',userController.getLogin)
router.get('/getRegister',userController.getRegister)
router.post('/register',userController.postRegister)
router.get('/getLogout',userController.logout)
router.post('/login',userController.postLogin)
router.get('/disease',userController.getDisease)
router.get('/search',userController.searchValues)
router.get('/getDiet',userController.getDiet)
router.post('/postDisease',userController.postDisease)
router.get('/profile',userController.getProfile)
router.post('/updateImage',userController.upload.single('profileImage'),userController.updateImage)
router.get('/edit',userController.getEdit)
router.post('/setupDisease',userController.setupDisease)
router.get('/getDailyPlan',userController.dailyProfie)
router.get('/favourite',userController.getFavourite)
router.get('/addFavourite',userController.addFavourite)
router.get('/viewFavourite',userController.viewFavourite)
router.get('/deleteFavourite',userController.deleteFavourite)
router.get('/recipes',userController.getRecipes)
router.get('/viewRecipe',userController.viewRecipe)
module.exports = router;