import { useEffect, useState } from "react"

export default function Dashboard(){

const [data,setData] = useState(null)
const [orders,setOrders] = useState([])   // ✅ NEW
const [loading,setLoading] = useState(true)

const agentId = localStorage.getItem("agent_id")
const username = localStorage.getItem("username") || "agent"

// 🔹 FETCH DASHBOARD STATS
const fetchDashboard = async () => {

try{

const res = await fetch(`https://evo-zobs.onrender.com/orders/agent-dashboard/${agentId}`)
const result = await res.json()

setData(result)

}catch(err){
console.log(err)
}

}

// 🔹 FETCH ORDERS (NEW)
const fetchOrders = async () => {

try{

const res = await fetch(`https://evo-zobs.onrender.com/orders/agent/${agentId}`)
const data = await res.json()

if(Array.isArray(data)){
setOrders(data)
}else{
setOrders([])
}

}catch(err){
console.log(err)
}

setLoading(false)

}

useEffect(()=>{
fetchDashboard()
fetchOrders()
// eslint-disable-next-line
},[])

return(

<div className="flex min-h-screen">

{/* 🔹 SIDEBAR */}
<div className="w-64 bg-gray-900 text-white p-5">
<h2 className="text-xl font-bold mb-6">EVOS</h2>

<ul className="space-y-4">
<li className="font-bold">Dashboard</li>
<li>My Shop</li>
<li>Edit Prices</li>
<li>Orders</li>
<li>Earnings</li>
<li>Withdraw</li>
<li>Apply for Admin</li>
</ul>
</div>

{/* 🔹 MAIN */}
<div className="flex-1 p-8 bg-gray-100">

<h1 className="text-2xl font-bold mb-4">
Agent Dashboard
</h1>

{/* 🔥 SHOP LINK */}
<div className="bg-white p-4 rounded shadow mb-6">
<p className="text-sm text-gray-500">Your Shop Link</p>
<p className="font-bold text-blue-600">
https://evos-amqc.onrender.com/shop/{username}
</p>
</div>

{loading ? (
<p>Loading...</p>
) : (

<>
{/* 🔥 TOP CARDS */}
<div className="grid grid-cols-3 gap-6 mb-6">

<div className="bg-white p-5 rounded shadow">
<h2 className="text-sm text-gray-500">Wallet</h2>
<p className="text-2xl font-bold">
GHS {data?.earnings || 0}
</p>
</div>

<div className="bg-white p-5 rounded shadow">
<h2 className="text-sm text-gray-500">Total Orders</h2>
<p className="text-2xl font-bold">
{data?.total_orders || 0}
</p>
</div>

<div className="bg-white p-5 rounded shadow">
<h2 className="text-sm text-gray-500">Successful</h2>
<p className="text-2xl font-bold">
{data?.successful_orders || 0}
</p>
</div>

</div>

{/* 🔥 SECOND ROW */}
<div className="grid grid-cols-2 gap-6 mb-6">

<div className="bg-white p-5 rounded shadow">
<h2 className="text-sm text-gray-500">Pending</h2>
<p className="text-2xl font-bold">
{data?.pending_orders || 0}
</p>
</div>

<div className="bg-white p-5 rounded shadow">
<h2 className="text-sm text-gray-500">Failed</h2>
<p className="text-2xl font-bold">
{data?.failed_orders || 0}
</p>
</div>

</div>

{/* 🔥 ORDERS TABLE */}
<div className="bg-white p-6 rounded shadow">

<h2 className="text-lg font-bold mb-4">
Recent Orders
</h2>

<table className="w-full border">

<thead>
<tr className="bg-gray-200 text-sm">
<th className="p-2">Order ID</th>
<th className="p-2">Customer</th>
<th className="p-2">Bundle</th>
<th className="p-2">Amount</th>
<th className="p-2">Status</th>
</tr>
</thead>

<tbody>
{orders.length === 0 ? (

<tr>
<td colSpan="5" className="text-center p-4 text-gray-500">
No orders yet
</td>
</tr>

) : (

orders.map((order)=>(
<tr key={order.id} className="text-center border-t">

<td className="p-2">{order.id}</td>
<td className="p-2">{order.customer_phone}</td>
<td className="p-2">{order.bundle}</td>
<td className="p-2">GHS {order.amount}</td>
<td className="p-2">{order.status}</td>

</tr>
))

)}
</tbody>

</table>

</div>

</>

)}

</div>

</div>

)
}
