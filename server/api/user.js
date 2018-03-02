
const router = require('express').Router();
const HttpError = require('../utils/HttpError');
const { Order, User } = require('../db/models');
const Promise = require('bluebird')


router.get('/:id/orders', (req, res, next)=> {
  const id = req.params.id
  Order.findAll({ where: {user_id: id}})
  .then(result => res.status(201).json(result))
})

router.post('/:id/orders', async(req, res, next) => {
  const {cart, currentUser, cartRestaurant} = req.body.terms
  Promise.each(cart, (dish)=> {
    Order.create({user_id: currentUser.id, dish_id: dish.id, restaurant_id: cartRestaurant.id,
      status: "ordered" })
  })
  .then(result => res.status(201).json(result))
});

router.get('/:id/favorites', (req, res, next)=> {
  const id = req.params.id
  Order.findAll({ where: {user_id: id, status: "favorite"}})
  .then(result => res.status(201).json(result))
})

router.post('/:id/favorites', (req, res, next) => {
  const {dish, currentUser, restaurant} = req.body.terms
  Order.create({user_id: currentUser.id, dish_id: dish.id, restaurant_id: restaurant.id,
    status: "favorite" })
  .then(result => res.status(201).json(result))
});



module.exports = router;
