import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, AlertTriangle, CheckCircle, Activity, Brain, TrendingUp, Download, Calendar, Upload } from "lucide-react";
import { Link } from "react-router-dom";

const PredictionResults = () => {
  const predictions = [
    {
      id: 1,
      type: "Disease Risk Assessment",
      report: "Blood Test Results",
      date: "2024-01-15",
      confidence: 92,
      risk: "Low",
      findings: [
        "Cholesterol levels within normal range",
        "Blood glucose slightly elevated but manageable",
        "Liver function excellent",
        "No signs of diabetes progression"
      ],
      recommendations: [
        "Maintain current diet and exercise routine",
        "Monitor blood glucose monthly",
        "Consider reducing sugar intake"
      ]
    },
    {
      id: 2,
      type: "Medical Image Analysis",
      report: "Chest X-Ray",
      date: "2024-01-10",
      confidence: 87,
      risk: "Normal",
      findings: [
        "No signs of pneumonia or infection",
        "Heart size normal",
        "Lung fields clear",
        "No abnormal masses detected"
      ],
      recommendations: [
        "Continue regular check-ups",
        "Maintain good respiratory hygiene"
      ]
    },
    {
      id: 3,
      type: "Trend Analysis",
      report: "Heart Rate Monitor",
      date: "2024-01-08",
      confidence: 78,
      risk: "Medium",
      findings: [
        "Resting heart rate trending upward",
        "Exercise recovery time increased",
        "Occasional irregular rhythms detected",
        "Blood pressure correlation noted"
      ],
      recommendations: [
        "Schedule cardiology consultation",
        "Increase cardiovascular exercise gradually",
        "Monitor stress levels",
        "Consider 24-hour Holter monitor"
      ]
    }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600";
      case "Normal": return "text-blue-600";
      case "Medium": return "text-yellow-600";
      case "High": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Low": case "Normal": return <CheckCircle className="w-5 h-5" />;
      case "Medium": return <AlertTriangle className="w-5 h-5" />;
      case "High": return <AlertTriangle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

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
              <h1 className="text-3xl font-bold">AI Prediction Results</h1>
              <p className="opacity-90">Your personalized health insights and risk assessments</p>
            </div>
          </div>
          <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold">3</h3>
              <p className="text-sm text-muted-foreground">AI Analyses Completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">2</h3>
              <p className="text-sm text-muted-foreground">Low Risk Results</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <AlertTriangle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold">1</h3>
              <p className="text-sm text-muted-foreground">Medium Risk Alert</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold">87%</h3>
              <p className="text-sm text-muted-foreground">Avg. Confidence</p>
            </CardContent>
          </Card>
        </div>

        {/* Prediction Results */}
        <div className="space-y-6">
          {predictions.map((prediction) => (
            <Card key={prediction.id} className="shadow-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${getRiskColor(prediction.risk)}`}>
                      {getRiskIcon(prediction.risk)}
                    </div>
                    <div>
                      <CardTitle className="text-xl">{prediction.type}</CardTitle>
                      <CardDescription>
                        Based on: {prediction.report} • {prediction.date}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={prediction.risk === "Low" || prediction.risk === "Normal" ? "secondary" : 
                                   prediction.risk === "Medium" ? "default" : "destructive"}>
                      {prediction.risk} Risk
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      {prediction.confidence}% confidence
                    </p>
                  </div>
                </div>
                <Progress value={prediction.confidence} className="mt-4" />
              </CardHeader>

              <CardContent>
                <Tabs defaultValue="findings" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="findings">Key Findings</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                  </TabsList>

                  <TabsContent value="findings" className="mt-4">
                    <div className="space-y-3">
                      {prediction.findings.map((finding, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                          <p className="text-sm">{finding}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="recommendations" className="mt-4">
                    <div className="space-y-3">
                      {prediction.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                          <CheckCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-3 mt-6">
                  <Button variant="outline" size="sm">
                    View Original Report
                  </Button>
                  <Button variant="outline" size="sm">
                    Share with Doctor
                  </Button>
                  <Button variant="outline" size="sm">
                    Get Second Opinion
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Panel */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>
              Based on your AI analysis results, here are some recommended actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <Button variant="medical" className="h-auto p-4 flex-col">
                <Calendar className="w-6 h-6 mb-2" />
                <span>Schedule Follow-up</span>
                <span className="text-xs opacity-75">Book appointment with specialist</span>
              </Button>
              
              <Link to="/upload-report">
                <Button variant="outline" className="h-auto p-4 flex-col w-full">
                  <Upload className="w-6 h-6 mb-2" />
                  <span>Upload More Reports</span>
                  <span className="text-xs opacity-75">Add additional medical data</span>
                </Button>
              </Link>
              
              <Link to="/medical-history">
                <Button variant="outline" className="h-auto p-4 flex-col w-full">
                  <TrendingUp className="w-6 h-6 mb-2" />
                  <span>View Trends</span>
                  <span className="text-xs opacity-75">See your health timeline</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PredictionResults;