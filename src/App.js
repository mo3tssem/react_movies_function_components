import React, { useEffect, useState } from "react"
import { Route, Redirect, Switch } from "react-router-dom"
import { ToastContainer } from "react-toastify"

import Movies from "./components/movies"
import Customers from "./components/customers"
import Rentals from "./components/rentals"
import NotFound from "./components/notFound"
import NavBar from "./components/navBar"
import MovieForm from "./components/movieForm"
import LoginForm from "./components/loginForm"
import Register from "./components/register"
import Logout from "./components/logout"
import auth from "./services/authService"
import ProdectedRoute from "./components/common/prodectedRoute"

import "react-toastify/dist/ReactToastify.css"
import "./App.css"
function App() {
  const [user, setUser] = useState({})

  useEffect(() => {
    const user = auth.getCurrentUser()
    setUser(user)
  }, [])

  return (
    <div>
      <ToastContainer />
      <NavBar user={user} />
      <main className="container">
        <Switch>
          <Route path="/login" component={LoginForm} />{" "}
          <Route path="/logout" component={Logout} />
          <Route path="/register" component={Register} />
          <ProdectedRoute path="/movies/:id" component={MovieForm} />
          <Route
            path="/movies"
            render={(props) => <Movies {...props} user={user} />}
          />
          <Route path="/customers" component={Customers}></Route>
          <Route path="/rentals" component={Rentals}></Route>
          <Route path="/notFound" component={NotFound}></Route>
          <Redirect from="/" exact to="/movies" />
          <Redirect to="/notFound" />
        </Switch>
      </main>
    </div>
  )
}

export default App
