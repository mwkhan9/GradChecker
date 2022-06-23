import React, { useEffect, useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'
import './login.css'
import {useForm} from 'react-hook-form'
import { BrowserRouter as Router, Route, Switch,useParams, useLocation } from "react-router-dom";


export default function UpdateAssignment() {


    const [show,setShow] = useState(false)
    const [serverResponse,setServerResponse] =useState('')
    
    const location = useLocation()
    const module_id = location.state;
    console.log(module_id)
    
    let name = localStorage.getItem("moduleName")

    //For updating an assignment
    const {register, handleSubmit, formState:{errors}} = useForm({});

    const update =(data)=>{
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')
        let newName = data.newName
        const body = {
            currentName:name,
            name:data.newName,
            weight:data.newWeight,
            completed: data.completed,
            percentage: data.newPercentage
        }
        const requestOptions={
            method:"PUT",
            headers:{
                'content-type':'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body:JSON.stringify(body)
        }

        fetch('/grades/updateAssgn/'+module_id,requestOptions)
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setServerResponse(data.message)
            setShow(true)
            if (data.message=="this assignment has been updated")
                localStorage.setItem("moduleName",newName)
        })
        .catch(err => console.log(err)) 
    }
    
    return (
        <div className="fullPage">
            {(show && (serverResponse==="this assignment has been updated"))?
                    <Alert variant="success" onClose={() => setShow(false)} style={{margin:"40px"}} dismissible>
                        <Alert.Heading>Success!</Alert.Heading>
                        <p>
                        {serverResponse}
                        </p>
                    </Alert>
    
                :(show && ((serverResponse==="this assignment doesn't seem to exist")|(serverResponse==="this assignment name has already been added")))?
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
                        <h5 className="card-title">Update an Assignment</h5>
                        <Form.Group>
                            <Form.Label>Name</Form.Label>
                            <Form.Control placeholder={name} type="text" {...register("newName",{required: true, minLength:3})}/>
                            {errors.newName && <p style={{color:'red'}}><small>Enter a valid name</small></p>}
                            {errors.newName?.type==="minLength" && <p style={{color:'red'}}><small>Module name is too short</small></p>}

                            <Form.Label>Assignment Weight (%)</Form.Label>
                            <Form.Control type="number" {...register("newWeight",{required: true, minLength:1,maxLength:3})}/>
                            {errors.newWeight && <p style={{color:'red'}}><small>Enter a valid percentage</small></p>}

                            <Form.Check type="checkbox" label="Completed (Tick if True)" {...register("completed")}/>

                            <Form.Label>Percentage Achieved (%)</Form.Label>
                            <Form.Control type="number" {...register("newPercentage",{required: true, minLength:1,maxLength:3})}/>
                            {errors.newPercentage && <p style={{color:'red'}}><small>Enter a valid percentage</small></p>}
                            
                            <Button as="sub" variant="primary" onClick={handleSubmit(update)} style={{marginTop: '15px', float: 'right'}}>Update Assignment</Button>
                        </Form.Group>

                    </form>
                </div>
            </div>
        </div>
      )
}