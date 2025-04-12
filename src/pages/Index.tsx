
import React, { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePatient, PatientProvider } from '@/contexts/PatientContext';
import RecordingPanel from '@/components/RecordingPanel';
import TranscriptPanel from '@/components/TranscriptPanel';
import StructuredDataPanel from '@/components/StructuredDataPanel';
import ReportPanel from '@/components/ReportPanel';
import PatientInfoPanel from '@/components/PatientInfoPanel';
import { Play, Users, FileText, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Main Dashboard Component
const Dashboard = () => {
  const { patients, appointments, setCurrentPatient, setCurrentAppointment } = usePatient();
  
  // Set demo data on component mount
  useEffect(() => {
    const activeAppointment = appointments.find(appt => appt.status === 'active');
    
    if (activeAppointment) {
      const patient = patients.find(p => p.id === activeAppointment.patientId);
      if (patient) {
        setCurrentPatient(patient);
        setCurrentAppointment(activeAppointment);
      }
    }
  }, [appointments, patients, setCurrentAppointment, setCurrentPatient]);

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3 space-y-6">
          {/* Main Section */}
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Рабочая область</h1>
            <Button asChild variant="ghost">
              <Link to="/patients" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                <span>Все пациенты</span>
              </Link>
            </Button>
          </div>
          
          {/* Patient Info */}
          <PatientInfoPanel />
          
          {/* Recording Panel */}
          <RecordingPanel />
          
          {/* Transcript Panel */}
          <TranscriptPanel />
        </div>
        
        <div className="lg:w-1/3 space-y-6">
          {/* Structured Data Panel */}
          <StructuredDataPanel />
          
          {/* Report Generation Panel */}
          <ReportPanel />
        </div>
      </div>
    </div>
  );
};

// Application wrapper with context
const Index = () => {
  return (
    <PatientProvider>
      <Layout>
        <Dashboard />
      </Layout>
    </PatientProvider>
  );
};

export default Index;
