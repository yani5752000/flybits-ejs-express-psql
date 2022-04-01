const {diff, flyDatabase, branchDatabase, promotionDatabase} = require("./helpers");

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'lightbnb'
});




app.get("/fly.json", (req, res) => {
  res.json(flyDatabase);
}); 


app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/user", (req, res) => {
  res.render("userPage", {promotion: null});
});

app.get("/marketer", (req, res) => {
  const templateVars = {branchDatabase, promotionDatabase};
  res.render("marketerPage", templateVars);
});

app.post("/addBranch", (req, res) => {
  console.log("%%%", req.body)
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  pool.query("INSERT INTO branches (latitude, longitude) VALUES $1, $2 RETURNING *", [latitude, longitude])
  .then(result => {
    console.log(branchDatabase);
    res.redirect("/marketer");
  })
})

app.get("/branches", (req, res) => {
  pool.query("SELECT * FROM promotions RETURNING *")
  .then(result => {
    return result.rows;
  })
  // res.json(branchDatabase);
})

app.get("/promotions/:lat/:lng", (req, res) => {
  pool.query("SELECT * FROM promotions Where latitude = $1 AND longitude = $2"
  , [req.params.lat, req.params.lng])
  .then(result => {
    return result.rows[0];
  })
  // res.json(promotionDatabase);
})

app.get("/promotions", (req, res) => {
  pool.query("SELECT * FROM promotions RETURNING *")
  .then(result => {
    return result.rows;
  })
  // res.json(promotionDatabase);
})

app.post("/branches", (req, res) => {
  console.log("%%%", req.body)
  const branchId = req.body.branchId;
  const imageUrl = req.body.imageUrl;
  const caption = req.body.caption;

  pool.query("INSERT INTO promotions(branch_id, caption, photo_url) VALUES ($1, $2, $3) Returning *;"
  , [branchId, caption, imageUrl])
  .then(result => {
    res.redirect("/marketer")
  })
  
  // const templateVars = {branchDatabase: branchDatabase}
  // res.render("marketerPage", templateVars);
  res.redirect("/marketer");
})

app.post("/deletePromotion", (req, res) => {
  console.log("%%%", req.body)
  const promotionId = req.body.promotionId;
  
  pool.query("DELETE FROM promotions WHERE id = $1 Returning *;"
  , [promotionId])
  .then(result => {
    res.redirect("/marketer")
  })
  // const templateVars = {branchDatabase: branchDatabase}
  // res.render("marketerPage", templateVars);
  res.redirect("/marketer");
})

app.post("/deleteBranch", (req, res) => {
  console.log("%%%", req.body)
  const branchId = req.body.branchId;
  
  pool.query("DELETE FROM branches WHERE id = $1"
  , [branchId])
  .then(result => {
    res.redirect("/marketer");
  })
  // const templateVars = {branchDatabase: branchDatabase}
  // res.render("marketerPage", templateVars);
})

app.post("/addPromotion", (req, res) => {
  console.log("%%%", req.body)
  const branchId = req.body.branchId;
  const imageUrl = req.body.imageUrl;
  const caption = req.body.caption;
  pool.query("INSERT INTO promotions(branch_id, caption, photo_url) VALUES ($1, $2, $3) RETURNING *;"
  , [branchId, caption, imageUrl])
  .then(result => {
    console.log(result.rows);
    res.redirect("/marketer");
  })
  // const templateVars = {branchDatabase: branchDatabase}
  // res.render("marketerPage", templateVars);
  
})

app.post("/marketerPromotion/:promotionId/delete", (req, res) => {
  delete promotionDatabase[req.params.promotionId];
 
  console.log(promotionDatabase);
  // const templateVars = {branchDatabase: branchDatabase}
  // res.render("marketerPage", templateVars);
  res.redirect("/marketer");
})


app.post("/userCheckPromotion", (req, res) => {
  // console.log("%%%", req.body)
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  
  const refLat = 45.37464841017669;
  const refLng = -75.651369761328;

  // if(diff(refLat, latitude) <= 0.0001 
  // && diff(refLng, longitude) <= 0.0001) {
  //   // console.log("this is the promotion");
  //   const promotion = promotionDatabase["1"];
  // } else {
  //   const promotion = null;
  // }
  // const templateVars = {promotion};
  // res.render("userPage.ejs", templateVars);
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});