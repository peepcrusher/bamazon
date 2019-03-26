//require inquirer 
var inquirer = require("inquirer");
var mysql = require("mysql");
//connection variable with the cridentials
var connection = mysql.createConnection({
    host: "localhost",
  
  
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazon_db"
  });

  connection.connect(function(err){
      if(err) throw err;
      start();
  })

  //variable to hold all the items in the store
  var items = []

//start up the store
function start() {
    console.log("Welcome to our shop!")
    menu();
}
//Menu function
function menu(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Buy", "List new item", "Exit"],
            name: "action"
        }
    ]).then(function(response){
//switch statement after the menu prompt
switch(response.action){
    //if they chose buy, then run the buy item function
    case "Buy": 
    populateItems();
    break;

    //if they chose to list a new item, run the list new item function
    case "List new item":
    listItem();
    break;
    
    //if they chose to exit the app, say goodbye, and end the connection
    case "Exit":
    console.log("Goodbye! Come again")
    
}
    })
    
}
var items = [];
//All Functions below this comment

function populateItems(){
    connection.query("SELECT * FROM products", function(err, res){
        if(err) throw err;
        for(var i = 0; i < res.length; i++){
            items.push(res[i].product)
            console.log(res[i].product)
        }
        buyItem();
    })
}

function buyItem(){
   
    inquirer.prompt([
        {
            type: "list",
            message: "Which item would you like to purchase?",
            choices: items,
            name: "item"
        },
        {
            type: "input",
            message: "How many would you like to buy?",
            name: "num"
        }
    ]).then(function(response){
        console.log(response.item, + response.num)
        updateQuantities(response.item, response.num)

    })
}
    
function updateQuantities(item, num){
    var number = parseInt(num);
    console.log(number)
    var quantity = 
    connection.query("UPDATE products SET ? WHERE ?",[
        {
            quantity: quantity - number
        },
        {
            product: item
        }
    ], function(err){
        if (err) throw err;

        })
}

function listItem(){
    inquirer.prompt([
        {
            type: "input",
            message: "What would you like to sell?",
            name: "product"
        },
        {
            type: "input",
            message: "How much does it cost?",
            name: "price"
        },
        {
            type: "input",
            message: "How many do we have in stock?",
            name: "quantity"
        }
    ]).then(function(response){
        connection.query("INSERT INTO products SET ?",
        {
            product: response.product,
            price: response.price,
            quantity: response.quantity
        })

        console.log("Your item has been added");
        menu();
    })
}