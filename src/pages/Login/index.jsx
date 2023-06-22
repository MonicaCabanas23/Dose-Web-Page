import classes from './Login.module.scss';
import logo from './../../assets/logo.png';

import { useState } from 'react';
import { toast } from 'react-toastify';

import { Input } from '../../components/Input/Input';
import { useAuth } from '../../hooks/useAuth';
import { Navigate, useNavigate } from 'react-router-dom';

export const Login = () => {
    if (useAuth() !== null) {
        return <Navigate to="/Home"/>;
    }

    const navigate = useNavigate();

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
        await fetch("https://api.mingo.studio/api/auth/admin", {
            method:"POST",
            crossDomain:true,
            headers:{
                "Content-Type" : "application/json",
                Accept: "application/json",
                "Access-Control-Allow-Origin": "*",
            },
            body: JSON.stringify({
                identifier: inputs.email,
                password: inputs.password
            }),
        })
        .then((res) => {            
            return res.json();
        }).then((data) => {
            if (data.error) {
                throw new Error(data.error);
            }

            window.localStorage.setItem("dataStorage", JSON.stringify({
                user: data.user,
                token: data.token
            }));

            toast.success("Inicio de sesión exitoso. ¡Bienvenido!", {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Login",
                pauseOnFocusLoss: false,
                autoClose:3000
            });

            setTimeout(() => {        
                navigate("/Home");
            }, 2000);
            return;
        }).catch((error) => {
            toast.error(`${error}`, {
                hideProgressBar: true,
                theme: "dark",
                toastId: "Login",
                pauseOnFocusLoss: false,
                autoClose:3000
            });            
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