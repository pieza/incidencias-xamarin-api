  
const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const User = require("../models/user")
const passport = require("passport")

const CODE_LENGTH = 6

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })

    // user not exist
    if(!user)
      return res.status(401).json({message: 'Correo o contraseña incorrectos.' })

    // incorrect password
    if(!user.comparePassword(password))
      return res.status(401).json({message: 'Correo o contraseña incorrectos.' })

    if(!user.active)
      return res.status(401).json({message: 'El usuario se encuentra inactivo.' })

    jwt.sign(user.toObject(),
      process.env.SECRET_JWT_KEY.toString(), 
      { expiresIn: parseInt(process.env.TOKEN_EXPIRATION) }, 
      (err, token) => {
          if(err)
            next(err)
          res.set('Token', token)
          return res.json(user)
      }
    )
  } catch(err) {
    next(err)
  }
})

router.get('/current', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const user = await User.findById(req.user._id)
  return res.status(200).json(user)
})

// logout
router.get("/logout", passport.authenticate('jwt', {session: false}), (req, res) => {
  req.logout()
  return res.status(200).send(true)
})

router.get("/current", (req, res) => {
  return res.json(req.user)
})


router.post("/activation", async (req, res, next) => {
  try {
    const { activation_number, email } = req.body

    const user = await User.findOne({ email })
  
    if(!user) new Error('El usuario no existe')
  
    if(user.activation_number == activation_number) {
      await User.updateOne({ _id: user._id }, { ...req.user, active: true })
      return res.status(200).json(true)
    } else {
      throw new Error('El código no es válido')
    }
  } catch(err) {
    next(err)
  }
})


router.post("/register", async (req, res, next) => {
  try {
    const userToCreate = req.body

    // server Side Validation
    const user = await User.findOne({ email: userToCreate.email })

    if (user) {
      throw new Error('El email ya está registrado.')
    } else {
      // generate code
      userToCreate.activation_number = generateRandomNumber()

      let newUser = new User({ ...userToCreate })
      // encrypt Password
      newUser.password = newUser.encryptPassword(newUser.password)
      // save User in MongoDB
      await newUser.save()
      return res.status(200).json(newUser)
    }
    
  } catch (error) {
    next(error)
  }
})

router.get('/users', passport.authenticate('jwt', {session: false}), async (req, res) => {
  let filters = req.query ? req.query : {}

  let users = await User.find(filters)
  return res.status(200).json(users)
})

router.get('/users/:_id', async (req, res) => {
  const _id = req.params._id
  let user = await User.findById(_id)

  return res.status(200).json(user)
})

router.put('/users/:_id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const _id = req.params._id
  let user = req.body

  if(user.password) {
    bcrypt.genSalt(10, (err, salt) =>
      bcrypt.hash(user.password, salt, async (err, hash) => {
        if (err) throw err;
        // Set password to the hash
        user.password = hash

        let updatedUser = await User.updateOne({ _id }, user)
        return res.status(200).json(updatedUser);
      })
    );
  } else {
    delete user.password
    let updatedUser = await User.updateOne({ _id }, user)
    return res.status(200).json(updatedUser)
  }
})

router.delete('/users/:_id', passport.authenticate('jwt', {session: false}), async (req, res) => {
  const _id = req.params._id
  await User.deleteOne({ _id })

  return res.status(200).json(true)
})

function generateRandomNumber() {
  const characters = '0123456789'
  var result = ''
  var charactersLength = characters.length
  for ( var i = 0; i < CODE_LENGTH; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return parseInt(result)
}


module.exports = router