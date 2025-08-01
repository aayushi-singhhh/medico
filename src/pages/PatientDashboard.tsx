import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Upload, FileText, Activity, Download, Calendar, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const PatientDashboard = () => {
  const { userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const recentReports = [
    { id: 1, name: "Blood Test Results", date: "2024-01-15", status: "Completed", risk: "Low" },
    { id: 2, name: "Chest X-Ray", date: "2024-01-10", status: "Analyzed", risk: "Normal" },
    { id: 3, name: "Heart Rate Monitor", date: "2024-01-08", status: "Pending", risk: "Medium" },
  ];

  const upcomingAppointments = [
    { id: 1, doctor: "Dr. Sarah Johnson", date: "2024-01-25", time: "10:00 AM", type: "Cardiology" },
    { id: 2, doctor: "Dr. Michael Chen", date: "2024-02-02", time: "2:30 PM", type: "General" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-medical text-white p-6">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Patient Dashboard</h1>
            <p className="opacity-90">Welcome back, {userData?.firstName} {userData?.lastName}</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <User className="w-4 h-4 mr-2" />
              Profile
            </Button>
            <Button 
              onClick={handleLogout}
              variant="outline" 
              className="bg-white/10 border-white/20 text-white hover:bg-white/20"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Link to="/upload-report">
            <Card className="hover:shadow-hover transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Upload Report</h3>
                <p className="text-sm text-muted-foreground">Add new medical documents</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/medical-history">
            <Card className="hover:shadow-hover transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Medical History</h3>
                <p className="text-sm text-muted-foreground">View complete timeline</p>
              </CardContent>
            </Card>
          </Link>

          <Link to="/prediction-results">
            <Card className="hover:shadow-hover transition-all duration-300 transform hover:scale-105 cursor-pointer">
              <CardContent className="p-6 text-center">
                <Activity className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">AI Predictions</h3>
                <p className="text-sm text-muted-foreground">View health insights</p>
              </CardContent>
            </Card>
          </Link>

          <Card className="hover:shadow-hover transition-all duration-300 transform hover:scale-105 cursor-pointer">
            <CardContent className="p-6 text-center">
              <Download className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Download Reports</h3>
              <p className="text-sm text-muted-foreground">Get PDF summaries</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Reports & Analysis</CardTitle>
              <CardDescription>Your latest medical documents and AI assessments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{report.name}</p>
                      <p className="text-sm text-muted-foreground">{report.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={report.status === "Completed" ? "default" : "secondary"}>
                      {report.status}
                    </Badge>
                    <Badge variant={report.risk === "Low" ? "secondary" : report.risk === "Normal" ? "default" : "destructive"}>
                      {report.risk}
                    </Badge>
                  </div>
                </div>
              ))}
              <Link to="/medical-history">
                <Button variant="outline" className="w-full">View All Reports</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled consultations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{appointment.doctor}</p>
                      <p className="text-sm text-muted-foreground">{appointment.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{appointment.date}</p>
                    <p className="text-sm text-muted-foreground">{appointment.time}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full">Schedule New Appointment</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;