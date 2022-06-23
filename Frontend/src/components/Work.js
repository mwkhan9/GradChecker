import React,{useState} from 'react'
import { Button, CloseButton,Card ,Modal,Form} from 'react-bootstrap';
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import './work.css'


import {useForm} from 'react-hook-form'

const Work=({module_id,name,weight,completed,percentage})=>{
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [alert,setAlert]= useState(false);
    const handleCloseAlert = () => setAlert(false);
    const handleShowAlert = () => setAlert(true);

    const deleteAssignment=()=>{
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

        const body = {
            name:name,
            weight:weight,
            completed:completed,
            percentage:percentage
        }

        const requestOptions={
            method:"DELETE",
            headers:{
                'content-type':'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(body)
        }
        
        console.log(module_id)
        fetch('/grades/assignments/'+module_id,requestOptions)
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            if (data.message=="Internal Server Error")
                handleShowAlert()
            else window.location.reload()
        })
    }
    const proceed=()=>{
        handleClose()
        deleteAssignment()
        //window.location.reload()
    }
    
    function showNumber(){
        completed="True"
        percentage=percentage+"%"
    }
    function showText(){
            completed="False"
            percentage="TBC"
        }
    

    if(completed)
        showNumber()
    else
        showText()

    const save=()=>{
        localStorage.setItem("moduleName",name)
    }

    return(
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to delete this Assignment?</Modal.Title>
                </Modal.Header>
                <Modal.Body>There is no going back!</Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={proceed}>Delete</Button>
                </Modal.Footer>
            </Modal>

            <Modal show={alert} onHide={handleCloseAlert}>
                <Modal.Header closeButton>
                <Modal.Title>ERROR</Modal.Title>
                </Modal.Header>
                <Modal.Body>Timed Out! Please logout and login again</Modal.Body>
            </Modal>
            
            <div className="card spacing">
                <div className="card-body center">
                    <Button className='btn delete' onClick={handleShow} variant='outline-danger' value="x"> <p className='cross'>X</p></Button>
                    <h5 className="card-header">{name}</h5>
                    <p className="card-text">
                    </p><p>Completed: {completed}</p>
                    <p>Weight: {weight}%</p>
                    <Link className="btn btn-primary" to={{pathname:"/UpdateAssignment", state:module_id}} onClick={save}>update</Link>
                    <p />
                    <h5 className="card-footer">Achieved: {percentage}</h5>
                </div>
            </div>
        </div>

    )
}


export default Work;