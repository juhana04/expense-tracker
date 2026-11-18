import { useEffect, useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../api.js';

const CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];
const COLORS = ['#6366f1', '#22c55e', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899', '#94a3b8'];
const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = { title: '', amount: '', category: 'Food', date: today() };

export default function Dashboard({ user, onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [month, setMonth] = useState(''); // "" = all time, or "2026-11"
  const [error, setError] = useState('');

  const load = async () => {
    try {
      setExpenses(await api('/expenses'));
    } catch (err) {
      if (err.message.includes('log in')) onLogout();
      else setError(err.message);
    }
  };

  useEffect(() => { load(); }, []);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = { ...form, amount: Number(form.amount) };
      if (editId) await api('/expenses/' + editId, 'PUT', payload);
      else await api('/expenses', 'POST', payload);
      setForm(emptyForm);
      setEditId(null);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const startEdit = (x) => {
    setEditId(x._id);
    setForm({ title: x.title, amount: x.amount, category: x.category, date: x.date.slice(0, 10) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => { setEditId(null); setForm(emptyForm); };

  const remove = async (id) => {
    if (!confirm('Delete this expense?')) return;
    try { await api('/expenses/' + id, 'DELETE'); load(); } catch (err) { setError(err.message); }
  };

  const visible = useMemo(
    () => (month ? expenses.filter((x) => x.date.startsWith(month)) : expenses),
    [expenses, month]
  );

  const total = visible.reduce((sum, x) => sum + x.amount, 0);

  const chartData = useMemo(() => {
    const totals = {};
    visible.forEach((x) => { totals[x.category] = (totals[x.category] || 0) + x.amount; });
    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [visible]);

  const fmt = (n) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 2 });

  return (
    <div className="container">
      <header className="top">
        <h1>💸 Expense Tracker</h1>
        <div>
          <span className="muted">Hi, {user.name} </span>
          <button onClick={onLogout}>Logout</button>
        </div>
      </header>

      <div className="grid">
        <section className="card">
          <h2>{editId ? 'Edit expense' : 'Add expense'}</h2>
          <form onSubmit={submit}>
            <input name="title" placeholder="What did you spend on?" value={form.title} onChange={change} required />
            <input name="amount" type="number" step="0.01" min="0.01" placeholder="Amount" value={form.amount} onChange={change} required />
            <select name="category" value={form.category} onChange={change}>
              {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
            <input name="date" type="date" value={form.date} onChange={change} required />
            {error && <div className="error">{error}</div>}
            <button className="primary">{editId ? 'Save changes' : 'Add expense'}</button>
            {editId && <button type="button" onClick={cancelEdit}>Cancel</button>}
          </form>
        </section>

        <section className="card">
          <div className="row">
            <h2>Summary</h2>
            <div>
              <input type="month" value={month} onChange={(e) => setMonth(e.target.value)} />
              {month && <button onClick={() => setMonth('')}>All time</button>}
            </div>
          </div>
          <p className="total">{fmt(total)}</p>
          <p className="muted">{visible.length} expense(s){month ? ' in selected month' : ' in total'}</p>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={85} label>
                  {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v) => fmt(v)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="muted">No data to chart yet.</p>
          )}
        </section>
      </div>

      <section className="card">
        <h2>Expenses</h2>
        {visible.length === 0 ? (
          <p className="muted">Nothing here yet. Add your first expense above.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Date</th><th>Title</th><th>Category</th><th className="right">Amount</th><th></th></tr>
              </thead>
              <tbody>
                {visible.map((x) => (
                  <tr key={x._id}>
                    <td>{x.date.slice(0, 10)}</td>
                    <td>{x.title}</td>
                    <td><span className="tag">{x.category}</span></td>
                    <td className="right">{fmt(x.amount)}</td>
                    <td className="right">
                      <button onClick={() => startEdit(x)}>Edit</button>{' '}
                      <button className="danger" onClick={() => remove(x._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
