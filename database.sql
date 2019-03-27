DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;
-- Create our table of products
CREATE TABLE products(
    id INT NOT NULL AUTO_INCREMENT,
    product VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    department VARCHAR(50) NOT NULL,
    quantity INT(50) NOT NULL,
    PRIMARY KEY (id)

);

-- populate table with products
INSERT INTO products(product, price, department, quantity)
VALUES ("Nerf Gun", 10, "Toys and Games", 50);

INSERT INTO products(product, price, department, quantity)
VALUES ("Flute", 50,"Music", 20);

INSERT INTO products (product, price, department, quantity)
VALUES ("Giant Teady Bear", 100, "Toys and Games", 5);

INSERT INTO products(product, price, department, quantity)
VALUES ("Eggs", 5, "Food and Drink", 23);

INSERT INTO products(product, price, department, quantity)
VALUES ("Franzia, Boxed Wine", 14, "Food and Drink", 50);