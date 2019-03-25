//require inquirer 
var inquirer = require("inquirer");

//start up the store
function start() {
    console.log("Welcome to our shop!")
    menu();
}

function menu(){
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["Buy", "List new item", "Exit"],
            name: "action"
        }
    ])

    switch(userInput){
        case "Buy": 
        buyItem();
    }
}