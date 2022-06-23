import React from "react";
import { useAuth ,logout} from '../auth'

//Remove user data from local storage
function removeCurrent(){
  localStorage.removeItem("currentUserForename")
  localStorage.removeItem("currentUserSurname")
  localStorage.removeItem("currentUserUsername")
  localStorage.removeItem("currentUserId")
  localStorage.removeItem("currentUserNumberOfYears")
  localStorage.removeItem("yearIds")
  localStorage.removeItem("Predicted")
  localStorage.removeItem("moduleName")
}

const LoggedOutLinks = () => {
  return (
    <>
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">     <a className="nav-link" href="/login" aria-current="page">Login</a>     </li>
        <li className="nav-item">     <a className="nav-link" href="/signup">Sign Up</a>    </li>
      </ul>
    </>
  )
}

const LoggedInLinks = () => {
  return (
    <>
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">     <a className="nav-link" href="/login" aria-current="page" onClick={()=>{logout();removeCurrent()}}>Log Out</a>     </li>
      </ul>
    </>
  )
}

const AccountLink = () =>{
  return(
    <>
      <li className="nav-item">     <a className="nav-link" href="/account">Account</a>    </li>
      <li className="nav-item">     <a className="nav-link" href="/grades">Grades</a>    </li>
    </>
  )
}

function Navbar() {
  
  const [logged] = useAuth();

  return (
    <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <a className="navbar-brand" >GradChecker</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon" />
            </button>
            <div className="collapse navbar-collapse" id="navbarText">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">     <a className="nav-link" aria-current="page" href="/home">Home</a>     </li>
                {logged?<AccountLink/>:<></>}
              </ul>
              <div className="d-flex">
                {logged?<LoggedInLinks/>:<LoggedOutLinks/>}
              </div>
            </div>
          </div>
        </nav>
    </div>
  );
}

export default Navbar;
