# ecommerce-API
<h1 align="center">ExpressJS - ecommerce API</h1>
Ecommerce API is a ecommerce application specially for backend only. Built with NodeJs using the ExpressJs Framework.
Express.js is a web application framework for Node.js. [More about Express](https://en.wikipedia.org/wiki/Express.js)

## Built With
[![Express.js](https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square)] (https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.10.16-green.svg?style=rounded-square)] (https://nodejs.org/)

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
5. Create a database with the name post, and Import file [ecommerce.sql](post.sql) to **phpmyadmin**
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
DATABASE=post 
```

## Release

<a href="http://localhost:8001">
  <img src="https://img.shields.io/badge/Visit%20on%20the-100.24.31.79-blue.svg?style=popout&logo=amazon-aws"/>
</a>

## End Point
<h3>user</h3>
<p>signup</p> <span>[post] http://localhost:8001/api/sign-up</span>
<p>login</p> <span>[post] http://localhost:8001/api/user/login</span>
<p>logout</p> <span>[get] http://localhost:8001/api/user/logout</span>
<p>reset password</p> <span>[post] http://localhost:8001/api/update-password</span>
<p>get my profile</p> <span>[get] http://localhost:8001/api/user</span>
<p>edit my profile</p> <span>[patch] http://localhost:8001/api/user/edit-profile</span>
<p>verifi email</p> <span>[get] http://localhost:8001/api/verifikasi-email/3adec4cc7d3b97ca91198c11e4c6eec406f72f68</span>
<p>forget password</p> <span>[post] http://localhost:8001/api/forgot-password</span>
<p>add address for customer</p> <span>[post] http://localhost:8001/api/user/customer-address</span>
<p>get all addres for customer</p> <span>[get] http://localhost:8001/api/user/customer-address</span>

<h3>products</h3>
<p>insert a product</p> <span>[post] http://localhost:8001/api/products</span>
<p>delete a product</p> <span>[delete] http://localhost:8001/api/products/:idproducts</span>
<p>get a product</p> <span>[get] http://localhost:8001/api/products/:idproducts</span>
<p>edit a product</p> <span>[patch] http://localhost:8080/api/products/:idproduct</span>
<p>get all products - paging - search - sort using query params</p> <span>[get] http://localhost:8001/api/products?product_condition=baru&order_by=product_price&sort=ASC&limit=10&page=1</span>

<h3>order</h3>
<p>add a product to carts</p> <span>[post] http://localhost:8001/api/order/addToCart</span>
<p>update carts (status_item) value from pending to order</p> <span>[patch] http://localhost:8001/api/order/changeStsItemAtChart</span>
<p>create order</p> <span>[post] http://localhost:8001/api/order/create-order</span>

<h3>category</h3>
<p>add category</p> <span>[post] http://localhost:8001/api/category</span>
<p>get all categories</p> <span>[get] http://localhost:8001/api/category</span>
<p>delete a category</p> <span>[delete] http://localhost:8001/api/category/:idcategory</span>

<h3>slide</h3>
<p>add a slide</p> <span>[post] http://localhost:8001/api/slide</span>
