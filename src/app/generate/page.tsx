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
        console.log(data)
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
    
        const itemsPerPage = 8;
        const pageWidth = 210;
        const pageHeight = 297;
        const itemWidth = pageWidth / 2;
        const itemHeight = pageHeight / 4;
        const circleSize = 150; // ขนาดวงกลม (หน่วยเป็น px)
    
        for (let pageStart = 0; pageStart < data.length; pageStart += itemsPerPage) {
            if (pageStart > 0) {
                pdf.addPage();
            }
    
            const pageData = data.slice(pageStart, pageStart + itemsPerPage);
            const container = document.createElement('div');
            container.style.width = `${pageWidth}mm`;
            container.style.height = `${pageHeight}mm`;
            container.style.position = 'relative';
    
            pageData.forEach((item, index) => {
                const itemDiv = document.createElement('div');
                itemDiv.style.position = 'absolute';
                itemDiv.style.width = `${itemWidth}mm`;
                itemDiv.style.height = `${itemHeight}mm`;
                itemDiv.style.left = `${(index % 2) * itemWidth}mm`;
                itemDiv.style.top = `${Math.floor(index / 2) * itemHeight}mm`;
                itemDiv.style.boxSizing = 'border-box';
                itemDiv.style.padding = '10px';
                itemDiv.style.border = '1px solid black'
               
    
                itemDiv.innerHTML = `
                    <div style="text-align: center;display:flex; flex-direction:column; padding: 0px 30px 0px 30px">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self:end;">${item.number}</div>
                        <div style="
                            width: ${circleSize}px;
                            height: ${circleSize}px;
                            border-radius: 50%;
                            border: 2px solid ${item.color};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 5px auto;
                            background-color: ${item.color};
                        ">
                            <span style="color: ${'#ffffff'}; font-size: 56px;">${item.charecter}</span>
                        </div>
                        <div style="margin-top: 20px; font-size: 20px; font-weight:600">${item.name}</div>
                    </div>
                `;
    
                container.appendChild(itemDiv);
            });
    
            document.body.appendChild(container);
            const canvas = await html2canvas(container, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);
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