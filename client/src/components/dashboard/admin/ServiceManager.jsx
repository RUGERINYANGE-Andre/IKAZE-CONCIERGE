// client/src/components/dashboard/admin/ServiceManager.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import Modal from '../../ui/Modal';

const ServiceManager = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    serviceId: '',
    name: '',
    tagline: '',
    description: '',
    price: '',
    currency: 'USD',
    features: [''],
    icon: '📋',
    popular: false,
    isActive: true,
  });

  const iconOptions = [
    '📋', '🧭', '📸', '🛎️', '✈️',
    '🎯', '🌍', '⭐', '🎉', '💼',
    '🏔️', '🦍', '🌿', '🎥', '🗺️',
  ];

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      // ✅ Use admin endpoint to get all services including inactive
      const response = await api.get('/admin/services');
      setServices(response.data.data || []); // ✅ Fixed: response.data.data
    } catch (error) {
      console.error('Failed to fetch services:', error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData((prev) => ({ ...prev, features: newFeatures }));
  };

  const addFeature = () => {
    setFormData((prev) => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.serviceId.trim())
      newErrors.serviceId = 'Service ID is required';
    else if (!/^[a-z0-9-]+$/.test(formData.serviceId))
      newErrors.serviceId = 'Only lowercase letters, numbers and hyphens';

    if (!formData.name.trim())
      newErrors.name = 'Service name is required';
    if (!formData.tagline.trim())
      newErrors.tagline = 'Tagline is required';
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = 'Valid price is required';

    const validFeatures = formData.features.filter((f) => f.trim());
    if (validFeatures.length === 0)
      newErrors.features = 'At least one feature is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const cleanedData = {
        ...formData,
        features: formData.features.filter((f) => f.trim()),
        price: parseFloat(formData.price),
      };

      if (editingService) {
        await api.put(`/admin/services/${editingService._id}`, cleanedData);
        alert('✅ Service updated successfully!');
      } else {
        await api.post('/admin/services', cleanedData);
        alert('✅ Service created successfully!');
      }

      setShowModal(false);
      resetForm();
      fetchServices();
    } catch (error) {
      // ✅ Better error extraction
      const message =
        error.response?.data?.message ||
        `Failed to ${editingService ? 'update' : 'create'} service`;
      alert(`❌ ${message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      serviceId: service.serviceId,
      name: service.name,
      tagline: service.tagline,
      description: service.description || '',
      price: service.price.toString(),
      currency: service.currency || 'USD',
      features: service.features.length > 0 ? service.features : [''],
      icon: service.icon || '📋',
      popular: service.popular || false,
      isActive: service.isActive,
    });
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return;
    try {
      await api.delete(`/admin/services/${serviceId}`);
      alert('✅ Service deleted successfully!');
      fetchServices();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete service';
      alert(`❌ ${message}`);
    }
  };

  // ✅ Use dedicated toggle endpoint
  const handleToggleActive = async (service) => {
    try {
      await api.patch(`/admin/services/${service._id}/toggle`);
      fetchServices();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to toggle status';
      alert(`❌ ${message}`);
    }
  };

  const resetForm = () => {
    setFormData({
      serviceId: '',
      name: '',
      tagline: '',
      description: '',
      price: '',
      currency: 'USD',
      features: [''],
      icon: '📋',
      popular: false,
      isActive: true,
    });
    setEditingService(null);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 border-4 border-primary-teal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-darkNavy mb-2">
            Service Management
          </h1>
          <p className="text-neutral-gray">
            {services.length} service{services.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Button onClick={() => { resetForm(); setShowModal(true); }}>
          + Add New Service
        </Button>
      </div>

      {/* Services Grid */}
      {services.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛎️</div>
            <h3 className="text-xl font-semibold text-neutral-darkNavy mb-2">
              No services yet
            </h3>
            <p className="text-neutral-gray mb-6">
              Create your first service package to get started
            </p>
            <Button onClick={() => { resetForm(); setShowModal(true); }}>
              Create Service
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service._id} className="relative flex flex-col">
              {/* Badges */}
              <div className="absolute top-4 right-4 flex items-center gap-2 flex-wrap justify-end">
                {service.popular && (
                  <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-semibold rounded-full">
                    ⭐ Popular
                  </span>
                )}
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  service.isActive
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {service.isActive ? '✓ Active' : '✗ Inactive'}
                </span>
              </div>

              {/* Content */}
              <div className="text-center mb-4 mt-10 flex-1">
                <div className="text-5xl mb-3">{service.icon}</div>
                <h3 className="text-xl font-bold text-neutral-darkNavy mb-1">
                  {service.name}
                </h3>
                <p className="text-primary-teal font-medium text-sm mb-1">
                  {service.tagline}
                </p>
                <p className="text-neutral-gray text-xs mb-3 line-clamp-2">
                  {service.description}
                </p>
                <div className="flex items-baseline justify-center">
                  <span className="text-3xl font-bold text-neutral-darkNavy">
                    ${service.price}
                  </span>
                  <span className="text-neutral-gray ml-1 text-sm">
                    {service.currency}
                  </span>
                </div>
              </div>

              {/* Features Preview */}
              <div className="mb-4">
                <ul className="space-y-1 text-sm">
                  {service.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start text-neutral-darkGray">
                      <span className="text-primary-teal mr-2 flex-shrink-0">✓</span>
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                  {service.features.length > 3 && (
                    <li className="text-neutral-gray text-xs italic pl-4">
                      +{service.features.length - 3} more features
                    </li>
                  )}
                </ul>
              </div>

              {/* Actions */}
              <div className="space-y-2 mt-auto">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(service)}
                    className="flex-1"
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    size="sm"
                    variant={service.isActive ? 'ghost' : 'primary'}
                    onClick={() => handleToggleActive(service)}
                    className="flex-1"
                  >
                    {service.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                </div>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDelete(service._id)}
                  className="w-full"
                >
                  🗑️ Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); resetForm(); }}
        title={editingService ? `Edit: ${editingService.name}` : 'Create New Service'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service ID */}
          <div>
            <label className="block text-sm font-medium text-neutral-darkGray mb-1">
              Service ID <span className="text-red-500">*</span>
            </label>
            <input
              name="serviceId"
              value={formData.serviceId}
              onChange={handleInputChange}
              disabled={!!editingService}
              placeholder="e.g., planning-hub"
              className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors ${
                editingService
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200'
                  : errors.serviceId
                  ? 'border-red-400 bg-red-50'
                  : 'border-gray-200 focus:border-teal-500'
              }`}
            />
            {errors.serviceId && (
              <p className="text-red-500 text-xs mt-1">{errors.serviceId}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              Lowercase letters, numbers and hyphens only
            </p>
          </div>

          {/* Name & Tagline */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-darkGray mb-1">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Planning Hub"
                className={`w-full px-4 py-3 border rounded-lg text-sm outline-none ${
                  errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-500'
                }`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-darkGray mb-1">
                Tagline <span className="text-red-500">*</span>
              </label>
              <input
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                placeholder="e.g., Pre-Visit Intelligence"
                className={`w-full px-4 py-3 border rounded-lg text-sm outline-none ${
                  errors.tagline ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-500'
                }`}
              />
              {errors.tagline && <p className="text-red-500 text-xs mt-1">{errors.tagline}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-darkGray mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              placeholder="Brief description of this service..."
              className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-500 resize-none"
            />
          </div>

          {/* Price & Currency */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-darkGray mb-1">
                Price <span className="text-red-500">*</span>
              </label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                placeholder="150"
                className={`w-full px-4 py-3 border rounded-lg text-sm outline-none ${
                  errors.price ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-teal-500'
                }`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-darkGray mb-1">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-500"
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="RWF">RWF</option>
              </select>
            </div>
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-darkGray mb-2">
              Icon
            </label>
            <div className="flex flex-wrap gap-2">
              {iconOptions.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, icon }))}
                  className={`text-2xl p-2 rounded-lg border-2 transition-all ${
                    formData.icon === icon
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 hover:border-teal-300'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-medium text-neutral-darkGray mb-2">
              Features{' '}
              {errors.features && (
                <span className="text-red-500 text-xs">({errors.features})</span>
              )}
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder={`Feature ${index + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-teal-500"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-400 hover:text-red-600 px-2 py-1 text-lg"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium flex items-center gap-1"
              >
                + Add Feature
              </button>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 py-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="popular"
                checked={formData.popular}
                onChange={handleInputChange}
                className="w-4 h-4 text-teal-500 rounded"
              />
              <span className="text-sm font-medium text-neutral-darkNavy">
                ⭐ Mark as Popular
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="w-4 h-4 text-teal-500 rounded"
              />
              <span className="text-sm font-medium text-neutral-darkNavy">
                Active
              </span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-lightGray">
            <Button
              type="button"
              variant="outline"
              onClick={() => { setShowModal(false); resetForm(); }}
              className="flex-1"
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={saving}>
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {editingService ? 'Updating...' : 'Creating...'}
                </span>
              ) : editingService ? (
                'Update Service'
              ) : (
                'Create Service'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceManager;