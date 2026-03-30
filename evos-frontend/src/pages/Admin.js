import { useEffect, useState } from "react";

export default function Admin() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Admin ID or token can be used if needed
  const adminId = localStorage.getItem("admin_id");

  const fetchDashboard = async () => {
    try {
      // Replace with your real endpoint
      const res = await fetch(`https://evo-zobs.onrender.com/admin/dashboard/${adminId}`);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.log(err);
      // Fallback data if backend isn't ready yet
      setData({
        total_agents: 12,
        total_orders: 45,
        successful_orders: 30,
        pending_orders: 10,
        failed_orders: 5,
        total_earnings: 1250.5,
        agents: [
          { id: 1, username: "AgentA", wallet: 150, total_orders: 10, status: "Active" },
          { id: 2, username: "AgentB", wallet: 120, total_orders: 8, status: "Active" },
        ],
        orders: [
          { id: 101, agent: "AgentA", customer: "024XXXXXXX", bundle: "3GB", amount: 15, status: "Success", date: "2026-03-30" },
          { id: 102, agent: "AgentB", customer: "055XXXXXXX", bundle: "5GB", amount: 27, status: "Pending", date: "2026-03-30" },
        ]
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* 🔹 SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">EVOS Admin</h2>
        <ul className="space-y-4">
          <li>Dashboard</li>
          <li>Agents</li>
          <li>Orders</li>
          <li>Withdraw Requests</li>
          <li>Apply for Founder</li>
        </ul>
      </div>

      {/* 🔹 MAIN */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* 🔹 TOP CARDS */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-5 rounded shadow">
                <h2>Total Agents</h2>
                <p className="text-xl font-bold">{data.total_agents}</p>
              </div>

              <div className="bg-white p-5 rounded shadow">
                <h2>Total Orders</h2>
                <p className="text-xl font-bold">{data.total_orders}</p>
              </div>

              <div className="bg-white p-5 rounded shadow">
                <h2>Successful Orders</h2>
                <p className="text-xl font-bold">{data.successful_orders}</p>
              </div>
            </div>

            {/* 🔹 SECOND ROW */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-5 rounded shadow">
                <h2>Pending Orders</h2>
                <p className="text-xl font-bold">{data.pending_orders}</p>
              </div>

              <div className="bg-white p-5 rounded shadow">
                <h2>Failed Orders</h2>
                <p className="text-xl font-bold">{data.failed_orders}</p>
              </div>

              <div className="bg-white p-5 rounded shadow">
                <h2>Total Earnings</h2>
                <p className="text-xl font-bold">GHS {data.total_earnings}</p>
              </div>
            </div>

            {/* 🔹 AGENTS TABLE */}
            <div className="bg-white p-5 rounded shadow mb-6">
              <h2 className="text-lg font-bold mb-3">Agents List</h2>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">ID</th>
                    <th className="border p-2">Username</th>
                    <th className="border p-2">Wallet</th>
                    <th className="border p-2">Total Orders</th>
                    <th className="border p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data.agents.map(agent => (
                    <tr key={agent.id}>
                      <td className="border p-2">{agent.id}</td>
                      <td className="border p-2">{agent.username}</td>
                      <td className="border p-2">GHS {agent.wallet}</td>
                      <td className="border p-2">{agent.total_orders}</td>
                      <td className="border p-2">{agent.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* 🔹 ORDERS TABLE */}
            <div className="bg-white p-5 rounded shadow mb-6">
              <h2 className="text-lg font-bold mb-3">Recent Orders</h2>
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Order ID</th>
                    <th className="border p-2">Agent</th>
                    <th className="border p-2">Customer</th>
                    <th className="border p-2">Bundle</th>
                    <th className="border p-2">Amount</th>
                    <th className="border p-2">Status</th>
                    <th className="border p-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.orders.map(order => (
                    <tr key={order.id}>
                      <td className="border p-2">{order.id}</td>
                      <td className="border p-2">{order.agent}</td>
                      <td className="border p-2">{order.customer}</td>
                      <td className="border p-2">{order.bundle}</td>
                      <td className="border p-2">GHS {order.amount}</td>
                      <td className="border p-2">{order.status}</td>
                      <td className="border p-2">{order.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
