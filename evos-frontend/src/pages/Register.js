import { useState } from "react"

export default function Register(){

const [username,setUsername] = useState("")
const [fullName,setFullName] = useState("")
const [phone,setPhone] = useState("")
const [password,setPassword] = useState("")
const [message,setMessage] = useState("")
const [loading,setLoading] = useState(false)

const handleRegister = async () => {

setLoading(true)
setMessage("")

try{

const res = await fetch("https://evo-zobs.onrender.com/auth/apply-agent",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
username: username,
full_name: fullName,
phone: phone,
password: password
})
})

const data = await res.json()
console.log("RESPONSE:", data)

if(!res.ok){
console.log("BACKEND ERROR", data)
setMessage(JSON.stringify(data))
setLoading(false)
return
}

setMessage("Application submitted! Wait for founder approval.")

}catch(err){
console.log("FULL ERROR", err)
setMessage("Server error - check console")
}

setLoading(false)

}

return(

<div className="flex items-center justify-center h-screen bg-gray-900">

<div className="bg-white p-8 rounded-xl shadow-md w-96">

<h1 className="text-2xl font-bold mb-6 text-center">
Apply as Agent
</h1>

{message && (
<p className="text-sm text-center mb-4">{message}</p>
)}

<input
className="border p-2 w-full mb-3 rounded"
placeholder="Username"
onChange={(e)=>setUsername(e.target.value)}
/>

<input
className="border p-2 w-full mb-3 rounded"
placeholder="Full Name"
onChange={(e)=>setFullName(e.target.value)}
/>

<input
className="border p-2 w-full mb-3 rounded"
placeholder="Phone Number"
onChange={(e)=>setPhone(e.target.value)}
/>

<input
type="password"
className="border p-2 w-full mb-4 rounded"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button
className="bg-green-600 text-white w-full p-2 rounded"
onClick={handleRegister}
disabled={loading}
>

{loading ? "Submitting..." : "Apply"}

</button>

</div>

</div>

)
}