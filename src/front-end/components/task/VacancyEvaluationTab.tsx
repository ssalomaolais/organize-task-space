import React, { useState } from "react";
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType } from "docx";
import { saveAs } from "file-saver";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const initialCompetencies = [
  { name: ".Net Conceito", status: "Atende", grade: "7", observation: "Necessita revisar o funcionamento do IEnumerable vs IQueryable e Memory Stack." },
  { name: "C#, .NET Framework", status: "Atende", grade: "8", observation: "Errou a questão de como declarar da divisão por zero." },
  { name: "Angular Conceito", status: "Atende", grade: "6", observation: "Necessita Revisar, conceitos." },
  { name: "Angular", status: "Atende", grade: "6", observation: "Revisar o Angular, como por exemplo Forms reativos, padrões de roteamento." },
  { name: "Css", status: "Atende", grade: "10", observation: "N/A" },
  { name: "Javascript/TypeScript", status: "Atende", grade: "8", observation: "N/A" },
  { name: "Banco de dados", status: "Atende", grade: "8", observation: "Necessita revisar as sintaxes de SQL (principalmente sobre questão de left, right outter Join)." },
  { name: "Git e GitHub", status: "Atende", grade: "10", observation: "N/A" },
  { name: "CI/CD", status: "Atende", grade: "", observation: "Mais como usuário" },
  { name: "Solid", status: "Não Atende", grade: "3", observation: "Necessita revisar os conceitos." },
  { name: "Arquitetura e Design Patterns", status: "Atende", grade: "10", observation: "N/A" },
  { name: "Testes Automatizados", status: "Atende", grade: "", observation: "Trabalha com QA" },
];

const VacancyEvaluationTab = () => {
  const [interviewSummary, setInterviewSummary] = useState("");
  const [competencies, setCompetencies] = useState(initialCompetencies);
  const [finalNotes, setFinalNotes] = useState("");

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
    <div className="mx-auto py-1 space-y-8">
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
        <h3 className="text-lg font-medium mb-2">Avaliação Técnica</h3>
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
        <h3 className="text-lg font-medium mb-2">Observações Finais</h3>
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