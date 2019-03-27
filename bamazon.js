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
    populateLowTable();
})
//create our nice and pretty looking table
var table = new Table({
    chars: {
        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
        , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
        , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
        , 'right': '║', 'right-mid': '╢', 'middle': '│'
    }
});
var lowTable = new Table({
    chars: {
        'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
        , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
        , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
        , 'right': '║', 'right-mid': '╢', 'middle': '│'
    }
});
lowTable.push(["ID", "Product", "Price", "Department", "Quantity"]);
function populateLowTable() {
    connection.query("SELECT * FROM products WHERE quantity<=5", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            lowTable.push([res[i].id, res[i].product, res[i].price, res[i].department, res[i].quantity])
        }
    })
}
//populate our nice, pretty table
table.push(["ID", "Product", "Price", "Department", "Quantity"]);
function populateTable() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].product, res[i].price, res[i].department, res[i].quantity])
        }
        start();
    })
}
//variable to hold all the items and departments in the store
var items = []
var departments = ["Toys and Games", "Music", "Food and Drink"];
//variables to be used to update quantities
var bought;
var stock;
var price;
var restock;
//start up the store
function start() {
    console.log("These are our wares")
    menu();
}
//Menu function
function menu() {
    console.log(table.toString());

    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Buy", "Manager Options", "Exit"],
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

            case "Manager Options":
                managerMode();
                break;

            //if they chose to exit the app, say goodbye, and end the connection
            case "Exit":
                console.log("Goodbye! Come again")
                connection.end();

        }
    })

}

//All Functions below this comment

function managerMode() {
    inquirer.prompt([
        {
            type: "password",
            message: "What is the manager password?",
            name: "password"
        }]
    )

        .then(function (response) {
            if (response.password === "farley") {
                console.log("password accepted!")
                showManagerOptions();
            }

            else if (response.password !== "farley") {
                console.log("Sorry, your password is incorrect")
                connection.end();
            }

        })

}

//function for showing manager options
function showManagerOptions() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Add an item to the store", "Update Quantities", "Show low quantity items", "Exit"],
            name: "action"
        }
    ]).then(function (response) {
        console.log(response);
        switch (response.action) {
            case "Add an item to the store":
                listItem();
                break;

            case "Update Quantities":
                updateWhichItem();
                break;

            case "Show low quantity items":
                showLowTable();
                break;

            case "Exit":
                console.log("Goodbye!");
                connection.end();

        }
    })
}


//function for showing the contents of the lowTable
function showLowTable() {
    console.log(lowTable.toString());
    showManagerOptions();
}



//populates the items array used for choices in
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
        getQuantity(response.item, response.num)

    })
}
//function for prompting the manager which item they would like to update
function updateWhichItem() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            items.push(res[i].product)
        }
        inquirer.prompt([
            {
                type: "list",
                message: "Which item would you like to add stock to?",
                choices: items,
                name: "item"
            },
            {
                type: "input",
                message: "How many would you like to add",
                name: "num"
            }
        ]).then(function (response) {
            updateItem(response.item, response.num)
        })
    }
    )
};

//function to update item when updating the quantities
function updateItem(item, num) {
    connection.query("SELECT * FROM products WHERE product=" + "'" + item + "'", function (err, res) {
        if (err) throw err;
        stock = res[0].quantity;
        restock = parseInt(num);
        var newQuantity = stock + restock;



        //if they put negative number or 0, then say they can't do that, and take them back to the updateWhichItem Screen
        if (restock <= 0) {
            console.log("You can't do that")
            updateWhichItem()
        }

        else {
            managerUpdateQuantities(item, newQuantity);
        }
    })
}

//this updates the stock of whatever item was said in the updateItem 
function managerUpdateQuantities(item, num) {

    connection.query("UPDATE products SET ? WHERE ?", [
        {
            quantity: num
        },
        {
            product: item
        }
    ], function (err) {
        if (err) throw err;
        console.log("Restock Complete");
        reset();
    })
}


//function to get the new quantity FOR BUYING AN ITEM
function getQuantity(item, num) {
    connection.query("SELECT * FROM products WHERE product=" + "'" + item + "'", function (err, res) {
        if (err) throw err;
        stock = res[0].quantity;
        bought = parseInt(num)
        price = res[0].price
        var newQuantity = stock - bought;

        //make sure they can't buy more than is in stock
        if (bought > stock) {
            console.log("Sorry, we don't have that many " + item + "(s)")
            menu();
        }

        //if they're trying to buy negative items kick them out of the store
        else if (bought <= 0) {
            console.log("you're really trying to buy negative items? What? Stop wasting my time and get out of here")
            connection.end();
        }

        else if (bought <= stock && bought > 0)
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
            type: "list",
            message: "Which department is this in?",
            choices: departments,
            name: "department"
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
                department: response.department,
                quantity: response.quantity
            })

        console.log("Your item has been added");
        reset();
    })
}

function reset() {
    bought = 0;
    stock = 0;
    items = [];
    price = 0;
    restock = 0;
    menu();
}