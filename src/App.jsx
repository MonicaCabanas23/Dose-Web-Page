import classes from'./App.module.scss';
import 'react-toastify/dist/ReactToastify.css';

import React from "react";
import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate  } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import { ProtectedRoute } from "./components/ProtectedRoute";
import { Avatars, Chords, Chord, Home, NotFound, Intervals, Interval, Landing, Login, Notes, Note, Roles, Songs, Song, Users } from "./pages";
import { NoAuthLayout } from "./layouts/NoAuthLayout/NoAuthLayout";
import { MainLayout } from "./layouts/MainLayout/MainLayout";

function App() {
  const [scrollTop, setScrollTop] = useState(0);
  
  const handleScroll = (event) => {    
    setScrollTop(event.currentTarget.scrollTop);
  };
  
  return (
    <div className={classes["App"]} onScroll={handleScroll}>
      <ToastContainer limit={3}/>
      <BrowserRouter>
        <Routes>
          <Route element={<NoAuthLayout scrollTop={scrollTop}/>}>
            <Route index element={<Landing/>}/>
            <Route path="/landing" element={<Navigate to="/"/>}/>
          </Route>
          <Route element={<ProtectedRoute/>}>
            <Route element={<MainLayout/>}>
              <Route path="/home" element={<Home/>}/>
              <Route path="/notes" element={<Notes/>}>
                <Route path="note" element={<Note/>}/>
                <Route path="note/:id" element={<Note/>}/>
              </Route>
              <Route path="/chords" element={<Chords/>}>
                <Route path="chord" element={<Chord/>}/>
                <Route path="chord/:id" element={<Chord/>}/>
              </Route>
              <Route path="/intervals" element={<Intervals/>}>              
                <Route path="interval" element={<Interval/>}/>
                <Route path="interval/:id" element={<Interval/>}/>
              </Route>
              <Route path="/songs" element={<Songs/>}>
                <Route path="song" element={<Song/>}/>
                <Route path="song/:id" element={<Song/>}/>
              </Route>
              <Route path="/roles" element={<Roles/>}/>
              <Route path="/users" element={<Users/>}/>
              <Route path="/avatars" element={<Avatars/>}/>
            </Route>
          </Route>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<NotFound/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;