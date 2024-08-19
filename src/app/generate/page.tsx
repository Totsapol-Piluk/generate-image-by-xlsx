"use client";

import { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface ExcelRow {
    shape: string;
    color: string;
    charecter: string;
    name: string;
    number: string;
}

const Generate = () => {
    const [data, setData] = useState<ExcelRow[]>([]);

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target?.result;
            if (typeof binaryStr !== 'string') return;

            const workbook = XLSX.read(binaryStr, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(sheet);

            const processedData: ExcelRow[] = jsonData.slice(0).map(row => {
                const typedRow = row as Record<string, any>;
                return {
                    shape: typedRow["Shape"] as string,
                    color: typedRow["Color"] as string,
                    charecter: typedRow["Charecter"] as string,
                    name: typedRow["Name"] as string,
                    number: typedRow["Number"] as string
                };
            });

            setData(processedData);
            console.log(processedData);
        };

        reader.readAsBinaryString(file);
    };

    const generatePDF = async () => {
        const pdf = new jsPDF();
        const itemsPerPage = 8;
        const itemsPerRow = 4;

        for (let i = 0; i < data.length; i += itemsPerPage) {
            if (i > 0) pdf.addPage();

            const pageData = data.slice(i, i + itemsPerPage);
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexWrap = 'wrap';
            container.style.width = '800px';

            for (const item of pageData) {
                const itemDiv = document.createElement('div');
                itemDiv.style.width = '50%';
                itemDiv.style.padding = '10px';
                itemDiv.style.boxSizing = 'border-box';

                itemDiv.innerHTML = `
                    <div style="text-align: center;">
                        <div style="font-size: 24px;">${item.number}</div>
                        <div style="
                            width: 100px;
                            height: 100px;
                            border-radius: 50%;
                            background-color: ${item.color};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 10px auto;
                            border:2px solid red;
                        ">
                            <span style="color: white; font-size: 48px;">${item.charecter}</span>
                        </div>
                        <div>${item.name}</div>
                    </div>
                `;

                container.appendChild(itemDiv);
            }

            document.body.appendChild(container);
            const canvas = await html2canvas(container);
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
            document.body.removeChild(container);
        }

        pdf.save('generated.pdf');
    };

    return (
        <div>
            <input type="file" accept=".xlsx, .xls" onChange={handleImport} />
            <button onClick={generatePDF}>Generate PDF</button>
        </div>
    );
};

export default Generate;