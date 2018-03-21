const express    = require('express');
const bodyParser = require('body-parser')
const mongoose   = require('mongoose');
const methodOverride = require('method-override')
const app        = express();
const Blog       = require('./models/Blog');
const expressSanitizer = require('express-sanitizer');

require('./config/config');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
mongoose.connect(process.env.MONGODB_URI);
app.use(methodOverride('_method'));
app.use(expressSanitizer());


app.get('/', (req, res) => {
    res.redirect('/blogs');
});

app.get('/blogs', (req, res) => {
    Blog.find({})
        .then(blogs => {
            res.render("index", {blogs});
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/blogs/new', (req, res) => {
    res.render('new');
});

app.post('/blogs', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog)
        .then(blog => {
            res.redirect("/blogs");
        })
        .catch(err =>{
            res.redirect('new')
        })
});
app.get('/blogs/:id', (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            res.render('show', {blog});
        })
        .catch(err => {
            res.redirect('/blogs');
        })
});

app.get('/blogs/:id/edit', (req, res) => {
    Blog.findById(req.params.id)
        .then(blog => {
            res.render('edit', {blog})
        }).catch(err => {
            res.redirect(`/blogs/${req.params.id}`)
        });
});

app.put('/blogs/:id', (req, res) => {
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog)
        .then(blog => {
            res.redirect(`/blogs/${req.params.id}`);
        })
        .catch(err => {
            res.redirect(`/blogs/${req.params.id}`);
        });
});

app.delete('/blogs/:id', (req, res) => {
    Blog.remove({_id: req.params.id})
        .then(() => {
            res.redirect('/blogs');
        })
        .catch(err => {
            res.redirect(`/blogs/${req.params.id}`);
        });
});

app.listen(process.env.PORT, (req, res) => {
    console.log(`The server is up on port ${process.env.PORT}`);
});
