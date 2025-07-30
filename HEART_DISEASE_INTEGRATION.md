# Heart Disease Prediction Integration

## Overview
The heart disease prediction model has been successfully integrated into the Medico application. The system now supports both diabetes and heart disease risk assessment using machine learning models.

## Backend Integration

### Heart Disease Model
- **Model File**: `heart_model.pkl`
- **Type**: Random Forest Classifier
- **Features**: 13 clinical parameters
- **Endpoint**: `/predict/heart`
- **Port**: 5001

### Heart Disease Features
The model requires the following 13 features:

1. **Age** (years): 20-80
2. **Sex**: 1=Male, 0=Female  
3. **ChestPainType**: 0-3 (chest pain type)
4. **RestingBP** (mm Hg): 80-200 (resting blood pressure)
5. **Cholesterol** (mg/dL): 100-600 (cholesterol level)
6. **FastingBS**: 1=Yes, 0=No (fasting blood sugar >120)
7. **RestingECG**: 0-2 (resting ECG results)
8. **MaxHR**: 60-220 (maximum heart rate)
9. **ExerciseAngina**: 1=Yes, 0=No (exercise induced angina)
10. **Oldpeak**: 0-6 (ST depression)
11. **ST_Slope**: 0=Down, 1=Flat, 2=Up (ST slope)
12. **Ca**: 0-4 (number of major vessels)
13. **Thal**: 1=Normal, 2=Fixed, 3=Reversible (thalassemia)

## Frontend Integration

### Multi-Disease Predictor
The frontend now includes a comprehensive multi-disease prediction interface at `/prediction-results` that supports:

- **Disease Selection**: Dropdown menu to choose between different conditions
- **Dynamic Forms**: Auto-generated forms based on disease type
- **Real-time Validation**: Input validation with proper ranges
- **Results Display**: Professional medical-style results with risk levels
- **Visual Feedback**: Progress bars, risk indicators, and clinical interpretations

### Features
- **Responsive Design**: Works on desktop and mobile devices
- **Professional UI**: Medical-grade interface with proper styling
- **Error Handling**: Comprehensive error messages and validation
- **Results Export**: Ability to download and share results

## API Endpoints

### Heart Disease Prediction
```bash
POST http://127.0.0.1:5001/predict/heart
Content-Type: application/json

{
  "Age": 63,
  "Sex": 1,
  "ChestPainType": 3,
  "RestingBP": 145,
  "Cholesterol": 233,
  "FastingBS": 1,
  "RestingECG": 0,
  "MaxHR": 150,
  "ExerciseAngina": 0,
  "Oldpeak": 2.3,
  "ST_Slope": 0,
  "Ca": 0,
  "Thal": 1
}
```

### Response Format
```json
{
  "prediction": 1,
  "probability": 0.74,
  "fields": ["Age", "Sex", "ChestPainType", ...]
}
```

## Usage Instructions

### For Users
1. Navigate to `/prediction-results` in the application
2. Select "Heart Disease Risk Assessment" from the dropdown
3. Fill in all required clinical parameters
4. Click "Predict Heart Risk" to get results
5. View detailed risk assessment and recommendations

### For Developers
1. Ensure Flask server is running on port 5001
2. Both `heart_model.pkl` and `diabetes_model.pkl` must be in the root directory
3. The frontend automatically detects available prediction types
4. Models are loaded once at startup for optimal performance

## Technical Details

### Model Performance
- **Accuracy**: 91.8% (as configured in frontend)
- **Features**: 13 clinical parameters
- **Algorithm**: Random Forest Classifier
- **Preprocessing**: No additional scaling required

### Error Handling
- Validates all required fields are filled
- Checks field value ranges
- Provides meaningful error messages
- Graceful fallback for server connection issues

## Testing

Both prediction models have been tested and verified:
- Heart disease prediction: ✅ Working
- Diabetes prediction: ✅ Working  
- Health endpoint: ✅ Both models loaded
- Frontend integration: ✅ Complete

The integration is now complete and ready for production use.
