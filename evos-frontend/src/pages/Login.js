import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function Login(){

const navigate = useNavigate()

const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [error,setError] = useState("")
const [loading,setLoading] = useState(false)

const handleLogin = async () => {

setLoading(true)
setError("")

try{

const res = await fetch("https://evo-zobs.onrender.com/auth/login",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
email,
password
})
})

const data = await res.json()

if(!res.ok){
setError(data.detail || "Invalid credentials")
setLoading(false)
return
}

// 🔐 Save auth data
localStorage.setItem("token", data.access_token)
localStorage.setItem("role", data.role)
localStorage.setItem("user_id", data.user_id)

// 🚫 Check approval (VERY IMPORTANT)
if(data.role === "agent" && data.is_approved === false){
setError("Your account is pending founder approval")
setLoading(false)
return
}

// 🚀 Redirect based on role
if(data.role === "founder"){
navigate("/founder")
}
else if(data.role === "admin"){
navigate("/admin")
}
else{
navigate("/dashboard")
}

}catch(err){
setError("Server error. Try again.")
}

setLoading(false)

}

return(

<div className="flex items-center justify-center h-screen bg-gray-900">

<div className="bg-white p-8 rounded-xl shadow-md w-96">

<h1 className="text-2xl font-bold mb-6 text-center">
EVOS Login
</h1>

{error && (
<p className="text-red-500 mb-4 text-sm text-center">{error}</p>
)}

<input
className="border p-2 w-full mb-3 rounded"
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
className="border p-2 w-full mb-4 rounded"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
className="bg-blue-600 text-white w-full p-2 rounded"
onClick={handleLogin}
disabled={loading}
>

{loading ? "Logging in..." : "Login"}

</button>

<a
href="/register"
className="block text-center mt-4 text-blue-600"
>
Apply as Agent
</a>

</div>

</div>

)
}