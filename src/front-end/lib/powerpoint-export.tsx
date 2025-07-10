import pptxgen from "pptxgenjs";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { SVGCard } from "@/components/dashboard/EventsGridSVGExport";
import { svgComponentToPngBase64 } from "@/lib/svg-to-image";
import React from "react";
import { drawCardsGridToCanvas } from "@/lib/draw-cards-grid-canvas";

type PaletteType = "minsait" | "indra";

interface PowerPointExportOptions {
  tasks: Task[];
  palette: PaletteType;
  title: string;
  hexagonType?: "approximate" | "perfect" | "rounded";
}

interface PowerPointExportImageOptions {
  imageBase64: string;
  title: string;
  cards?: CardData[];
}

interface CardData {
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

interface ExportCardsGridOptions {
  cards: CardData[];
  title: string;
  paletteType?: "minsait" | "indra";
  hexagonType?: "approximate" | "perfect" | "rounded";
}

const palettes = {
  minsait: {
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    pageBackground: "#f0f0f0",
    schemes: {
      dark: { cardBackground: "#4f062a", titleText: "#e4023f", dateText: "#ffffff", descriptionText: "#ffffff", participantText: "#ffffff" },
      light: { cardBackground: "#ffffff", titleText: "#63284b", dateText: "#6b7280", descriptionText: "#ff3d88", participantText: "#63284b" }
    }
  },
  indra: {
    fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
    pageBackground: "#EBEAE6",
    schemes: {
      dark: { cardBackground: "#00434F", titleText: "#FFFFFF", dateText: "#FFFFFF", descriptionText: "#FFFFFF", participantText: "#FFFFFF" },
      light: { cardBackground: "#ADD8E6", titleText: "#000000", dateText: "#000000", descriptionText: "#000000", participantText: "#000000" }
    }
  }
};

/**
 * Exporta tarefas para PowerPoint com cards hexagonais
 * 
 * Tipos de hexágonos disponíveis:
 * - "approximate": Hexágono com cantos cortados (design atual)
 * - "perfect": Hexágono perfeito com 6 lados iguais
 * - "rounded": Hexágono com cantos suavemente arredondados
 */
export const exportToPowerPoint = async ({ tasks, palette, title, hexagonType = "approximate" }: PowerPointExportOptions) => {
  const pptx = new pptxgen();
  const currentPalette = palettes[palette];
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "Organize Task Space";
  pptx.company = "Dashboard Export";

  // Slide de título
  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: currentPalette.pageBackground };
  titleSlide.addText(title, {
    x: 0.5, y: 1.5, w: 9, h: 1.5, fontSize: 40, color: palettes[palette].schemes.dark.titleText, bold: true, align: "left", fontFace: currentPalette.fontFamily
  });
  titleSlide.addText(`Exportado em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, {
    x: 0.5, y: 3.2, w: 9, h: 0.5, fontSize: 16, color: palettes[palette].schemes.dark.dateText, align: "left", fontFace: currentPalette.fontFamily
  });
  titleSlide.addText(`Total de eventos: ${tasks.length}`, {
    x: 0.5, y: 3.8, w: 9, h: 0.5, fontSize: 18, color: palettes[palette].schemes.dark.participantText, align: "left", fontFace: currentPalette.fontFamily, bold: true
  });

  // Cards por slide
  const numberOfColumns = 6;
  const numberOfRows = 2;
  const cardsPerSlide = numberOfColumns * numberOfRows;
  const cardWidth = 1.5;
  const cardHeight = 3.2;
  const cardGapX = 0.2;
  const cardGapY = 0.3;
  const marginX = 0.3;
  const marginY = 1.2;

  // Paleta para alternar cor dos cards
  const getCardScheme = (index: number, row: number) => {
    if (palette === "minsait") {
      return (row + index) % 2 !== 0 ? currentPalette.schemes.light : currentPalette.schemes.dark;
    } else {
      return (row + index) % 2 !== 0 ? palettes.indra.schemes.light : palettes.indra.schemes.dark;
    }
  };

  // Paginar os cards
  for (let i = 0; i < tasks.length; i += cardsPerSlide) {
    const slide = pptx.addSlide();
    slide.background = { color: currentPalette.pageBackground };
    // Título no topo à esquerda
    slide.addText(title, {
      x: 0.3, y: 0.2, w: 5, h: 0.5, fontSize: 18, color: palettes[palette].schemes.dark.titleText, bold: true, align: "left", fontFace: currentPalette.fontFamily
    });
    const pageTasks = tasks.slice(i, i + cardsPerSlide);
    pageTasks.forEach((task, idx) => {
      const row = Math.floor(idx / numberOfColumns);
      const col = idx % numberOfColumns;
      const x = marginX + col * (cardWidth + cardGapX);
      const y = marginY + row * (cardHeight + cardGapY);
      const scheme = getCardScheme(idx, row);
      addHexCard(slide, task, x, y, cardWidth, cardHeight, scheme, currentPalette.fontFamily, hexagonType);
    });
  }

  const fileName = `apresentacao_${format(new Date(), "yyyy-MM-dd_HH-mm", { locale: ptBR })}.pptx`;
  await pptx.writeFile({ fileName });
};

// Função para calcular pontos de um hexágono perfeito
function calculateHexagonPoints(centerX: number, centerY: number, radius: number) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3; // 60 graus em radianos
    const x = centerX + radius * Math.cos(angle);
    const y = centerY + radius * Math.sin(angle);
    points.push({ x, y });
  }
  return points;
}

// Função para calcular pontos de um hexágono com cantos arredondados
function calculateRoundedHexagonPoints(x: number, y: number, w: number, h: number, cornerRadius: number = 0.1) {
  const points = [];
  const radius = Math.min(w, h) * cornerRadius;
  
  // Pontos principais do hexágono
  const mainPoints = [
    { x: x + w * 0.05, y: y },
    { x: x + w * 0.95, y: y },
    { x: x + w, y: y + h * 0.05 },
    { x: x + w, y: y + h * 0.95 },
    { x: x + w * 0.95, y: y + h },
    { x: x + w * 0.05, y: y + h },
    { x: x, y: y + h * 0.95 },
    { x: x, y: y + h * 0.05 }
  ];
  
  // Adiciona pontos de curva nos cantos (simulação de arredondamento)
  for (let i = 0; i < mainPoints.length; i++) {
    points.push(mainPoints[i]);
    if (i < mainPoints.length - 1) {
      const next = mainPoints[(i + 1) % mainPoints.length];
      const midX = (mainPoints[i].x + next.x) / 2;
      const midY = (mainPoints[i].y + next.y) / 2;
      points.push({ x: midX, y: midY });
    }
  }
  
  return points;
}

// Função para obter pontos do hexágono baseado no tipo
function getHexagonPoints(x: number, y: number, w: number, h: number, type: "approximate" | "perfect" | "rounded" = "approximate") {
  switch (type) {
    case "perfect":
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const radius = Math.min(w, h) / 2 * 0.9;
      return calculateHexagonPoints(centerX, centerY, radius);
    
    case "rounded":
      return calculateRoundedHexagonPoints(x, y, w, h);
    
    case "approximate":
    default:
      return [
        { x: x + w * 0.05, y: y },
        { x: x + w * 0.95, y: y },
        { x: x + w, y: y + h * 0.05 },
        { x: x + w, y: y + h * 0.95 },
        { x: x + w * 0.95, y: y + h },
        { x: x + w * 0.05, y: y + h },
        { x: x, y: y + h * 0.95 },
        { x: x, y: y + h * 0.05 }
      ];
  }
}

// Função para desenhar um card hexagonal (ou com cantos cortados)
function addHexCard(slide: any, task: Task, x: number, y: number, w: number, h: number, scheme: any, fontFamily: string, hexagonType: "approximate" | "perfect" | "rounded" = "approximate") {
  const hexPoints = getHexagonPoints(x, y, w, h, hexagonType);
  
  slide.addShape("polygon", {
    points: hexPoints,
    fill: { color: scheme.cardBackground },
    line: { color: scheme.titleText, width: 1 }
  });

  // Data e hora
  slide.addText(format(new Date(task.start_date), "dd/MM HH'h'", { locale: ptBR }), {
    x: x + 0.08, y: y + 0.12, w: w - 0.16, h: 0.3, fontSize: 13, color: scheme.dateText, bold: true, fontFace: fontFamily
  });
  // Título
  slide.addText(task.title, {
    x: x + 0.08, y: y + 0.45, w: w - 0.16, h: 0.5, fontSize: 14, color: scheme.titleText, bold: true, fontFace: fontFamily
  });
  // Descrição
  let description = task.summary ? task.summary : task.description;
  description = (description || "").length > 90 ? description.substring(0, 90) + "..." : description;
  slide.addText(description, {
    x: x + 0.08, y: y + 1.05, w: w - 0.16, h: 0.7, fontSize: 10, color: scheme.descriptionText, fontFace: fontFamily
  });
  // Participantes
  slide.addText(`${task.people || 0}`, {
    x: x + w - 0.7, y: y + h - 0.6, w: 0.6, h: 0.3, fontSize: 18, color: scheme.participantText, bold: true, align: "right", fontFace: fontFamily
  });
  slide.addText("Participantes", {
    x: x + w - 0.7, y: y + h - 0.3, w: 0.6, h: 0.2, fontSize: 8, color: scheme.participantText, align: "right", fontFace: fontFamily
  });
}

// Função para adicionar um card hexagonal usando addShape("polygon") - similar ao drawCard do canvas
function addCardShape(slide: any, x: number, y: number, w: number, h: number, cardData: { title: string; description: string; date: string; people: number }, palette: any, fontFamily: string) {
  // Hexágono/cantos cortados - mesma lógica do drawCard
  const hexPoints = [
    { x: x + w * 0.05, y: y },
    { x: x + w * 0.95, y: y },
    { x: x + w, y: y + h * 0.05 },
    { x: x + w, y: y + h * 0.95 },
    { x: x + w * 0.95, y: y + h },
    { x: x + w * 0.05, y: y + h },
    { x: x, y: y + h * 0.95 },
    { x: x, y: y + h * 0.05 }
  ];
  
  slide.addShape("polygon", {
    points: hexPoints,
    fill: { color: palette.cardBackground },
    line: { color: palette.titleText, width: 1 }
  });

  // Padding interno
  const padX = 0.1; // Convertido para polegadas
  const participantesY = y + h - 0.25;
  const participantesLabelY = y + h - 0.08;

  // Data
  slide.addText(cardData.date, {
    x: x + padX, y: y + 0.18, w: w - padX * 2, h: 0.3, 
    fontSize: 11, color: palette.dateText, bold: true, 
    fontFace: fontFamily, align: "left"
  });

  // Título
  slide.addText(cardData.title, {
    x: x + padX, y: y + 0.42, w: w - padX * 2, h: 0.4, 
    fontSize: 10.5, color: palette.titleText, bold: true, 
    fontFace: fontFamily, align: "left"
  });

  // Descrição
  slide.addText(cardData.description, {
    x: x + padX, y: y + 0.85, w: w - padX * 2, h: 0.6, 
    fontSize: 9, color: palette.descriptionText, 
    fontFace: fontFamily, align: "left"
  });

  // Participantes
  slide.addText(String(cardData.people), {
    x: x + w - padX - 0.6, y: participantesY, w: 0.6, h: 0.3, 
    fontSize: 16, color: palette.participantText, bold: true, 
    fontFace: fontFamily, align: "right"
  });
  
  slide.addText("Participantes", {
    x: x + w - padX - 0.6, y: participantesLabelY, w: 0.6, h: 0.2, 
    fontSize: 9, color: palette.participantText, 
    fontFace: fontFamily, align: "right"
  });
}

export const exportGridImageToPowerPoint = async ({ imageBase64, title, cards = [] }: PowerPointExportImageOptions) => {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "TaskFlow";
  pptx.company = "Dashboard Export";

  // Converter dimensões da imagem para polegadas
  const img = new window.Image();
  img.src = imageBase64;
  await new Promise((resolve) => { img.onload = resolve; });
  const pxToIn = (px: number) => px / 96;
  
  // Calcular dimensões para caber no slide
  const slideWidth = 960; // Largura do slide em px
  const slideHeight = 540; // Altura do slide em px (16:9)
  const maxImageHeight = slideHeight * 0.7; // 70% da altura do slide para a imagem
  
  let wIn, hIn;
  
  if (img.height <= maxImageHeight) {
    // Imagem cabe no slide, usar largura completa
    wIn = pxToIn(slideWidth);
    hIn = pxToIn(img.height * (slideWidth / img.width));
  } else {
    // Imagem é muito alta, redimensionar para caber
    const scale = maxImageHeight / img.height;
    wIn = pxToIn(img.width * scale);
    hIn = pxToIn(maxImageHeight);
  }

  const slide = pptx.addSlide();
  slide.background = { fill: '#E3E2DA' };

  const [firstWord, ...rest] = title.split(' ');

  slide.addText([
    { text: firstWord + (rest.length ? ' ' : ''), options: { color: '#e4023f', fontSize: 24, bold: true } },
    { text: rest.join(' '), options: { color: '#4f062a', fontSize: 24, bold: true } }
  ], { x: 0.08, y: 0.2, w: 8, h: 0.5, align: 'left' });
  
  // Imagem do grid centralizada
  const imageX = (10 - wIn) / 2; // Centralizar horizontalmente
  slide.addImage({
    data: imageBase64,
    x: imageX,
    y: 0.8,
    w: wIn,
    h: hIn
  });

  const fileName = `apresentacao_grid_${Date.now()}.pptx`;
  await pptx.writeFile({ fileName });
};

export async function exportCardsGridToPowerPoint({ cards, title, paletteType = "minsait", hexagonType = "approximate" }: ExportCardsGridOptions) {
  const pptx = new pptxgen();
  pptx.layout = "LAYOUT_16x9";
  pptx.author = "Organize Task Space";
  pptx.company = "Dashboard Export";

  // Layout do grid
  const numberOfColumns = 6;
  const numberOfRows = 2;
  const cardsPerSlide = numberOfColumns * numberOfRows;

  // Paginar os cards
  for (let i = 0; i < cards.length; i += cardsPerSlide) {
    const pageCards = cards.slice(i, i + cardsPerSlide);
    // Gerar imagem do grid via canvas
    const scale = 2;
    const canvas = drawCardsGridToCanvas(pageCards, { scale, minRows: 2 });
    const imageBase64 = canvas.toDataURL("image/png");

    // Converter dimensões da imagem para polegadas
    const img = new window.Image();
    img.src = imageBase64;
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => { img.onload = resolve; });
    const pxToIn = (px: number) => px / 96;
    const slideWidth = 960; // px
    const slideHeight = 540; // px (16:9)
    const maxImageHeight = slideHeight * 0.7;
    let wIn, hIn;
    if (img.height <= maxImageHeight) {
      wIn = pxToIn(slideWidth);
      hIn = pxToIn(img.height * (slideWidth / img.width));
    } else {
      const scaleImg = maxImageHeight / img.height;
      wIn = pxToIn(img.width * scaleImg);
      hIn = pxToIn(maxImageHeight);
    }
    const slide = pptx.addSlide();
    slide.background = { fill: '#E3E2DA' };
    const [firstWord, ...rest] = title.split(' ');
    slide.addText([
      { text: firstWord + (rest.length ? ' ' : ''), options: { color: '#e4023f', fontSize: 24, bold: true } },
      { text: rest.join(' '), options: { color: '#222', fontSize: 24, bold: true } }
    ], { x: 0.15, y: 0.2, w: 8, h: 0.5, align: 'left' });
    const imageX = (10 - wIn) / 2;
    slide.addImage({
      data: imageBase64,
      x: imageX,
      y: 0.8,
      w: wIn,
      h: hIn
    });
  }
  const fileName = `apresentacao_cards_${Date.now()}.pptx`;
  await pptx.writeFile({ fileName });
} 