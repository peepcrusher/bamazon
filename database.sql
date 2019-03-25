DROP DATABASE IF EXISTS bamazon_db;

CREATE DATABASE bamazon_db;

USE bamazon_db;
-- Create our table of products
CREATE TABLE products(
    id INT NOT NULL AUTO_INCREMENT,
    product VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT(50) NOT NULL,
    PRIMARY KEY (id)

);

-- populate table with products
INSERT INTO products(product, price, quantity)
VALUES ("Nerf Gun", 10, 50);

INSERT INTO products(product, price, quantity)
VALUES ("Flute", 50, 20);

INSERT INTO products (product, price, quantity)
VALUES ("Giant Teady Bear", 100, 5);