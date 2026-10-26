import React, { useState, useEffect } from 'react';
import { dashboardService } from '../services/dashboardService';
import { adminService } from '../services/adminService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  ShieldAlert,
  Users,
  GraduationCap,
  Calendar,
  Search,
  CheckCircle2,
  XCircle,
  UserCog,
  Power,
  RotateCcw,
} from 'lucide-react';

const AdminDashboardPage = () => {
  const { user: currentUser } = useAuth();
  const { showToast } = useToast();

  const [dashboardData, setDashboardData] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Dialog state for role change or status change
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [dash, userList] = await Promise.all([
        dashboardService.getAdminDashboard(),
        adminService.getAllUsers({ role: roleFilter !== 'ALL' ? roleFilter : undefined }),
      ]);
      setDashboardData(dash);
      setUsers(userList);
    } catch (err) {
      showToast(err.message || 'Failed to load administration controls', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleFilter]);

  const handleRoleChange = (userId, currentRole, newRole) => {
    if (userId === currentUser?.id && newRole !== 'ADMIN') {
      showToast('You cannot demote your own administrator privileges.', 'error');
      return;
    }

    setConfirmDialog({
      isOpen: true,
      title: 'Update User Role',
      message: `Are you sure you want to change this user's role from ${currentRole} to ${newRole}?`,
      onConfirm: async () => {
        try {
          await adminService.updateUserRole(userId, newRole);
          showToast(`User role updated to ${newRole}`, 'success');
          setConfirmDialog({ isOpen: false });
          fetchData();
        } catch (err) {
          showToast(err.message || 'Failed to update role', 'error');
        }
      },
    });
  };

  const handleStatusToggle = (userId, currentActive) => {
    if (userId === currentUser?.id && currentActive) {
      showToast('You cannot deactivate your own account.', 'error');
      return;
    }

    const nextState = !currentActive;
    setConfirmDialog({
      isOpen: true,
      title: `${nextState ? 'Activate' : 'Deactivate'} User Account`,
      message: `Are you sure you want to ${nextState ? 'activate' : 'deactivate'} this user account? ${!nextState ? 'They will no longer be able to log in.' : ''}`,
      onConfirm: async () => {
        try {
          await adminService.updateUserStatus(userId, nextState);
          showToast(`Account successfully ${nextState ? 'activated' : 'deactivated'}`, 'info');
          setConfirmDialog({ isOpen: false });
          fetchData();
        } catch (err) {
          showToast(err.message || 'Status update failed', 'error');
        }
      },
    });
  };

  const filteredUsers = users.filter((u) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      u.fullName?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.department?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="container" style={{ padding: '5rem 1.5rem', minHeight: '60vh' }}>
        <LoadingSpinner text="Retrieving administrative oversight metrics..." />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 5rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '2.5rem' }}>
        <span className="badge badge-seminar" style={{ marginBottom: '0.4rem' }}>
          Root System Administration
        </span>
        <h1 style={{ fontSize: '2.25rem' }}>Administrator Dashboard</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          System-wide governance, user role assignments, account statuses, and institutional event summaries.
        </p>
      </div>

      {/* System Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem',
        }}
      >
        <StatCard
          icon={Users}
          label="Total Registered Users"
          value={dashboardData?.totalUsers || 0}
          subtext={`${dashboardData?.totalStudents || 0} Students • ${dashboardData?.totalOrganizers || 0} Faculty`}
          gradient="linear-gradient(135deg, #4F7CFF 0%, #8B5CF6 100%)"
        />
        <StatCard
          icon={Calendar}
          label="Total Events"
          value={dashboardData?.totalEvents || 0}
          subtext={`${dashboardData?.upcomingEvents || 0} Upcoming • ${dashboardData?.completedEvents || 0} Completed`}
          gradient="linear-gradient(135deg, #8B5CF6 0%, #22D3EE 100%)"
        />
        <StatCard
          icon={GraduationCap}
          label="Total Registrations"
          value={dashboardData?.totalRegistrations || 0}
          subtext="Active student bookings"
          gradient="linear-gradient(135deg, #22D3EE 0%, #4F7CFF 100%)"
        />
        <StatCard
          icon={CheckCircle2}
          label="Overall Attendance Rate"
          value={`${dashboardData?.overallAttendanceRate || 0}%`}
          subtext={`${dashboardData?.totalAttended || 0} sessions attended`}
          gradient="linear-gradient(135deg, #10B981 0%, #34D399 100%)"
        />
      </div>

      {/* User Management Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>User Roster & Role Governance</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              Assign or update privileges (ADMIN, ORGANISER, STUDENT) and manage account activity.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '240px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Search name, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '2.4rem' }}
              />
              <Search
                size={16}
                style={{
                  position: 'absolute',
                  left: '0.85rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)',
                }}
              />
            </div>

            <select
              className="form-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ minWidth: '140px' }}
            >
              <option value="ALL">All Roles</option>
              <option value="STUDENT">Students</option>
              <option value="ORGANISER">Organizers</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>

        {/* User Management Table */}
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Academic Email</th>
                <th>Department</th>
                <th>Current Role</th>
                <th>Account Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => {
                const isSelf = u.id === currentUser?.id;

                return (
                  <tr key={u.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>
                        {u.fullName} {isSelf && <span style={{ fontSize: '0.75rem', color: 'var(--primary-blue)' }}>(You)</span>}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        ID #{u.id}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{u.email}</td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{u.department}</td>
                    <td>
                      <select
                        className="form-select"
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, u.role, e.target.value)}
                        disabled={isSelf}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem', minWidth: '120px' }}
                      >
                        <option value="STUDENT">STUDENT</option>
                        <option value="ORGANISER">ORGANISER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td>
                      {u.active ? (
                        <span className="badge badge-ongoing" style={{ fontSize: '0.75rem' }}>
                          Active
                        </span>
                      ) : (
                        <span className="badge badge-cancelled" style={{ fontSize: '0.75rem' }}>
                          Deactivated
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(u.id, u.active)}
                        disabled={isSelf}
                        className={`btn btn-sm ${u.active ? 'btn-ghost' : 'btn-outline'}`}
                        style={{
                          color: u.active ? '#EF4444' : '#10B981',
                          padding: '0.35rem 0.65rem',
                        }}
                        title={u.active ? 'Deactivate account' : 'Activate account'}
                      >
                        <Power size={14} /> {u.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog({ isOpen: false })}
      />
    </div>
  );
};

export default AdminDashboardPage;
