export interface CardData {
  title: string;
  description: string;
  date: string;
  people: number;
  palette: {
    cardBackground: string;
    titleText: string;
    dateText: string;
    descriptionText: string;
    participantText: string;
  };
}

export function drawCardsGridToCanvas(cards: CardData[], options?: { width?: number; height?: number; scale?: number }) {
  const scale = options?.scale || 1;
  // Parâmetros do card
  const cardWidth = 150 * scale;
  const cardHeight = 180 * scale;
  const gapX = 8 * scale;
  const gapY = 8 * scale;
  const marginX = 8 * scale;
  const marginY = 8 * scale;
  const numberOfColumns = 6;
  const rows = Math.ceil(cards.length / numberOfColumns);
  const canvasWidth = marginX * 2 + numberOfColumns * cardWidth + (numberOfColumns - 1) * gapX;
  const canvasHeight = marginY * 2 + rows * cardHeight + (rows - 1) * gapY;

  const canvas = document.createElement('canvas');
  canvas.width = options?.width || canvasWidth;
  canvas.height = options?.height || canvasHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context not available');

  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Desenhar todos os cards no grid
  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    const row = Math.floor(i / numberOfColumns);
    const col = i % numberOfColumns;
    const x = marginX + col * (cardWidth + gapX);
    const y = marginY + row * (cardHeight + gapY);
    drawCard(ctx, x, y, cardWidth, cardHeight, card, scale);
  }

  return canvas;
}

function drawCard(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, card: CardData, scale: number = 1) {
  // Hexágono/cantos cortados
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + w * 0.05, y);
  ctx.lineTo(x + w * 0.95, y);
  ctx.lineTo(x + w, y + h * 0.05);
  ctx.lineTo(x + w, y + h * 0.95);
  ctx.lineTo(x + w * 0.95, y + h);
  ctx.lineTo(x + w * 0.05, y + h);
  ctx.lineTo(x, y + h * 0.95);
  ctx.lineTo(x, y + h * 0.05);
  ctx.closePath();
  ctx.fillStyle = card.palette.cardBackground;
  ctx.fill();
  ctx.restore();

  // Padding interno
  const padX = 10 * scale;
  // Espaço para participantes e label
  const participantesY = y + h - 24 * scale;
  const participantesLabelY = y + h - 8 * scale;
  // Espaço para descrição (até 3 linhas, 9px, 13px de altura)
  const descFontSize = 9 * scale;
  const descLineHeight = 13 * scale;
  const descLinesMax = 3;
  const descBoxHeight = descLineHeight * descLinesMax;
  const descBoxBottom = participantesY - 8 * scale; // 8px acima do número
  const descBoxTop = descBoxBottom - descBoxHeight;

  const font = "ForFuture Sans, Verdana, sans-serif";
  // Data
  let cursorY = y + 18 * scale;
  ctx.font = `bold ${11 * scale}px ${font}`;
  ctx.fillStyle = card.palette.dateText;
  ctx.textAlign = 'left';
  ctx.fillText(card.date, x + padX, cursorY);
  cursorY += 24 * scale;

  // Título
  ctx.font = `bold ${10.5 * scale}px ${font}`;
  ctx.fillStyle = card.palette.titleText;
  wrapCanvasText(ctx, card.title, x + padX, cursorY, w - padX * 2, 14 * scale, 2, true);

  // Descrição (de baixo para cima)
  ctx.font = `${descFontSize}px ${font}`;
  ctx.fillStyle = card.palette.descriptionText;
  wrapCanvasTextBottomUp(ctx, card.description, x + padX, descBoxBottom, w - padX * 2, descLineHeight, descLinesMax);

  // Participantes
  ctx.font = `bold ${16 * scale}px ${font}`;
  ctx.fillStyle = card.palette.participantText;
  ctx.textAlign = 'right';
  ctx.fillText(String(card.people), x + w - padX, participantesY);
  ctx.font = `${9 * scale}px ${font}`;
  ctx.fillText('Participantes', x + w - padX, participantesLabelY);
  ctx.textAlign = 'left';
}

function wrapCanvasText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number, maxLines: number, bold?: boolean) {
  const words = text.split(' ');
  let line = '';
  let lines = 0;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
      lines++;
      if (lines === maxLines - 1) break;
    } else {
      line = testLine;
    }
  }
  if (lines < maxLines) ctx.fillText(line.trim(), x, y);
}

function wrapCanvasTextBottomUp(ctx: CanvasRenderingContext2D, text: string, x: number, yBottom: number, maxWidth: number, lineHeight: number, maxLines: number) {
  const words = text.split(' ');
  let lines: string[] = [];
  let line = '';
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
      if (lines.length === maxLines - 1) break;
    } else {
      line = testLine;
    }
  }
  if (lines.length < maxLines) lines.push(line.trim());
  // Desenhar de baixo para cima
  let drawY = yBottom - (lines.length - 1) * lineHeight;
  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, drawY);
    drawY += lineHeight;
  }
} 