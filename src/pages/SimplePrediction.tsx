import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, AlertTriangle, CheckCircle, Activity, Brain, Droplet } from "lucide-react";

interface DiabetesPrediction {
  prediction: number;
  probability: number;
  fields: string[];
  timestamp?: string;
  patientData?: any;
}

const SimpleDiabetesPredictor = () => {
  const [prediction, setPrediction] = useState<DiabetesPrediction | null>(null);
  const [features, setFeatures] = useState({
    Pregnancies: '',
    Glucose: '',
    BloodPressure: '',
    SkinThickness: '',
    Insulin: '',
    BMI: '',
    DiabetesPedigreeFunction: '',
    Age: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [currentView, setCurrentView] = useState('predict');

  const API_BASE = 'http://127.0.0.1:5000';

  const handleFeatureChange = (featureName: string, value: string) => {
    setFeatures(prev => ({
      ...prev,
      [featureName]: value
    }));
  };

  const handlePredict = async () => {
    if (Object.values(features).some(val => val === '')) {
      alert('Please fill all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE}/predict/diabetes`, {
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
          patientData: features
        });
        setCurrentView('results');
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Failed to make prediction. Make sure the Flask server is running on port 5000.');
    } finally {
      setIsLoading(false);
    }
  };

  const fieldLabels = {
    Pregnancies: 'Number of Pregnancies',
    Glucose: 'Glucose Level (mg/dL)',
    BloodPressure: 'Blood Pressure (mm Hg)',
    SkinThickness: 'Skin Thickness (mm)',
    Insulin: 'Insulin Level (mu U/ml)',
    BMI: 'Body Mass Index',
    DiabetesPedigreeFunction: 'Diabetes Pedigree Function',
    Age: 'Age (years)'
  };

  const renderPredictionForm = () => (
    <div className="min-h-screen p-8 bg-gray-50">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Droplet className="w-8 h-8 text-blue-600" />
            Diabetes Risk Predictor
          </CardTitle>
          <CardDescription className="text-lg">
            Enter patient parameters for AI-powered diabetes risk assessment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(features).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <Label htmlFor={key} className="text-sm font-medium">
                  {fieldLabels[key as keyof typeof fieldLabels]}
                </Label>
                <Input
                  id={key}
                  type="number"
                  step={key === 'BMI' || key === 'DiabetesPedigreeFunction' ? '0.01' : '1'}
                  value={value}
                  onChange={(e) => handleFeatureChange(key, e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md"
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-center pt-6">
            <Button
              onClick={handlePredict}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              {isLoading ? (
                <>
                  <Activity className="w-5 h-5 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="w-5 h-5 mr-2" />
                  Predict Diabetes Risk
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderResults = () => {
    if (!prediction) return null;

    const riskPercentage = Math.round(prediction.probability * 100);
    const riskLevel = prediction.probability < 0.3 ? 'Low' : prediction.probability < 0.7 ? 'Medium' : 'High';
    const riskColor = riskLevel === 'Low' ? 'text-green-600' : riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600';

    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="outline"
            onClick={() => setCurrentView('predict')}
            className="flex items-center gap-2 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Predictor
          </Button>

          <Card className="border shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Droplet className="w-8 h-8 text-blue-600" />
                Diabetes Risk Assessment Results
              </CardTitle>
              <CardDescription>
                Analysis completed on {prediction.timestamp}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-center space-y-4">
                  <div className={`text-6xl font-bold ${riskColor}`}>
                    {riskPercentage}%
                  </div>
                  <Badge 
                    variant={riskLevel === 'Low' ? 'default' : 'destructive'}
                    className="text-lg px-4 py-2"
                  >
                    {riskLevel} Risk
                  </Badge>
                  <div className="text-sm text-gray-600">
                    Diabetes Risk Probability
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Interpretation</h3>
                  <div className="space-y-3">
                    {prediction.prediction === 0 ? (
                      <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg">
                        <CheckCircle className="w-6 h-6 text-green-600 mt-1" />
                        <div>
                          <p className="font-medium text-green-800">Low Diabetes Risk</p>
                          <p className="text-green-700 text-sm mt-1">
                            Based on the provided parameters, the patient shows a low probability of having diabetes.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                        <AlertTriangle className="w-6 h-6 text-red-600 mt-1" />
                        <div>
                          <p className="font-medium text-red-800">High Diabetes Risk</p>
                          <p className="text-red-700 text-sm mt-1">
                            Based on the provided parameters, the patient shows a high probability of having diabetes.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Patient Parameters</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(prediction.patientData).map(([key, value]) => (
                  <div key={key} className="text-center p-4 bg-gray-100 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      {fieldLabels[key as keyof typeof fieldLabels]}
                    </div>
                    <div className="text-lg font-semibold">{value as string}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {riskLevel === 'Low' ? (
                  <>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <p>Continue maintaining a healthy lifestyle with regular exercise and balanced diet.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                      <p>Regular health checkups are recommended to monitor glucose levels.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                      <p>Consult with a healthcare professional for further evaluation and testing.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                      <p>Consider lifestyle modifications including diet changes and increased physical activity.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-600 mt-1" />
                      <p>Monitor blood glucose levels regularly and follow medical advice.</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  return currentView === 'predict' ? renderPredictionForm() : renderResults();
};

export default SimpleDiabetesPredictor;
