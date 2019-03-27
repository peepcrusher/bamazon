//require inquirer 
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require("cli-table2")
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

connection.connect(function (err) {
    if (err) throw err;
    populateTable();
})
//create our nice and pretty looking table
var table = new Table({
    chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
           , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
           , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
           , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
  });
//populate our nice, pretty table
  table.push(["Product", "Price", "Quantity"]);
function populateTable(){
  connection.query("SELECT * FROM products", function (err, res) {
    if (err) throw err;
    for (var i = 0; i < res.length; i++) {
        table.push([res[i].product, res[i].price, res[i].quantity])
    }
    start();
})
}
//variable to hold all the items in the store
var items = []
//variables to be used to update quantities
var bought;
var stock;
var price;
//start up the store
function start() {
    console.log("Welcome to our shop!")
    menu();
}
//Menu function
function menu() {
    console.log(table.toString());
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Buy", "List new item", "Exit"],
            name: "action"
        }
    ]).then(function (response) {
        //switch statement after the menu prompt
        switch (response.action) {
            //if they chose buy, then run the buy item function
            case "Buy":
                items = [];
                populateItems();
                break;

            //if they chose to list a new item, run the list new item function
            case "List new item":
                listItem();
                break;

            //if they chose to exit the app, say goodbye, and end the connection
            case "Exit":
                console.log("Goodbye! Come again")
                connection.end();

        }
    })

}

//All Functions below this comment

function populateItems() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            items.push(res[i].product)
        }
        buyItem();
    })
}
//funcion to buy an Item
function buyItem() {

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
    ]).then(function (response) {
        console.log(response.item, + response.num)
        getQuantity(response.item, response.num)

    })
}


//function to get the new quantity 
function getQuantity(item, num){
    connection.query("SELECT * FROM products WHERE product=" + "'" + item + "'", function (err, res) {
        if (err) throw err;
        stock = res[0].quantity;
        bought = parseInt(num)
        price = res[0].price
        var newQuantity = stock - bought;
        console.log(stock)

        //make sure they can't buy more than is in stock
        if(bought > stock) {
            console.log("Sorry, we don't have that many " + item + "(s)")
            menu();
        }

        else if(bought <= stock)
        updateQuantities(item, newQuantity);
    })
}
//function to update quantities after something has been purchased
function updateQuantities(item, num) {

    
    connection.query("UPDATE products SET ? WHERE ?", [
        {
            quantity: num
        },
        {
            product: item
        }
    ], function (err) {
        if (err) throw err;
        console.log("you bought " + bought + " " + item + " for " + (price * bought) + " dollars!");
        reset();
    })
}
//function for adding items to the shop
function listItem() {
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
    ]).then(function (response) {
        connection.query("INSERT INTO products SET ?",
            {
                product: response.product,
                price: response.price,
                quantity: response.quantity
            })

        console.log("Your item has been added");
        reset();
    })
}

function reset(){
    bought = 0;
    stock = 0;
    items = [];
    price = 0;
    menu();
}