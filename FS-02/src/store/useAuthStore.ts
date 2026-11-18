import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole, Address } from '../types';
import { initialCustomers } from '../data/seedData';

interface AuthState {
  currentUser: User | null;
  role: UserRole;
  selectedVendorId: string; // for vendor view
  loginAs: (role: UserRole, email?: string, vendorId?: string) => void;
  logout: () => void;
  updateProfile: (updatedData: Partial<User>) => void;
  addAddress: (address: Address) => void;
  removeAddress: (index: number) => void;
  setDefaultAddress: (index: number) => void;
}

export const demoUsers: Record<UserRole, User> = {
  customer: {
    id: 'cust-1',
    name: 'Sarah Jenkins',
    email: 'customer@markethub.com',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (555) 123-4567',
    address: {
      fullName: 'Sarah Jenkins',
      phone: '+1 (555) 123-4567',
      street: '742 Evergreen Terrace',
      city: 'Springfield',
      state: 'OR',
      postalCode: '97477',
      country: 'United States',
      isDefault: true,
    },
    savedAddresses: [
      {
        fullName: 'Sarah Jenkins',
        phone: '+1 (555) 123-4567',
        street: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        postalCode: '97477',
        country: 'United States',
        isDefault: true,
      },
      {
        fullName: 'Sarah Jenkins (Office)',
        phone: '+1 (555) 987-6543',
        street: '100 Tech Boulevard, Suite 400',
        city: 'Portland',
        state: 'OR',
        postalCode: '97201',
        country: 'United States',
        isDefault: false,
      },
    ],
    createdAt: '2023-02-14',
  },
  vendor: {
    id: 'ven-user-1',
    name: 'Alex Rivera',
    email: 'vendor@markethub.com',
    role: 'vendor',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (555) 234-5678',
    vendorId: 'ven-1',
    createdAt: '2023-01-15',
  },
  admin: {
    id: 'admin-1',
    name: 'Eleanor Vance',
    email: 'admin@markethub.com',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    phone: '+1 (555) 000-1122',
    createdAt: '2022-11-01',
  },
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: demoUsers.customer,
      role: 'customer',
      selectedVendorId: 'ven-1',

      loginAs: (role: UserRole, email?: string, vendorId?: string) => {
        let user = { ...demoUsers[role] };
        if (email) user.email = email;
        if (vendorId) user.vendorId = vendorId;

        set({
          currentUser: user,
          role: role,
          selectedVendorId: vendorId || (role === 'vendor' ? user.vendorId || 'ven-1' : get().selectedVendorId),
        });
      },

      logout: () => {
        set({
          currentUser: null,
          role: 'customer',
        });
      },

      updateProfile: (updatedData: Partial<User>) => {
        const current = get().currentUser;
        if (!current) return;
        set({
          currentUser: {
            ...current,
            ...updatedData,
          },
        });
      },

      addAddress: (address: Address) => {
        const current = get().currentUser;
        if (!current) return;
        const currentAddresses = current.savedAddresses || [];
        const updated = [...currentAddresses, address];
        set({
          currentUser: {
            ...current,
            address: current.address || address,
            savedAddresses: updated,
          },
        });
      },

      removeAddress: (index: number) => {
        const current = get().currentUser;
        if (!current || !current.savedAddresses) return;
        const updated = current.savedAddresses.filter((_, i) => i !== index);
        set({
          currentUser: {
            ...current,
            address: updated.length > 0 ? updated[0] : undefined,
            savedAddresses: updated,
          },
        });
      },

      setDefaultAddress: (index: number) => {
        const current = get().currentUser;
        if (!current || !current.savedAddresses) return;
        const updated = current.savedAddresses.map((addr, i) => ({
          ...addr,
          isDefault: i === index,
        }));
        set({
          currentUser: {
            ...current,
            address: updated[index],
            savedAddresses: updated,
          },
        });
      },
    }),
    {
      name: 'markethub-auth-storage',
    }
  )
);
