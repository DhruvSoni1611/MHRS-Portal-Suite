import React, { useState } from 'react';
import { X, FileText, User, Clock, CheckCircle, AlertTriangle, Download, Phone } from 'lucide-react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';


const ConsentHistoryModal = ({ consent, onClose }) => {
  // Mock historical data
  const consentHistory = [
    {
      id: 1,
      action: 'Consent Created',
      timestamp: '2024-01-15 09:30:00',
      user: 'Dr. Sarah Johnson',
      userRole: 'Physician',
      details: 'Initial consent request created',
      version: '2.1',
      status: 'active'
    },
    {
      id: 2,
      action: 'OTP Sent',
      timestamp: '2024-01-15 09:31:15',
      user: 'System',
      userRole: 'Automated',
      details: `OTP sent to ${consent?.patientName} at phone number ending in ...3210`,
      version: '2.1',
      status: 'pending'
    },
    {
      id: 3,
      action: 'OTP Verified',
      timestamp: '2024-01-15 09:35:22',
      user: consent?.patientName,
      userRole: 'Patient',
      details: 'Patient successfully verified phone number via OTP',
      version: '2.1',
      status: 'verified'
    },
    {
      id: 4,
      action: 'Digital Signature Collected',
      timestamp: '2024-01-15 09:37:45',
      user: consent?.patientName,
      userRole: 'Patient',
      details: 'Digital signature captured and consent form completed',
      version: '2.1',
      status: 'active'
    },
    {
      id: 5,
      action: 'Consent Activated',
      timestamp: '2024-01-15 09:38:00',
      user: 'System',
      userRole: 'Automated',
      details: 'Consent status changed to active. All verification steps completed.',
      version: '2.1',
      status: 'active'
    }
  ];

  const auditTrail = [
    {
      field: 'Consent Type',
      oldValue: null,
      newValue: consent?.typeLabel,
      changedBy: 'Dr. Sarah Johnson',
      timestamp: '2024-01-15 09:30:00'
    },
    {
      field: 'Collection Method',
      oldValue: null,
      newValue: 'OTP Verification',
      changedBy: 'Dr. Sarah Johnson',
      timestamp: '2024-01-15 09:30:00'
    },
    {
      field: 'Expiry Date',
      oldValue: null,
      newValue: consent?.expiryDate,
      changedBy: 'Dr. Sarah Johnson',
      timestamp: '2024-01-15 09:30:00'
    },
    {
      field: 'Status',
      oldValue: 'pending',
      newValue: 'active',
      changedBy: 'System',
      timestamp: '2024-01-15 09:38:00'
    }
  ];

  const formatDateTime = (timestamp) => {
    return new Date(timestamp)?.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActionIcon = (action) => {
    if (action?.includes('Created')) return FileText;
    if (action?.includes('OTP')) return Phone;
    if (action?.includes('Signature')) return User;
    if (action?.includes('Verified') || action?.includes('Activated')) return CheckCircle;
    if (action?.includes('Withdrawn') || action?.includes('Expired')) return AlertTriangle;
    return Clock;
  };

  const getActionColor = (action, status) => {
    if (action?.includes('Created')) return 'text-blue-600 bg-blue-100';
    if (action?.includes('OTP') && status === 'pending') return 'text-yellow-600 bg-yellow-100';
    if (action?.includes('Verified') || action?.includes('Activated')) return 'text-green-600 bg-green-100';
    if (action?.includes('Withdrawn') || action?.includes('Expired')) return 'text-red-600 bg-red-100';
    return 'text-gray-600 bg-gray-100';
  };

  const downloadConsentPDF = () => {
    // Mock PDF download
    console.log('Downloading consent PDF for:', consent?.id);
  };

  const downloadAuditReport = () => {
    // Mock audit report download
    console.log('Downloading audit report for:', consent?.id);
  };

  const [activeTab, setActiveTab] = React.useState('timeline');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>
        
        <div className="inline-block w-full max-w-4xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
          {/* Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Consent History & Audit Trail</h3>
                <p className="text-sm text-gray-500">
                  {consent?.id} • {consent?.patientName} • {consent?.typeLabel}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button
                  onClick={downloadConsentPDF}
                  className="px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Consent Summary */}
          <div className="px-6 py-4 bg-blue-50 border-b border-blue-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Status</div>
                <div className="mt-1 flex items-center">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    consent?.status === 'active' ? 'bg-green-100 text-green-800' :
                    consent?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    consent?.status === 'expired'? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {consent?.status}
                  </span>
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Collected</div>
                <div className="mt-1 text-sm text-gray-900">
                  {consent?.collectedDate ? formatDateTime(consent?.collectedDate + ' 09:30:00') : '-'}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Expires</div>
                <div className="mt-1 text-sm text-gray-900">
                  {consent?.expiryDate ? new Date(consent.expiryDate)?.toLocaleDateString() : 'No expiry'}
                </div>
              </div>
              <div>
                <div className="text-xs font-medium text-blue-600 uppercase tracking-wide">Version</div>
                <div className="mt-1 text-sm text-gray-900">v{consent?.version}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'timeline', label: 'Activity Timeline' },
                { id: 'audit', label: 'Audit Trail' },
                { id: 'versions', label: 'Version History' }
              ]?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab?.id
                      ? 'border-blue-500 text-blue-600' :'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab?.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            {/* Activity Timeline */}
            {activeTab === 'timeline' && (
              <div className="flow-root">
                <ul className="-mb-8">
                  {consentHistory?.map((event, eventIdx) => {
                    const Icon = getActionIcon(event?.action);
                    return (
                      <li key={event?.id}>
                        <div className="relative pb-8">
                          {eventIdx !== consentHistory?.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${getActionColor(event?.action, event?.status)}`}>
                                <Icon className="h-4 w-4" />
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">{event?.action}</div>
                                  <div className="text-sm text-gray-500">by {event?.user} ({event?.userRole})</div>
                                </div>
                                <div className="text-right text-xs text-gray-500">
                                  {formatDateTime(event?.timestamp)}
                                </div>
                              </div>
                              <div className="mt-2 text-sm text-gray-700">
                                {event?.details}
                              </div>
                              {event?.version && (
                                <div className="mt-2">
                                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                                    Version {event?.version}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* Audit Trail */}
            {activeTab === 'audit' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-md font-medium text-gray-900">Field Change History</h4>
                  <Button
                    onClick={downloadAuditReport}
                    className="px-3 py-2 bg-gray-100 text-gray-700 text-sm rounded-md hover:bg-gray-200 flex items-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export Report
                  </Button>
                </div>
                
                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Field
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Old Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          New Value
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Changed By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Timestamp
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {auditTrail?.map((change, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {change?.field}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {change?.oldValue || (
                              <span className="italic text-gray-400">Not set</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                              {change?.newValue}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {change?.changedBy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDateTime(change?.timestamp)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Version History */}
            {activeTab === 'versions' && (
              <div className="space-y-4">
                <h4 className="text-md font-medium text-gray-900">Consent Form Versions</h4>
                
                <div className="space-y-3">
                  {[
                    {
                      version: '2.1',
                      date: '2024-01-15',
                      status: 'current',
                      changes: 'Updated privacy policy section, added data retention clause',
                      user: 'Legal Team'
                    },
                    {
                      version: '2.0',
                      date: '2023-12-01',
                      status: 'archived',
                      changes: 'Added telehealth consent options, updated terms',
                      user: 'Legal Team'
                    },
                    {
                      version: '1.5',
                      date: '2023-09-15',
                      status: 'archived',
                      changes: 'Minor language updates for clarity',
                      user: 'Legal Team'
                    }
                  ]?.map((version, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            version?.status === 'current' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            Version {version?.version}
                            {version?.status === 'current' && ' (Current)'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(version.date)?.toLocaleDateString()} • by {version?.user}
                          </div>
                        </div>
                        <Button className="text-blue-600 hover:text-blue-800 text-sm flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">
                        <strong>Changes:</strong> {version?.changes}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Last updated: {formatDateTime(consentHistory?.[0]?.timestamp || new Date()?.toISOString())}
            </div>
            <Button
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentHistoryModal;