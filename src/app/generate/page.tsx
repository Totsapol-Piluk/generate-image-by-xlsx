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
                const shape = item.shape.toLocaleLowerCase().slice(0, -1)
                console.log(shape , shape.length)
            
                

                if(shape === 'circle'){
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
                }
                if(shape === 'square'){
                    itemDiv.innerHTML = `
                    <div style="text-align: center;display:flex; flex-direction:column; padding: 0px 30px 0px 30px">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self:end;">${item.number}</div>
                        <div style="
                            width: ${circleSize}px;
                            height: ${circleSize}px;
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
                }
                if(shape === 'triangle'){
                    itemDiv.innerHTML = `
                   <div style="text-align: center; display: flex; flex-direction: column; padding: 0px 30px;">
    <div style="font-size: 20px;font-weight:600; margin-bottom: 5px; align-self: end;">${item.number}</div>
    <div style="
        width: 0;
        height: 0;
        border-left: ${circleSize / 2}px solid transparent;
        border-right: ${circleSize / 2}px solid transparent;
        border-bottom: ${circleSize}px solid ${item.color};
        position: relative;
        margin: 5px auto;
    ">
        <span style="
            color: #ffffff;
            font-size: 46px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, 70px); /* ปรับให้ตัวอักษรอยู่กึ่งกลางจริงๆ */
        ">${item.charecter}</span>
    </div>
    <div style="margin-top: 20px; font-size: 20px; font-weight: 600;">${item.name}</div>
</div>
                    `;
                }
                if(shape === 'heart'){
                    itemDiv.innerHTML = `
                        <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 0px 30px;">
                            <div style="font-size: 24px; margin-bottom: 5px; align-self: end;">${item.number}</div>
                            <div id="heart"></div>
                            <div style="margin-top: 20px; font-size: 20px; font-weight: 600;">${item.name}</div>
                        </div>
                    `
                }
                if(shape === 'star'){
                    itemDiv.innerHTML = `
                    <div style="text-align: center;display:flex; flex-direction:column; padding: 0px 30px 0px 30px">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self:end;">${item.number}</div>
                        <div id="star"></div>
                        <div style="margin-top: 20px; font-size: 20px; font-weight:600">${item.name}</div>
                    </div>
                `;
                }
                if(shape === 'daimond'){
                    itemDiv.innerHTML = `
                    <div style="text-align: center;display:flex; flex-direction:column; padding: 0px 30px 0px 30px">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self:end;">${item.number}</div>
                        <div style="
                            width: ${circleSize}px;
                            height: ${circleSize}px;
                            border: 2px solid ${item.color};
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            margin: 5px auto;
                            background-color: ${item.color};
                            transform: rotate(45deg);

                        ">
                            <span style="color: ${'#ffffff'}; font-size: 56px; transform: rotate(-45deg);">${item.charecter}</span>
                        </div>
                        <div style="margin-top: 20px; font-size: 20px; font-weight:600">${item.name}</div>
                    </div>
                `;
                }
                if(shape === 'pentago'){
                    itemDiv.innerHTML = `
                    <div style="text-align: center;display:flex; flex-direction:column; padding: 0px 30px 0px 30px">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self:end;">${item.number}</div>
                        <div id="pentagon"></div>
                        <div style="margin-top: 20px; font-size: 20px; font-weight:600">${item.name}</div>
                    </div>
                `;
                }
                
                if(shape === 'hexago'){
                    itemDiv.innerHTML = `
                    <div style="text-align: center;display:flex; flex-direction:column; padding: 0px 30px 0px 30px;">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self:end;">${item.number}</div>
                        <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                        <polygon points="50,5 95,37.5 77,95 23,95 5,37.5" fill="green"  />
                        </svg>
                        <div style="margin-top: 20px; font-size: 20px; font-weight:600">${item.name}</div>
                    </div>
                `;
                }
                if(shape === 'pentago'){
                    itemDiv.innerHTML = `
                    <div style="text-align: center;display:flex; flex-direction:column; padding: 0px 30px 0px 30px;">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self:end;">${item.number}</div>
                        <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="25,5 75,5 95,50 75,95 25,95 5,50" fill=${item.color}  />
                        </svg>
                        <div style="margin-top: 20px; font-size: 20px; font-weight:600">${item.name}</div>
                    </div>
                `;
                }
                if(shape === 'cros'){
                    itemDiv.innerHTML = `
        <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 0px 30px;">
            <div style="font-size: 24px; margin-bottom: 5px; align-self: end;">${item.number}</div>
           <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  <!-- Cross shape -->
  <path d="M75 25 h25 v25 h25 v25 h-25 v25 h-25 v-25 h-25 v-25 h25 z" fill="lime" />
</svg>


            <div style="margin-top: 20px; font-size: 20px; font-weight: 600;">${item.name}</div>
        </div>
    `;
                }
                if(shape === 'teardro'){
                    itemDiv.innerHTML = `
        <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 0px 30px;">
            <div style="font-size: 24px; margin-bottom: 5px; align-self: end;">${item.number}</div>
            <svg width="400" height="200" xmlns="http://www.w3.org/2000/svg">
  
  <!-- Teardrop shape -->
  <path d="M300 25 q75 0 75 75 a75 75 0 1 1 -150 0 q0 -75 75 -75 z" fill="lime" />
</svg>
            <div style="margin-top: 20px; font-size: 20px; font-weight: 600;">${item.name}</div>
        </div>
    `;
                }
                if(shape === 'shea'){
                  
                    itemDiv.innerHTML = `
                    <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 0px 30px;">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self: end;">${item.number}</div>
                        <svg width="300" height="150" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="20,90 110,90 130,10 40,10" fill="${item.color}" />
                        </svg>
                        <div style="margin-top: 20px; font-size: 20px; font-weight: 600;">${item.name}</div>
                    </div>
                `;
                    
                    
                }
                if(shape === 'wav'){
                    
                        itemDiv.innerHTML = `
                            <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 0px 30px;">
                                <div style="font-size: 24px; margin-bottom: 5px; align-self: end;">${item.number}</div>
                                <svg width="200" height="200" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10,10 
                                             Q30,30 60,10 
                                             T100,10 
                                             L100,90 
                                             Q70,70 40,90 
                                             T10,90 
                                             Z" 
                                          fill="${item.color}" />
                                </svg>
                                <div style="margin-top: 20px; font-size: 20px; font-weight: 600;">${item.name}</div>
                            </div>
                        `;
                    
                    
                }
               
                
               
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