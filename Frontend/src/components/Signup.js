import React, { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import './login.css'
import {useForm} from 'react-hook-form'

export default function Signup() {
    const {register, reset,handleSubmit, formState:{errors}} = useForm();
    const [show,setShow] = useState(false)
    const [serverResponse,setServerResponse] =useState('')

    const submitForm = (data) =>{

        const body = {
            forename:data.forename,
            surname:data.surname,
            username: data.username,
            email: data.email,
            password: data.password,
            subject: data.subject,
            numberOfYears: data.numberOfYears
        }

        let currentUserUsername = data.username

        let currentUserYears= data.numberOfYears
        console.log("here",currentUserUsername)
        console.log("here",currentUserYears)

        const requestOptions = {
            method: "POST",
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(body)
        }

        fetch('/auth/SignUp',requestOptions)
        .then(res=>res.json())
        .then(data=>{
            setServerResponse(data.message)
            console.log((serverResponse))
            setShow(true)
        })
        .catch(err => console.log(err))

        reset()

    }

 return (
    <div className="fullPage">
        {(show && (serverResponse==="User created successfuly"))?
            <Alert variant="success" onClose={() => setShow(false)} style={{margin:"40px"}} dismissible>
                <Alert.Heading>Success!</Alert.Heading>
                <p>
                {serverResponse}
                </p>
            </Alert>


            :(show && ((serverResponse==="email already used")|(serverResponse==="username already exists")))?
                <Alert variant="danger" onClose={() => setShow(false)} style={{margin:"40px"}} dismissible>
                    <Alert.Heading>Oh Snap!</Alert.Heading>
                    <p>
                    {serverResponse}
                    </p>
                </Alert>
        :
        <></>
        }
        <div className="card border-dark" style={{width: '18rem', boxShadow: '10px 10px 0px 1px  rgba(0,0,0,0.2)'}}>

            <div className="card-body">
                <form method="POST" action="/signup">
                    <h5 className="card-title">Sign Up</h5>
                    <Form.Group>
                        <Form.Label>Forename</Form.Label>
                        <Form.Control type="text" {...register("forename",{required: true, minLength:3})}/>
                        {errors.forename && <p style={{color:'red'}}><small>Enter a valid forename</small></p>}
                        {errors.forename?.type==="minLength" && <p style={{color:'red'}}><small>Forename is too short</small></p>}

                        <Form.Label>Surname</Form.Label>
                        <Form.Control type="text" {...register("surname",{required: true, minLength:3})}/>
                        {errors.surname && <p style={{color:'red'}}><small>Enter a valid surname</small></p>}
                        {errors.surname?.type==="minLength" && <p style={{color:'red'}}><small>surname is too short</small></p>}

                        <Form.Label>Subject</Form.Label>
                        <Form.Control type="text" {...register("subject",{required: true, minLength:3})}/>
                        {errors.subject && <p style={{color:'red'}}><small>Enter a valid subject</small></p>}
                        {errors.subject?.type==="minLength" && <p style={{color:'red'}}><small>subject is too short</small></p>}

                        <Form.Label>Years of Study</Form.Label>
                        <Form.Control type="number" {...register("numberOfYears",{required: true, minLength:1, maxLength:1})}/>
                        {errors.numberOfYears && <p style={{color:'red'}}><small>Enter a valid number of years</small></p>}

                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" {...register("username",{required: true, minLength:5})}/>
                        {errors.username && <p style={{color:'red'}}><small>Enter a valid username</small></p>}
                        {errors.username?.type==="minLength" && <p style={{color:'red'}}><small>username is too short</small></p>}

                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" {...register("email",{required: true, minLength:6})}/>
                        {errors.email && <p style={{color:'red'}}><small>Enter a valid email</small></p>}
                        {errors.email?.type==="minLength" && <p style={{color:'red'}}><small>email is too short</small></p>}

                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" {...register("password",{required: true, minLength:6})}/>
                        {errors.password && <p style={{color:'red'}}><small>Enter a valid password</small></p>}
                        {errors.password?.type==="minLength" && <p style={{color:'red'}}><small>password is too short</small></p>}

                        <Button as="sub" variant="primary" onClick={handleSubmit(submitForm)} style={{marginTop: '15px', float: 'right'}}>Sign Up</Button>
                    </Form.Group>
                </form>
            </div>
        </div>
    </div>
  )
}
