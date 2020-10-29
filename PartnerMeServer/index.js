const express = require('express');

const app = express();
const PORT = 3000;
var createError = require('http-errors');
var logger = require('morgan');

const { Connection, Request } = require("tedious");

// Create connection to database
const config = {
  authentication: {
    options: {
      userName: "partnermeteam",
      password: "df67POIL!#"
    },
    type: "default"
  },
  server: "partnerme.database.windows.net",
  options: {
    database: "PartnerMe",
    encrypt: true,
    rowCollectionOnRequestCompletion: true
  }
};

app.use(express.json());

app.get('/', (request, response) => {
    response.send('Hello');
});

//////// AUTH SERVICE ////////
app.get('/auth/getID', (request, response) => {
    response.send('Your ID');
});

/**
    {
    "user_id":"hello",
    "password": "password"
    }
*/

app.post('/auth/authorize', (request, response)=>{
    // check user_id and password to make sure hash is correct.
    console.log(request.body);
    response.send("authorize");
});


app.post('/auth/external', (request, response)=>{
    // check with fb / google auth
    console.log(request.body);
    response.send("external services");
});

app.post('/auth/create', (request, response)=>{
    // check is user_id is already in db, return error
    // connect to auth db and update with user_id and password
    console.log(request.body);
    response.send("create new account");
});

// Matching Service
app.get('/matching/getmatch', (request, response) => {
  const connection = new Connection(config);
    console.log("connection made");
    // Attempt to connect and execute queries if connection goes through
    connection.on("connect", err => {
	if (err) {
	    console.log("error");
	    console.error(err.message);
	} else {
    const request = new Request(
      `SELECT * FROM test`,
      (err, rowCount, rows) => {
        if (err) {
          console.error(err.message);
        } else {
          var return_list = [];
          console.log(`${rowCount} row(s) returned`);
          for(let i = 0 ; i < rows.length ; i++){
            var item = {
              "Name" : rows[i][0].value ,
              "Class" : rows[i][1].value ,
              "Language" : rows[i][2].value,
              "Availability" : rows[i][3].value,
              "Hobbies" : rows[i][4].value ,
            }
            return_list.push(item);
          }
          response.send(return_list);
        }
      }
    );
	    connection.execSql(request);
	}
    });
});

app.post('/matching/sendmessage', (request, response)=>{
    console.log(request.body);
    response.send("external services");
});

// Collaboration Service
app.post('/collaboration/schedule', (request, response)=>{
    console.log(request.body);
    response.send('matching services');
});

// Error Handling
app.use(function(req,res,next) {
    next(createError(404));
});
app.use(function(err, req, res, next){
    return res.status(err.status || 500);
});

app.use(express.urlencoded({
    extended: true
}));

app.listen(PORT, () => console.log(`Express server currently running on port ${PORT}`));


// function queryDatabase() {

//   // Read all rows from table
//   const request = new Request(
//     `SELECT * FROM test`,
//     (err, rowCount, rows) => {
//       if (err) {
//         console.error(err.message);
//       } else {
//         console.log(`${rowCount} row(s) returned`);
//         console.log(rows);
//       }
//     }
//   );

//   return request;
// }