const LocalStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

const User = require("../models/user")

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      // match User
      User.findOne({ email: email })
        .then(user => {
          if (!user) {
            return done(null, false, {
              message: "El correo no esta registrado."
            });
          }
          // match Password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) throw err;
            if (isMatch) {
              if(!user.active) return done(null, false, { message: "El usuario no está activo." })
              return done(null, user);
            } else {
              return done(null, false, { message: "Contraseña incorrecta." })
            }
          })
        })
        .catch(err => console.log(err))
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })
}