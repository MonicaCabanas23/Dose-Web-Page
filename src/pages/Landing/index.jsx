import classes from './Landing.module.scss';

import Phone1 from './../../assets/Phone1.png';
import Phone2 from './../../assets/Phone2.png';
import logo from './../../assets/logo.png';

import { TbUserQuestion } from "react-icons/tb";
import { FaRegClock } from "react-icons/fa";
import { BiWorld } from "react-icons/bi";
import { MdLeaderboard, MdOutlinePiano } from 'react-icons/md';

export const Landing = () => {
    return (
        <>
            <section className={ classes["First"] }>
                <div className={ classes["Logo"] }>
                    <img src={logo} />
                    <h1>DOSE</h1>
                    <h2>"Organiza tu medicación de forma fácil y segura"</h2>
                </div>                
            </section>
            <section className={ classes["Section"] }>
                <div className={ classes["Image"] }>
                    <img src={Phone1}/>
                </div>
                
                <div className={ classes["Text"] }>
                    <h1>Organiza tu medicación de forma fácil y segura</h1>
                    <p className={ classes["Text-body"] }>
                        Con Dose, recibe alertas personalizadas para no olvidar ningún medicamento. 
                        <br />
                        <br />
                        Administra tus tratamientos diarios de manera práctica y sin complicaciones.
                    </p>
                </div>
            </section>

            <section className={ classes["Section"] }>
                <div className={ classes["Text"] }>
                    <h1>Configura tus medicamentos en segundos</h1>
                    <p className={ classes["Text-body"] }>
                        Agrega el nombre del medicamento, la dosis, frecuencia y horario. 
                        <br />
                        <br />
                        Dose se encarga de recordártelo puntualmente. También puedes registrar el tipo de medicamento para llevar un control más claro.
                    </p>
                </div>
                <div className={ classes["Image"] }>
                    <img src={Phone2}/>
                </div>
            </section>

            <section className={ classes["Section"] }>
                <h1 className={ classes["Text"] }>Razones para usar Dose</h1>
                <div className={ classes["Reasons"] }>
                    <div className={ classes["Reason"] }>
                        <div className={ classes["Icon"] }>
                            <TbUserQuestion />
                        </div>
                        <div className={ classes["Reason-Body"] }>
                            <h2>Evita olvidos</h2>
                            <p>Recibe notificaciones en el momento exacto para cada toma de medicamento.</p>
                        </div>
                    </div>
                    <div className={ classes["Reason"] }>
                        <div className={ classes["Icon"] }>
                            <FaRegClock />
                        </div>
                        <div className={ classes["Reason-Body"] }>
                            <h2>Adaptado a ti</h2>
                            <p>Configura los horarios, la frecuencia y el tipo de medicamento según tus necesidades.</p>
                        </div>
                    </div>
                    <div className={ classes["Reason"] }>
                        <div className={ classes["Icon"] }>
                            <BiWorld />
                        </div>
                        <div className={ classes["Reason-Body"] }>
                            <h2>Disponible en español e inglés</h2>
                            <p>Cambia fácilmente el idioma de la aplicación y úsala en el que prefieras.</p>
                        </div>
                    </div>                    
                </div>
            </section> 
            <footer className={ classes["Footer"] }>
                <p>&copy; 2023 MINGO. All rights reserved.</p>             
            </footer>           
        </>
    )
}