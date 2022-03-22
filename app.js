const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const app = express();
const mongoose = require("mongoose");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost:27017/restful_blog_app");

// MONGOOSE BLOG SCHEMA
const blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {
    type: Date,
    default: Date.now,
  },
});
const Blog = mongoose.model("Blog", blogSchema);

// Blog.create({

//   title: "Best thing",
//   image: "https://rxjs.dev/assets/images/logos/logo.png",
//   body: "Hello this is a blog",
// });

// RESTFUL ROUTES

app.get("/", function (req, res) {
  res.redirect("/blogs");
});

app.get("/blogs", function (req, res) {
  Blog.find({}, (err, blogs) => {
    if (err) {
      console.log("err");
    } else {
      res.render("index", { blogs: blogs });
    }
  });
});

// NEW ROUTE
app.get("/blogs/new", (req, res) => {
  res.render("new");
});

// CREATE ROUTE

app.post("/blogs", (req, res) => {
  //  create a blog
  const data = req.body.blog;
  // çreate blog
  Blog.create(data, (err, newBlog) => {
    if (err) {
      res.render("new");
    } else {
      // then redirect
      res.redirect("/blogs");
    }
  });
});

// SHOW ROUTE

app.get("/blogs/:id", (req, res) => {
  const id = req.params.id;
  Blog.findById(id, (err, singleBlog) => {
    if (err) {
      // redirect to all blogs
      res.redirect("/blogs");
    } else {
      // render show with blog obj
      res.render("show", { blog: singleBlog });
    }
  });
});

// EDIT ROUTE
app.get("/blogs/:id/edit", (req, res) => {
  Blog.findById(req.params.id, (err, foundBlog) => {
    if (err) {
      res.redirect("/blogs");
    } else {
      res.render("edit", { blog: foundBlog });
    }
  });
});
// UPDATE ROUTE

app.put("/blogs/:id", (req, res) => {
  Blog.findByIdAndUpdate(
    req.params.id,
    req.body.blog,
    function (err, updatedBlog) {
      if (err) {
        res.redirect("/blogs");
      } else {
        res.redirect("/blogs/" + req.params.id);
      }
    }
  );
});

app.listen(3000, () => {
  console.log("server has started on port 3000");
});
