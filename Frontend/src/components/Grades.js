import React,{useEffect,useState} from 'react'

import 'bootstrap/dist/css/bootstrap.css';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { Link } from 'react-router-dom'
import { Button, Form } from 'react-bootstrap'
import {useForm} from 'react-hook-form'

import './grades.css'
import Module from './Modules'

import { useAuth} from '../auth'

export default function Grades() {
  const [logged] = useAuth();

  const LoggedIn = () => {

    const [modules1,setModules1] = useState([])
    const [modules2,setModules2] = useState([])
    const [modules3,setModules3] = useState([])
    const [modules4,setModules4] = useState([])

    const [overallYear1,setOverallYear1] = useState([])
    const [overallYear2,setOverallYear2] = useState([])
    const [overallYear3,setOverallYear3] = useState([])
    const [overallYear4,setOverallYear4] = useState([])

    let current_user_id =localStorage.getItem("currentUserId")
    let current_user_forename =localStorage.getItem("currentUserForename")
    let current_user_NumberOfYears =localStorage.getItem("currentUserNumberOfYears")
    
    let years_id = JSON.parse(localStorage.getItem("yearIds"))
    //Get modules, for each year!!
    useEffect(
        ()=>{
            let year1 = years_id[0]?.id
            //console.log(year1)
            fetch('/grades/modules/'+year1)  //FOR YEAR  1   
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                setModules1(data)
            })
            .catch(err=>console.log(err))
    
            let year2 = years_id[1]?.id
            //console.log(year2)
            fetch('/grades/modules/'+year2)  //FOR YEAR  1   
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                setModules2(data)
            })
            .catch(err=>console.log(err))
            
            let year3 = years_id[2]?.id
            //console.log(year3)
            fetch('/grades/modules/'+year3)  //FOR YEAR  1   
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                setModules3(data)
            })
            .catch(err=>console.log(err))

            //if (current_user_NumberOfYears ==4)
            let year4 = years_id[3]?.id
            //console.log(year4)
            fetch('/grades/modules/'+year4)  //FOR YEAR  1   
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                setModules4(data)
            })
            .catch(err=>console.log(err))


            //Get overall year grades!
            fetch('/grades/calcYear/'+year1) 
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                setOverallYear1(data)
            })
            .catch(err=>console.log(err))

            fetch('/grades/calcYear/'+year2) 
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                setOverallYear2(data)
            })
            .catch(err=>console.log(err))

            fetch('/grades/calcYear/'+year3) 
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                setOverallYear3(data)
            })
            .catch(err=>console.log(err))

            fetch('/grades/calcYear/'+year4) 
            .then(res=>res.json())
            .then(data=>{
                console.log(data)
                setOverallYear4(data)
            })
            .catch(err=>console.log(err))

        },[]
    );

    //For Overall Grade Form
    const {register,handleSubmit, formState:{errors}} = useForm();
    const [show,setShow] = useState(false)
    var final = 0
    const calculateFinalGrade = (data) =>{
        data.ratio1 = Number(data.ratio1)
        data.ratio2 = Number(data.ratio2)
        data.ratio3 = Number(data.ratio3)
        data.ratio4 = Number(data.ratio4)

        let totalOutOf = data.ratio1+data.ratio2+data.ratio3
        if (current_user_NumberOfYears==4)
            totalOutOf+= data.ratio4

        final+= (data.ratio1/totalOutOf)*overallYear1
        final+= (data.ratio2/totalOutOf)*overallYear2
        final+= (data.ratio3/totalOutOf)*overallYear3
        if (current_user_NumberOfYears==4)
            final+= (data.ratio4/totalOutOf)*overallYear4
            
        final = Math.round((final + Number.EPSILON) * 100) / 100
        localStorage.setItem("Predicted",final)
        setShow(true)

    }

    return (
        <div>
            <div className="fullPage">
                
                <h2>Welcome {current_user_forename}!</h2>

                <div className="box">
                    <Tabs defaultActiveKey="one-tab">
                        <Tab eventKey="one-tab" title="Year 1" id='year_1'>

                            <h1>Year 1 Grades</h1>
                            <div className="card-deck wrapCards">
                                {

                                    modules1.map(
                                        (module)=>(
                                            <Module key={module.id} year_id={years_id[0].id} module_id ={module.id} name={module.name} assignments={module.assignments} creditsWorth={module.creditsWorth}></Module>
                                        )
                                    )
                                }

                                {/* Special "+" Card */}
                                <div className="card border-light spacing">
                                    <div className="card-body centerAdd">
                                        <p className="card-text"></p>
                                        <Link style={{textDecoration:'none',color:'black'}} to={{pathname:"/addModules", state:years_id[0]?.id}}><p className="circle centerAdd">+</p></Link>
                                        <p />
                                    </div>
                                </div>
                            </div>
                            <div className='overall'>
                                <p>Overall Grade: {overallYear1}%</p>
                            </div>
                        </Tab>
                        <Tab eventKey="two-tab" title="Year 2" id='year_2'>
                            <h1>Year 2 Grades</h1>
                            <div className="card-deck wrapCards">
                                {
                                modules2.map(
                                    (module)=>(
                                        <Module key={module.id} year_id={years_id[1].id} module_id ={module.id} name={module.name} assignments={module.assignments} creditsWorth={module.creditsWorth}></Module>
                                    )
                                )
                                }

                                {/* Special "+" Card */}
                                <div className="card border-light spacing">
                                    <div className="card-body centerAdd">
                                        <p className="card-text"></p>
                                        <Link style={{textDecoration:'none',color:'black'}} to={{pathname:"/addModules", state:years_id[1]?.id}}><p className="circle centerAdd">+</p></Link>
                                        <p />
                                    </div>
                                </div>
                            </div>
                            <div className='overall'>
                                <p>Overall Grade: {overallYear2}%</p>
                            </div>
                        </Tab>
                        <Tab eventKey="three-tab" title="Year 3"  id='year_3'>
                            <h1>Year 3 Grades</h1>
                            <div className="card-deck wrapCards">
                                {
                                modules3.map(
                                    (module)=>(
                                        <Module key={module.id} year_id={years_id[2].id} module_id ={module.id} name={module.name} assignments={module.assignments} creditsWorth={module.creditsWorth}></Module>
                                    )
                                )
                                }

                                {/* Special "+" Card */}
                                <div className="card border-light spacing">
                                    <div className="card-body centerAdd">
                                        <p className="card-text"></p>
                                        <Link style={{textDecoration:'none',color:'black'}} to={{pathname:"/addModules", state:years_id[2]?.id}}><p className="circle centerAdd">+</p></Link>
                                        <p />
                                    </div>
                                </div>
                            </div>
                            <div className='overall'>
                                <p>Overall Grade: {overallYear3}%</p>
                            </div>
                        </Tab>
                        {
                        (current_user_NumberOfYears ==4)?
                            <Tab eventKey="four-tab" title="Year 4"  id='year_4'>
                                <h1>Year 4 Grades</h1>
                                <div className="card-deck wrapCards">
                                    {
                                    modules4.map(
                                        (module)=>(
                                            <Module key={module.id} year_id={years_id[3].id} module_id ={module.id} name={module.name} assignments={module.assignments} creditsWorth={module.creditsWorth}></Module>
                                        )
                                    )
                                    }

                                    {/* Special "+" Card */}
                                    <div className="card border-light spacing">
                                        <div className="card-body centerAdd">
                                            <p className="card-text"></p>
                                            <Link style={{textDecoration:'none',color:'black'}} to={{pathname:"/addModules", state:years_id[3]?.id}}><p className="circle centerAdd">+</p></Link>
                                            <p />
                                        </div>
                                    </div>
                                </div>
                                <div className='overall'>
                                <p>Overall Grade: {overallYear4}%</p>
                            </div>
                            </Tab>
                            :<></>
                        }
                        <Tab eventKey="overall-tab" title="Overall" id='overall'>
                            <h1>Calculate overall</h1>
                            <ul style={{listStyleType:"circle"}}>
                                <li>Year 1: {overallYear1}%</li>
                                <li>Year 2: {overallYear2}%</li>
                                <li>Year 3: {overallYear3}%</li>
                                {(current_user_NumberOfYears ==4)?<li>Year 4: {overallYear4}%</li>:<></>}
                            </ul>

                            <Form.Group>
                                <h5>Please enter the ratio that each year is weighted at:</h5>
                                <Form.Label>Year 1</Form.Label>
                                <Form.Control type="number" {...register("ratio1",{required: true, minLength:1, maxLength:1})} style={{width:'30%'}}/>
                                {errors.ratio1 && <p style={{color:'red'}}><small>Enter a valid ratio number</small></p>}
        
                                <Form.Label>Year 2</Form.Label>
                                <Form.Control type="number" {...register("ratio2",{required: true, minLength:1, maxLength:1})} style={{width:'30%'}}/>
                                {errors.ratio2 && <p style={{color:'red'}}><small>Enter a valid ratio number</small></p>}
        
                                <Form.Label>Year 3</Form.Label>
                                <Form.Control type="number" {...register("ratio3",{required: true, minLength:1, maxLength:1})} style={{width:'30%'}}/>
                                {errors.ratio3 && <p style={{color:'red'}}><small>Enter a valid ratio number</small></p>}
        
                                {(current_user_NumberOfYears ==4)?
                                    <div>
                                        <Form.Label>Year 4</Form.Label>
                                        <Form.Control type="number" {...register("ratio4",{required: true, minLength:1, maxLength:1})} style={{width:'30%'}}/>
                                        {errors.ratio4 && <p style={{color:'red'}}><small>Enter a valid ratio number</small></p>}
                                    </div>
                                    :
                                    <></>
                                }

                                <Button as="sub" variant="primary" onClick={handleSubmit(calculateFinalGrade)} style={{marginTop: '15px', float: 'right'}}>Calculate</Button>
                            </Form.Group>

                            {(show)?
                                <div className='final'>
                                    <h3>Predicted Grade: {localStorage.getItem("Predicted")}%</h3>
                                </div>
                            :
                            <></>
                            }
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>

    )}

    return(
        <div>
            {logged?<LoggedIn/>:<></>}
        </div>
    )
}