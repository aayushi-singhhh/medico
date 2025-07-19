import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, FileText, Activity, Search, Filter, Download, ArrowLeft, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const MedicalHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");

  const historyEntries = [
    {
      id: 1,
      date: "2024-01-15",
      type: "Blood Test",
      title: "Complete Blood Count & Metabolic Panel",
      doctor: "Dr. Sarah Johnson",
      status: "Completed",
      aiAnalysis: true,
      risk: "Low",
      summary: "All values within normal range. Slight elevation in cholesterol noted.",
      tags: ["Lab Results", "Routine Check"]
    },
    {
      id: 2,
      date: "2024-01-10",
      type: "X-Ray",
      title: "Chest X-Ray - Annual Screening",
      doctor: "Dr. Michael Chen",
      status: "Analyzed",
      aiAnalysis: true,
      risk: "Normal",
      summary: "Clear lung fields, normal heart size. No abnormalities detected.",
      tags: ["Imaging", "Preventive Care"]
    },
    {
      id: 3,
      date: "2024-01-08",
      type: "Monitoring",
      title: "24-Hour Heart Rate Monitor",
      doctor: "Dr. Sarah Johnson",
      status: "Under Review",
      aiAnalysis: true,
      risk: "Medium",
      summary: "Elevated resting heart rate patterns observed. Recommend cardiology consultation.",
      tags: ["Cardiology", "Monitoring"]
    },
    {
      id: 4,
      date: "2024-01-05",
      type: "Consultation",
      title: "Follow-up Visit - Hypertension",
      doctor: "Dr. Sarah Johnson",
      status: "Completed",
      aiAnalysis: false,
      risk: null,
      summary: "Blood pressure well controlled with current medication. Continue monitoring.",
      tags: ["Follow-up", "Medication Review"]
    },
    {
      id: 5,
      date: "2023-12-20",
      type: "MRI",
      title: "Brain MRI - Headache Investigation",
      doctor: "Dr. Lisa Park",
      status: "Completed",
      aiAnalysis: true,
      risk: "Low",
      summary: "No structural abnormalities detected. Likely tension-type headaches.",
      tags: ["Imaging", "Neurology"]
    },
    {
      id: 6,
      date: "2023-12-15",
      type: "Lab Results",
      title: "Thyroid Function Test",
      doctor: "Dr. Michael Chen",
      status: "Completed",
      aiAnalysis: true,
      risk: "Normal",
      summary: "TSH and T4 levels normal. No thyroid dysfunction detected.",
      tags: ["Lab Results", "Endocrinology"]
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Blood Test":
      case "Lab Results":
        return <Activity className="w-5 h-5" />;
      case "X-Ray":
      case "MRI":
        return <FileText className="w-5 h-5" />;
      case "Consultation":
        return <Calendar className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const filteredEntries = historyEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === "all" || entry.type.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-medical text-white p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/patient-dashboard">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Medical History Timeline</h1>
              <p className="opacity-90">Complete overview of your healthcare journey</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Download className="w-4 h-4 mr-2" />
              Share with Doctor
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Filters and Search */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Filter & Search</CardTitle>
            <CardDescription>Find specific medical records and reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search records..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Records</SelectItem>
                  <SelectItem value="blood">Blood Tests</SelectItem>
                  <SelectItem value="xray">X-Rays</SelectItem>
                  <SelectItem value="mri">MRI Scans</SelectItem>
                  <SelectItem value="consultation">Consultations</SelectItem>
                  <SelectItem value="lab">Lab Results</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date-desc">Newest First</SelectItem>
                  <SelectItem value="date-asc">Oldest First</SelectItem>
                  <SelectItem value="type">By Type</SelectItem>
                  <SelectItem value="doctor">By Doctor</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <div className="space-y-6">
          {filteredEntries.map((entry, index) => (
            <div key={entry.id} className="relative">
              {/* Timeline line */}
              {index < filteredEntries.length - 1 && (
                <div className="absolute left-6 top-16 w-0.5 h-full bg-border -z-10" />
              )}
              
              <Card className="shadow-card hover:shadow-hover transition-all duration-300">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Timeline dot and icon */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        {getTypeIcon(entry.type)}
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground text-center">
                        {entry.date}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold mb-1">{entry.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {entry.type} • {entry.doctor}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {entry.aiAnalysis && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              AI Analyzed
                            </Badge>
                          )}
                          <Badge variant={entry.status === "Completed" ? "default" : "secondary"}>
                            {entry.status}
                          </Badge>
                          {entry.risk && (
                            <Badge variant={
                              entry.risk === "Low" || entry.risk === "Normal" ? "secondary" :
                              entry.risk === "Medium" ? "default" : "destructive"
                            }>
                              {entry.risk} Risk
                            </Badge>
                          )}
                        </div>
                      </div>

                      <p className="text-sm mb-4 leading-relaxed">{entry.summary}</p>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {entry.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-1" />
                            Download
                          </Button>
                          {entry.aiAnalysis && (
                            <Link to="/prediction-results">
                              <Button variant="outline" size="sm">
                                <Activity className="w-4 h-4 mr-1" />
                                AI Analysis
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-8">
          <Button variant="outline">Load More Records</Button>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistory;