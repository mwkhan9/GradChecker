import React, { useEffect, useState } from 'react'
import { Button, Form,Modal, Alert } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.css';
import './account.css'
import {useForm} from 'react-hook-form'

import {logout} from '../auth'
import {useHistory} from 'react-router-dom'

export default function Account() {

  const [user,setUser] = useState({})
  //get current user info
  useEffect(
    ()=>{
        let userName= localStorage.getItem("currentUserUsername")
        console.log(userName)
        fetch('/user/getUser/'+userName)  
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setUser((data))
        })
        .catch(err=>console.log(err))
      },[]
  )
    


  const {register, reset,handleSubmit, formState:{errors}} = useForm({});

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  //Deleting account
  const deleteAccount=()=>{
      const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

      const requestOptions={
          method:"DELETE",
          headers:{
              'content-type':'application/json',
              'Authorization': `Bearer ${JSON.parse(token)}`
          }
      }
      
      fetch('/user/user/'+localStorage.getItem("currentUserId"),requestOptions)
      .then(res=>res.json())
      .then(data=>{
          console.log(data)
      })
  }

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

  const history = useHistory()
  
  const proceed=()=>{
    handleClose()
    deleteAccount()
    logout()
    removeCurrent()
    history.push('/home') //Move to next page!
  }
  
  //Updating account
  const [showAlert, setShowAlert] = useState(true);
  const [serverResponse,setServerResponse] =useState('')

  const checkPassword=(current_password)=>{
    return new Promise((resolve) => {
      const body = {
        current_username:localStorage.getItem("currentUserUsername"),
        current_password:current_password
      }
      const requestOptions = {
        method: "PUT",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(body)
      }
      fetch('/auth/checkPassword',requestOptions)
          .then(res=>res.json())
          .then(data=>{
              console.log(data.message)
              if (data.message==1)
                resolve(1);
              else
                resolve(0);
          })
          .catch(err => console.log(err)) 
    })
  }

  const updateUser=async(data)=>{

    //check password first
    const result = await checkPassword(data.current_password)
    console.log(result);

    if (result){
        let newInfo=data
        console.log(data)
        let current_user_id = localStorage.getItem("currentUserId")
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

        const requestOptions={
            method:"PUT",
            headers:{
                'content-type':'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body:JSON.stringify(data)
        }

        const update=()=>{
          localStorage.setItem("currentUserForename",newInfo.forename)
          localStorage.setItem("currentUserNumberOfYears",newInfo.numberOfYears)
          localStorage.setItem("currentUserSurname",newInfo.surname)
          localStorage.setItem("currentUserUsername",newInfo.username)
        }
        
        fetch('/user/user/'+current_user_id,requestOptions)
        .then(res=>res.json())
        .then(data=>{
          setShowAlert(true)
          setServerResponse(data.message)
          if (data.message=="User updated succesfully")
            update()
        })
    }
    else{
      alert("You current password is incorrect")
    }
  }

  return (
    <div>
        {(showAlert && (serverResponse==="User updated succesfully"))?
            <Alert variant="success" onClose={() => setShow(false)} style={{margin:"40px"}} dismissible>
                <Alert.Heading>Success!</Alert.Heading>
                <p>
                {serverResponse}
                </p>
            </Alert>

            :(showAlert && ((serverResponse==="email already used")|(serverResponse==="username already exists")))?
            <Alert variant="danger" onClose={() => setShow(false)} style={{margin:"40px"}} dismissible>
                <Alert.Heading>Oh Snap!</Alert.Heading>
                <p>
                {serverResponse}
                </p>
            </Alert>

            //FOR TIME OUT ERROR
            :(showAlert && (serverResponse==="Internal Server Error"))?
            <Alert variant="danger" onClose={() => setShow(false)} style={{margin:"40px"}} dismissible>
                <Alert.Heading>Oh Snap!</Alert.Heading>
                <p>
                You have timed out, please logout and sign in again!
                </p>
            </Alert>

        :
        <></>
        }


      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
        <Modal.Title>Are you sure you want to delete your account?</Modal.Title>
        </Modal.Header>
        <Modal.Body>There is no going back!</Modal.Body>
        <Modal.Footer>
        <Button variant="danger" onClick={proceed}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <div className="fullPage">
        <div className="box">
          <br></br>
          <h1><u>Edit Account Info</u></h1>

          <Form.Group>
            <Form.Label>Forename</Form.Label>
            <Form.Control type="text" placeholder={user.forename} {...register("forename",{required: true, minLength:3})}/>
            {errors.forename && <p style={{color:'red'}}><small>Enter a valid forename</small></p>}
            {errors.forename?.type==="minLength" && <p style={{color:'red'}}><small>Forename is too short</small></p>}

            <Form.Label>Surname</Form.Label>
            <Form.Control type="text" placeholder={user.surname} {...register("surname",{required: true, minLength:3})}/>
            {errors.surname && <p style={{color:'red'}}><small>Enter a valid surname</small></p>}
            {errors.surname?.type==="minLength" && <p style={{color:'red'}}><small>surname is too short</small></p>}

            <Form.Label>Subject</Form.Label>
            <Form.Control type="text" placeholder={user.subject} {...register("subject",{required: true, minLength:2})}/>
            {errors.subject && <p style={{color:'red'}}><small>Enter a valid subject</small></p>}
            {errors.subject?.type==="minLength" && <p style={{color:'red'}}><small>subject is too short</small></p>}

            <Form.Label>Years of Study</Form.Label>
            <Form.Control type="number" placeholder={user.numberOfYears} {...register("numberOfYears",{required: true, minLength:1, maxLength:1})}/>
            {errors.numberOfYears && <p style={{color:'red'}}><small>Enter a valid number of years</small></p>}

            <Form.Label>Email</Form.Label>
            <Form.Control type="email" placeholder={user.email} {...register("email",{required: true, minLength:5})}/>
            {errors.email && <p style={{color:'red'}}><small>Enter a valid email</small></p>}
            {errors.email?.type==="minLength" && <p style={{color:'red'}}><small>email is too short</small></p>}
            
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder={user.username} {...register("username",{required: true, minLength:5})}/>
            {errors.username && <p style={{color:'red'}}><small>Enter a valid username</small></p>}
            {errors.username?.type==="minLength" && <p style={{color:'red'}}><small>username is too short</small></p>}
            
            <Form.Label>Current Password</Form.Label>
            <Form.Control type="password" {...register("current_password",{required: true, minLength:6})}/>
            {errors.current_password && <p style={{color:'red'}}><small>Enter a valid password</small></p>}
            {errors.current_password?.type==="minLength" && <p style={{color:'red'}}><small>password is too short</small></p>}

            <Form.Label>New Password</Form.Label>
            <Form.Control type="password" {...register("password",{required: true, minLength:1})}/>
            {errors.password && <p style={{color:'red'}}><small>Enter a valid password</small></p>}
            {errors.password?.type==="minLength" && <p style={{color:'red'}}><small>password is too short</small></p>}

            <Button as="sub" variant="primary" onClick={handleSubmit(updateUser)} style={{marginTop: '15px', float: 'right'}}>Update</Button>
          </Form.Group>

        </div>
        <Button as="sub" variant="danger" onClick={handleShow} style={{marginTop: '15px', float: 'right', right:'0px'}}>Delete Account</Button>
      </div>
    </div>
  )
}

