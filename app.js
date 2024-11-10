if (process.env.NODE_ENV !== "Production") {
    require("dotenv").config();
}

const express = require("express");
const path = require("path");
const app = express();
const methodOverride = require("method-override");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoose = require("mongoose");
const User = require("./Model/User.js");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const multer = require("multer");

const BLOG = require("./Model/edit.js");
const TECH = require("./Model/tech.js");
const CRIC = require("./Model/cric.js");
const GEN = require("./Model/gen.js");
const NAT = require("./Model/nature.js");
const MOTIVE = require("./Model/motive.js");
const Lbrary = require("./Model/library.js");
const { isLoggedIn } = require("./middleware.js");

const { storage } = require("./cloudConfig.js");
const UPLOAD = multer({ storage });

const dburl = process.env.ATLAS_DB;
const port = 8060;

app.set("views", path.join(__dirname, "VIEW"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "PUBLIC")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

async function main() {
    await mongoose.connect(dburl || "mongodb://127.0.0.1:27017/blog");
}
main().catch(err => console.log(err));

const sessionOption = {
    secret: "musecretcode",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.user = req.user;
    req.time = new Date(Date.now()).toString();
    res.locals.time = req.time;
    res.locals.msg = req.flash("success");
    next();
});

app.get("/home", (req, res) => {
    res.render("HOME/index.ejs");
});

app.get("/sign", (req, res) => {
    res.render("LOG-SIGN/signup.ejs");
});

app.post("/sign", async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newuser = new User({ username, email });
        await User.register(newuser, password);
        res.redirect("/home");
    } catch (err) {
        console.error(err);
        res.status(500).send("Please fill the data correctly.");
    }
});

app.get("/login", (req, res) => {
    res.render("LOG-SIGN/login.ejs");
});

app.post(
    "/login",
    passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
    (req, res) => {
        req.flash("success", "Login successful");
        res.redirect("/home");
    }
);

app.get("/logout", async (req, res) => {
    try {
        await req.logout();
        res.redirect("/home");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while logging out.");
    }
});

app.get("/blog/new", (req, res) => {
    res.render("BLOG/edit.ejs");
});

app.post("/blog", UPLOAD.fields([{ name: 'Image' }, { name: 'Image1' }]), async (req, res) => {
    if (!req.files['Image'] || !req.files['Image1']) {
        return res.status(400).send("Please upload both images.");
    }

    const imageFile = req.files['Image'][0];
    const image1File = req.files['Image1'][0];
    let { Title, Content, Contents, Author, Content1, Content2 } = req.body;

    let blogPost = new BLOG({
        Title,
        Content,
        Contents,
        Author,
        Content1,
        Content2,
        Image: { url: imageFile.path, filename: imageFile.filename },
        Image1: { url: image1File.path, filename: image1File.filename }
    });

    try {
        await blogPost.save();
        res.redirect("/blog");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the blog.");
    }
});

app.get("/blog", async (req, res) => {
    let blogs = await BLOG.find({});
    res.render("BLOG/blog.ejs", { blogs });
});

app.get("/blog/:id", async (req, res) => {
    const blog = await BLOG.findById(req.params.id);
    res.render("BLOG/DisplayBlog.ejs", { b: blog });
});

app.delete("/blog/:id", async (req, res) => {
    await BLOG.findByIdAndDelete(req.params.id);
    res.redirect("/blog");
});

app.get("/tech/new", (req, res) => {
    res.render("TECH/editTech.ejs");
});

app.post("/tech", UPLOAD.fields([{ name: 'Image' }, { name: 'Image1' }]), async (req, res) => {
    if (!req.files['Image'] || !req.files['Image1']) {
        return res.status(400).send("Please upload both images.");
    }

    const imageFile = req.files['Image'][0];
    const image1File = req.files['Image1'][0];
    let { Title, Content, Contents, Author, Content1, Content2 } = req.body;

    let techPost = new TECH({
        Title,
        Content,
        Contents,
        Author,
        Content1,
        Content2,
        Image: { url: imageFile.path, filename: imageFile.filename },
        Image1: { url: image1File.path, filename: image1File.filename }
    });

    try {
        await techPost.save();
        res.redirect("/tech");
    } catch (err) {
        console.error(err);
        res.status(500).send("An error occurred while saving the tech blog.");
    }
});

app.get("/tech", async (req, res) => {
    let techs = await TECH.find({});
    res.render("TECH/tech.ejs", { techs });
});

app.delete("/tech/:id", async (req, res) => {
    await TECH.findByIdAndDelete(req.params.id);
    res.redirect("/tech");
});

// The rest of the code for other blog categories (CRIC, GEN, NAT, MOTIVE) should follow similar patterns.

app.get("/Main", (req, res) => {
    res.render("BLOG/blogMain.ejs");
});

app.get("/library", (req, res) => {
    res.render("Library.ejs");
});

app.get("/About", (req, res) => {
    res.render("HOME/About.ejs");
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
