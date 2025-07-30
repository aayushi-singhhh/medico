import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, AlertTriangle, CheckCircle, Activity, Brain, Droplet, Heart, Stethoscope, Zap, Shield, TrendingUp, Users, Clock } from "lucide-react";
import { Upload, FileText, Download, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";

interface PredictionResult {
  prediction: number;
  probability: number;
  fields: string[];
  timestamp?: string;
  patientData?: any;
  diseaseType?: string;
}

interface DiseaseConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
  bgGradient: string;
  fields: Record<string, {
    label: string;
    placeholder: string;
    type: string;
    step?: string;
    min?: string;
    max?: string;
  }>;
  endpoint: string;
  description: string;
  stats?: {
    prevalence: string;
    accuracy: string;
  };
}

const MultiDiseasePredictor = () => {
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<string>('diabetes');
  const [features, setFeatures] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('predict');
  
  const API_BASE = 'http://127.0.0.1:5000';

  // Enhanced disease configurations with gradients and stats
  const diseaseConfigs: Record<string, DiseaseConfig> = {
    diabetes: {
      name: 'Diabetes Risk Assessment',
      icon: <Droplet className="w-6 h-6" />,
      color: 'text-blue-600',
      bgGradient: 'from-blue-500 to-cyan-600',
      description: 'AI-powered diabetes risk prediction using patient metabolic parameters',
      endpoint: '/predict/diabetes',
      stats: {
        prevalence: '11.3% globally',
        accuracy: '94.2% accuracy'
      },
      fields: {
        Pregnancies: {
          label: 'Number of Pregnancies',
          placeholder: '0-17',
          type: 'number',
          min: '0',
          max: '17'
        },
        Glucose: {
          label: 'Glucose Level (mg/dL)',
          placeholder: '0-200',
          type: 'number',
          min: '0',
          max: '200'
        },
        BloodPressure: {
          label: 'Blood Pressure (mm Hg)',
          placeholder: '0-122',
          type: 'number',
          min: '0',
          max: '122'
        },
        SkinThickness: {
          label: 'Skin Thickness (mm)',
          placeholder: '0-100',
          type: 'number',
          min: '0',
          max: '100'
        },
        Insulin: {
          label: 'Insulin Level (mu U/ml)',
          placeholder: '0-846',
          type: 'number',
          min: '0',
          max: '846'
        },
        BMI: {
          label: 'Body Mass Index',
          placeholder: '0.0-67.1',
          type: 'number',
          step: '0.1',
          min: '0',
          max: '67.1'
        },
        DiabetesPedigreeFunction: {
          label: 'Diabetes Pedigree Function',
          placeholder: '0.078-2.42',
          type: 'number',
          step: '0.001',
          min: '0.078',
          max: '2.42'
        },
        Age: {
          label: 'Age (years)',
          placeholder: '21-81',
          type: 'number',
          min: '21',
          max: '81'
        }
      }
    },
    heart: {
      name: 'Heart Disease Risk Assessment',
      icon: <Heart className="w-6 h-6" />,
      color: 'text-red-600',
      bgGradient: 'from-red-500 to-pink-600',
      description: 'Cardiovascular risk prediction using clinical parameters',
      endpoint: '/predict/heart',
      stats: {
        prevalence: '6.2% globally',
        accuracy: '91.8% accuracy'
      },
      fields: {
        Age: {
          label: 'Age (years)',
          placeholder: '20-80',
          type: 'number',
          min: '20',
          max: '80'
        },
        Sex: {
          label: 'Sex (1=Male, 0=Female)',
          placeholder: '0 or 1',
          type: 'number',
          min: '0',
          max: '1'
        },
        ChestPainType: {
          label: 'Chest Pain Type (0-3)',
          placeholder: '0-3',
          type: 'number',
          min: '0',
          max: '3'
        },
        RestingBP: {
          label: 'Resting Blood Pressure (mm Hg)',
          placeholder: '80-200',
          type: 'number',
          min: '80',
          max: '200'
        },
        Cholesterol: {
          label: 'Cholesterol Level (mg/dL)',
          placeholder: '100-600',
          type: 'number',
          min: '100',
          max: '600'
        },
        FastingBS: {
          label: 'Fasting Blood Sugar >120 (1=Yes, 0=No)',
          placeholder: '0 or 1',
          type: 'number',
          min: '0',
          max: '1'
        },
        RestingECG: {
          label: 'Resting ECG (0-2)',
          placeholder: '0-2',
          type: 'number',
          min: '0',
          max: '2'
        },
        MaxHR: {
          label: 'Maximum Heart Rate',
          placeholder: '60-220',
          type: 'number',
          min: '60',
          max: '220'
        },
        ExerciseAngina: {
          label: 'Exercise Induced Angina (1=Yes, 0=No)',
          placeholder: '0 or 1',
          type: 'number',
          min: '0',
          max: '1'
        },
        Oldpeak: {
          label: 'ST Depression',
          placeholder: '0-6',
          type: 'number',
          step: '0.1',
          min: '0',
          max: '6'
        }
      }
    },
    kidney: {
      name: 'Kidney Disease Risk Assessment',
      icon: <Stethoscope className="w-6 h-6" />,
      color: 'text-green-600',
      bgGradient: 'from-green-500 to-emerald-600',
      description: 'Chronic kidney disease risk prediction',
      endpoint: '/predict/kidney',
      stats: {
        prevalence: '8-16% globally',
        accuracy: '89.5% accuracy'
      },
      fields: {
        Age: {
          label: 'Age (years)',
          placeholder: '18-90',
          type: 'number',
          min: '18',
          max: '90'
        },
        BloodPressure: {
          label: 'Blood Pressure (mm Hg)',
          placeholder: '70-180',
          type: 'number',
          min: '70',
          max: '180'
        },
        SpecificGravity: {
          label: 'Specific Gravity',
          placeholder: '1.005-1.025',
          type: 'number',
          step: '0.001',
          min: '1.005',
          max: '1.025'
        },
        Albumin: {
          label: 'Albumin (0-5)',
          placeholder: '0-5',
          type: 'number',
          min: '0',
          max: '5'
        },
        Sugar: {
          label: 'Sugar (0-5)',
          placeholder: '0-5',
          type: 'number',
          min: '0',
          max: '5'
        }
      }
    },
    liver: {
      name: 'Liver Disease Risk Assessment',
      icon: <Zap className="w-6 h-6" />,
      color: 'text-amber-600',
      bgGradient: 'from-amber-500 to-orange-600',
      description: 'Liver disease risk prediction using biochemical markers',
      endpoint: '/predict/liver',
      stats: {
        prevalence: '25% globally',
        accuracy: '87.3% accuracy'
      },
      fields: {
        Age: {
          label: 'Age (years)',
          placeholder: '18-90',
          type: 'number',
          min: '18',
          max: '90'
        },
        Gender: {
          label: 'Gender (1=Male, 0=Female)',
          placeholder: '0 or 1',
          type: 'number',
          min: '0',
          max: '1'
        },
        TotalBilirubin: {
          label: 'Total Bilirubin (mg/dL)',
          placeholder: '0.1-75',
          type: 'number',
          step: '0.1',
          min: '0.1',
          max: '75'
        },
        DirectBilirubin: {
          label: 'Direct Bilirubin (mg/dL)',
          placeholder: '0.1-20',
          type: 'number',
          step: '0.1',
          min: '0.1',
          max: '20'
        },
        AlkalinePhosphatase: {
          label: 'Alkaline Phosphatase (IU/L)',
          placeholder: '63-2110',
          type: 'number',
          min: '63',
          max: '2110'
        }
      }
    }
  };

  // Initialize features when component mounts or disease changes
  React.useEffect(() => {
    const newFeatures: Record<string, string> = {};
    Object.keys(diseaseConfigs[selectedDisease].fields).forEach(field => {
      newFeatures[field] = '';
    });
    setFeatures(newFeatures);
    setPrediction(null);
  }, [selectedDisease]);

  const handleDiseaseChange = (disease: string) => {
    setSelectedDisease(disease);
    setCurrentView('predict');
  };

  const handleFeatureChange = (featureName: string, value: string) => {
    setFeatures(prev => ({
      ...prev,
      [featureName]: value
    }));
  };

  const handlePredict = async () => {
    const currentFields = Object.keys(diseaseConfigs[selectedDisease].fields);
    if (currentFields.some(field => features[field] === '' || features[field] === undefined)) {
      alert('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = diseaseConfigs[selectedDisease].endpoint;
      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(features)
      });

      const result = await response.json();
      if (response.ok) {
        setPrediction({
          ...result,
          timestamp: new Date().toLocaleString(),
          patientData: features,
          diseaseType: selectedDisease
        });
        setCurrentView('results');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Prediction error:', error);
      alert(`Failed to make prediction. Make sure the Flask server is running and supports ${selectedDisease} prediction.`);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskLevel = (probability: number) => {
    if (probability < 0.3) return 'Low';
    if (probability < 0.7) return 'Medium';
    return 'High';
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-green-600";
      case "Medium": return "text-amber-600";
      case "High": return "text-red-600";
      default: return "text-gray-600";
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Low": return <CheckCircle className="w-5 h-5" />;
      case "Medium": return <AlertTriangle className="w-5 h-5" />;
      case "High": return <AlertTriangle className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const renderPredictionForm = () => {
    const currentConfig = diseaseConfigs[selectedDisease];
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        {/* Header */}
        <header className="bg-gradient-medical text-white p-6">
          <div className="container mx-auto flex items-center gap-4">
            <Link to="/patient-dashboard">
              <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">AI Health Predictor</h1>
              <p className="opacity-90">Provide medical data for AI analysis</p>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          {/* Disease Selection */}
          <Card className="bg-white border-0 shadow-2xl mb-8">
            <CardContent className="p-8">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  Select Disease Assessment
                </h2>
                <p className="text-gray-600">Choose the medical condition you'd like to assess</p>
              </div>
              
              <Select value={selectedDisease} onValueChange={handleDiseaseChange}>
                <SelectTrigger className="w-full p-20 text-lg border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 rounded-2xl bg-white shadow-lg hover:shadow-xl">
                  <SelectValue placeholder="Choose a disease to predict..." className="text-gray-700" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-2 max-h-[32rem] overflow-y-auto bg-white shadow-2xl">
                  {Object.entries(diseaseConfigs).map(([key, config]) => (
                    <SelectItem key={key} value={key} className="p-6 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 rounded-xl cursor-pointer transition-all duration-200 m-1">
                      <div className="flex items-center gap-6 w-full">
                        <div className={`p-3 rounded-xl bg-gradient-to-r ${config.bgGradient} text-white shadow-lg flex-shrink-0`}>
                          {config.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 text-lg truncate">{config.name}</div>
                          <div className="text-gray-600 mt-1 text-sm line-clamp-2">{config.description}</div>
                          <div className="flex gap-3 mt-3">
                            <span className="text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                              {config.stats?.prevalence}
                            </span>
                            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
                              {config.stats?.accuracy}
                            </span>
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Selected Disease Info Card */}
          <Card className={`mb-8 border-0 shadow-2xl bg-gradient-to-r ${currentConfig.bgGradient} text-white overflow-hidden relative`}>
            <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-black/10"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg border border-white/30">
                  <div className="text-white">
                    {currentConfig.icon}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold mb-2 text-white drop-shadow-lg">{currentConfig.name}</h3>
                  <p className="text-white/90 text-lg mb-4 drop-shadow">{currentConfig.description}</p>
                  <div className="flex gap-4">
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors backdrop-blur-sm">
                      <Users className="w-4 h-4 mr-2" />
                      {currentConfig.stats?.prevalence}
                    </Badge>
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 transition-colors backdrop-blur-sm">
                      <TrendingUp className="w-4 h-4 mr-2" />
                      {currentConfig.stats?.accuracy}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Input Fields Section */}
          <Card className="bg-white border-0 shadow-2xl">
            <CardContent className="p-8">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <div className="w-2 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                  Patient Clinical Parameters
                </h3>
                <p className="text-gray-600">Enter the patient's medical information for accurate risk assessment</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Object.entries(currentConfig.fields).map(([fieldName, fieldConfig]) => (
                  <div key={fieldName} className="group space-y-3">
                    <Label htmlFor={fieldName} className="text-sm font-bold text-gray-700 block">
                      {fieldConfig.label}
                    </Label>
                    <div className="relative">
                      <Input
                        id={fieldName}
                        type={fieldConfig.type}
                        step={fieldConfig.step}
                        min={fieldConfig.min}
                        max={fieldConfig.max}
                        placeholder={fieldConfig.placeholder}
                        value={features[fieldName] || ''}
                        onChange={(e) => handleFeatureChange(fieldName, e.target.value)}
                        className="w-full p-4 border-2 border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 rounded-xl text-base bg-white group-hover:shadow-lg focus:shadow-lg"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Submit Button */}
              <div className="flex justify-center pt-12">
                <Button
                  onClick={handlePredict}
                  disabled={isLoading}
                  className={`px-12 py-6 text-lg font-bold rounded-2xl shadow-2xl transition-all duration-300 transform hover:scale-105 border-0 ${
                    isLoading 
                      ? 'bg-green-600 cursor-not-allowed text-white' 
                      : `bg-gradient-to-r ${currentConfig.bgGradient} hover:shadow-2xl text-white hover:brightness-110`
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-3">
                      <Activity className="w-6 h-6 animate-spin" />
                      <span>Analyzing Patient Data...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Brain className="w-6 h-6" />
                      <span>Predict {currentConfig.name.split(' ')[0]} Risk</span>
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const renderResults = () => {
    if (!prediction) return null;

    const riskPercentage = Math.round(prediction.probability * 100);
    const riskLevel = getRiskLevel(prediction.probability);
    const riskColor = getRiskColor(riskLevel);
    const currentConfig = diseaseConfigs[prediction.diseaseType || 'diabetes'];

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="outline"
            onClick={() => setCurrentView('predict')}
            className="flex items-center gap-3 px-6 py-4 rounded-2xl border-2 hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm mb-8"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Assessment
          </Button>

          {/* Main Result Card */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl mb-8 overflow-hidden">
            <CardHeader className="pb-6 bg-gradient-to-r from-gray-50 to-blue-50">
              <CardTitle className="flex items-center gap-6 text-4xl">
                <div className={`p-4 bg-gradient-to-r ${currentConfig.bgGradient} rounded-2xl shadow-lg text-white`}>
                  {currentConfig.icon}
                </div>
                <div>
                  <div className="text-gray-900">{currentConfig.name} Results</div>
                  <CardDescription className="text-lg text-gray-600 mt-2 flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Analysis completed on {prediction.timestamp}
                  </CardDescription>
                </div>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="text-center space-y-8">
                  <div className={`text-8xl font-bold ${riskColor} drop-shadow-2xl`}>
                    {riskPercentage}%
                  </div>
                  <Badge 
                    variant={riskLevel === 'Low' ? 'default' : 'destructive'}
                    className={`text-2xl px-8 py-4 rounded-2xl shadow-2xl border-0 ${
                      riskLevel === 'Low' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 
                      riskLevel === 'Medium' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
                      'bg-gradient-to-r from-red-500 to-pink-600'
                    } text-white`}
                  >
                    {getRiskIcon(riskLevel)}
                    <span className="ml-3">{riskLevel} Risk</span>
                  </Badge>
                  <div className="space-y-6">
                    <div className="relative">
                      <Progress 
                        value={riskPercentage}
                        className="h-8 w-full rounded-full shadow-inner bg-gray-200"
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20"></div>
                    </div>
                    <div className="text-xl font-bold text-gray-700">
                      {currentConfig.name.split(' ')[0]} Risk Probability
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <h3 className="text-3xl font-bold text-gray-900">Clinical Interpretation</h3>
                  <div className="space-y-6">
                    {prediction.prediction === 0 ? (
                      <div className="flex items-start gap-6 p-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200 shadow-lg">
                        <div className="p-3 bg-green-100 rounded-full">
                          <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <div>
                          <p className="font-bold text-green-900 text-2xl mb-3">Low Risk Assessment</p>
                          <p className="text-green-800 text-lg leading-relaxed">
                            Based on the clinical parameters provided, the patient demonstrates a low probability 
                            of developing {selectedDisease}. Continue with preventive measures and regular monitoring.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-6 p-8 bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl border-2 border-red-200 shadow-lg">
                        <div className="p-3 bg-red-100 rounded-full">
                          <AlertTriangle className="w-8 h-8 text-red-600" />
                        </div>
                        <div>
                          <p className="font-bold text-red-900 text-2xl mb-3">High Risk Assessment</p>
                          <p className="text-red-800 text-lg leading-relaxed">
                            Based on the clinical parameters provided, the patient shows elevated risk factors 
                            for {selectedDisease}. Immediate medical consultation and intervention are recommended.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Patient Data Summary */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl mb-8">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                <div className="w-3 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                Patient Clinical Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {Object.entries(prediction.patientData).map(([key, value]) => (
                  <div key={key} className="group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                      <div className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wide">
                        {currentConfig.fields[key]?.label || key}
                      </div>
                      <div className="text-2xl font-bold text-gray-900">{value as string}</div>
                      <div className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
              <CardTitle className="text-3xl font-bold text-gray-900 flex items-center gap-4">
                <div className="w-3 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                Medical Recommendations
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                Personalized recommendations based on your risk assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {riskLevel === 'Low' ? (
                  <>
                    <div className="group relative overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start gap-6 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg text-white">
                          <CheckCircle className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-green-900 text-xl mb-3">Maintain Healthy Lifestyle</h4>
                          <p className="text-green-800 text-base leading-relaxed">Continue with regular exercise, balanced nutrition, and healthy habits to maintain your low risk status.</p>
                        </div>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start gap-6 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg text-white">
                          <Activity className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-green-900 text-xl mb-3">Regular Health Monitoring</h4>
                          <p className="text-green-800 text-base leading-relaxed">Schedule routine checkups to monitor relevant health parameters and catch any changes early.</p>
                        </div>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start gap-6 p-8 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 shadow-lg">
                        <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg text-white">
                          <Users className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-green-900 text-xl mb-3">Family History Awareness</h4>
                          <p className="text-green-800 text-base leading-relaxed">Stay informed about family medical history and genetic predisposition factors for continued prevention.</p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="group relative overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start gap-6 p-8 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 shadow-lg">
                        <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg text-white">
                          <AlertTriangle className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-red-900 text-xl mb-3">Immediate Medical Consultation</h4>
                          <p className="text-red-800 text-base leading-relaxed">Consult with a healthcare professional immediately for comprehensive evaluation and personalized treatment planning.</p>
                        </div>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start gap-6 p-8 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 shadow-lg">
                        <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg text-white">
                          <TrendingUp className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-red-900 text-xl mb-3">Lifestyle Modification</h4>
                          <p className="text-red-800 text-base leading-relaxed">Implement immediate changes including dietary modifications, increased physical activity, and stress management.</p>
                        </div>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start gap-6 p-8 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 shadow-lg">
                        <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg text-white">
                          <Activity className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-red-900 text-xl mb-3">Regular Monitoring & Follow-up</h4>
                          <p className="text-red-800 text-base leading-relaxed">Establish a regular monitoring schedule with frequent follow-up appointments to track progress and adjust treatment.</p>
                        </div>
                      </div>
                    </div>
                    <div className="group relative overflow-hidden rounded-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-start gap-6 p-8 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 shadow-lg">
                        <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-2xl shadow-lg text-white">
                          <Stethoscope className="w-8 h-8" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-red-900 text-xl mb-3">Additional Diagnostic Testing</h4>
                          <p className="text-red-800 text-base leading-relaxed">Consider comprehensive diagnostic tests as recommended by your healthcare provider for accurate diagnosis and treatment planning.</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Footer Info */}
          <div className="text-center mt-12 p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-blue-600" />
              <span className="text-lg font-bold text-gray-900">Medical Disclaimer</span>
            </div>
            <p className="text-gray-700 max-w-4xl mx-auto leading-relaxed">
              This AI-powered risk assessment is designed to support healthcare decisions and should not replace professional medical advice. 
              Always consult with qualified healthcare providers for accurate diagnosis and treatment recommendations.
            </p>
          </div>
        </div>
      </div>
    );
  };

  return currentView === 'predict' ? renderPredictionForm() : renderResults();
};

export default MultiDiseasePredictor;