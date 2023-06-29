import classes from './Landing.module.scss';

import Phone1 from './../../assets/Phone1.png';
import Phone2 from './../../assets/Phone2.png';
import Ellipse from './../../assets/Ellipse.png';

import { FaGraduationCap } from "react-icons/fa";
import { CgGym } from 'react-icons/cg';
import { MdLeaderboard, MdOutlinePiano } from 'react-icons/md';

export const Landing = () => {
    return (
        <>
            <section className={ classes["First"] }>
                <div className={ classes["Logo"] }>
                    <MdOutlinePiano/>
                    <h1>MINGO</h1>
                </div>                
            </section>
            <section className={ classes["Section"] }>
                <div className={ classes["Image"] }>
                    <img src={Phone1}/>
                </div>
                
                <div className={ classes["Text"] }>
                    <h1>Learn to read music the easiest way</h1>
                    <p className={ classes["Text-body"] }>
                        Excel at reading music sheets and easily identify the main musical notes and chords in the staff. 
                        <br/>
                        <br/>
                        Get statistics of your progress and compete with others while practicing.
                    </p>
                </div>
            </section>

            <section className={ classes["Section"] }>
                <div className={ classes["Text"] }>
                    <h1>Recognize notes, chords and intervals by ear</h1>
                    <p className={ classes["Text-body"] }>
                        When it comes to music, recognizing what we play or hear becomes an essential skill. 
                        <br/>
                        <br/>
                        In Mingo you can train your ear for recognizing notes, chords and intervals through interactive games.
                    </p>
                </div>
                <div className={ classes["Image"] }>
                    <img src={Phone2}/>
                </div>
            </section>

            <section className={ classes["Section"] }>
                <img className={ [classes["Ellipse"], classes["Ellipse-1"]].join(" ") } src={Ellipse}/>
                <img className={ [classes["Ellipse"], classes["Ellipse-2"]].join(" ") } src={Ellipse}/>
                <h1>Reasons why you should try Mingo</h1>
                <div className={ classes["Reasons"] }>
                    <div className={ classes["Reason"] }>
                        <div className={ classes["Icon"] }>
                            <FaGraduationCap/>
                        </div>
                        <div className={ classes["Reason-Body"] }>
                            <h2>Learn the basics</h2>
                            <p>Learn the basics of musical theory if you are beginner along the practices of reading and listening.</p>
                        </div>
                    </div>
                    <div className={ classes["Reason"] }>
                        <div className={ classes["Icon"] }>
                            <CgGym/>
                        </div>
                        <div className={ classes["Reason-Body"] }>
                            <h2>Train at your own pace</h2>
                            <p>You can whether practice or learn whenever you want and get statistics of your progress.</p>
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