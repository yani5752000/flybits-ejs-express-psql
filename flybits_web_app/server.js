const {diff, flyDatabase, branchDatabase, promotionDatabase} = require("./helpers");

const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));




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
  const id = Object.keys(branchDatabase).length + 1;
  branchDatabase[id] = {id, latitude, longitude};
  console.log(branchDatabase);
  // const templateVars = {branchDatabase: branchDatabase}
  // res.render("marketerPage", templateVars);
  res.redirect("/marketer");
})

app.get("/branches", (req, res) => {
  res.json(branchDatabase);
})

app.get("/promotions", (req, res) => {
  res.json(promotionDatabase);
})

app.post("/branches", (req, res) => {
  console.log("%%%", req.body)
  const branchId = req.body.branchId;
  const imageUrl = req.body.imageUrl;
  const caption = req.body.caption;
  const id = Object.keys(promotionDatabase).length + 1;
  promotionDatabase[id] = {branchId, imageUrl, caption};
  console.log(promotionDatabase);
  // const templateVars = {branchDatabase: branchDatabase}
  // res.render("marketerPage", templateVars);
  res.redirect("/marketer");
})

app.post("/addPromotion", (req, res) => {
  console.log("%%%", req.body)
  const branchId = req.body.branchId;
  const imageUrl = req.body.imageUrl;
  const caption = req.body.caption;
  const id = Object.keys(promotionDatabase).length + 1;
  promotionDatabase[id] = {id, branchId, imageUrl, caption};
  console.log(promotionDatabase);
  // const templateVars = {branchDatabase: branchDatabase}
  // res.render("marketerPage", templateVars);
  res.redirect("/marketer");
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