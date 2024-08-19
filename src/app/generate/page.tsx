"use client";

import { useState } from 'react';
import * as XLSX from 'xlsx';

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
        console.log('hi')
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

            // แปลงข้อมูล JSON ไปเป็น ExcelRow[]
            const processedData: ExcelRow[] = jsonData.slice(0).map(row => {
                const typedRow = row as Record<string, any>; // ใช้ Type Assertion

                return {
                    shape: typedRow["Shape"] as string,
                    color: typedRow["Color"] as string,
                    charecter: typedRow["Charecter"] as string,
                    name: typedRow["Name"] as string,
                    // number: Number(typedRow["Number"])
                    number: typedRow["Number"] as string
                };
            });

            setData(processedData);
            console.log(processedData); // แสดงข้อมูลที่แปลงแล้วใน console
        };

        reader.readAsBinaryString(file);
    };

    return (
        <div>
            <input type="file" accept=".xlsx, .xls" onChange={handleImport} />
        </div>
    );
};

export default Generate;
