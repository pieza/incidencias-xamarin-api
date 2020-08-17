module.exports = {
  ensureAuthenticated: (req,res,next) => {
      if(req.isAuthenticated()){
          if(!req.user.active) return res.send("El usuario no ha sido activado.")
          return next()
      }
      res.send("Acceso denegado!")
  }
}