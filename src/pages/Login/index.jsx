import classes from './Login.module.scss';
import logo from './../../assets/logo.png';

import { useState, useEffect } from 'react';

import { Input } from '../../components/Input/Input';
import { useAuth } from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

export const Login = () => {
    if (useAuth() !== null) {
        return <Navigate to="/Home"/>;
    }

    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    })

    const setEmail = (e) => {
        setInputs(existingValues => ({
            ...existingValues,
            email: e.target.value
        }));
    }

    const setPassword = (e) => {
        setInputs(existingValues => ({
            ...existingValues,
            password: e.target.value
        }));
    }

    const handleSubmit = async (e) => {
        if (inputs.email === "" && inputs.password === "") {
            return;
        }

        e.preventDefault();
        fetch("https://api.mingo.studio/api/auth/admin", {
            method:"POST",
            crossDomain:true,
            headers:{
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Acces-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                identifier: inputs.email,
                password: inputs.password
            }),
        })
        .then((res) => {
            if (!res.ok) {                    
                throw new Error('Something went wrong');
            }
            return res.json();
        }).then((data) => {
            window.localStorage.setItem("dataStorage", JSON.stringify({
                user: data.user,
                token: data.token
            }));
            setTimeout(() => {        
                window.location.href = "/Home";
            }, 2000);
            return;
        }).catch((error) => {
            
        });;          
    }    

    return (
        <div className={ classes["Login"] }>
            <div className={ classes["Login-container"] }>
                <div className={ classes["Logo"] }>
                    <img src={logo}/>
                    <h2>
                        MINGO
                    </h2>
                </div>

                <div className={ classes["LoginForm"]}>
                    <Input id="femail" handleInput={setEmail} value={inputs.email} name="Email" type="text"/>
                    <Input id="fpassword" handleInput={setPassword} value={inputs.password} name="Password" type="password"/>
                </div>

                <button className={ classes["Login"] } onClick={handleSubmit}>Login</button>
            </div>
        </div>
    )
}