import classes from'./App.module.scss';

import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { Chord } from './pages/Chords/Chord';
import { Avatars, Chords, Home, Intervals, Interval, Landing, Login, Notes, Note, Roles, Songs, Topics, Users } from "./pages";
import { NoAuthLayout } from "./layouts/NoAuthLayout/NoAuthLayout";
import { MainLayout } from "./layouts/MainLayout/MainLayout";

function App() {
  return (
    <div className={classes["App"]}>
      <BrowserRouter>
        <Routes>
          <Route element={<NoAuthLayout/>}>
            <Route index element={<Landing/>}/>
            <Route path="/landing" element={<Landing/>}/>
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
              <Route path="/songs" element={<Songs/>}/>
              <Route path="/topics" element={<Topics/>}/>
              <Route path="/roles" element={<Roles/>}/>
              <Route path="/users" element={<Users/>}/>
              <Route path="/avatars" element={<Avatars/>}/>
            </Route>
          </Route>
          <Route path="/login" element={<Login/>}/>
          <Route path="*" element={<h1>404 Not Found</h1>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App;