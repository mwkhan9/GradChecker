import React, { useEffect,useState } from 'react'
import {Form,Button,Alert} from 'react-bootstrap'
import { Link } from 'react-router-dom'
import {set, useForm} from 'react-hook-form'
import { login } from '../auth'
import {useHistory} from 'react-router-dom'

import './login.css'

var current_username 

export default function LoginPage() {
    const {register,handleSubmit,reset,formState:{errors}}=useForm()

    const [show,setShow] = useState(false)
    
    const history = useHistory()

    const Proceed=(data)=>{
        console.log(data.access_token);
        login(data.access_token);

        //
        fetch('/user/getUser/'+current_username)  //Get user id of current_username & store data in local storage
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            localStorage.setItem("currentUserId",JSON.stringify(data.id))
            localStorage.setItem("currentUserForename",data.forename)
            localStorage.setItem("currentUserSurname",data.surname)
            localStorage.setItem("currentUserUsername",data.username)
            localStorage.setItem("currentUserNumberOfYears",data.numberOfYears)

            ///!!! ADD THE YEAR_IDS OF CURRENT USER
            fetch('/grades/getYearIds/'+data.id)    
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                localStorage.setItem("yearIds",JSON.stringify(data))
                history.push('/grades') //Move to next page!
            })
            .catch(err=>console.log(err))
            ///!!!

        })
        .catch(err=>console.log(err))
    }

    const loginUser=(data)=>{
        console.log(data)
        current_username = data.username

        const requestOptions={
            method:"POST",
            headers:{
                'content-type':'application/json'
            },
            body:JSON.stringify(data)
        }
        
        fetch('/auth/login',requestOptions)
        .then(res=>res.json())
        .then(data=>{
            if(data.message == "Invalid username or password")
                setShow(true)
            else Proceed(data)
        })

        reset()
    }

  return (
        <div className="fullPage">

            {(show)?
                <Alert variant="danger" onClose={() => setShow(false)} style={{margin:"40px"}} dismissible>
                    <Alert.Heading>Oh Snap!</Alert.Heading>
                    <p>Incorrect credentials</p>
                </Alert>
                :
                 <></>
            }

            <div className="card border-dark" style={{width: '18rem', boxShadow: '10px 10px 0px 1px  rgba(0,0,0,0.2)'}}>
                <div className="card-body">
                    <form method="POST" action="/login">
                        <h5 className="card-title">Login</h5>
                        <Form.Group>
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" {...register('username',{required:true,minLength:1})}/>
                            {errors.username && <p style={{color:'red'}}><small>Enter a valid username</small></p>}

                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" {...register('password',{required:true,minLength:1})}/>
                            {errors.password && <p style={{color:'red'}}><small>Enter a valid password</small></p>}

                        </Form.Group>
                        <Button as="sub" variant="primary" onClick={handleSubmit(loginUser)} style={{marginTop: '15px', float: 'right'}}>Log In</Button>
                    </form>
                </div>
            </div>
        </div>

  )
}
