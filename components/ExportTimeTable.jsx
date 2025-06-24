"use client";
import { useState, useRef } from 'react';
import { Download } from 'lucide-react';
import TimetableView from './TimetableView';
import FacultyTimeTable from './FacultyTimeTable';
import RoomTimeTable from './RoomTimeTable';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function TimetableExport({ TimeTablesDeps, initialRooms }) {
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState('');
  const timetableRef = useRef(null);

  const handleExport = async () => {
    setIsExporting(true);
    const timetableElement = timetableRef.current;
    if (timetableElement) {
      try {
        const canvas = await html2canvas(timetableElement);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 10, imgWidth, imgHeight);
        pdf.save(`timetable_${exportType}.pdf`);
      } catch (error) {
        console.error("Error generating PDF: ", error);
      }
    }
    setIsExporting(false);
  };

  const renderTimetableView = () => {
    switch (exportType) {
      case 'department':
        return <TimetableView TimeTablesDeps={TimeTablesDeps} />;
      case 'faculty':
        return <FacultyTimeTable TimeTablesDeps={TimeTablesDeps} />;
      case 'room':
        return <RoomTimeTable TimeTablesDeps={TimeTablesDeps} initialRooms={initialRooms} />;
      default:
        return (
          <div className="d-flex flex-column align-items-center justify-content-center p-5 text-muted">
            <h5>No timetable selected</h5>
            <p>Please select an export type from the dropdown.</p>
          </div>
        );
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Timetable Export</h2>
        <select
          className="form-select"
          style={{ width: '200px' }}
          value={exportType}
          onChange={(e) => setExportType(e.target.value)}
        >
          <option value="">Select Export Type</option>
          <option value="department">Department</option>
          <option value="faculty">Faculty</option>
          <option value="room">Room</option>
        </select>
      </div>
      <div className="row mb-4" style={{ minHeight: '300px' }}>
        <div className="col-12" ref={timetableRef}>
          {renderTimetableView()}
        </div>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-4 text-center">
          <button
            className="btn btn-primary w-100"
            onClick={handleExport}
            disabled={isExporting || !exportType}
          >
            {isExporting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Exporting...
              </>
            ) : (
              <>
                <Download size={18} className="me-2" />
                Export Timetable
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
