import html2canvas from 'html2canvas';

export interface ExportImageOptions {
  element: HTMLElement;
  filename?: string;
  scale?: number;
}

export async function exportPng({ element, filename = 'routine.png', scale = 2 }: ExportImageOptions): Promise<void> {
  const canvas = await html2canvas(element, {
    scale,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  });

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));

  if (!blob) throw new Error('PNG export failed');

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
