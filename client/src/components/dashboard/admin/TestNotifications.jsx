// client/src/components/dashboard/admin/TestNotifications.jsx

import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import api from '../../../services/api';

const TestNotifications = () => {
  const [whatsappData, setWhatsappData] = useState({
    phoneNumber: '',
    message: '',
  });
  const [emailData, setEmailData] = useState({
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const testWhatsApp = async () => {
    try {
      setLoading(true);
      const response = await api.post('/notifications/test/whatsapp', whatsappData);
      
      if (response.data.url) {
        window.open(response.data.url, '_blank');
      }
      
      alert('✅ WhatsApp link generated! Opening in new tab...');
    } catch (error) {
      alert('❌ Failed to generate WhatsApp link');
    } finally {
      setLoading(false);
    }
  };

  const testEmail = async () => {
    try {
      setLoading(true);
      await api.post('/notifications/test/email', emailData);
      alert('✅ Test email sent successfully!');
    } catch (error) {
      alert('❌ Failed to send test email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-neutral-darkNavy mb-2">
          Test Notifications
        </h1>
        <p className="text-neutral-gray">Test WhatsApp and email integrations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* WhatsApp Test */}
        <Card>
          <h2 className="text-xl font-bold mb-6">📱 WhatsApp Test</h2>
          <div className="space-y-4">
            <Input
              label="Phone Number"
              placeholder="+250 XXX XXX XXX"
              value={whatsappData.phoneNumber}
              onChange={(e) => setWhatsappData({ ...whatsappData, phoneNumber: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-neutral-darkGray mb-2">
                Message (Optional)
              </label>
              <textarea
                className="input-field resize-none"
                rows="4"
                placeholder="Custom test message..."
                value={whatsappData.message}
                onChange={(e) => setWhatsappData({ ...whatsappData, message: e.target.value })}
              />
            </div>
            <Button onClick={testWhatsApp} loading={loading} className="w-full">
              Open WhatsApp
            </Button>
          </div>
        </Card>

        {/* Email Test */}
        <Card>
          <h2 className="text-xl font-bold mb-6">📧 Email Test</h2>
          <div className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="test@example.com"
              value={emailData.email}
              onChange={(e) => setEmailData({ ...emailData, email: e.target.value })}
            />
            <Input
              label="Subject (Optional)"
              placeholder="Test Email Subject"
              value={emailData.subject}
              onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium text-neutral-darkGray mb-2">
                Message (Optional)
              </label>
              <textarea
                className="input-field resize-none"
                rows="4"
                placeholder="Custom test message..."
                value={emailData.message}
                onChange={(e) => setEmailData({ ...emailData, message: e.target.value })}
              />
            </div>
            <Button onClick={testEmail} loading={loading} className="w-full">
              Send Test Email
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TestNotifications;