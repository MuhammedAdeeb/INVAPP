'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('products');
  
  // Data States
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [newProduct, setNewProduct] = useState({ name: '', price: '', quantity: '' });
  const [newCustomer, setNewCustomer] = useState({ name: '', phone: '', address: '' });

  // Initial Data Fetch
  useEffect(() => {
    Promise.all([
      fetch('/api/products').then(res => res.json()),
      fetch('/api/customers').then(res => res.json())
    ]).then(([productsData, customersData]) => {
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCustomers(Array.isArray(customersData) ? customersData : []);
      setLoading(false);
    }).catch(err => console.error("Failed to load database", err));
  }, []);

  // --- Handlers ---

  const addProduct = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newProduct,
        price: parseFloat(newProduct.price),
        quantity: parseInt(newProduct.quantity),
      }),
    });
    if (res.ok) {
      const addedProduct = await res.json();
      setProducts([addedProduct, ...products]);
      setNewProduct({ name: '', price: '', quantity: '' });
    }
  };

  const addCustomer = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newCustomer),
    });
    if (res.ok) {
      const addedCustomer = await res.json();
      setCustomers([addedCustomer, ...customers]);
      setNewCustomer({ name: '', phone: '', address: '' });
    }
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col p-6 hidden md:flex">
        <h1 className="text-2xl font-bold mb-8 text-indigo-400">NexTrack</h1>
        <nav className="space-y-2">
          <button 
            onClick={() => setActiveTab('products')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'products' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Products
          </button>
          <button 
            onClick={() => setActiveTab('customers')}
            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'customers' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}
          >
            Customers
          </button>
        </nav>
      </aside>

      {/* Main View Area */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 capitalize">{activeTab} Dashboard</h2>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64 text-slate-500 text-lg animate-pulse">
            Connecting to MongoDB...
          </div>
        ) : (
          <>
            {/* --- PRODUCTS VIEW --- */}
            {activeTab === 'products' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-sm font-medium">Total Products</p>
                    <p className="text-3xl font-bold text-slate-800">{products.length}</p>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <p className="text-slate-500 text-sm font-medium">Total Inventory Value</p>
                    <p className="text-3xl font-bold text-emerald-600">${totalValue.toFixed(2)}</p>
                  </div>
                </div>

                {/* Add Product Form */}
                <form onSubmit={addProduct} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-600 mb-1">Product Name</label>
                    <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Price ($)</label>
                    <input required type="number" step="0.01" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Quantity</label>
                    <input required type="number" value={newProduct.quantity} onChange={e => setNewProduct({...newProduct, quantity: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <button type="submit" className="md:col-span-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Save Product
                  </button>
                </form>

                {/* Products Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 text-sm uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Price</th>
                        <th className="p-4 font-medium">Quantity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {products.map((product) => (
                        <tr key={product._id} className="hover:bg-slate-50">
                          <td className="p-4 font-medium text-slate-800">{product.name}</td>
                          <td className="p-4 text-slate-600">${product.price.toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.quantity < 10 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                              {product.quantity}
                            </span>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && (
                        <tr><td colSpan="3" className="p-4 text-center text-slate-500">No products found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* --- CUSTOMERS VIEW --- */}
            {activeTab === 'customers' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                 {/* Stats */}
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 w-full md:w-1/2">
                    <p className="text-slate-500 text-sm font-medium">Total Customers</p>
                    <p className="text-3xl font-bold text-slate-800">{customers.length}</p>
                  </div>

                {/* Add Customer Form */}
                <form onSubmit={addCustomer} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Full Name</label>
                    <input required type="text" value={newCustomer.name} onChange={e => setNewCustomer({...newCustomer, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Phone Number</label>
                    <input required type="text" value={newCustomer.phone} onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Address</label>
                    <input required type="text" value={newCustomer.address} onChange={e => setNewCustomer({...newCustomer, address: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <button type="submit" className="md:col-span-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                    Save Customer
                  </button>
                </form>

                {/* Customers Table */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-slate-600 text-sm uppercase border-b border-slate-200">
                      <tr>
                        <th className="p-4 font-medium">Name</th>
                        <th className="p-4 font-medium">Phone</th>
                        <th className="p-4 font-medium">Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {customers.map((customer) => (
                        <tr key={customer._id} className="hover:bg-slate-50">
                          <td className="p-4 font-medium text-slate-800">{customer.name}</td>
                          <td className="p-4 text-slate-600">{customer.phone}</td>
                          <td className="p-4 text-slate-600">{customer.address}</td>
                        </tr>
                      ))}
                      {customers.length === 0 && (
                        <tr><td colSpan="3" className="p-4 text-center text-slate-500">No customers found.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}