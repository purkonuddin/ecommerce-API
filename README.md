# ecommerce-API
<h1 align="center">ExpressJS - ecommerce API</h1>
Ecommerce API is a ecommerce application specially for backend only. Built with NodeJs using the ExpressJs Framework.
Express.js is a web application framework for Node.js. ![More_about_Express](https://en.wikipedia.org/wiki/Express.js)

## Built With

<a href="http://localhost:8001">
  <img src="https://img.shields.io/badge/Express.js-4.x-orange.svg?style=rounded-square"/>
</a>
<a href="http://localhost:8001">
  <img src="https://img.shields.io/badge/Node.js-v.10.16-green.svg?style=rounded-square"/>
</a> 

## Requirements
1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (exp:. localhost)

## How to run the app ?
1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name post, and Import file [ecommerce.sql](ecommerce.sql) to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before, 
<a href="https://www.getpostman.com/collections/9b37cdb72de14add6727">collection_link</a> 
or test on SWAGGER <a href="http://3.92.225.2:8001/api-docs/#/">http://3.92.225.2:8001/api-docs/#/</a>
7. Choose HTTP Method and enter request url.(ex. localhost:8001/api/v1/)
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

<a href="http://3.92.225.2:8001/api-docs/">
  <img src="https://img.shields.io/badge/Visit%20on%20the-100.24.31.79-blue.svg?style=popout&logo=amazon-aws"/>
</a>
![http://3.92.225.2:8001/api-docs/](http://3.92.225.2:8001/api-docs/)


## End Point
<h3>user</h3><hr/>
<p>login <code>[post] http://localhost:8001/api/v1/login</code></p>
<pre>
exp:.
{
    "login_email":"purkonud12119617@gmail.com",
    "login_password":"pass123"
}
</pre>
<br/>
<p>sign-up <code>[post] sign-up post http://3.92.225.2:8001/api/v1/user/sign-up</code></p>
<pre>
exp:.
{
    "account_type": "seller", 
    "username" : "Mr Swagger",
    "useremail": "purkonuddin25@gmail.com",
    "password" : "pass123",
    "password_repeat" : "pass123",
    "userphone":"085779919114",
    "userstore":"Toko Swagger"
}

note:. account_type's type enum('seller','customer','admin')
      if success then check your email, and tap on verify email link

      verifi email:  <code>[get] http://3.92.225.2:8001/api/v1/user/verifikasi-email/:token</code>
</pre>
<br/> 

<p>logout  <span>[get] http://3.92.225.2:8001/api/v1/user/logout</span></p>
<br/>

<p>reset password  <code>[post] http://3.92.225.2:8001/api/v1/user/update-password</code></p>
<pre>

  Authorization's type Bearer Token

{
    "newpassword":"AmikBsi12119617",
    "newpassword_repeat":"AmikBsi12119617"
}
</pre>
<br/>
<p>get my profile  <span>[get] http://3.92.225.2:8001/api/v1/user</span></p>
<pre>
  Authorization's type Bearer Token
</pre>
<br/>

<p>edit my profile  <code>[patch] http://3.92.225.2:8001/api/v1/user/edit-profile</code></p>
<pre>
  Authorization's type Bearer Token

  body in formData:
  {
    user_email (required) type string
    user_phone (required) type string
    gender's type enum('laki-laki','perempuan')
    date_of_birth type date
    images type file
  }
</pre>
<br/>
<p>forget password <code>[post] http://3.92.225.2:8001/api/v1/user/forgot-password</code></p>
<pre>
  {
    "email":"purkonud12119617@gmail.com"
  }
</pre>
<br/>
<p>add customer's address <span>[post] http://3.92.225.2:8001/api/v1/user/customer-address</span></p>
<pre>
  Authorization's type Bearer Token
 
  {
    "address":"kp. gelap gulita rt.01 rw.01, desa hujan",
    "primary_address":"true"
  } 

  note:. primary_address's type enum('true','false') DEFAULT 'false'

</pre>
<br>
<p>get customer's address  <span>[get] http://3.92.225.2:8001/api/v1/user/customer-address</span></p>
<pre>
  Authorization's type Bearer Token 
</pre>
<br>
<h3>products</h3><hr/>
<p>insert a product <span>[post] http://3.92.225.2:8001/api/v1/products</span></p><br/>
<p>delete a product <span>[delete] http://3.92.225.2:8001/api/v1/products/:idproducts</span></p><br/>
<p>get a product <span>[get] http://3.92.225.2:8001/api/v1/products/:idproducts</span></p><br/>
<p>edit a product <span>[patch] http://3.92.225.2:8080/api/v1/products/:idproduct</span></p><br/>
<p>get all products - paging - search - sort using query params  <span>[get] http://3.92.225.2:8001/api/v1/products?product_condition=baru&order_by=product_price&sort=ASC&limit=10&page=1</span></p><br/>

<h3>order</h3><hr/>
<p>add a product to carts <span>[post] http://3.92.225.2:8001/api/v1/order/addToCart</span></p>
<p>update carts (status_item) value from pending to order <span>[patch] http://localhost:8001/api/v1/order/changeStsItemAtChart</span></p><hr/>
<p>create order  <span>[post] http://3.92.225.2:8001/api/v1/order/create-order</span></p><br/>

<h3>category</h3><hr/>
<p>add category  <span>[post] http://3.92.225.2:8001/api/v1/category</span></p>
<p>get all categories  <span>[get] http://3.92.225.2:8001/api/v1/category</span></p>
<p>delete a category  <span>[delete] http://3.92.225.2:8001/api/v1/category/:idcategory</span></p>

<h3>slide</h3><hr/>
<p>add a slide <span>[post] http://3.92.225.2:8001/api/v1/slide</span></p>
