let mongoose = require('mongoose');
let Book = require('./models/book.js')
let Author = require('./models/author.js')

//configure express/bodyparser/ejs and connect to server
let express = require('express');
let bodyparser = require('body-parser');
const { response } = require('express');
let app = express();
let viewpath = __dirname+'/views/';
app.use(bodyparser.urlencoded({extended:false}));
app.use(express.static('images'));
app.use(express.static('css'));
app.listen(8081);
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

const db_url = 'mongodb://localhost:27017/week6Librarydb';

mongoose.connect(db_url,function(err){
    if (err)console.log(err);
    else {
        console.log('connect to DB successfully');

    }
})

app.get('/',function(req,res){
res.sendFile(viewpath+'index.html');
});
app.get('/newbook',function(req,res){
    let fileName = viewpath +'newbook.html';
    res.sendFile(fileName);
});
app.get('/newauthor',function(req,res){
    let fileName = viewpath +'newauthor.html';
    res.sendFile(fileName);
});

app.post('/addauthor',function(req,res){
    let newauthor= req.body;
    let addauthor= new Author({
        _id: new mongoose.Types.ObjectId(),
        name:{
            firstName:newauthor.firstname,
            lastName:newauthor.lastname
        },
        dob:newauthor.dob,
        address:{
            state:newauthor.state,
            suburb:newauthor.suburb,
            street:newauthor.street,
            unit:newauthor.unit
        },
        numberBook:parseInt(newauthor.booknum)
    });
    addauthor.save(function(error){
        if (error){
            console.log('err: ' + error);
            res.redirect('/newauthor');
        }
        else{
        console.log('author added to DB');
        res.redirect('/authorlist');
    }
    });
});

app.get('/booklist',function(req,res){
   Book.find({}).populate('author').exec(function(error,data){
    res.render('booklist', { books: data });
   })
});

//AUTHOR LIST 
app.get('/authorlist',function(req,res){
    Author.find({}, function(error,data){
     res.render('authorlist', { authors: data });
    });
 });

app.post('/addbook',function(req,res){
    let bookItem= req.body;
    let addbook= new Book({
        _id: new mongoose.Types.ObjectId(),
        title:bookItem.title,
        author:mongoose.Types.ObjectId(bookItem.authorid),
        isbn:bookItem.isbn,
        date:bookItem.publicationdate,
        summary:bookItem.summary
    });
    addbook.save(function(error){
        if (error){
            console.log('err: ' + error);
            res.redirect('/newbook');
        }
        else{
        console.log('book added to DB');
        Author.updateOne({'_id':bookItem.authorid},{$inc:{'numberBook':1}},function(error,doc){
            console.log('add book to author successfully!');
        });
        res.redirect('/booklist');
    }
    });
    
});


app.get('/deletebook',function(req,res){
    let fileName = viewpath +'deletebook.html';
    res.sendFile(fileName);
});

app.post('/deletebookdata',function(req,res){
    let bookdetails = req.body;
    Book.deleteMany({'isbn':bookdetails.deleteisbn},function(err,doc){
    });
    res.redirect('/booklist');
  
})


//GET request: send the page to the client 
app.get('/updateauthorbooknum', function (req, res) {
    let fileName = viewpath +'updateauthorbooknum.html';
    res.sendFile(fileName);
});
//POST request: receive the details from the client and do the update
app.post('/updateauthordata', function (req, res) {
    Author.findByIdAndUpdate(req.body.authoridupdate,{$set:{'numberBook':req.body.booknumupdate}},function(err,doc){

    });
    res.redirect('/authorlist');// redirect the client to list users page
    
})
//return all the authors with number of books less than the number sent as a query parameter
app.get('/authorBook',(req,res)=>{
    let booknum=parseInt(req.query.n);
    Author.where('numberBook').lt(booknum).exec(function(err,docs){
        res.send(docs+'<br/>'+'thanks!');
        res.end('thanks');
    
    });

});
app.get(/.*/,(req,res)=>{
    res.send('error page');
});



