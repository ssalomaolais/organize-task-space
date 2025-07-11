import React from "react";

interface SVGCardProps {
  x: number;
  y: number;
  width: number;
  height: number;
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
  fontFamily: string;
  titleFontFamily: string;
}

// Função de quebra de texto similar ao canvas
function wrapSVGText(text: string, maxWidth: number, fontSize: number, maxLines: number): string[] {
  const words = text.split(' ');
  let line = '';
  let lines: string[] = [];
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    // Estimativa mais precisa da largura baseada no tamanho da fonte
    const estimatedWidth = testLine.length * fontSize * 0.55;
    
    if (estimatedWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
      if (lines.length === maxLines - 1) break;
    } else {
      line = testLine;
    }
  }
  
  if (lines.length < maxLines) {
    lines.push(line.trim());
  }
  
  return lines;
}

// Função de quebra de texto de baixo para cima (como no canvas)
function wrapSVGTextBottomUp(text: string, maxWidth: number, fontSize: number, maxLines: number): string[] {
  const words = text.split(' ');
  let lines: string[] = [];
  let line = '';
  
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const estimatedWidth = testLine.length * fontSize * 0.55;
    
    if (estimatedWidth > maxWidth && n > 0) {
      lines.push(line.trim());
      line = words[n] + ' ';
      if (lines.length === maxLines - 1) break;
    } else {
      line = testLine;
    }
  }
  
  if (lines.length < maxLines) {
    lines.push(line.trim());
  }
  
  return lines;
}

const hexPoints = (x: number, y: number, w: number, h: number) => {
  return [
    [x + w * 0.05, y],
    [x + w * 0.95, y],
    [x + w, y + h * 0.05],
    [x + w, y + h * 0.95],
    [x + w * 0.95, y + h],
    [x + w * 0.05, y + h],
    [x, y + h * 0.95],
    [x, y + h * 0.05],
  ].map((p) => p.join(",")).join(" ");
};

export const SVGCard: React.FC<SVGCardProps> = ({
  x, y, width, height, title, description, date, people, palette, fontFamily, titleFontFamily
}) => {
  // Parâmetros idênticos ao canvas
  const padX = 10;
  const participantesY = y + height - 24;
  const participantesLabelY = y + height - 8;
  const descFontSize = 9;
  const descLineHeight = 13;
  const descLinesMax = 3;
  const descBoxHeight = descLineHeight * descLinesMax;
  const descBoxBottom = participantesY - 8;
  const descBoxTop = descBoxBottom - descBoxHeight;

  // Data - posicionamento idêntico ao canvas
  let cursorY = y + 18;
  const titleLines = wrapSVGText(title, width - padX * 2, 10.5, 2);
  const descLines = wrapSVGTextBottomUp(description, width - padX * 2, descFontSize, descLinesMax);

  return (
    <g>
      <polygon
        points={hexPoints(x, y, width, height)}
        fill={palette.cardBackground}
      />
      
      {/* Data */}
      <text 
        x={x + padX} 
        y={cursorY} 
        fontSize={11} 
        fontFamily={fontFamily} 
        fill={palette.dateText} 
        fontWeight="bold"
        dominantBaseline="hanging"
      >
        {date}
      </text>
      
      {/* Título */}
      {titleLines.map((line, i) => (
        <text 
          key={i} 
          x={x + padX} 
          y={cursorY + 24 + i * 14} 
          fontSize={10.5} 
          fontFamily={titleFontFamily} 
          fill={palette.titleText} 
          fontWeight="bold"
          dominantBaseline="hanging"
        >
          {line}
        </text>
      ))}
      
      {/* Descrição - posicionamento de baixo para cima como no canvas */}
      {descLines.map((line, i) => {
        const drawY = descBoxBottom - (descLines.length - 1 - i) * descLineHeight;
        return (
          <text 
            key={i} 
            x={x + padX} 
            y={drawY} 
            fontSize={descFontSize} 
            fontFamily={fontFamily} 
            fill={palette.descriptionText}
            dominantBaseline="hanging"
          >
            {line}
          </text>
        );
      })}
      
      {/* Participantes */}
      <text 
        x={x + width - padX} 
        y={participantesY} 
        fontSize={16} 
        fontFamily={fontFamily} 
        fill={palette.participantText} 
        fontWeight="bold" 
        textAnchor="end"
        dominantBaseline="hanging"
      >
        {people}
      </text>
      <text 
        x={x + width - padX} 
        y={participantesLabelY} 
        fontSize={9} 
        fontFamily={fontFamily} 
        fill={palette.participantText} 
        textAnchor="end"
        dominantBaseline="hanging"
      >
        Participantes
      </text>
    </g>
  );
};

// Novo: grid completo
interface EventData {
  title: string;
  description: string;
  summary: string;
  date: string;
  people: number;
}

interface EventsGridSVGExportProps {
  events: EventData[];
  paletteType?: "minsait" | "indra";
}

export const EventsGridSVGExport: React.FC<EventsGridSVGExportProps> = ({ events, paletteType = "minsait" }) => {
  const palette = {
    minsait: {
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      titleFontFamily: "ForFuture Sans, Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      pageBackground: "#f0f0f0",
      schemes: {
        dark: { cardBackground: "#4f062a", titleText: "#e4023f", dateText: "#ffffff", descriptionText: "#ffffff", participantText: "#ffffff" },
        light: { cardBackground: "#ffffff", titleText: "#63284b", dateText: "#6b7280", descriptionText: "#ff3d88", participantText: "#63284b" }
      }
    },
    indra: {
      fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      titleFontFamily: "ForFuture Sans, Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
      pageBackground: "#EBEAE6",
      schemes: {
        dark: { cardBackground: "#00434F", titleText: "#FFFFFF", dateText: "#FFFFFF", descriptionText: "#FFFFFF", participantText: "#FFFFFF" },
        light: { cardBackground: "#ADD8E6", titleText: "#000000", dateText: "#000000", descriptionText: "#000000", participantText: "#000000" }
      }
    }
  };
  
  const currentPalette = palette[paletteType];
  
  // Parâmetros idênticos ao canvas
  const cardWidth = 150;
  const cardHeight = 180;
  const gapX = 8;
  const gapY = 8;
  const marginX = 8;
  const marginY = 8;
  const numberOfColumns = 6;
  const rows = Math.ceil(events.length / numberOfColumns);
  const svgWidth = marginX * 2 + numberOfColumns * cardWidth + (numberOfColumns - 1) * gapX;
  const svgHeight = marginY * 2 + rows * cardHeight + (rows - 1) * gapY;

  // Alternância de cor idêntica ao canvas
  const getScheme = (idx: number) => {
    const row = Math.floor(idx / numberOfColumns);
    return (row + idx) % 2 !== 0 ? currentPalette.schemes.light : currentPalette.schemes.dark;
  };

  return (
    <svg width={svgWidth} height={svgHeight} style={{ background: currentPalette.pageBackground }}>
      {events.map((event, idx) => {
        const row = Math.floor(idx / numberOfColumns);
        const col = idx % numberOfColumns;
        const x = marginX + col * (cardWidth + gapX);
        const y = marginY + row * (cardHeight + gapY);
        const scheme = getScheme(idx);
        return (
          <SVGCard
            key={idx}
            x={x}
            y={y}
            width={cardWidth}
            height={cardHeight}
            title={event.title}
            description={event.summary ? event.summary:  event.description}
            date={event.date}
            people={event.people}
            palette={scheme}
            fontFamily={currentPalette.fontFamily}
            titleFontFamily={currentPalette.titleFontFamily}
          />
        );
      })}
    </svg>
  );
}; 