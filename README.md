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
<a href="https://www.getpostman.com/collections/2301f2e9a1e6d0eb00ba">Postman</a> 
or test on <a href="http://3.92.225.2:8001/api-docs/#/">Swagger</a>
7. Choose HTTP Method and enter request url.(ex. localhost:8001/api/v1/)
8. You can see all the end point [here](#end-point)


## Set up .env file
Open .env file on your favorite code editor, and copy paste this code below :
``` 
PORT = 8001
JWT_KEY= asdf1234
IP = "3.92.225.2" 

DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = ""
DB_NAME = "ecommerce"
 
APP_URL_PRODUCTS = "http://3.92.225.2:8001/imgs-products/"
APP_URL_PROFILE = "http://3.92.225.2:8001/imgs-users/"
APP_URL_CATEGORY = "http://3.92.225.2:8001/imgs-category/"
APP_URL_SLIDE = "http://3.92.225.2:8001/imgs-slide/"
APP_URL_STORE = "http://3.92.225.2:8001/imgs-store/"

EMAIL_ADDRESS = ""
EMAIL_PASS = ""
API_KEY_RAJAONGKIR = ""
```

## Release

<a href="http://18.208.170.8:8001/api-docs/">
  <img src="https://img.shields.io/badge/Visit%20on%20the-3.92.225.2-blue.svg?style=popout&logo=amazon-aws"/>
</a> swagger
<p>jika anda mengakses api-docs/ akan mendapati sebagian error atau not respons, dikarnakan ada perubahan pada script. sebagai gantinya anda bisa gunakan postman. ini link nya:</p>
<a href="https://www.getpostman.com/collections/2301f2e9a1e6d0eb00ba">
  <img src="https://img.shields.io/badge/postman-https%3A%2F%2Fwww.getpostman.com%2Fcollections%2F2301f2e9a1e6d0eb00ba-orange"/>
</a> postman


## End Point
<h3>User</h3><hr/>
<p>Login <code>[post] http://3.92.225.2:8001/api/v1/login</code></p>
<pre>
exp:.
{
    "login_email":"purkonud12119617@gmail.com",
    "login_password":"Pass123",
    "login_account_type":"seller"
}
</pre>
<br/>
<p>Sign-up <code>[post] sign-up post http://3.92.225.2:8001/api/v1/user/sign-up</code></p>
<p>alur sing-up : validateSignup-> signUp-> SendEmail-> sendResponse </p>
<p>jika signup gagal karna SendEmail error, hal ini terjadi karna badCredential. silahkan gunakan account yang sudah terdaftar seperti end point login diatas.</p>
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

<p>Logout  <code>[get] http://3.92.225.2:8001/api/v1/user/logout</code></p>
<br/>

<p>Reset password  <code>[post] http://3.92.225.2:8001/api/v1/user/update-password</code></p>
<pre>

  Authorization's type Bearer Token

  {
      "newpassword":"AmikBsi12119617",
      "newpassword_repeat":"AmikBsi12119617"
  }
</pre>
<br/>
<p>Get my profile  <code>[get] http://3.92.225.2:8001/api/v1/user</code></p>
<pre>
  Authorization's type Bearer Token
</pre>
<br/>

<p>Edit my profile  <code>[patch] http://3.92.225.2:8001/api/v1/user/edit-profile</code></p>
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
<p>Forget password <code>[post] http://3.92.225.2:8001/api/v1/user/forgot-password</code></p>
<pre>
  {
    "email":"purkonud12119617@gmail.com"
  }
</pre>
<br/>
<p>Add customer's address <code>[post] http://3.92.225.2:8001/api/v1/user/customer-address</code></p>
<pre>
  Authorization's type Bearer Token
 
  {
    "address":"kp. gelap gulita rt.01 rw.01, desa hujan",
    "primary_address":"true"
  } 

  note:. primary_address's type enum('true','false') DEFAULT 'false'

</pre>
<br>
<p>Get customer's address  <code>[get] http://3.92.225.2:8001/api/v1/user/customer-address</code></p>
<pre>
  Authorization's type Bearer Token 
</pre>
<br>


<h3>Products</h3><hr/>
<p>Create a product <code>[post] http://3.92.225.2:8001/api/v1/products</code></p><br/>
<pre>

  Authorization's type Bearer Token

  {
    "product_name" string,
    "product_description"string,
    "images" file,
    "product_category" FK to tb_categories,
    "product_price" integer,
    "disc" float,
    "product_stock" integer,
    "product_rating" integer,
    "product_condition" string,
    "product_size" string,
    "product_color" string,

  }
</pre>
<p>Delete a product <code>[delete] http://3.92.225.2:8001/api/v1/products/:idproducts</code></p><br/>
<p>Read product <code>[get] http://3.92.225.2:8001/api/v1/products/:idproducts</code></p><br/>
<p>Edit a product <code>[patch] http://3.92.225.2:8080/api/v1/products/:idproduct</code></p><br/>
<p>Read products - paging - search - sort using query params  <br/>
<code>[get] http://3.92.225.2:8001/api/v1/products?product_condition=baru&order_by=product_price&sort=ASC&limit=10&page=1</code></p>
<br/>
<pre>
  query params:

  {
    product_name,
    product_category,
    seller,
    product_condition,
    order_by,
    sort, 
    limit ,
    page,

  }

  note: 
        sort type string default ASC
        limit type integer
        page type integer
</pre>
<br/>
<h3>Order</h3><hr/>
<p>first - Add a product to carts <code>[post] http://3.92.225.2:8001/api/v1/order/addToCart</code></p><br/>
<p>second - Update carts (status_item) value from pending to order <code>[patch] http://localhost:8001/api/v1/order/changeStsItemAtChart</code></p><br/>
<p>last - Create order  <code>[post] http://3.92.225.2:8001/api/v1/order/create-order</code></p><br/>

<h3>Category</h3><hr/>
<p>Create category  <code>[post] http://3.92.225.2:8001/api/v1/category</code></p><br/>
<pre>
  Authorization's type Bearer Token
  
  body in form-data:
  {
    [type string required] "category_name": "t-shirt",
    [type file]   "images":"category_one.png"
  }  
</pre>
<br/>

<p>Read categories  <code>[get] http://3.92.225.2:8001/api/v1/category</code></p> 
<br/>

<p>Delete category  <code>[delete] http://3.92.225.2:8001/api/v1/category/:category_id</code></p>
<pre>
  parameters:
  {
    Authorization's type Bearer Token
  },
  {
    Path variabel `category_id` type string required
  }

</pre>
<br/>

<h3>Slide</h3><hr/>
<p>Add a slide <code>[post] http://3.92.225.2:8001/api/v1/slide</code></p><br/>
<pre>
  Authorization's type Bearer Token
  
  body in form-data:
  {
    [type string required] "slide_name": "slide one",
    [type file]   "images":"slide_one.png",
    [type string] "url":"http://3.92.225.2:8001/imgs-slide/slide_one.png"
  }  
</pre>
