const express = require('express')
const router = express.Router()
const passport = require('passport')
const Incidence = require('../models/incidence')

router.get('/incidences', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    let filters = req.query ? req.query : {}

    let incidences = await Incidence.find(filters).populate('user')
    return res.status(200).json(incidences)
  } catch(err) {
    next(err)
  }
})

router.get('/incidences/:_id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const _id = req.params._id
    let incidence = await Incidence.findById(_id).populate('user')

    return res.status(200).json(incidence)
  } catch(err) {
    next(err)
  }
})

router.post('/incidences', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    let incidence = req.body
    incidence.user = req.user._id
    let createdIncidence = await Incidence.create(incidence)
    
    return res.status(200).json(createdIncidence)
  } catch(err) {
    next(err)
  }
})

router.put('/incidences/:_id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const _id = req.params._id
    let incidence = req.body
    let updatedIncidence = await Incidence.updateOne({ _id }, incidence).populate('user')
    
    return res.status(200).json(updatedIncidence)
  } catch(err) {
    next(err)
  }
})

router.delete('/incidences/:_id', passport.authenticate('jwt', {session: false}), async (req, res, next) => {
  try {
    const _id = req.params._id
    await Incidence.deleteOne({ _id })

    return res.status(200).json(true)
  } catch(err) {
    next(err)
  }
})

module.exports = router