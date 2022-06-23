import React,{useState,useEffect} from 'react'
import 'bootstrap/dist/css/bootstrap.css';
import Work from './Work'
import './assignments.css'

import { BrowserRouter as Router, Route, Switch,useParams, useLocation } from "react-router-dom";
import { Link } from 'react-router-dom'

const Assignments=()=>{

    const location = useLocation()
    const module_id = location.state;

    const [assignments,setAssignments] = useState([])
    let current_user_id =localStorage.getItem("currentUserId")

        //Get assignments, for this module!!
        useEffect(
            ()=>{
                console.log(module_id)
                fetch('/grades/assignments/'+module_id)    
                .then(res=>res.json())
                .then(data=>{
                    console.log(data)
                    setAssignments(data)
                })
                .catch(err=>console.log(err))
            },[]
        );

    return(
        <div className="fullPage">
            <h1>Assignments</h1>
            <div className="card-deck wrapCards">
                {
                    assignments.map(
                        (work)=>(
                            <Work key={work.id} module_id={module_id} name={work.name} completed={work.completed} weight={work.weight} percentage={work.percentage}></Work>
                        )
                    )
                }

                {/* Special "+" Card */}
                <div className="card border-light spacing">
                    <div className="card-body centerAdd">
                        <p className="card-text"></p>
                        <Link style={{textDecoration:'none',color:'black'}} to={{pathname:"/addAssignment", state:module_id}}><p className="circle centerAdd">+</p></Link>
                        <p />
                    </div>
                </div>
            </div>
        </div>

    )
}


export default Assignments;