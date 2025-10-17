import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Dashboard = () => {
  const { api, token, user } = useAuth();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api
      .get('/reports', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setReports(res.data))
      .catch(() => setReports([]));
  }, [api, token]);

  return (
    <div>
      <div className="section">
        <h2>Welcome back, {user?.name}</h2>
        <p>Role: {user?.role}</p>
        <p>Points: {user?.points}</p>
      </div>
      <div className="section">
        <h3>Latest Reports</h3>
        {reports.slice(0, 5).map((report) => (
          <div key={report._id} className="card">
            <h4>{report.title}</h4>
            <p>{report.description}</p>
            <p>
              Severity: <span className="badge">{report.severity}</span>
            </p>
            <p>Status: {report.status}</p>
            {user?.role === 'admin' && <p>Reporter: {report.reporter?.name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
