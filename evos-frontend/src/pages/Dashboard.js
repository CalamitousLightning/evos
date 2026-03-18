export default function Dashboard(){

return(

<div className="p-10">

<h1 className="text-3xl font-bold mb-6">
EVOS Agent Dashboard
</h1>

<div className="grid grid-cols-3 gap-6">

<div className="bg-white shadow p-6 rounded">
<h2 className="text-lg">Wallet Balance</h2>
<p className="text-2xl font-bold mt-2">GHS 0.00</p>
</div>

<div className="bg-white shadow p-6 rounded">
<h2 className="text-lg">Today's Sales</h2>
<p className="text-2xl font-bold mt-2">0 Orders</p>
</div>

<div className="bg-white shadow p-6 rounded">
<h2 className="text-lg">Total Orders</h2>
<p className="text-2xl font-bold mt-2">0</p>
</div>

<br> 
<a href="/buy-data" className= "bg-green-600 text-white px-6 py-2 rounded mt-6 inline-block">Buy Data</a>
</br>

</div>

</div>

)

}