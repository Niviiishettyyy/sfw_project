import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const Leaderboard = () => {
  const { api, token } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api
      .get('/leaderboard', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setUsers(res.data))
      .catch(() => setUsers([]));
  }, []);

  return (
    <div className="section">
      <h2>Top Reporters</h2>
      <table className="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Points</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.points}</td>
              <td>{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
