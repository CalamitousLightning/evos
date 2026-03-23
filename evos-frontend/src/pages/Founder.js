import { useEffect, useState } from "react"

export default function Founder(){

const [agents,setAgents] = useState([])
const [loading,setLoading] = useState(true)

const token = localStorage.getItem("token")

// Fetch pending agents
const fetchAgents = async () => {
try{
const res = await fetch("https://evo-zobs.onrender.com/founder/pending-agents",{
headers:{
"Authorization": token ? `Bearer ${token}` : ""
}
})

const data = await res.json()
console.log("AGENTS:", data) // 🔥 DEBUG

setAgents(data)
}catch(err){
console.log("ERROR:", err)
}
setLoading(false)
}

// Approve agent
const approveAgent = async (id) => {
try{
await fetch(`https://evo-zobs.onrender.com/founder/approve-agent/${id}`,{
method:"POST",
headers:{
"Authorization": token ? `Bearer ${token}` : ""
}
})

fetchAgents() // refresh list

}catch(err){
console.log(err)
}
}

useEffect(()=>{
fetchAgents()
//eslint-disable-next-line
},[])

return(

<div className="p-6">

<h1 className="text-2xl font-bold mb-6">Founder Dashboard</h1>

{loading ? (
<p>Loading...</p>
) : (

<div>

{agents.length === 0 ? (
<p>No pending agents</p>
) : (

agents.map((agent)=>(
<div key={agent.id} className="border p-4 mb-3 flex justify-between items-center">

<div>
<p><b>Username:</b> {agent.username}</p>
<p><b>Full Name:</b> {agent.full_name}</p>
<p><b>Phone:</b> {agent.phone}</p>
</div>

<button
className="bg-green-600 text-white px-4 py-1 rounded"
onClick={()=>approveAgent(agent.id)}
>
Approve
</button>

</div>
))

)}

</div>

)}

</div>

)
}