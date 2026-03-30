import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import Founder from "./pages/Founder"
import Admin from "./pages/Admin"
import Register from "./pages/Register"
import Shop from "./pages/Shop"
import EditPrices from "./pages/EditPrices"

export default function App(){

return(

<BrowserRouter>

<Routes>

<Route path="/" element={<Login />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/founder" element={<Founder />} />
<Route path="/admin" element={<Admin />} />
<Route path="/register" element={<Register />} />
<Route path="/shop/:username" element={<Shop />} />
<Route path="/editprices" element={<EditPrices />} />
</Routes>

</BrowserRouter>

)

}
