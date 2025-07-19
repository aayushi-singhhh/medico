import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, FileText, Activity, Search, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

const DoctorDashboard = () => {
  const patients = [
    { id: 1, name: "John Doe", age: 45, lastVisit: "2024-01-15", condition: "Hypertension", risk: "Medium" },
    { id: 2, name: "Sarah Johnson", age: 32, lastVisit: "2024-01-14", condition: "Diabetes", risk: "High" },
    { id: 3, name: "Michael Chen", age: 58, lastVisit: "2024-01-12", condition: "Heart Disease", risk: "High" },
    { id: 4, name: "Emily Davis", age: 29, lastVisit: "2024-01-10", condition: "Asthma", risk: "Low" },
  ];

  const todayAppointments = [
    { id: 1, patient: "John Doe", time: "10:00 AM", type: "Follow-up", status: "Confirmed" },
    { id: 2, patient: "Sarah Johnson", time: "11:30 AM", type: "Consultation", status: "Pending" },
    { id: 3, patient: "Michael Chen", time: "2:00 PM", type: "Check-up", status: "Confirmed" },
  ];

  const recentAlerts = [
    { id: 1, patient: "Sarah Johnson", alert: "High glucose levels detected", severity: "High", time: "2 hours ago" },
    { id: 2, patient: "Michael Chen", alert: "Blood pressure reading outside normal range", severity: "Medium", time: "4 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-medical text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Doctor Dashboard</h1>
            <p className="opacity-90">Dr. Sarah Williams - Cardiology</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Link to="/">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold">127</h3>
              <p className="text-sm text-muted-foreground">Total Patients</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold">8</h3>
              <p className="text-sm text-muted-foreground">Today's Appointments</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h3 className="text-2xl font-bold">3</h3>
              <p className="text-sm text-muted-foreground">Critical Alerts</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold">45</h3>
              <p className="text-sm text-muted-foreground">Reports Reviewed</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Patient List */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Patient List</CardTitle>
              <CardDescription>Manage your assigned patients</CardDescription>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search patients..." className="pl-10" />
                </div>
                <Button variant="medical">Add Patient</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {patients.map((patient) => (
                <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{patient.name}</p>
                      <p className="text-sm text-muted-foreground">Age: {patient.age} • Last visit: {patient.lastVisit}</p>
                      <p className="text-sm text-muted-foreground">{patient.condition}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={patient.risk === "Low" ? "secondary" : patient.risk === "Medium" ? "default" : "destructive"}>
                      {patient.risk} Risk
                    </Badge>
                    <Link to="/medical-history">
                      <Button variant="outline" size="sm">View History</Button>
                    </Link>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-6">
            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Schedule</CardTitle>
                <CardDescription>Your appointments for today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {todayAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">{appointment.patient}</p>
                      <p className="text-sm text-muted-foreground">{appointment.time} • {appointment.type}</p>
                    </div>
                    <Badge variant={appointment.status === "Confirmed" ? "default" : "secondary"}>
                      {appointment.status}
                    </Badge>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View Full Schedule</Button>
              </CardContent>
            </Card>

            {/* Critical Alerts */}
            <Card>
              <CardHeader>
                <CardTitle>Critical Alerts</CardTitle>
                <CardDescription>Patients requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 border rounded-lg border-destructive/20 bg-destructive/5">
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-medium text-destructive">{alert.patient}</p>
                      <Badge variant="destructive" className="text-xs">
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm mb-2">{alert.alert}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                ))}
                <Button variant="outline" className="w-full">View All Alerts</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;