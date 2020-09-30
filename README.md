# ecommerce-API
<h1 align="center">ExpressJS - ecommerce API</h1>
Ecommerce API is a ecommerce application specially for backend only. Built with NodeJs using the ExpressJs Framework.
Express.js is a web application framework for Node.js. [More about Express](https://en.wikipedia.org/wiki/Express.js)

## Built With
![Express.js] (https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)
![Node.js](https://img.shields.io/badge/Node.js-v.10.16-green.svg?style=rounded-square)

## Requirements
1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?
1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name post, and Import file [ecommerce.sql](ecommerce.sql) to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:8001/api)
8. You can see all the end point [here](#end-point)


## Set up .env file
Open .env file on your favorite code editor, and copy paste this code below :
```
PORT=8001
HOST=localhost
USER=root // default
PASS= // default
DATABASE=ecommerce 
```

## Release

<a href="http://localhost:8001">
  <img src="https://img.shields.io/badge/Visit%20on%20the-100.24.31.79-blue.svg?style=popout&logo=amazon-aws"/>
</a>

## End Point
<h3>user</h3>
<p>signup <span>[post] http://localhost:8001/api/sign-up</span></p>
<p>login <span>[post] http://localhost:8001/api/user/login</span></p>
<p>logout  <span>[get] http://localhost:8001/api/user/logout</span></p>
<p>reset password  <span>[post] http://localhost:8001/api/user/update-password</span></p>
<p>get my profile  <span>[get] http://localhost:8001/api/user</span></p>
<p>edit my profile  <span>[patch] http://localhost:8001/api/user/edit-profile</span></p>
<p>verifi email  <span>[get] http://localhost:8001/api/user/verifikasi-email/:token</span></p>
<p>forget password <span>[post] http://localhost:8001/api/user/forgot-password</span></p>
<p>add address for customer  <span>[post] http://localhost:8001/api/user/customer-address</span></p>
<p>get all addres for customer  <span>[get] http://localhost:8001/api/user/customer-address</span></p>

<h3>products</h3>
<p>insert a product <span>[post] http://localhost:8001/api/products</span></p>
<p>delete a product <span>[delete] http://localhost:8001/api/products/:idproducts</span></p>
<p>get a product <span>[get] http://localhost:8001/api/products/:idproducts</span></p>
<p>edit a product <span>[patch] http://localhost:8080/api/products/:idproduct</span></p>
<p>get all products - paging - search - sort using query params  <span>[get] http://localhost:8001/api/products?product_condition=baru&order_by=product_price&sort=ASC&limit=10&page=1</span></p>

<h3>order</h3>
<p>add a product to carts <span>[post] http://localhost:8001/api/order/addToCart</span></p>
<p>update carts (status_item) value from pending to order <span>[patch] http://localhost:8001/api/order/changeStsItemAtChart</span></p>
<p>create order  <span>[post] http://localhost:8001/api/order/create-order</span></p>

<h3>category</h3>
<p>add category  <span>[post] http://localhost:8001/api/category</span></p>
<p>get all categories  <span>[get] http://localhost:8001/api/category</span></p>
<p>delete a category  <span>[delete] http://localhost:8001/api/category/:idcategory</span></p>

<h3>slide</h3>
<p>add a slide <span>[post] http://localhost:8001/api/slide</span></p>
