
import React from 'react';
import Layout from '@/components/Layout';
import { usePatient } from '@/contexts/PatientContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const PatientsList = () => {
  const { patients, appointments } = usePatient();
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Список пациентов</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patients.map(patient => {
          const patientAppointments = appointments.filter(a => a.patientId === patient.id);
          const latestAppointment = patientAppointments.sort((a, b) => 
            new Date(b.date).getTime() - new Date(a.date).getTime()
          )[0];
          
          return (
            <Link to="/" key={patient.id}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <div className="w-8 h-8 rounded-full bg-medical-light flex items-center justify-center text-medical-primary mr-2">
                      <User className="h-4 w-4" />
                    </div>
                    {patient.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      {patient.age} лет, {patient.gender === 'male' ? 'муж.' : 'жен.'}
                    </div>
                    
                    {latestAppointment && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">
                          {new Date(latestAppointment.date).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-3 flex justify-between items-center">
                    {latestAppointment && (
                      <Badge variant={
                        latestAppointment.status === 'scheduled' ? 'outline' :
                        latestAppointment.status === 'active' ? 'default' : 'secondary'
                      } className="text-xs">
                        {latestAppointment.status === 'scheduled' ? 'Запланирован' :
                         latestAppointment.status === 'active' ? 'Активен' : 'Завершен'}
                      </Badge>
                    )}
                    
                    {latestAppointment?.diagnosis && latestAppointment.diagnosis.length > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {latestAppointment.diagnosis[0]}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const Patients = () => {
  return (
    <Layout>
      <PatientsList />
    </Layout>
  );
};

export default Patients;
