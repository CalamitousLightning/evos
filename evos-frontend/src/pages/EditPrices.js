import { useEffect, useState } from "react"

export default function EditPrices(){

const [prices,setPrices] = useState([])
const [loading,setLoading] = useState(true)
const [message,setMessage] = useState("")

const agentId = localStorage.getItem("agent_id")

// 🔹 Fetch base + agent prices
const fetchPrices = async () => {

try{

const res = await fetch(`https://evo-zobs.onrender.com/prices/${agentId}`)
const data = await res.json()

setPrices(data)

}catch(err){
console.log(err)
}

setLoading(false)

}

// 🔹 Handle input change
const handleChange = (index,value) => {

const updated = [...prices]
updated[index].agent_price = value

setPrices(updated)

}

// 🔹 Save prices
const savePrices = async () => {

setMessage("Saving...")

try{

const res = await fetch("https://evo-zobs.onrender.com/prices/update",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
agent_id: agentId,
prices: prices
})
})

const data = await res.json()

if(!res.ok){
setMessage(data.error || "Failed to save")
return
}

setMessage("✅ Prices updated successfully")

}catch(err){
console.log(err)
setMessage("Server error")
}

}

useEffect(()=>{
fetchPrices()
// eslint-disable-next-line
},[])

return(

<div className="flex min-h-screen">

{/* 🔹 SIDEBAR */}
<div className="w-64 bg-gray-900 text-white p-5">
<h2 className="text-xl font-bold mb-6">EVOS</h2>

<ul className="space-y-4">
<li>Dashboard</li>
<li>My Shop</li>
<li className="font-bold">Edit Prices</li>
<li>Orders</li>
<li>Earnings</li>
<li>Withdraw</li>
<li>Apply for Admin</li>
</ul>
</div>

{/* 🔹 MAIN */}
<div className="flex-1 p-8 bg-gray-100">

<h1 className="text-2xl font-bold mb-6">
Edit Prices
</h1>

{loading ? (
<p>Loading prices...</p>
) : (

<div className="bg-white p-6 rounded shadow">

{prices.map((item,index)=>(
<div key={index} className="flex justify-between items-center mb-4 border-b pb-2">

<div>
<p className="font-semibold">{item.network} {item.bundle}</p>
<p className="text-sm text-gray-500">
Base: GHS {item.base_price}
</p>
</div>

<input
type="number"
placeholder="Your profit"
className="border p-2 w-32"
value={item.agent_price || ""}
onChange={(e)=>handleChange(index,e.target.value)}
/>

</div>
))}

<button
className="bg-blue-600 text-white px-6 py-2 rounded mt-4"
onClick={savePrices}
>
Save Prices
</button>

{message && (
<p className="mt-4 text-sm">{message}</p>
)}

</div>

)}

</div>

</div>

)

}
