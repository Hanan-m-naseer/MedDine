const app = require('./app')
const mongoose  = require('mongoose');


mongoose.connect('mongodb+srv://sharhanmohammed03:Rapid7711@cluster.8vewkk6.mongodb.net/healthify?retryWrites=true&w=majority&appName=Clustery');

const db = mongoose.connection

db.on('error',err => console.error(err))
db.once('open',()=>{
    console.log('MongoDb connected ');
})

app.listen(3000,()=>{
console.log('server is connected');
});
