import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import BuyData from "./pages/BuyData"
import Founder from "./pages/Founder"
import Admin from "./pages/Admin"
import Register from "./pages/Register"


export default function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Login />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/buy-data" element={<BuyData />} />
<Route path="/founder" element={<Founder />} />
<Route path="/admin" element={<Admin />} />
<Route path="/register" element={<Register />} />

</Routes>

</BrowserRouter>

)

}