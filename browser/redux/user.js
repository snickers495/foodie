import axios from 'axios'
import Promise from 'bluebird'
import config from '../config'


// /* -----------------    ACTION TYPES    ------------------ */

const RESET_PREF = "RESET_PREF"
const ADD_LIKE = "ADD_LIKE"
const ADD_DISLIKE = "ADD_DISLIKE"
const DELETE_DISLIKE = "DELETE_DISLIKE"
const DELETE_LIKE = "DELETE_LIKE"
const SET_FAVORITES = "SET_FAVORITES"
const SET_ORDERS = "SET_ORDERS"
const GET_LOCATION = 'GET_LOCATION'
const REORDER = 'REORDER'
// /* ------------     ACTION CREATORS      ------------------ */

export const addLike = like => ({
  type: ADD_LIKE,
  like
})
export const deleteLike = likeInd => ({
  type: DELETE_LIKE,
  likeInd
})
export const deleteDislike = dislikeInd => ({
  type: DELETE_DISLIKE,
  dislikeInd
})
export const addDislike = dislike => ({
  type: ADD_DISLIKE,
  dislike
})
export const resetPref = () => ({
  type: RESET_PREF
})
export const setFavoriteDishes = favorites => ({
  type: SET_FAVORITES,
  favorites
})
export const setOrders = orders => ({
  type: SET_ORDERS,
  orders
})



// /* ------------          REDUCER         ------------------ */

export default function reducer(userPref = {
  currentLocation: {
    lat: null,
    long: null
  },
  like: [],
  dislike: [],
  favoriteDishes: [],
  orders: {
    dishArray: [],
    dishIds: [],
    orders: []
  }
}, action) {
  switch (action.type) {
    case ADD_LIKE:
      return Object.assign({}, userPref, {
        like: [...userPref.like, {
          id: userPref.like.length + 1,
          text: action.like
        }]
      })
    case ADD_DISLIKE:
      return Object.assign({}, userPref, {
        dislike: [...userPref.dislike, {
          id: userPref.dislike.length + 1,
          text: action.dislike
        }]
      })
    case DELETE_LIKE:
      var newLike = [...userPref.like]
      newLike.splice(action.likeInd, 1)
      return Object.assign({}, userPref, {
        like: [...userPref.like].splice(action.likeInd, 1)
      })
    case DELETE_DISLIKE:
      var newDislike = [...userPref.dislike]
      newDislike.splice(action.dislikeInd, 1)
      return Object.assign({}, userPref, {
        dislike: [...userPref.dislike].splice(action.dislikeInd, 1)
      })
    case RESET_PREF:
      return Object.assign({}, userPref, {
        like: [],
        dislike: []
      })
    case SET_FAVORITES:
      return Object.assign({}, userPref, {
        favoriteDishes: [...action.favorites]
      })
    case SET_ORDERS:
      return Object.assign({}, userPref, {
        orders: action.orders
      })
    case GET_LOCATION:
      return Object.assign({}, userPref, {
        currentLocation: {
          lat: action.location.lat,
          long: action.location.long
        }
      })
    default:
      return userPref;
  }
}

// /* ------------       THUNK CREATORS     ------------------ */

export const orderAgain = terms => dispatch => {
  axios.post(`/api/users/${terms.order[0].user_id}/orders`, {
      terms
    })
    .then(res => console.log(res))
}
export const fetchFavoriteDishes = currentUser => dispatch => {
  axios.get(`/api/users/${currentUser.id}/favorites`)
    .then(favorites => [...favorites.data].map(ele => ele.dish_id))
    .then(dishIds => Promise.map(dishIds, (dishId) => {
      return axios.get(`/api/dishes/${dishId}`)
    })).then(result => result.map(ele => ele.data))
    .then(dishes => dispatch(setFavoriteDishes(dishes)))
}

export const fetchOrders = currentUser => dispatch => {
  let order = {}
  axios.get(`/api/users/${currentUser.id}/orders`)
    .then(orders => order.orders = orders.data)
    .then(orderInfo =>
      Promise.map(order.orders.map(ele => ele.dish_id), (dishId) => {
        return axios.get(`/api/dishes/${dishId}`)
      }))
    .then(result => {
      order.dishArray = result.map(dish => dish.data)
      return Promise.map(order.orders.map(ele => ele.restaurant_id), (restaurantId) => {
        return axios.get(`/api/restaurants/${restaurantId}`)
      })
    }).then(restaurantArr => {
      order.restaurantArray = restaurantArr.map(rest => rest.data).filter((thing, index, self) =>
        self.findIndex(t => t.id === thing.id && t.name === thing.name) === index)
      dispatch(setOrders(order))
    })
}

export const getLocation = () => dispatch => {
  const geolocation = navigator.geolocation;
  if (!geolocation) {
    console.log('Location not supported')
  } else {
    geolocation.getCurrentPosition((position) => {
      console.log(position)
      const location = {
        lat: position.coords.latitude,
        long: position.coords.longitude
      }
      dispatch({
        type: GET_LOCATION,
        location: location
      })
    }, (err) => console.log(err));
  }
}