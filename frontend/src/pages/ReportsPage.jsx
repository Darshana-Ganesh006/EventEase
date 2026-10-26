import React, { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Calendar,
  Users,
  CheckCircle,
  BarChart3,
  Download,
  PieChart as PieIcon,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#4F7CFF', '#8B5CF6', '#22D3EE', '#10B981', '#F59E0B'];

const ReportsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await reportService.getOverview();
        setData(res);
      } catch (err) {
        setError(err.message || 'Failed to generate department reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleExportCSV = () => {
    if (!data || !data.eventReports) return;

    const headers = ['Event ID', 'Title', 'Category', 'Date', 'Capacity', 'Registrations', 'Attended', 'Attendance Rate %'];
    const rows = data.eventReports.map(e => [
      e.eventId,
      `"${e.title?.replace(/"/g, '""')}"`,
      e.category,
      e.eventDate,
      e.capacity,
      e.registrationsCount,
      e.attendedCount,
      `${e.attendancePercentage}%`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `EventEase_Department_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', minHeight: '60vh' }}>
        <LoadingSpinner text="Compiling academic event analytics & attendance statistics..." />
      </div>
    );
  }

  // Prepare chart datasets
  const categoryData = Object.entries(data?.categoryDistribution || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const statusData = Object.entries(data?.statusDistribution || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const eventBarData = (data?.eventReports || []).slice(0, 8).map(e => ({
    title: e.title?.length > 20 ? e.title.substring(0, 20) + '...' : e.title,
    registrations: e.registrationsCount,
    attended: e.attendedCount,
  }));

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <span className="badge badge-workshop" style={{ marginBottom: '0.4rem' }}>
            Academic Intelligence
          </span>
          <h1 style={{ fontSize: '2.25rem' }}>Department Reports & Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Audited metrics on student participation, event distributions, and verified completion rates.
          </p>
        </div>

        <button onClick={handleExportCSV} className="btn btn-primary">
          <Download size={18} /> Export CSV Report
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: '#EF4444', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        <StatCard
          icon={Calendar}
          label="Total Scheduled Events"
          value={data?.totalEvents || 0}
          subtext="Seminars & Workshops"
          gradient="linear-gradient(135deg, #4F7CFF 0%, #8B5CF6 100%)"
        />
        <StatCard
          icon={Users}
          label="Total Registrations"
          value={data?.totalRegistrations || 0}
          subtext="Confirmed student bookings"
          gradient="linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%)"
        />
        <StatCard
          icon={CheckCircle}
          label="Verified Attendances"
          value={data?.totalAttended || 0}
          subtext="Students marked Present"
          gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
        />
        <StatCard
          icon={TrendingUp}
          label="Overall Attendance Rate"
          value={`${data?.overallAttendanceRate || 0}%`}
          subtext="Across all completed sessions"
          gradient="linear-gradient(135deg, #22D3EE 0%, #4F7CFF 100%)"
        />
      </div>

      {/* Charts Section */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '2rem',
          marginBottom: '3rem',
        }}
      >
        {/* Bar Chart: Registrations vs Attendance */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <BarChart3 size={20} className="gradient-text" /> Participation Roster by Event
          </h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={eventBarData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis dataKey="title" stroke="var(--text-muted)" fontSize={11} angle={-15} textAnchor="end" />
                <YAxis stroke="var(--text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Bar dataKey="registrations" name="Registered" fill="#4F7CFF" radius={[4, 4, 0, 0]} />
                <Bar dataKey="attended" name="Attended" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart: Category Distribution */}
        <div className="card" style={{ padding: '1.75rem' }}>
          <h3 style={{ fontSize: '1.15rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieIcon size={20} className="gradient-text" /> Event Format Breakdown
          </h3>
          <div style={{ height: '300px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Comprehensive Report Breakdown Table */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.25rem' }}>
          Detailed Event Attendance Audit
        </h3>
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Event Title</th>
                <th>Category</th>
                <th>Event Date</th>
                <th>Capacity</th>
                <th>Registered</th>
                <th>Attended (Present)</th>
                <th>Completion Rate</th>
              </tr>
            </thead>
            <tbody>
              {(data?.eventReports || []).map((ev) => (
                <tr key={ev.eventId}>
                  <td style={{ fontWeight: 600 }}>{ev.title}</td>
                  <td>
                    <span className={`badge ${ev.category === 'Seminar' ? 'badge-seminar' : 'badge-workshop'}`}>
                      {ev.category}
                    </span>
                  </td>
                  <td>{ev.eventDate}</td>
                  <td>{ev.capacity}</td>
                  <td style={{ fontWeight: 600 }}>{ev.registrationsCount}</td>
                  <td style={{ color: '#10B981', fontWeight: 600 }}>{ev.attendedCount}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700 }}>{ev.attendancePercentage}%</span>
                      <div style={{ width: '60px', height: '6px', background: 'var(--bg-secondary)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${ev.attendancePercentage}%`, height: '100%', background: 'var(--brand-gradient)' }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
