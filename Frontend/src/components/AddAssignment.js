import React, { useEffect, useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import './login.css'
import {useForm} from 'react-hook-form'
import { BrowserRouter as Router, Route, Switch,useParams, useLocation } from "react-router-dom";


export default function AddAssignment() {

    const {register, reset,handleSubmit, formState:{errors}} = useForm();
    const [show,setShow] = useState(true)
    const [serverResponse,setServerResponse] =useState('')

    const location = useLocation()
    const module_id = location.state;
    console.log(module_id)

    const createAssignment = (data) =>{

        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
        console.log(token)

        const body = {
            name:data.name,
            weight:data.weight,
            completed: data.completed,
            percentage: data.percentage
        }

        console.log(body)

        const requestOptions = {
            method: "PUT",
            headers: {
                'content-type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(body)
        }
        
        const route = '/grades/assignments/'+module_id

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
            {(show && (serverResponse==="Assignment added successfuly"))?
                    <Alert variant="success" onClose={() => setShow(false)} style={{margin:"40px"}} dismissible>
                        <Alert.Heading>Success!</Alert.Heading>
                        <p>
                        {serverResponse}
                        </p>
                    </Alert>
    
                :(show && (serverResponse==="this assignment has already been added"))?
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
                    You have time out, please logout and sign in again!
                    </p>
                </Alert>
            :
            <></>
            }
            <div className="card border-dark" style={{width: '18rem', boxShadow: '10px 10px 0px 1px  rgba(0,0,0,0.2)'}}>
    
                <div className="card-body">
                    <form method="POST" action="/signup">
                        <h5 className="card-title">Add an Assignment</h5>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control type="text" {...register("name",{required: true})}/>
                            {errors.name && <p style={{color:'red'}}><small>Enter a valid assignment name</small></p>}
    
                            <Form.Label>Weight (%)</Form.Label>
                            <Form.Control type="number" {...register("weight",{required: true, minLength:1, maxLength:3})}/>
                            {errors.creditsWorth && <p style={{color:'red'}}><small>Enter a valid Weight</small></p>}
                            {errors.weight?.type==="minLength" && <p style={{color:'red'}}><small> Too short</small></p>}
                            {errors.weight?.type==="maxLength" && <p style={{color:'red'}}><small> Too Long</small></p>}
    
                            <Form.Check type="checkbox" label="Completed (Tick if True)" {...register("completed")}/>

                            <Form.Label>Percentage Achieved</Form.Label>
                            <Form.Control type="number" placeholder='If Incomplete, just put 0!' {...register("percentage",{required: true, minLength:1,maxLength:3})}/>
                            {errors.percentage && <p style={{color:'red'}}><small>Enter a valid Percentage</small></p>}
    
                            <Button as="sub" variant="primary" onClick={handleSubmit(createAssignment)} style={{marginTop: '15px', float: 'right'}}>Add Assignment</Button>
                        </Form.Group>
                    </form>
                </div>
            </div>
        </div>
      )
}