import React, { useState } from 'react';
import QrScanner from 'react-qr-scanner';
import { useNavigate } from 'react-router-dom';

const QRScanComponent = () => {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const handleScan = (scanData) => {
    if (scanData) {
      setData(scanData);
      // You can use the scanned data to redirect to the scan page, passing restaurantId and tableId
      navigate(`/scan?restaurantId=${scanData.restaurantId}&tableId=${scanData.tableId}`);
    }
  };

  const handleError = (error) => {
    console.error('Error scanning QR code:', error);
  };

  return (
    <div>
      <QrScanner onScan={handleScan} onError={handleError} />
      <p>{data ? `Scanned data: ${data}` : 'Scan a QR code'}</p>
    </div>
  );
};

export default QRScanComponent;
