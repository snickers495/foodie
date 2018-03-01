import React from 'react';
import { connect } from 'react-redux';
import {addDishToCart, addRestaurantToCart, favoriteDish, fetchFavorites} from '../../redux'

class MenuDiv extends React.Component {
  render() {
  const {dish, handleClick, restaurant, currentUser, handleFavorite, favoriteDishes} = this.props
    return(
      <li>
        <div className="dish-div shadow" style={{cursor: "pointer"}} onClick={()=>handleClick(dish, restaurant)}>
          <h6>{dish.name}</h6> 
          <em>{dish.category}</em>
          ${dish.price} 
          {favoriteDishes.find(item => item.dish_id === dish.id) ? "Favorited" : 
         <button onClick={()=>handleFavorite(dish, restaurant, currentUser)}>Favorite</button>}
        </div>
      </li>
    )
  }
}

const mapStateToProps = (state, ownProps) => ({
  currentUser: state.currentUser,
  favoriteDishes: state.restaurants.favorites.filter(ele => ele.restaurant_id === ownProps.restaurant.id)
})
const mapDispatchToProps = (dispatch)=> ({
  handleClick: (dish, restaurant) => {
    dispatch(addDishToCart(dish))
    dispatch(addRestaurantToCart(restaurant))},
  handleFavorite: (dish, restaurant, currentUser) => dispatch(favoriteDish({dish, restaurant, currentUser})),
  fetchFavorites: (user_id) => dispatch(fetchFavorites(user_id))
})
export default connect(mapStateToProps, mapDispatchToProps)(MenuDiv);
