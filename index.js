const express = require('express')
const bodyParser = require('body-parser')
// const port = process.env.PORT || 3000
const mongoose = require('mongoose')
const validator = require('validator');
const { ReplSet } = require('mongodb');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const slugify = require('slugify')
require('dotenv').config()
const { env } = require('process');
const port = process.env.PORT || 3000

mongoose.connect('mongodb://127.0.0.1:27017/blogsite', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
})

const auth = require('./authentication/auth')
const User = require('./models/user')
const Post = require('./models/post')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }));
app.set('view engine', "ejs")
app.use(express.static('public'))


app.get('/', auth, async (req, res) => {
    const name = "User"
    const upost = await Post.find()
    res.render('newhome', { upost: upost, name: name })
});

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/signup', (req, res) => {
    res.render('signup')
})

app.get('/post', auth, async (req, res) => {
    res.render('post')
})

app.get('/show', auth, async (req, res) => {
    try {
        const list = await User.find({})
        res.render('show', { list: list })
    } catch (error) {
        res.send('Something gone wrong during showing our data')
    }
})

app.get('/logout', async (req, res) => {
    try {
        res.clearCookie('jwt', { domain: 'localhost', path: '/' })
        console.log("Logout Successfully")
        await req.User.save();
        res.redirect('/')
    } catch (error) {
        const upost = await Post.find()
        res.render('home', { upost: upost })
    }
})

app.get('/profile', auth, async (req, res) => {
    const tmp = req.headers.cookie
    // console.log("Our Cookie : " + tmp)
    const token = tmp.substring(4)
    const verifyUser = jwt.verify(token, 'MyBlogSite')
    const user = await User.findOne({ _id: verifyUser.id })
    var first = user.name[0].toUpperCase();
    console.log(first)
    res.render('profile', { list: user.posts, name: user.name, email: user.email, count: user.posts.length, organisation: user.organisation, first: first })
})

function giveDate() {
    const date = new Date();
    const formattedDate = date.toLocaleDateString();

    return formattedDate
}


app.post('/post', auth, async (req, res) => {
    try {
        const dates = giveDate()

        const tmp = req.headers.cookie
        const token = tmp.substring(4)
        const verifyUser = jwt.verify(token, 'MyBlogSite')
        const user = await User.findOne({ _id: verifyUser.id })
        console.log(user.name)

        const post = new Post({
            email: user.name,
            heading: req.body.heading,
            details: req.body.details,
            date: dates,
            slug: slugify(req.body.heading)
        })
        var x = {
            title: req.body.heading,
            about: req.body.details,
            date: dates
        }

        user.posts.push(x)
        await user.save()
        await post.save().then((result) => {
            res.redirect('/')
        }).catch((e) => {
            res.send("Something gone wrong during saving our POst data  " + e)
        })
    } catch (error) {
        res.send('Something gone wrong ' + error)
    }
})


app.post('/signup', async (req, res) => {
    try {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            organisation: req.body.org,
            password: req.body.pass,
            token: '1'
        })
        // const token = await user.generateAuthToken()

        await user.save().then((result) => {
            res.redirect('/login')
        }).catch((e) => {
            res.send("Something gone wrong during saving our data")
        })
    } catch (error) {
        console.log("Signup Post Error " + error)
    }
})

app.post('/login', async (req, res) => {
    const user = await User.findOne({ email: req.body.email })
    try {
        const isMatch = await bcrypt.compare(req.body.pass, user.password)

        const token = await user.generateAuthToken()
        console.log(isMatch, token)
        res.cookie('jwt', token, {
            expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100),
            secure: false
        })
        name = "User"
        const upost = await Post.find()
        res.render('newhome', { upost: upost, name: name })

    } catch (error) {
        console.log("LOgin Error " + error)
        res.redirect('/login')
    }
})

app.get('/articles/:id', async (req, res) => {
    console.log(req.params.id)
    const content = await Post.findOne({ slug: slugify(req.params.id) })
    console.log(content)
})

console.log(slugify('Kumar Kumar'))

app.listen(port, () => {
    console.log(`Server started on ${port}`);
});
