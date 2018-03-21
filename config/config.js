process.env.NODE_ENV = process.env.NODE_ENV || "developement";

if(process.env.NODE_ENV === "developement"){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://localhost/blog-app';
}
