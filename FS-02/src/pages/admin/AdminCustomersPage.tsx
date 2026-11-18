import React, { useState } from 'react';
import { useMarketStore } from '../../store/useMarketStore';
import { Modal } from '../../components/common/Modal';
import { User } from '../../types';
import {
  Users,
  Search,
  Mail,
  Phone,
  ShoppingBag,
  Eye,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export const AdminCustomersPage: React.FC = () => {
  const { customers, orders } = useMarketStore();
  const [search, setSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

  const filtered = customers.filter((c) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const getCustomerOrders = (customer: User) => {
    return orders.filter(
      (o) => o.customerEmail === customer.email || o.customerId === customer.id
    );
  };

  const getCustomerSpend = (customer: User) => {
    const custOrders = getCustomerOrders(customer);
    return custOrders
      .filter((o) => o.orderStatus !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Customer Accounts Directory
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          View registered shopper profiles, transaction lifetime value, and order history ({customers.length} Accounts)
        </p>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by customer name, email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-transparent text-xs text-slate-900 outline-none"
        />
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase font-bold text-slate-400 bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Primary Destination</th>
                <th className="py-3.5 px-4">Total Orders</th>
                <th className="py-3.5 px-4">Lifetime Spend</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((customer) => {
                const custOrders = getCustomerOrders(customer);
                const spend = getCustomerSpend(customer);

                return (
                  <tr key={customer.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={customer.avatar}
                          alt={customer.name}
                          className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-slate-900">{customer.name}</p>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {customer.id}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-800">{customer.email}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{customer.phone}</div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {customer.address ? `${customer.address.city}, ${customer.address.state}` : 'N/A'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">
                        {custOrders.length}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-black text-slate-900">
                      ${spend.toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">{customer.createdAt}</td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedCustomer(customer)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1 ml-auto"
                      >
                        <Eye className="w-3.5 h-3.5" /> View Activity
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Profile: ${selectedCustomer.name}`}
          subtitle={`Account ID: ${selectedCustomer.id}`}
          maxWidth="2xl"
        >
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <img
                src={selectedCustomer.avatar}
                alt={selectedCustomer.name}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-300"
              />
              <div className="text-xs space-y-1">
                <h4 className="text-base font-bold text-slate-900">{selectedCustomer.name}</h4>
                <p className="text-slate-500 font-mono">{selectedCustomer.email}</p>
                <p className="text-slate-500">{selectedCustomer.phone || 'No phone recorded'}</p>
              </div>
            </div>

            {/* Past Orders */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Order Activity ({getCustomerOrders(selectedCustomer).length} Orders)
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {getCustomerOrders(selectedCustomer).map((ord) => (
                  <div
                    key={ord.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-slate-900">{ord.orderNumber}</span>
                      <span className="text-slate-400 ml-2">({ord.items.length} items)</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">{ord.createdAt.split('T')[0]}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-900 block">${ord.total.toFixed(2)}</span>
                      <span className="text-[10px] uppercase font-bold text-brand-secondary">
                        {ord.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
