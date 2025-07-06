import pptxgen from "pptxgenjs";
import { Task } from "@/types/task";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

type PaletteType = "minsait" | "indra";

interface PowerPointExportOptions {
  tasks: Task[];
  palette: PaletteType;
  title: string;
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

export const exportToPowerPoint = async ({ tasks, palette, title }: PowerPointExportOptions) => {
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
      addHexCard(slide, task, x, y, cardWidth, cardHeight, scheme, currentPalette.fontFamily);
    });
  }

  const fileName = `apresentacao_${format(new Date(), "yyyy-MM-dd_HH-mm", { locale: ptBR })}.pptx`;
  await pptx.writeFile({ fileName });
};

// Função para desenhar um card hexagonal (ou com cantos cortados)
function addHexCard(slide: any, task: Task, x: number, y: number, w: number, h: number, scheme: any, fontFamily: string) {
  // Hexágono aproximado (pptxgenjs não suporta clipPath, mas suporta polígono)
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
  const description = (task.description || "").length > 90 ? task.description.substring(0, 90) + "..." : task.description;
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