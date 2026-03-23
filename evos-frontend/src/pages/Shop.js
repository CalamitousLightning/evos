import { useParams } from "react-router-dom"
import { useState } from "react"

export default function Shop(){

const { username } = useParams()

const [network,setNetwork] = useState("MTN")
const [phone,setPhone] = useState("")
const [bundle,setBundle] = useState("")
const [message,setMessage] = useState("")
const [loading,setLoading] = useState(false)

// 🔥 YOUR PAYSTACK KEY HERE
const PAYSTACK_KEY = "YOUR_PAYSTACK_PUBLIC_KEY"

const handleBuy = () => {

if(!phone || !bundle){
setMessage("Please fill all fields")
return
}

// ✅ CHECK IF PAYSTACK IS LOADED
if (!window.PaystackPop) {
  setMessage("Payment system not loaded. Refresh page.")
  return
}

setLoading(true)
setMessage("Initializing payment...")

const handler = window.PaystackPop.setup({
  key: PAYSTACK_KEY,
  email: `${phone}@evos.com`,
  amount: Number(bundle) * 100 * 100,
  currency: "GHS",
  ref: `${username}-${Date.now()}`,

  onClose: function(){
    setMessage("Payment cancelled")
    setLoading(false)
  },

  callback: async function(response){

    setMessage("Payment successful! Creating order...")

    try{
      const res = await fetch("https://evo-zobs.onrender.com/orders/create",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          agent_username: username,
          customer_phone: phone,
          network: network,
          bundle: bundle + "GB",
          amount: Number(bundle)
        })
      })

      const data = await res.json()

      if(!res.ok){
        setMessage(data.detail?.[0]?.msg || data.error || "Order failed")
        setLoading(false)
        return
      }

      setMessage("✅ Data purchase successful!")
      setPhone("")
      setBundle("")

    }catch(err){
      console.log(err)
      setMessage("Server error while creating order")
    }

    setLoading(false)
  }
})

handler.openIframe()
}


return(

<div className="flex justify-center items-center h-screen bg-gray-900">

<div className="bg-white p-8 rounded-xl shadow w-96">

<h1 className="text-2xl font-bold mb-4 text-center">
{username}'s Data Shop
</h1>

{message && (
<p className="text-center mb-4 text-sm">{message}</p>
)}

<select
className="border p-2 w-full mb-3"
value={network}
onChange={(e)=>setNetwork(e.target.value)}
>
<option>MTN</option>
<option>Telecel</option>
<option>AT</option>
</select>

<input
className="border p-2 w-full mb-3"
placeholder="Phone Number"
value={phone}
onChange={(e)=>setPhone(e.target.value)}
/>

<input
className="border p-2 w-full mb-4"
placeholder="Bundle (GB)"
value={bundle}
onChange={(e)=>setBundle(e.target.value)}
/>

<button
className="bg-green-600 text-white w-full p-2 rounded"
onClick={handleBuy}
disabled={loading}
>
{loading ? "Processing..." : "Buy Data"}
</button>

</div>

</div>

)
}