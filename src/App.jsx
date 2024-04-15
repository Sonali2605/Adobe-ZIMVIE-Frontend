import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import LearnerDashboard from './components/LearnerDashboard'
import { Header } from './components/Header'
import AdminDashboard from './components/AdminDashboard'
import AuthorDashboard from './components/AuthorDashboard';
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
   <BrowserRouter>
   <Routes>
    <Route path ="/" element={<Header/>}/>
    <Route path = "/learner" element={<LearnerDashboard/>}/>
    <Route path = "/admin" element={<AdminDashboard/>}/>
    <Route path = "/author" element={<AuthorDashboard/>}/>
   </Routes>
   </BrowserRouter>
  )
}

export default App
