import React, { useState } from "react";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType } from "docx";
import { saveAs } from "file-saver";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Vacancy } from "@/types/task";

interface VacancyEvaluationTabProps {
  selectedVacancy: Vacancy;
}

const defaultStatus = "Atende";

const VacancyEvaluationTab = ({ selectedVacancy }: VacancyEvaluationTabProps) => {
  // Debug: log the selectedVacancy object
  console.log('VacancyEvaluationTab - selectedVacancy:', selectedVacancy);
  console.log('VacancyEvaluationTab - knowledges:', selectedVacancy?.knowledges);
  
  // Inicializa competências baseadas nos conhecimentos da vaga
  const initialCompetencies = (selectedVacancy.knowledges || []).map(k => ({
    name: k.knowledge,
    status: defaultStatus,
    grade: "",
    observation: ""
  }));

  const [interviewSummary, setInterviewSummary] = useState("");
  const [competencies, setCompetencies] = useState(initialCompetencies);
  const [finalNotes, setFinalNotes] = useState("");

  // Atualiza competências se selectedVacancy mudar
  React.useEffect(() => {
    console.log('VacancyEvaluationTab - useEffect - knowledges:', selectedVacancy?.knowledges);
    setCompetencies((selectedVacancy.knowledges || []).map(k => ({
      name: k.knowledge,
      status: defaultStatus,
      grade: "",
      observation: ""
    })));
  }, [selectedVacancy]);

  const handleCompetencyChange = (index, field, value) => {
    const updated = [...competencies];
    updated[index][field] = value;
    setCompetencies(updated);
  };

  const handleExportWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: "Relatório de Avaliação de Vaga",
              heading: "Heading1",
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: "Resumo da Entrevista",
              heading: "Heading2",
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: interviewSummary || "-",
              spacing: { after: 300 },
            }),
            new Paragraph({
              text: "Avaliação Técnica",
              heading: "Heading2",
              spacing: { after: 100 },
            }),
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              rows: [
                new TableRow({
                  children: [
                    new TableCell({ children: [new Paragraph("Competência")]}),
                    new TableCell({ children: [new Paragraph("Status")]}),
                    new TableCell({ children: [new Paragraph("Nota")]}),
                    new TableCell({ children: [new Paragraph("Observação")]}),
                  ],
                }),
                ...competencies.map(comp =>
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph(comp.name)] }),
                      new TableCell({ children: [new Paragraph(comp.status)] }),
                      new TableCell({ children: [new Paragraph(comp.grade)] }),
                      new TableCell({ children: [new Paragraph(comp.observation)] }),
                    ],
                  })
                ),
              ],
            }),
            new Paragraph({
              text: "Observações Finais",
              heading: "Heading2",
              spacing: { after: 100 },
            }),
            new Paragraph({
              text: finalNotes || "-",
            }),
          ],
        },
      ],
    });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, "relatorio-avaliacao.docx");
  };

  return (
    <div className="mx-auto py-1 space-y-4">
      <div>
        <Label className="block mb-1">Resumo da Entrevista</Label>
        <Textarea
          className="w-full border rounded p-2 min-h-[100px]"
          placeholder="Descreva o resumo da entrevista..."
          value={interviewSummary}
          onChange={e => setInterviewSummary(e.target.value)}
        />
      </div>
      <div>
        <Label className="block mb-1">Avaliação Técnica</Label>
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-muted-foreground/10">
                <th className="border px-2 py-1">Competência</th>
                <th className="border px-2 py-1">Status</th>
                <th className="border px-2 py-1">Nota</th>
                <th className="border px-2 py-1">Observação</th>
              </tr>
            </thead>
            <tbody>
              {competencies.map((comp, idx) => (
                <tr key={comp.name}>
                  <td className="border px-2 py-1">{comp.name}</td>
                  <td className="border px-2 py-1">
                    <select
                      className="border rounded px-1"
                      value={comp.status}
                      onChange={e => handleCompetencyChange(idx, "status", e.target.value)}
                    >
                      <option value="Atende">Atende</option>
                      <option value="Não Atende">Não Atende</option>
                    </select>
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="border rounded px-1 w-12"
                      value={comp.grade}
                      onChange={e => handleCompetencyChange(idx, "grade", e.target.value)}
                    />
                  </td>
                  <td className="border px-2 py-1">
                    <input
                      type="text"
                      className="border rounded px-1 w-full"
                      value={comp.observation}
                      onChange={e => handleCompetencyChange(idx, "observation", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <Label className="block mb-1">Observações Finais</Label>
        <textarea
          className="w-full border rounded p-2 min-h-[80px]"
          placeholder="Observações finais sobre o candidato..."
          value={finalNotes}
          onChange={e => setFinalNotes(e.target.value)}
        />
      </div>
      <div className="flex justify-end mb-4">
        <button
          className="px-4 py-2 rounded shadow"
          onClick={handleExportWord}
        >
          Exportar para Word
        </button>
      </div>
    </div>
  );
};

export default VacancyEvaluationTab; 