import React from 'react';
import { OrderStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' | 'accent';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs font-medium' : 'px-2.5 py-1 text-xs font-semibold';

  const variantClasses = {
    primary: 'bg-navy-100 text-navy-800 border-navy-200',
    secondary: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    neutral: 'bg-gray-100 text-gray-700 border-gray-200',
    accent: 'bg-orange-50 text-orange-700 border-orange-200',
  }[variant];

  return (
    <span
      className={`inline-flex items-center rounded-full border ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};

export const OrderStatusBadge: React.FC<{ status: OrderStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  switch (status) {
    case 'delivered':
      return <Badge variant="success" size={size}>Delivered</Badge>;
    case 'shipped':
      return <Badge variant="primary" size={size}>Shipped</Badge>;
    case 'out_for_delivery':
      return <Badge variant="accent" size={size}>Out for Delivery</Badge>;
    case 'processing':
      return <Badge variant="warning" size={size}>Processing</Badge>;
    case 'confirmed':
      return <Badge variant="secondary" size={size}>Confirmed</Badge>;
    case 'placed':
      return <Badge variant="neutral" size={size}>Placed</Badge>;
    case 'cancelled':
      return <Badge variant="danger" size={size}>Cancelled</Badge>;
    default:
      return <Badge variant="neutral" size={size}>{status}</Badge>;
  }
};

export const VendorStatusBadge: React.FC<{
  status: 'approved' | 'pending' | 'rejected' | 'suspended';
}> = ({ status }) => {
  switch (status) {
    case 'approved':
      return <Badge variant="success">Approved</Badge>;
    case 'pending':
      return <Badge variant="warning">Pending Approval</Badge>;
    case 'rejected':
      return <Badge variant="danger">Rejected</Badge>;
    case 'suspended':
      return <Badge variant="danger">Suspended</Badge>;
  }
};

export const StockBadge: React.FC<{ stock: number }> = ({ stock }) => {
  if (stock <= 0) {
    return <Badge variant="danger">Out of Stock</Badge>;
  }
  if (stock <= 10) {
    return <Badge variant="warning">Low Stock ({stock})</Badge>;
  }
  return <Badge variant="success">{stock} In Stock</Badge>;
};
