import React,{useState} from 'react'
import { Button, CloseButton,Card ,Modal,Form} from 'react-bootstrap';
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.css';
import './modules.css'

import {useForm} from 'react-hook-form'


const Module=({year_id,module_id,name,creditsWorth,assignments})=>{
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [alert,setAlert]= useState(false);
    const handleCloseAlert = () => setAlert(false);
    const handleShowAlert = () => setAlert(true);

    const [moduleGrade,setModuleGrade] = useState([])
    fetch('/grades/calcModule/'+module_id) 
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setModuleGrade(data)
        })
        .catch(err=>console.log(err))

    const deleteModule=()=>{
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

        const body = {
            name:name,
        }

        const requestOptions={
            method:"DELETE",
            headers:{
                'content-type':'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body: JSON.stringify(body)
        }
        
        console.log((year_id))
        fetch('/grades/modules/'+year_id,requestOptions)
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
        deleteModule()
        //window.location.reload()
    }


    //console.log(module_id)

    //For updating a module
    const {register, handleSubmit, formState:{errors}} = useForm({});
    const [showUpdate, setShowUpdate] = useState(false);
    const handleCloseUpdate = () => setShowUpdate(false);
    const handleShowUpdate = () => setShowUpdate(true);
    const [serverResponse,setServerResponse]=useState('')

    const [server,setServer]= useState(false);
    const handleCloseServer = () => setServer(false);
    const handleShowServer = () => setServer(true);

    const update =(data)=>{
        const token = localStorage.getItem('REACT_TOKEN_AUTH_KEY')

        const body = {
            currentName:name,
            name:data.newName,
            creditsWorth:data.newCreditsWorth,
            assignments:data.newAssignments
        }
        const requestOptions={
            method:"PUT",
            headers:{
                'content-type':'application/json',
                'Authorization': `Bearer ${JSON.parse(token)}`
            },
            body:JSON.stringify(body)
        }

        const finish=()=>{
            handleCloseUpdate()
            window.location.reload()
        }

        const alertError=()=>{
            handleCloseUpdate()
            if (serverResponse=='Internal Server Error')
                handleShowAlert()
            else
                handleShowServer()
        }

        fetch('/grades/update/'+year_id,requestOptions)
        .then(res=>res.json())
        .then(data=>{
            console.log(data)
            setServerResponse(data.message)
            if (data.message!="this module has been updated")
                alertError()
            else finish()
        })
        .catch(err => console.log(err)) 

    }
  
    return(
        <div>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Are you sure you want to delete this module?</Modal.Title>
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

            <Modal show={server} onHide={handleCloseServer}>
                <Modal.Header closeButton>
                <Modal.Title>ERROR</Modal.Title>
                </Modal.Header>
                <Modal.Body>{serverResponse}</Modal.Body>
            </Modal>

            <Modal show={showUpdate} onHide={handleCloseUpdate}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Module {name}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control placeholder={name} type="text" {...register("newName",{required: true, minLength:3})}/>
                        {errors.newName && <p style={{color:'red'}}><small>Enter a valid name</small></p>}
                        {errors.newName?.type==="minLength" && <p style={{color:'red'}}><small>Module name is too short</small></p>}

                        <Form.Label>Credits Worth</Form.Label>
                        <Form.Control placeholder={creditsWorth} type="number" {...register("newCreditsWorth",{required: true, minLength:1})}/>
                        {errors.newCreditsWorth && <p style={{color:'red'}}><small>Enter a valid number</small></p>}

                        <Form.Label>Number of Assignments</Form.Label>
                        <Form.Control placeholder={assignments} type="number" {...register("newAssignments",{required: true, minLength:1})}/>
                        {errors.newAssignments && <p style={{color:'red'}}><small>Enter a valid number</small></p>}
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                <Button className="btn btn-primary" variant="Primary" onClick={handleSubmit(update)}>Update</Button>
                </Modal.Footer>
            </Modal>

            <div className="card spacing">
                <div className="card-body center">
                    <Button className='btn delete' onClick={handleShow} variant='outline-danger' value="x"> <p className='cross'>X</p></Button>
                    <h5 className="card-header">{name}</h5>
                    <p className="card-text">
                        </p><p>Assignments: {assignments}</p>
                        <p>Credits Worth: {creditsWorth}</p>

                        <Button className="btn btn-primary" style={{margin:"5px"}} to="" onClick={handleShowUpdate}>update</Button>
                        <Link className="btn btn-primary" style={{margin:"5px"}} to={{pathname:"/assignments", state:module_id}}>View</Link>

                    <p />
                    <h5 className="card-footer">Overall Grade: {moduleGrade}</h5>
                </div>
            </div>
        </div>

    )
}


export default Module;