var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Sgr31087!",
    database: "bamazon_DB"
});
// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection successful");
    showStoreStuff();
});

var showStoreStuff = function () {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " || " + res[i].product_name + " || " + res[i].department_name +
                " || " + res[i].price + " || " + res[i].stock_quantity + " || " + "\n");
        }
        engageCustomer(res);
    })
}
// run the start function after the connection is made to prompt the user
var engageCustomer = function (res) {
    inquirer
        .prompt([
            {
                name: "choice",
                type: "input",
                message: "Hi there and welcome to bamazon. Here is a list of our items. Which would you like to purchase today?",

            }])
        .then(function (answer) {
            var correct = false;
            for (var i = 0; i < res.length; i++) {
                if (res[i].product_name == answer.choice) {
                    correct = true;
                    var product = answer.choice;
                    var id = i;
                    inquirer
                        .prompt([
                            {
                                name: "quant",
                                type: "input",
                                message: "How many of that item would you like to purchase?",
                                validate: function (value) {
                                    if (isNaN(value) == false) {
                                        return true;
                                    } else {
                                        return false;
                                    }
                                }
                            }]).then(function (answer) {
                               
                                if ((res[id].stock_quantity - answer.quant) > 0) {
                                    connection.query(`UPDATE products SET stock_quantity='${(res[id].stock_quantity - answer.quant)}'
                                        WHERE product_name like '${product}'`, function (err, res2) {
                                            if (err) throw err;
                                            console.log("CONGRATULATIONS! Successfully Purchased Product!");
                                            showStoreStuff();
                                        })
                                } else {
                                    console.log("Not a valid selection please try again.");
                                    engageCustomer(res);
                                }

                            })
                }
            }
        })
}

