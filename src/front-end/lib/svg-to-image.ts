import { Canvg } from 'canvg';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

export async function svgComponentToPngBase64(svgElement: React.ReactElement, width: number, height: number): Promise<string> {
  // Renderizar SVG como string
  const svgString = ReactDOMServer.renderToStaticMarkup(svgElement);
  // Criar canvas
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  // Renderizar SVG no canvas
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');
  const v = await Canvg.fromString(ctx, svgString);
  await v.render();
  // Gerar base64
  return canvas.toDataURL('image/png');
} 