import React, { useRef, useState, useEffect } from 'react';
import { Eraser, PenLine, Sparkles } from 'lucide-react';

interface SignaturePadProps {
  label: string;
  sublabel?: string;
  legalName?: string;
  initialSignature?: string;
  onChange: (dataUrl: string) => void;
}

export const SignaturePad: React.FC<SignaturePadProps> = ({
  label,
  sublabel,
  legalName = '',
  initialSignature,
  onChange,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Ajustar DPI
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;

    if (initialSignature) {
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 0, 0, rect.width, rect.height);
        setHasSignature(true);
      };
      img.src = initialSignature;
    }
  }, [initialSignature]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if ('touches' in e) {
      e.preventDefault(); // Evitar scroll al firmar en móvil
    }

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSignature(true);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      onChange(canvas.toDataURL('image/png'));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);
    setHasSignature(false);
    onChange('');
  };

  const generateSignatureFromName = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, rect.width, rect.height);

    const name = legalName.trim() || 'Firma Registrada';
    ctx.font = 'italic 28px "Brush Script MT", cursive, "Segoe Script", sans-serif';
    ctx.fillStyle = '#0f172a';
    ctx.fillText(name, 24, rect.height / 2 + 8);

    // Línea de rúbrica caligráfica
    ctx.beginPath();
    ctx.moveTo(20, rect.height / 2 + 18);
    ctx.bezierCurveTo(80, rect.height / 2 + 35, 180, rect.height / 2 - 10, rect.width - 40, rect.height / 2 + 20);
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    setHasSignature(true);
    onChange(canvas.toDataURL('image/png'));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div>
          <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
            <PenLine className="h-3.5 w-3.5 text-blue-600" />
            {label}
          </label>
          {sublabel && <p className="text-[11px] text-slate-500">{sublabel}</p>}
        </div>
        <div className="flex items-center gap-2">
          {legalName && (
            <button
              type="button"
              onClick={generateSignatureFromName}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-blue-700 hover:text-blue-800 hover:underline px-2 py-1 rounded bg-blue-50 transition-colors"
              title="Generar rúbrica caligráfica a partir del nombre"
            >
              <Sparkles className="h-3 w-3" />
              Rúbrica automática
            </button>
          )}
          {hasSignature && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-rose-600 hover:text-rose-700 px-2 py-1 rounded hover:bg-rose-50 transition-colors"
            >
              <Eraser className="h-3 w-3" />
              Borrar
            </button>
          )}
        </div>
      </div>

      <div className="relative rounded-xl border-2 border-dashed border-slate-300 bg-white shadow-inner overflow-hidden">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          className="h-28 w-full cursor-crosshair touch-none"
        />

        {!hasSignature && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <PenLine className="h-5 w-5 mb-1 opacity-50" />
            <span className="text-xs font-medium">Dibuje su firma aquí o use rúbrica automática</span>
          </div>
        )}

        {/* Guía de firma */}
        <div className="pointer-events-none absolute bottom-5 left-6 right-6 border-b border-slate-200 border-dashed" />
      </div>
    </div>
  );
};
