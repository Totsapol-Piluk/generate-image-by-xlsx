"use client";

import { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { time } from 'console';

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
                const shape = item.shape.toLocaleLowerCase().trim()
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
                        <div style="margin-top: 20px; font-size: 20px; font-weight: 400;">${item.name}</div>
                    </div>
                    `;
                }
                if(shape === 'heart'){
                    itemDiv.innerHTML = `
                        <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 0px 30px;">
                            <div style="font-size: 24px; margin-bottom: 5px; align-self: end;">${item.number}</div>
                            <span style="transform:scale(1.1);">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="150" height="150">
                                    <path fill=${item.color} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                </svg>
                            </span>
                            <div style="margin-top: 20px; font-size: 20px; font-weight: 600;">${item.name}</div>
                            <span style="color: ${'#ffffff'}; font-size: 56px; position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); z-index: 50;">${item.charecter}</span>
                        </div>
                    `
                }
                if(shape === 'star'){
                    itemDiv.innerHTML = `
                    <div style="text-align: center;display:flex; flex-direction:column; padding: 0px 30px 0px 30px">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self:end;">${item.number}</div>
                        <span style="transform:scale(1.3);">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="150" height="150">
                                <path fill=${item.color} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                            </svg>
                        </span>
                        <div style="margin-top: 20px; font-size: 20px; font-weight:600">${item.name}</div>
                         <span style="color: ${'#ffffff'}; font-size: 56px; position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); z-index: 50;">${item.charecter}</span>
                    </div>
                `;
                }
                if(shape === 'diamond'){
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
                            transform: rotate(45deg) scale(0.8);

                        ">
                            <span style="color: ${'#ffffff'}; font-size: 56px; transform: rotate(-45deg);">${item.charecter}</span>
                        </div>
                        <div style="margin-top: 20px; font-size: 20px; font-weight:600">${item.name}</div>
                    </div>
                `;
                }
                if(shape === 'pentagon'){
                    itemDiv.innerHTML = `
                    <div style="text-align: center;display:flex; flex-direction:column; padding: 0px 30px 0px 30px; ">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self:end;">${item.number}</div>
                       <span>
                            <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <polygon points="50,5 95,37.5 77,95 23,95 5,37.5" fill=${item.color}  />
                            </svg>
                       </span>
                        <div style="margin-top: 20px; font-size: 20px; font-weight:600">${item.name}</div>
                         <span style="color: ${'#ffffff'}; font-size: 56px; position: absolute; top: 46%; left: 50%; transform: translate(-50%, -50%); z-index: 50;">${item.charecter}</span>
                    </div>
                `;
                }
                if(shape === 'hexagon'){
                    itemDiv.innerHTML = `
                    <div style="text-align: center; display: flex; flex-direction: column; padding: 0px 30px 0px 30px;">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self: end;">${item.number}</div>
                        <span>
                            <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                <polygon points="50,2.875 89.375,17.5 89.375,75.625 50,96.25 10.625,75.625 10.625,17.5" fill=${item.color} />
                            </svg>
                        </span>
                        <div style="margin-top: 20px; font-size: 20px; font-weight: 600;">${item.name}</div>
                         <span style="color: ${'#ffffff'}; font-size: 56px; position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); z-index: 50;">${item.charecter}</span>
                    </div>

                `;
                }
                if(shape === 'rounded'){
                    itemDiv.innerHTML = `
                    <div style="text-align: center;display:flex; flex-direction:column; padding: 0px 30px 0px 30px">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self:end;">${item.number}</div>
                        <div style="
                            width: ${circleSize}px;
                            height: ${circleSize}px;
                            border: 2px solid ${item.color};
                            border-radius: 45px;
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
                if(shape === 'teardrop'){
                    itemDiv.innerHTML = `
                    <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 0px 30px;">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self: end;">${item.number}</div>
                        <span style=" transform: rotate(-45deg) scale(1.5);">
                            <svg id="sw-js-blob-svg" width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">                    
                            <defs>                         
                                <linearGradient id="sw-gradient" x1="0" x2="1" y1="1" y2="0">                            
                                    <stop id="stop1" stop-color="rgba(248, 117, 55, 1)" offset="0%"></stop>                            
                                    <stop id="stop2" stop-color="rgba(251, 168, 31, 1)" offset="100%"></stop>                        
                                </linearGradient>                    
                            </defs>                
                            <path fill=${item.color} d="M17.7,-18.5C24.9,-10.4,34.3,-5.2,33.9,-0.3C33.6,4.5,23.5,9,16.3,13.2C9,17.4,4.5,21.2,-1.6,22.8C-7.7,24.4,-15.4,23.8,-20.2,19.6C-25,15.4,-26.8,7.7,-26.1,0.7C-25.4,-6.3,-22.2,-12.7,-17.4,-20.8C-12.7,-29,-6.3,-38.9,-0.6,-38.4C5.2,-37.8,10.4,-26.7,17.7,-18.5Z" width="200%" height="200%" transform="translate(50 50)" stroke-width="0" style="transition: 0.3s;"></path>
                        </svg>
                        </span>
                        <div style="margin-top: 20px; font-size: 20px; font-weight: 600;">${item.name}</div>
                         <span style="color: ${'#ffffff'}; font-size: 56px; position: absolute; top: 43%; left: 48%; transform: translate(-50%, -50%); z-index: 50;">${item.charecter}</span>
                    </div>
                    `;
                }
                if(shape === 'shear'){
                  
                    itemDiv.innerHTML = `
                    <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 0px 30px;">
                        <div style="font-size: 24px; margin-bottom: 5px; align-self: end;">${item.number}</div>
                        <svg width="300" height="150" viewBox="0 0 150 100" xmlns="http://www.w3.org/2000/svg">
                            <polygon points="20,90 110,90 130,10 40,10" fill="${item.color}" />
                        </svg>
                        <div style="margin-top: 20px; font-size: 20px; font-weight: 600;">${item.name}</div>
                         <span style="color: ${'#ffffff'}; font-size: 56px; position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); z-index: 50;">${item.charecter}</span>
                    </div>
                `;
                    
                    
                }
                if(shape === 'wave'){
                    
                        itemDiv.innerHTML = `
                            <div style="text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: space-around; padding: 0px 30px;">
                                <div style="font-size: 24px; margin-bottom: 5px; align-self: end;">${item.number}</div>
                                <span>
                                    <svg width="150" height="150" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10,10 
                                             Q30,30 60,10 
                                             T100,10 
                                             L100,90 
                                             Q70,70 40,90 
                                             T10,90 
                                             Z" 
                                          fill="${item.color}" />
                                </svg>
                                </span>
                                <div style="margin-top: 20px; font-size: 20px; font-weight: 600;">${item.name}</div>
                                 <span style="color: ${'#ffffff'}; font-size: 56px; position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); z-index: 50;">${item.charecter}</span>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' ,alignItems: 'center' ,justifyContent:"center",width:"100%",height:'100%' }}>
           <input className='myButton' type="file" accept=".xlsx, .xls" onChange={handleImport} />
            <button className='myButton' onClick={generatePDF}>Generate PDF</button> 
        </div>
    );
};

export default Generate;