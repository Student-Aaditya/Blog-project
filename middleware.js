module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        // req.flash("error","ligin please");
        return res.redirect("/login");
    }
    next();
}
