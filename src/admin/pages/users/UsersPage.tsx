import React, { useState } from 'react';
import { ShieldCheck, Plus, UserCircle, Trash2 } from 'lucide-react';
import { userStorage } from '../../services/adminStorage';
import { useAdminStore } from '../../context/AdminStoreContext';
import type { AdminUser, AdminRole } from '../../types/admin.types';

const ROLES: AdminRole[] = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'CONTENT_EDITOR'];

export function UsersPage() {
  const { showToast, logAudit } = useAdminStore();
  const [users, setUsers] = useState<AdminUser[]>(() => userStorage.getAll());
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('STAFF');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;
    const created = userStorage.create({ name, email, role });
    setUsers(userStorage.getAll());
    logAudit('created', 'user', created.id, `Created team member ${name} (${role})`);
    showToast('success', 'User added', `${name} added as ${role}`);
    setName(''); setEmail(''); setShowAdd(false);
  };

  const handleDelete = (u: AdminUser) => {
    if (users.length <= 1) {
      showToast('error', 'Cannot delete', 'Must have at least one admin user.');
      return;
    }
    userStorage.delete(u.id);
    setUsers(userStorage.getAll());
    logAudit('deleted', 'user', u.id, `Deleted team member ${u.name}`);
    showToast('success', 'User removed');
  };

  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1A1A1A]">Users & Roles</h1>
          <p className="text-sm text-[#9E968C]">Manage administrative team access and permissions</p>
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0F2747] text-white text-xs font-semibold hover:bg-[#0B1D3A]"
        >
          <Plus size={14} /> Add Staff Member
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAddUser} className="bg-white border border-[#E5E2DC] rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-[#1A1A1A]">Add New User</h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#5A544E] mb-1.5">Name</label>
              <input className="w-full h-10 px-3 rounded-xl border border-[#E5E2DC] text-sm" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5A544E] mb-1.5">Email</label>
              <input type="email" className="w-full h-10 px-3 rounded-xl border border-[#E5E2DC] text-sm" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@holisticedge.in" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#5A544E] mb-1.5">Role</label>
              <select className="w-full h-10 px-3 rounded-xl border border-[#E5E2DC] text-sm" value={role} onChange={e => setRole(e.target.value as AdminRole)}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="px-3 py-1.5 text-xs text-[#5A544E]">Cancel</button>
            <button type="submit" className="px-4 py-1.5 bg-[#1A1A1A] text-white text-xs font-semibold rounded-xl">Save User</button>
          </div>
        </form>
      )}

      <div className="bg-white border border-[#E5E2DC] rounded-2xl overflow-hidden divide-y divide-[#F0ECE4]">
        {users.map(u => (
          <div key={u.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0F2747] text-white font-bold flex items-center justify-center text-sm">
                {u.name.charAt(0)}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1A1A1A]">{u.name}</p>
                <p className="text-xs text-[#9E968C]">{u.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs bg-[#F4F1EA] text-[#5A544E] px-2.5 py-1 rounded-lg font-medium">{u.role}</span>
              {users.length > 1 && (
                <button onClick={() => handleDelete(u)} className="text-red-500 hover:text-red-700 p-1">
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
