import React from "react";

const Footer = () => {
  // Gera versão baseada na data de compilação
  const generateVersion = () => {
    // Tenta obter a data de compilação das variáveis de ambiente
    const buildDate = import.meta.env.VITE_BUILD_DATE || import.meta.env.BUILD_DATE;
    
    let year, month, day;
    
    if (buildDate) {
      // Se temos uma data de compilação definida, usa ela
      const date = new Date(buildDate);
      year = date.getFullYear().toString().slice(-2);
      month = (date.getMonth() + 1).toString().padStart(2, '0');
      day = date.getDate().toString().padStart(2, '0');
    } else {
      // Fallback: usa a data atual (para desenvolvimento)
      const now = new Date();
      year = now.getFullYear().toString().slice(-2);
      month = (now.getMonth() + 1).toString().padStart(2, '0');
      day = now.getDate().toString().padStart(2, '0');
    }
    
    // Número da compilação do dia (pode vir de variável de ambiente)
    const buildNumber = import.meta.env.VITE_BUILD_NUMBER || import.meta.env.BUILD_NUMBER || "1";
    
    return `${year}.${month}.${day}.${buildNumber}`;
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white px-4 py-2 shadow-sm">
      <div className="flex items-center justify-center">
        <span className="text-sm text-gray-600">
          Delivery Network - Versão {generateVersion()}
        </span>
      </div>
    </footer>
  );
};

export default Footer; 