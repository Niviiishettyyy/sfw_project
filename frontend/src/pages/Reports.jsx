import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const defaultForm = {
  title: '',
  description: '',
  severity: 'low',
  attachments: []
};

const Reports = () => {
  const { api, token, user } = useAuth();
  const [reports, setReports] = useState([]);
  const [form, setForm] = useState(defaultForm);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchReports = () => {
    api
      .get('/reports', { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setReports(res.data))
      .catch(() => setReports([]));
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm((prev) => ({ ...prev, attachments: files }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('severity', form.severity);
    Array.from(form.attachments).forEach((file) => formData.append('attachments', file));
    try {
      await api.post('/reports', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      setForm(defaultForm);
      fetchReports();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (report) => {
    setLoading(true);
    try {
      await api.put(`/reports/${report._id}`, report, { headers: { Authorization: `Bearer ${token}` } });
      fetchReports();
      setSelected(null);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await api.delete(`/reports/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchReports();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {user?.role === 'reporter' && (
        <div className="section">
          <h2>Submit Report</h2>
          <form onSubmit={handleSubmit}>
            <input name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" required />
            <select name="severity" value={form.severity} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <input name="attachments" type="file" multiple onChange={handleChange} />
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      )}
      <div className="section">
        <h2>Reports</h2>
        {reports.map((report) => (
          <div key={report._id} className="card">
            {selected === report._id ? (
              <ReportEditor
                report={report}
                onChange={(updated) => setReports((prev) => prev.map((r) => (r._id === report._id ? updated : r)))}
                onSave={handleUpdate}
                onCancel={() => setSelected(null)}
                role={user?.role}
              />
            ) : (
              <ReportView report={report} onEdit={() => setSelected(report._id)} onDelete={() => handleDelete(report._id)} role={user?.role} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ReportView = ({ report, onEdit, onDelete, role }) => (
  <div>
    <h3>{report.title}</h3>
    <p>{report.description}</p>
    <p>
      Severity: <span className="badge">{report.severity}</span>
    </p>
    <p>Status: {report.status}</p>
    <p>Reward: {report.reward}</p>
    {role === 'admin' && <p>Reporter: {report.reporter?.name}</p>}
    {report.attachments?.length > 0 && (
      <ul>
        {report.attachments.map((file, i) => (
          <li key={i}>
            <a href={`http://localhost:5000${file}`} target="_blank" rel="noreferrer">
              Attachment {i + 1}
            </a>
          </li>
        ))}
      </ul>
    )}
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={onEdit}>Edit</button>
      {role === 'admin' && (
        <button onClick={onDelete} style={{ background: '#ef4444' }}>
          Delete
        </button>
      )}
    </div>
  </div>
);

const ReportEditor = ({ report, onSave, onCancel, onChange, role }) => {
  const [data, setData] = useState(report);

  const updateField = (field, value) => {
    setData((prev) => {
      const updated = { ...prev, [field]: value };
      onChange(updated);
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={data.title} onChange={(e) => updateField('title', e.target.value)} />
      <textarea value={data.description} onChange={(e) => updateField('description', e.target.value)} />
      <select value={data.severity} onChange={(e) => updateField('severity', e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
        <option value="critical">Critical</option>
      </select>
      {role === 'admin' && (
        <>
          <select value={data.status} onChange={(e) => updateField('status', e.target.value)}>
            <option value="open">Open</option>
            <option value="review">In Review</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
          <input type="number" value={data.reward} onChange={(e) => updateField('reward', Number(e.target.value))} placeholder="Reward points" />
        </>
      )}
      <div style={{ display: 'flex', gap: '8px' }}>
        <button type="submit">Save</button>
        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default Reports;
