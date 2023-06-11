import classes from'./App.module.scss';

import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import { ProtectedRoute } from "./components/ProtectedRoute";
import { Avatars, Chords, Home, Intervals, Landing, Login, Notes, Roles, Songs, Topics, Users } from "./pages";
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
              <Route path="/notes" element={<Notes/>}/>
              <Route path="/chords" element={<Chords/>}/>
              <Route path="/intervals" element={<Intervals/>}/>
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