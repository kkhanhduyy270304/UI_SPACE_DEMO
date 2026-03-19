import { useRef } from 'react';
import { Download, ImageDown } from 'lucide-react';

const downloadTextFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const exportSvgToPng = async (svgElement, filename) => {
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svgElement);
  const svgBlob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  const image = new Image();
  image.crossOrigin = 'anonymous';

  await new Promise((resolve, reject) => {
    image.onload = resolve;
    image.onerror = reject;
    image.src = svgUrl;
  });

  const canvas = document.createElement('canvas');
  canvas.width = image.width || 1200;
  canvas.height = image.height || 600;
  const context = canvas.getContext('2d');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(image, 0, 0);

  URL.revokeObjectURL(svgUrl);

  const pngUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.href = pngUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
};

/**
 * Reusable chart container with consistent UI and export actions.
 */
export const StandardChartCard = ({
  title,
  children,
  data = [],
  fileName = 'chart-data',
  className = ''
}) => {
  const chartRef = useRef(null);

  const handleExportCsv = () => {
    if (!Array.isArray(data) || data.length === 0) {
      downloadTextFile('Khong co du lieu', `${fileName}.csv`, 'text/csv;charset=utf-8;');
      return;
    }

    const headers = Object.keys(data[0]);
    const rows = data.map(item => headers.map(header => JSON.stringify(item[header] ?? '')).join(','));
    const csv = [headers.join(','), ...rows].join('\n');
    downloadTextFile(csv, `${fileName}.csv`, 'text/csv;charset=utf-8;');
  };

  const handleExportPng = async () => {
    const svgElement = chartRef.current?.querySelector('svg');
    if (!svgElement) return;

    try {
      await exportSvgToPng(svgElement, `${fileName}.png`);
    } catch {
      // Fallback to SVG download if PNG export fails.
      const serializer = new XMLSerializer();
      const source = serializer.serializeToString(svgElement);
      downloadTextFile(source, `${fileName}.svg`, 'image/svg+xml;charset=utf-8;');
    }
  };

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ${className}`}>
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <Download size={14} />
            Tai CSV
          </button>
          <button
            onClick={handleExportPng}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            <ImageDown size={14} />
            Tai PNG
          </button>
        </div>
      </div>
      <div ref={chartRef}>{children}</div>
    </div>
  );
};
