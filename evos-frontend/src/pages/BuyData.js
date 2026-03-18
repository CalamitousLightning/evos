import { useState } from "react"

export default function BuyData(){

const [network,setNetwork] = useState("MTN")
const [phone,setPhone] = useState("")
const [bundle,setBundle] = useState("")

const handleBuy = async () => {

const token = localStorage.getItem("token")

const res = await fetch("https://evo-zobs.onrender.com/L/orders/create",{

method:"POST",

headers:{
"Content-Type":"application/json",
"Authorization":`Bearer ${token}`
},

body:JSON.stringify({
network,
phone,
bundle
})

})

const data = await res.json()

alert("Order sent!")

console.log(data)

}

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">
Buy Data Bundle
</h1>

<div className="bg-white p-6 rounded-xl shadow w-96">

<select
className="border p-2 w-full mb-4"
onChange={(e)=>setNetwork(e.target.value)}
>

<option>MTN</option>
<option>Telecel</option>
<option>AT</option>

</select>

<input
className="border p-2 w-full mb-4"
placeholder="Customer Phone Number"
onChange={(e)=>setPhone(e.target.value)}
/>

<input
className="border p-2 w-full mb-4"
placeholder="Bundle Size (GB)"
onChange={(e)=>setBundle(e.target.value)}
/>

<button
className="bg-blue-600 text-white w-full p-2 rounded"
onClick={handleBuy}
>

Buy Data

</button>

</div>

</div>

)
}