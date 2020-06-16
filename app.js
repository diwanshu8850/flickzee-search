const express = require('express'),
      app = express(),
      bodyParser = require('body-parser'),
      ejs = require('ejs'),
      mysql = require('mysql');


const con = mysql.createPool({
    connectionLimit: 10,
    host: "localhost",
    user: "root",
    password: "1234",
    database: "movies_29aug"
});

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/',(req, res)=>{
   res.render('index', {data: []}); 
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*123456789+?.`~!?_@&%,\\^$|#\s]/g, '');
};

app.get('/movie', (req, res)=>{
    con.getConnection((err,connection)=>{
        if(err){
            console.log(err);
        }
        else{
            const query = req.query.name.split(' ');
            let name = [];
            query.forEach(item=>{
               escapeRegex(item).split('/').forEach(data=>{
                   name.push(data);
               }); 
            });
//            console.log(name);
            let search="",mi=1;
            for(let i=0;i<name.length;i++){
                if(name[i].length > mi){
                    mi=name[i].length;
                    search = name[i];
                }
            }
//             console.log(search);
            connection.query(`SELECT title,poster FROM movies WHERE title LIKE '${search}%' OR title LIKE '%${search}%' OR title LIKE '%${search}' ORDER BY imdbRating DESC LIMIT 10`, function (err, result, fields) {
                connection.release();
                if (err) throw err;
                res.render('index', {data: result});
            }); 
        }
    });
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=>{
   console.log('Search Server on.....'); 
});
