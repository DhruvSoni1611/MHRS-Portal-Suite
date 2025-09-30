import React, { useState } from 'react';
import { Eye, Edit, MoreHorizontal, Download, RefreshCw, AlertTriangle, XCircle, FileCheck } from 'lucide-react';
import Button from '../../../components/ui/Button';

const ConsentTrackingTable = ({ consents, onViewHistory, onEditConsent, getStatusColor, getStatusIcon }) => {
  const [selectedConsents, setSelectedConsents] = useState([]);
  const [sortField, setSortField] = useState('collectedDate');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSelectAll = (e) => {
    if (e?.target?.checked) {
      setSelectedConsents(consents?.map(consent => consent?.id));
    } else {
      setSelectedConsents([]);
    }
  };

  const handleSelectConsent = (consentId) => {
    setSelectedConsents(prev => {
      if (prev?.includes(consentId)) {
        return prev?.filter(id => id !== consentId);
      } else {
        return [...prev, consentId];
      }
    });
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedConsents = [...consents]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];
    
    if (sortField === 'collectedDate' || sortField === 'expiryDate') {
      aValue = new Date(aValue || '1900-01-01');
      bValue = new Date(bValue || '1900-01-01');
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const getExpiryWarning = (expiryDate, status) => {
    if (!expiryDate || status !== 'active') return null;
    
    const expiry = new Date(expiryDate);
    const today = new Date();
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry <= 0) return { type: 'expired', message: 'Expired' };
    if (daysUntilExpiry <= 30) return { type: 'warning', message: `Expires in ${daysUntilExpiry} days` };
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString)?.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getCollectionMethodBadge = (method) => {
    const methods = {
      'digital': { label: 'Digital', color: 'bg-blue-100 text-blue-800' },
      'otp': { label: 'OTP', color: 'bg-green-100 text-green-800' },
      'paper': { label: 'Paper', color: 'bg-gray-100 text-gray-800' }
    };
    
    const methodInfo = methods?.[method] || { label: method, color: 'bg-gray-100 text-gray-800' };
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${methodInfo?.color}`}>
        {methodInfo?.label}
      </span>
    );
  };

  if (consents?.length === 0) {
    return (
      <div className="text-center py-12">
        <FileCheck className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No consent records</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating a new consent request.</p>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Bulk Actions */}
      {selectedConsents?.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-sm text-blue-700">
              {selectedConsents?.length} consent{selectedConsents?.length > 1 ? 's' : ''} selected
            </span>
          </div>
          <div className="flex space-x-2">
            <Button className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700">
              <Download className="h-3 w-3 mr-1" />
              Export
            </Button>
            <Button className="px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700">
              <RefreshCw className="h-3 w-3 mr-1" />
              Renew
            </Button>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedConsents?.length === consents?.length && consents?.length > 0}
                  onChange={handleSelectAll}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  Consent ID
                  {sortField === 'id' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('patientName')}
              >
                <div className="flex items-center">
                  Patient
                  {sortField === 'patientName' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('typeLabel')}
              >
                <div className="flex items-center">
                  Type
                  {sortField === 'typeLabel' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center">
                  Status
                  {sortField === 'status' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('collectedDate')}
              >
                <div className="flex items-center">
                  Collected Date
                  {sortField === 'collectedDate' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700"
                onClick={() => handleSort('expiryDate')}
              >
                <div className="flex items-center">
                  Expiry Date
                  {sortField === 'expiryDate' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Collection
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedConsents?.map((consent) => {
              const expiryWarning = getExpiryWarning(consent?.expiryDate, consent?.status);
              const StatusIcon = getStatusIcon(consent?.status);
              
              return (
                <tr key={consent?.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedConsents?.includes(consent?.id)}
                      onChange={() => handleSelectConsent(consent?.id)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{consent?.id}</div>
                      <div className="text-xs text-gray-500">v{consent?.version}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm font-medium text-gray-900">{consent?.patientName}</div>
                      <div className="text-xs text-gray-500">{consent?.patientId}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{consent?.typeLabel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(consent?.status)}`}>
                        <StatusIcon />
                        <span className="ml-1 capitalize">{consent?.status}</span>
                      </span>
                      {expiryWarning && (
                        <span className={`text-xs mt-1 ${
                          expiryWarning?.type === 'expired' ? 'text-red-600' : 'text-yellow-600'
                        }`}>
                          <AlertTriangle className="h-3 w-3 inline mr-1" />
                          {expiryWarning?.message}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <div className="text-sm text-gray-900">{formatDate(consent?.collectedDate)}</div>
                      {consent?.consentBy && (
                        <div className="text-xs text-gray-500">by {consent?.consentBy}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatDate(consent?.expiryDate)}</div>
                    {consent?.withdrawnDate && (
                      <div className="text-xs text-red-500">Withdrawn: {formatDate(consent?.withdrawnDate)}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getCollectionMethodBadge(consent?.collectionMethod)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={() => onViewHistory(consent)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                        title="View History"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => onEditConsent(consent)}
                        className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                        title="Edit Consent"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <div className="relative group">
                        <Button className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-50 rounded">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        <div className="absolute right-0 top-8 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </button>
                          <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Renew Consent
                          </button>
                          {consent?.status === 'active' && (
                            <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center">
                              <XCircle className="h-4 w-4 mr-2" />
                              Withdraw Consent
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Table Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div>
            Showing {sortedConsents?.length} of {consents?.length} consent records
          </div>
          <div className="flex items-center space-x-4">
            <span>
              {selectedConsents?.length} selected
            </span>
            {selectedConsents?.length > 0 && (
              <Button 
                onClick={() => setSelectedConsents([])}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                Clear selection
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentTrackingTable;