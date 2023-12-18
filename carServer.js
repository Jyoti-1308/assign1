var express = require("express");
var app = express();
app.use(express.json());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,OPTIONS,PATCH,PUT,DELETE,HEAD,POST"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});
var port = process.env.PORT || 2410;
app.listen(port, () => console.log(`Node App listening on port ${port}!`));

let data = require("./carData.js");
let { cars = [], carMaster } = data;

app.get("/cars/:id",function(req,res){
    let id=req.params.id;
    let car=cars.find(c1=>c1.id===id);
    res.send(car);
});

app.post("/cars", function (req, res) {

    let body = req.body;
    console.log(body);
    cars.push(body);
    res.send(cars);
});

app.put("/cars/:id", function (req, res) {
    let id=req.params.id;
    let index=cars.findIndex(c1=>c1.id===id);
    let body = req.body;
    console.log(body);
    cars[index]=body;
    res.send(cars);
});

app.delete("/cars/:id",function(req,res){
    let id=req.params.id;
    let index=cars.findIndex(c1=>c1.id===id);
    if(index>=0){
        let car=cars.splice(index,1);
        res.send(car);
    }
   
    
})

app.get("/cars", function (req, res) {
    let { sort = '', fuel = '', type = '' ,minPrice='',maxPrice=''} = req.query;
    let cars1 = [], cars2 = [], cars3 = [],cars4=[];
    let data1 = [], data2 = [];
    
    if (fuel) {
        data1 = carMaster.filter(ele => ele.fuel === fuel);
        cars1 = cars.filter(ele => data1.find(d1 => d1.model === ele.model));

    }
    else {
        data1 = carMaster;
        cars1 = cars;
    }
    if (type) {
        data2 = data1.filter(ele => ele.type === type);
       console.log(data2);
        cars2 = cars1.filter(ele => data2.find(d1 => d1.model === ele.model));
       console.log(cars2);
    }
    else {
        cars2 = cars1;
        data2 = data1;
    }
    if (sort) {
        if (sort === "kms") {
            cars2.sort((c1, c2) => c1.kms - c2.kms);
        }
        if (sort === "price") {
            cars2.sort((c1, c2) => c1.price - c2.price);
        }
        if (sort === "year") {
            cars2.sort((c1, c2) => c1.year - c2.year);
        }
        
    }
    if(minPrice){
        cars3=cars2.filter(c1=>c1.price>=(+minPrice));
    }
    else{
        cars3=cars2;
    }
    if(maxPrice){
        cars4=cars3.filter(c1=>c1.price<=(+maxPrice));
    }
    else{
        cars4=cars3;
    }
    // console.log(cars2);
    res.send(cars4);
});