import React, { Component } from 'react'
import './App.css'
import './styles/User.css'
import './styles/Recipes.css'
import './styles/Sidebar.css'
import { connect } from 'react-redux'

import { Route } from 'react-router-dom'
import { withRouter } from 'react-router'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { red500 } from 'material-ui/styles/colors';

import Navbar from './components/Navbar'
import RecipesList from './containers/RecipesList'
import FullRecipe from './containers/FullRecipe'
import Favorites from './containers/Favorites'
import Login from './components/Login'
import Register from './components/Register'

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: red500,
  },
  datePicker: {
    color: "#e53935",
    selectColor: "#ffeb3b",
    headerColor: "#ffeb3b",
    calendarTextColor: "rgba(0, 0, 0, 0.77)",
    textColor: "#ffffff",
    selectTextColor: "#f44336",
    calendarYearBackgroundColor: "#ffffff"
  },
  checkbox: {
    checkedColor: "#ff1744"
  }
})

class App extends Component {

  componentDidMount() {
    const { loggedIn } = this.props
    loggedIn ? this.renderApp() : this.renderLoginRegister()
  }

  shouldComponentUpdate(nextProps) {
    if (
      // componentDidMount will initially change location
      this.props.location.pathname !== nextProps.location.pathname
      // register/login toggle will change userView
      || this.props.userView !== nextProps.userView
      // loggedIn status will render login/register or app
      || this.props.loggedIn !== nextProps.loggedIn
      // view will toggle between browse/search and favorites
      || this.props.view !== nextProps.view
      // recipe will determine if fullRecipe is displayed
      || this.props.recipe !== nextProps.recipe
      // user_id
      || this.props.user_id !== nextProps.user_id
    ) {
      return true
    } else {
      return false
    }
  }

  componentDidUpdate(prevProps) {
    const { loggedIn } = this.props
    loggedIn ? this.renderApp() : this.renderLoginRegister()
  }

  renderLoginRegister = () => {
    const { userView, history } = this.props
    userView === "register" ? history.replace("/register") : history.replace("/login")
  }

  // renderApp = () => {
  //   const { view, recipe } = this.props
  //   return (
  //     <div className="App app-container">
  //       <div className="Ingredients-container">
  //         <IngredientsForm />
  //         <IngredientsList />
  //       </div>
  //       <div className="Recipes-container">
  //         {view === "favorites" ? <Favorites /> : recipe ? <FullRecipe recipe={recipe}/> : <RecipesList/>}
  //       </div>
  //     </div>
  //   )
  // }

  renderApp = () => {
    const { view, recipe, history } = this.props
    if (view === "favorites") {
      history.replace("/favorites")
    } else if (recipe) {
      history.replace(`/recipe/${recipe.id}`)
    } else {
      history.replace("/recipes")
    }
  }

  // render() {
  //   const { loggedIn } = this.props
  //   return (
  //     <MuiThemeProvider>
  //       <div className="main-container-column">
  //         <Navbar />
  //         {loggedIn ? this.renderApp() : this.renderLoginRegister()}
  //       </div>
  //     </MuiThemeProvider>
  //   )
  // }

  renderAttribution = () => {
    return (
      <div className="Attribution-container">
        <div className="Attribution-1"></div>
        <div className="Attribution-2">Fridge Boss 2018 by Jason Lim  -  Recipe search powered by <a href='http://www.yummly.co/recipes' className="Yummly"><img alt='Yummly' src='https://static.yummly.co/api-logo.png'/></a></div>
      </div>
    )
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="main-container-column">
          <Navbar />
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
          <Route path="/recipes" component={RecipesList}/>
          <Route path="/favorites" component={Favorites}/>
          <Route path="/recipe" component={FullRecipe}/>
          {this.props.loggedIn ? this.renderAttribution() : null}
        </div>
      </MuiThemeProvider>
    )
  }
}

const mapStateToProps = state => {
  return {
    view: state.recipes.view,
    recipe: state.recipes.recipe,
    userView: state.user.view,
    loggedIn: state.user.loggedIn,
    user_id: state.user.user_id,
    page: state.recipes.page
  }
}

export default withRouter(connect(mapStateToProps)(App))
