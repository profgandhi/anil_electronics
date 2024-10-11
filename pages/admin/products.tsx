//admin/products

import React, { useEffect, useState } from 'react';
import withAuth from '../../components/withAuth';
import { Product, fetchProducts, addProduct, editProduct, deleteProduct } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
//import Image from 'next/image'

const AdminProducts: React.FC = () => {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({ name: '', price: 0, description: '', product_type: '', img: '', metadata: {} });
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  useEffect(() => {
    const getProducts = async () => {
      try {
        const { data } = await fetchProducts();
        setProducts(data);
      } catch { setError('Failed to fetch products.'); }
      finally { setLoading(false); }
    };
    getProducts();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.name === 'price' ? +e.target.value : e.target.value }));
  const handleAddKeyValuePair = () => { if (newKey && newValue) setFormData(prev => ({ ...prev, metadata: { ...prev.metadata, [newKey]: newValue } })); setNewKey(''); setNewValue(''); };
  const closeModal = () => { setIsModalOpen(false); setCurrentProduct(null); setFormData({ name: '', price: 0, description: '', product_type: '', img: '', metadata: {} }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return setError('Unauthorized. Please log in again.');
    try {
      if (isEditMode && currentProduct) {
        await editProduct(token, currentProduct.id, formData);
        setProducts(prev => prev.map(p => (p.id === currentProduct.id ? { ...p, ...formData } as Product : p)));
      } else {
        const { data } = await addProduct(token, formData);
        setProducts(prev => [...prev, { ...formData, id: data.product_id } as Product]);
      }
      closeModal();
    } catch { setError('Failed to submit the form.'); }
  };

  const handleDelete = async (productId: number) => {
    if (!token) return setError('Unauthorized. Please log in again.');
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(token, productId);
        setProducts(prev => prev.filter(p => p.id !== productId));
      } catch { setError('Failed to delete the product.'); }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <button onClick={() => setIsModalOpen(true)} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Product</button>
      {loading ? <p>Loading products...</p> : (
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              {['ID', 'Name', 'Price', 'Product Type', 'Metadata', 'Image', 'Actions'].map((heading) => (
                <th key={heading} className="py-2 px-4 border">{heading}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map(({ id, name, price, product_type, metadata, img }) => (
              <tr key={id}>
                <td className="py-2 px-4 border text-center">{id}</td>
                <td className="py-2 px-4 border">{name}</td>
                <td className="py-2 px-4 border text-right">${price.toFixed(2)}</td>
                <td className="py-2 px-4 border text-center">{product_type}</td>
                <td className="py-2 px-4 border text-center">
                  {Object.entries(metadata || {}).map(([key, value]) => (
                    <div key={key} className="bg-green-100 p-2 rounded mb-1"><strong>{key}</strong>: {value}</div>
                  ))}
                </td>
                <td className="py-2 px-4 border text-center">{img ? <img src={img} alt={name} className="w-16 h-16 object-cover" /> : 'N/A'}</td>
                <td className="py-2 px-4 border text-center">
                  <button onClick={() => { setIsEditMode(true); setCurrentProduct({ id, name, price, product_type, metadata, img }); setFormData({ name, price, description: '', product_type, img, metadata }); setIsModalOpen(true); }} className="mr-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600">Edit</button>
                  <button onClick={() => handleDelete(id)} className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg w-96 p-6">
            <h2 className="text-xl font-bold mb-4">{isEditMode ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleSubmit}>
              {['name', 'price', 'description', 'product_type', 'img'].map((field) => (
                <div key={field} className="mb-4">
                  <label className="block mb-1 capitalize">{field.replace('_', ' ')}</label>
                  <input
                    type={field === 'price' ? 'number' : 'text'}
                    name={field}
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    value={(formData as any)[field]}
                    onChange={handleChange}
                    className="w-full border px-3 py-2 rounded"
                    required={field !== 'description' && field !== 'img'}
                  />
                </div>
              ))}
              <div className="mb-4">
                <label className="block mb-1">Add Key-Value Pair to Metadata</label>
                <input type="text" placeholder="Key" value={newKey} onChange={(e) => setNewKey(e.target.value)} className="w-full border px-3 py-2 rounded mb-2" />
                <input type="text" placeholder="Value" value={newValue} onChange={(e) => setNewValue(e.target.value)} className="w-full border px-3 py-2 rounded mb-2" />
                <button type="button" onClick={handleAddKeyValuePair} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Add Key-Value Pair</button>
              </div>
              <div className="mb-4">
                {Object.entries(formData.metadata || {}).map(([key, value]) => (
                  <div key={key} className="bg-green-100 p-2 rounded mb-1"><strong>{key}</strong>: {value}</div>
                ))}
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={closeModal} className="mr-2 px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">{isEditMode ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default withAuth(AdminProducts);
