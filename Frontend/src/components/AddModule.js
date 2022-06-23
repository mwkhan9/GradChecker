import React, { useEffect, useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import './login.css'
import {useForm} from 'react-hook-form'
import { BrowserRouter as Router, Route, Switch,useParams, useLocation } from "react-router-dom";


export default function AddModule() {

    const {register, reset,handleSubmit, formState:{errors}} = useForm();
    const [show,setShow] = useState(true)
    const [serverResponse,setServerResponse] =useState('')

    const location = useLocation()
    const year_id = location.state;
    console.log(year_id)

    const createModule = (data) =>{

        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
        console.log(token)

        const body = {
            name:data.name,
            creditsWorth:data.creditsWorth,
            assignments: data.assignments,
        }

        console.log(body)
        console.log(year_id)

        const requestOptions = {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(body)
        }
        
        const route = '/grades/modules/'+year_id

        fetch(route,requestOptions)
        .then(res=>res.json())
        .then(data=>{
            setServerResponse(data.message)
            console.log(serverResponse)
            setShow(true)
        })
        .catch(err => console.log(err))

        //reset()
    }
    
    return (
        <div className="fullPage">
            {(show && (serverResponse==="Module added successfuly"))?
                    <Alert variant="success" onClose={() => setShow(false)} style={{margin:"40px"}} dismissible>
                        <Alert.Heading>Success!</Alert.Heading>
                        <p>
                        {serverResponse}
                        </p>
                    </Alert>
    
                :(show && (serverResponse==="this module has already been added"))?
                <Alert variant="danger" onClose={() => setShow(false)} style={{margin:"40px"}} dismissible>
                    <Alert.Heading>Oh Snap!</Alert.Heading>
                    <p>
                    {serverResponse}
                    </p>
                </Alert>
                //FOR TIME OUT ERROR
                :(show && (serverResponse==="Internal Server Error"))?
                <Alert variant="danger" onClose={() => setShow(false)} style={{margin:"40px"}} dismissible>
                    <Alert.Heading>Oh Snap!</Alert.Heading>
                    <p>
                    You have timed out, please logout and sign in again!
                    </p>
                </Alert>
            :
            <></>
            }
            <div className="card border-dark" style={{width: '18rem', boxShadow: '10px 10px 0px 1px  rgba(0,0,0,0.2)'}}>
    
                <div className="card-body">
                    <form method="POST" action="/signup">
                        <h5 className="card-title"><u>Add a module</u></h5>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" {...register("name",{required: true})}/>
                            {errors.name && <p style={{color:'red'}}><small>Enter a valid module name</small></p>}
    
                            <Form.Label>Credits Worth</Form.Label>
                            <Form.Control type="number" {...register("creditsWorth",{required: true, minLength:1, maxLength:2})}/>
                            {errors.creditsWorth && <p style={{color:'red'}}><small>Enter a valid surname</small></p>}
                            {errors.creditsWorth?.type==="minLength" && <p style={{color:'red'}}><small> Too short</small></p>}
    
                            <Form.Label>Number Of Assignments</Form.Label>
                            <Form.Control type="number" {...register("assignments",{required: true, minLength:1})}/>
                            {errors.assignments && <p style={{color:'red'}}><small>Enter a valid subject</small></p>}
    
                            <Button as="sub" variant="primary" onClick={handleSubmit(createModule)} style={{marginTop: '15px', float: 'right'}}>Add Module</Button>
                        </Form.Group>
                    </form>
                </div>
            </div>
        </div>
      )
}