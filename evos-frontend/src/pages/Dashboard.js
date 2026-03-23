import { useEffect, useState } from "react"

export default function Dashboard(){

const [orders,setOrders] = useState([])
const [loading,setLoading] = useState(true)

const user_id = localStorage.getItem("user_id")

const fetchOrders = async () => {

try{

const res = await fetch(`https://evo-zobs.onrender.com/orders/agent/${user_id}`)
const data = await res.json()

// ✅ VERY IMPORTANT FIX
if(Array.isArray(data)){
    setOrders(data)
}else{
    console.log("Not an array:", data)
    setOrders([]) // prevent crash
}

}catch(err){
console.log(err)
setOrders([])
}

setLoading(false)
}

useEffect(()=>{
fetchOrders()
// eslint-disable-next-line
},[])

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">
EVOS Agent Dashboard
</h1>

{loading ? (
<p>Loading...</p>
) : (

<div>

<h2 className="text-xl mb-4">My Orders</h2>

{orders.length === 0 ? (
<p>No orders yet</p>
) : (

<table className="w-full border">

<thead>
<tr className="bg-gray-200">
<th className="p-2">Phone</th>
<th className="p-2">Network</th>
<th className="p-2">Bundle</th>
<th className="p-2">Status</th>
</tr>
</thead>

<tbody>
{orders.map((order)=>(
<tr key={order.id} className="text-center border-t">
<td className="p-2">{order.customer_phone}</td>
<td className="p-2">{order.network}</td>
<td className="p-2">{order.bundle}</td>
<td className="p-2">{order.status || "pending"}</td>
</tr>
))}
</tbody>

</table>

)}

</div>

)}

</div>

)
}