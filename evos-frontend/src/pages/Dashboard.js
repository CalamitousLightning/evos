import { useEffect, useState } from "react"

export default function Dashboard(){

const [data,setData] = useState(null)
const [loading,setLoading] = useState(true)

const agentId = localStorage.getItem("agent_id")

const fetchDashboard = async () => {

try{

const res = await fetch(`https://evo-zobs.onrender.com/orders/agent-dashboard/${agentId}`)
const result = await res.json()

setData(result)

}catch(err){
console.log(err)
}

setLoading(false)

}

useEffect(()=>{
fetchDashboard()
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
<li>Edit Prices</li>
<li>Orders</li>
<li>Earnings</li>
<li>Withdraw</li>
<li>Apply for Admin</li>
</ul>
</div>

{/* 🔹 MAIN */}
<div className="flex-1 p-8 bg-gray-100">

<h1 className="text-2xl font-bold mb-6">
Agent Dashboard
</h1>

{loading ? (
<p>Loading...</p>
) : (

<>
{/* 🔥 TOP CARDS */}
<div className="grid grid-cols-3 gap-6 mb-6">

<div className="bg-white p-5 rounded shadow">
<h2>Wallet</h2>
<p className="text-xl font-bold">
GHS {data.earnings}
</p>
</div>

<div className="bg-white p-5 rounded shadow">
<h2>Total Orders</h2>
<p className="text-xl font-bold">
{data.total_orders}
</p>
</div>

<div className="bg-white p-5 rounded shadow">
<h2>Successful</h2>
<p className="text-xl font-bold">
{data.successful_orders}
</p>
</div>

</div>

{/* 🔥 SECOND ROW */}
<div className="grid grid-cols-2 gap-6">

<div className="bg-white p-5 rounded shadow">
<h2>Pending</h2>
<p className="text-xl font-bold">
{data.pending_orders}
</p>
</div>

<div className="bg-white p-5 rounded shadow">
<h2>Failed</h2>
<p className="text-xl font-bold">
{data.failed_orders}
</p>
</div>

</div>

</>

)}

</div>

</div>

)
}
