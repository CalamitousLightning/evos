import { useEffect, useState } from "react";

export default function Founder() {
  const [loading, setLoading] = useState(true);
  const [pendingAgents, setPendingAgents] = useState([]);
  const [stats, setStats] = useState({
    total_agents: 0,
    total_orders: 0,
    successful_orders: 0,
    pending_orders: 0,
    failed_orders: 0,
    total_earnings: 0
  });

  const token = localStorage.getItem("token");

  // 🔹 Fetch high-level stats
  const fetchStats = async () => {
    try {
      const res = await fetch("https://evo-zobs.onrender.com/founder/stats", {
        headers: {
          "Authorization": token ? `Bearer ${token}` : ""
        }
      });
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.log("ERROR fetching stats:", err);
    }
  };

  // 🔹 Fetch pending agents
  const fetchPendingAgents = async () => {
    try {
      const res = await fetch("https://evo-zobs.onrender.com/founder/pending-agents", {
        headers: {
          "Authorization": token ? `Bearer ${token}` : ""
        }
      });
      const data = await res.json();
      setPendingAgents(data);
    } catch (err) {
      console.log("ERROR fetching agents:", err);
    }
    setLoading(false);
  };

  // 🔹 Approve an agent
  const approveAgent = async (id) => {
    try {
      await fetch(`https://evo-zobs.onrender.com/founder/approve-agent/${id}`, {
        method: "POST",
        headers: {
          "Authorization": token ? `Bearer ${token}` : ""
        }
      });
      fetchPendingAgents(); // Refresh list
    } catch (err) {
      console.log("ERROR approving agent:", err);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPendingAgents();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="flex min-h-screen">
      {/* 🔹 SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">EVOS Founder</h2>
        <ul className="space-y-4">
          <li>Dashboard</li>
          <li>Pending Agents</li>
          <li>Orders</li>
          <li>Platform Stats</li>
        </ul>
      </div>

      {/* 🔹 MAIN */}
      <div className="flex-1 p-8 bg-gray-100">
        <h1 className="text-2xl font-bold mb-6">Founder Dashboard</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* 🔹 TOP CARDS: System Stats */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-5 rounded shadow">
                <h2>Total Agents</h2>
                <p className="text-xl font-bold">{stats.total_agents}</p>
              </div>

              <div className="bg-white p-5 rounded shadow">
                <h2>Total Orders</h2>
                <p className="text-xl font-bold">{stats.total_orders}</p>
              </div>

              <div className="bg-white p-5 rounded shadow">
                <h2>Successful Orders</h2>
                <p className="text-xl font-bold">{stats.successful_orders}</p>
              </div>
            </div>

            {/* 🔹 SECOND ROW */}
            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="bg-white p-5 rounded shadow">
                <h2>Pending Orders</h2>
                <p className="text-xl font-bold">{stats.pending_orders}</p>
              </div>

              <div className="bg-white p-5 rounded shadow">
                <h2>Failed Orders</h2>
                <p className="text-xl font-bold">{stats.failed_orders}</p>
              </div>

              <div className="bg-white p-5 rounded shadow">
                <h2>Total Earnings</h2>
                <p className="text-xl font-bold">GHS {stats.total_earnings}</p>
              </div>
            </div>

            {/* 🔹 PENDING AGENTS TABLE */}
            <div className="bg-white p-5 rounded shadow mb-6">
              <h2 className="text-lg font-bold mb-3">Pending Agents</h2>
              {pendingAgents.length === 0 ? (
                <p>No pending agents</p>
              ) : (
                pendingAgents.map(agent => (
                  <div key={agent.id} className="border p-4 mb-3 flex justify-between items-center">
                    <div>
                      <p><b>Username:</b> {agent.username}</p>
                      <p><b>Full Name:</b> {agent.full_name}</p>
                      <p><b>Phone:</b> {agent.phone}</p>
                    </div>
                    <button
                      className="bg-green-600 text-white px-4 py-1 rounded"
                      onClick={() => approveAgent(agent.id)}
                    >
                      Approve
                    </button>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
