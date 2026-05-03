import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import QRCode from 'qrcode';
import { useStore } from '../../store.jsx';

function QRCodeModal({ open, onClose, filename, reservation }) {
  const [dataUrl, setDataUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const formatDateOnly = useStore((s) => s.formatDateOnly);
  const formatTime = useStore((s) => s.formatTime);

  useEffect(() => {
    if (!open) return;
    let mounted = true;
    async function gen() {
      setLoading(true);
      try {
        const id = reservation.uuid;
        const d = await QRCode.toDataURL(String(id));
        if (mounted) setDataUrl(d);
      } catch (e) {
        console.error('QR gen error', e);
        if (mounted) setDataUrl(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    gen();
    return () => {
      mounted = false;
    };
  }, [open, reservation]);

  if (!open) return null;

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden
      />
      <div className="bg-white rounded-lg p-6 z-60 max-w-sm w-full mx-4 shadow-lg">
        <h3 className="font-bold text-lg mb-2">QR Prenotazione</h3>
        <div className="text-sm text-gray-700 mb-3 w-full">
          {reservation ? (
            <>
              {reservation.parking_name && (
                <div className="mb-1"><strong>Parcheggio:</strong> {reservation.parking_name}</div>
              )}
              {reservation.start_time && (
                <div>
                  <strong>Inizio:</strong>{' '}
                  {formatDateOnly(reservation.start_time)} {formatTime(reservation.start_time)}
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-500">Dettagli prenotazione non disponibili</div>
          )}
        </div>
        <div className="py-4 flex flex-col items-center">
          {loading ? (
            <p>Generazione...</p>
          ) : dataUrl ? (
            <img src={dataUrl} alt="QR" style={{ maxWidth: '100%' }} />
          ) : (
            <p>Errore generazione QR</p>
          )}
        </div>
        <div className="flex gap-2 justify-end">
          {dataUrl && (
            <a href={dataUrl} download={filename || `prenotazione-${reservation.uuid || 'qr'}.png`} className="btn">
              Scarica
            </a>
          )}
          <button className="btn" onClick={onClose}>
            Chiudi
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}

export default QRCodeModal;
