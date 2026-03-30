import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

export default function Shop(){

const { username } = useParams()

const [network,setNetwork] = useState("MTN")
const [phone,setPhone] = useState("")
const [bundles,setBundles] = useState([])
const [selected,setSelected] = useState(null)
const [message,setMessage] = useState("")
const [loading,setLoading] = useState(false)

// 🔥 PAYSTACK KEY
const PAYSTACK_KEY = "pk_test_96ebff2c005c164726c96b7cebbd2efbffede456"

// 🔹 Fetch bundles (FINAL PRICES)
const fetchBundles = async () => {
try{
const res = await fetch(`https://evo-zobs.onrender.com/shop/${username}`)
const data = await res.json()

setBundles(data)

}catch(err){
console.log(err)

// 🔥 FALLBACK DATA (for testing)
setBundles([
{network:"MTN", bundle:"1GB", price:6.5},
{network:"MTN", bundle:"2GB", price:13.5},
{network:"Telecel", bundle:"1GB", price:7},
])
}
}

useEffect(()=>{
fetchBundles()
// eslint-disable-next-line
},[])

// 🔹 Filter bundles by network
const filtered = bundles.filter(b => b.network === network)

// 🔹 PAY
const handleBuy = () => {

if(!phone || !selected){
setMessage("Select bundle & enter phone")
return
}

if (!window.PaystackPop) {
setMessage("Payment system not loaded. Refresh page.")
return
}

setLoading(true)
setMessage("Initializing payment...")

const handler = window.PaystackPop.setup({
key: PAYSTACK_KEY,
email: `${phone}@evos.com`,
amount: selected.price * 100, // ✅ CORRECT (kobo/pesewas)
currency: "GHS",
ref: `${username}-${Date.now()}`,

onClose: function(){
setMessage("Payment cancelled")
setLoading(false)
},

callback: async function(){

setMessage("Payment successful! Processing order...")

try{

const res = await fetch("https://evo-zobs.onrender.com/orders/create",{
method:"POST",
headers:{
"Content-Type":"application/json"
},
body:JSON.stringify({
agent_username: username,
customer_phone: phone,
network: selected.network,
bundle: selected.bundle,
amount: selected.price
})
})

const data = await res.json()

if(!res.ok){
setMessage(data.error || "Order failed")
setLoading(false)
return
}

setMessage("✅ Data purchase successful!")

setPhone("")
setSelected(null)

}catch(err){
console.log(err)
setMessage("Server error")
}

setLoading(false)
}
})

handler.openIframe()
}

return(

<div className="min-h-screen bg-gray-100 flex justify-center items-center">

<div className="bg-white p-6 rounded-xl shadow w-96">

<h1 className="text-xl font-bold text-center mb-2">
{username}'s Shop
</h1>

<p className="text-center text-gray-500 mb-4">
Buy affordable data bundles
</p>

{message && (
<p className="text-center text-sm mb-4">{message}</p>
)}

{/* 🔹 NETWORK */}
<select
className="border p-2 w-full mb-4"
value={network}
onChange={(e)=>setNetwork(e.target.value)}
>
<option>MTN</option>
<option>Telecel</option>
<option>AT</option>
</select>

{/* 🔹 BUNDLES */}
<div className="mb-4 space-y-2">
{filtered.map((b,i)=>(
<div
key={i}
onClick={()=>setSelected(b)}
className={`p-3 border rounded cursor-pointer flex justify-between ${
selected === b ? "bg-green-100 border-green-500" : ""
}`}
>
<span>{b.bundle}</span>
<span>GHS {b.price}</span>
</div>
))}
</div>

{/* 🔹 PHONE */}
<input
className="border p-2 w-full mb-4"
placeholder="Enter phone number"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

{/* 🔹 BUTTON */}
<button
className="bg-green-600 text-white w-full p-2 rounded"
onClick={handleBuy}
disabled={loading}
>
{loading ? "Processing..." : "Buy Now"}
</button>

</div>

</div>

)
}
