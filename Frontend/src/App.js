import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login"
import Grades from "./components/Grades"
import Signup from "./components/Signup";
import Account from "./components/Account";
import Footer from "./components/Footer";
import AddModule from "./components/AddModule";
import Assignments from "./components/Assignments";
import AddAssignment from "./components/AddAssignment";
import UpdateAssignment from "./components/UpdateAssignment";
import HttpsRedirect from "react-https-redirect";

import 'bootstrap/dist/css/bootstrap.min.css'
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.min.js'

import{useParams} from "react-router-dom";

function App() {

  return (
    <HttpsRedirect>
      <Router>
        <Switch>
          
          <Route exact path={["/home", "/"]}>
            <Navbar/>
            <Home />
            <Footer/>
          </Route>

          <Route exact path={["/account", "/"]}>
            <Navbar/>
            <Account/>
            <Footer/>
          </Route>

          <Route exact path={["/login", "/"]}>
            <Navbar/>
            <Login />
            <Footer/>
          </Route>

          <Route exact path={["/grades", "/"]}>
            <Navbar/>
            <Grades />
            <Footer/>
          </Route>

          <Route exact path={["/signup", "/"]}>
            <Navbar/>
            <Signup />
            <Footer/>
          </Route>

          <Route exact path={["/addModules/", "/"]}>
            <Navbar/>
            <AddModule />
            <Footer/>
          </Route>

          <Route exact path={["/assignments/", "/"]}>
            <Navbar/>
            <Assignments />
            <Footer/>
          </Route>

          <Route exact path={["/AddAssignment/", "/"]}>
            <Navbar/>
            <AddAssignment />
            <Footer/>
          </Route>

          <Route exact path={["/UpdateAssignment/", "/"]}>
            <Navbar/>
            <UpdateAssignment />
            <Footer/>
          </Route>
          

        </Switch>
      </Router>
    </HttpsRedirect>
  );
}

export default App;
