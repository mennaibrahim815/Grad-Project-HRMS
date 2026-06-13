import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

print("1. Generating Synthetic HR Data (10,000 records)...")
np.random.seed(42)
n_samples = 10000

# توليد بيانات عشوائية منطقية
skills_match = np.random.uniform(0.1, 1.0, n_samples)
experience_gap = np.random.normal(0, 2, n_samples)
education_match = np.random.choice([0, 1], p=[0.3, 0.7], size=n_samples)

# حساب الـ Score الحقيقي
base_score = (skills_match * 50) + (np.clip(experience_gap + 3, 0, 6) / 6 * 35) + (education_match * 15)
noise = np.random.normal(0, 3, n_samples)
y = np.clip(base_score + noise, 0, 100)

X = pd.DataFrame({
    'skills_match': skills_match,
    'experience_gap': experience_gap,
    'education_match': education_match
})

# ==========================================
# 💾 الإضافة الجديدة: حفظ الداتا في ملف CSV
# ==========================================
print("Saving dataset to CSV for the presentation...")
df_full = X.copy()
df_full['ats_final_score'] = np.round(y, 2) # تقريب السكور لرقمين عشريين عشان يبقى شكله نظيف
df_full.to_csv("synthetic_hr_data.csv", index=False)
print("✅ Dataset saved as 'synthetic_hr_data.csv'")
# ==========================================

print("2. Splitting data and Training RandomForest Model...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestRegressor(n_estimators=100, max_depth=8, random_state=42)
model.fit(X_train, y_train)

# مقاييس الدقة للدكتورة
predictions = model.predict(X_test)
print(f"Model R2 Score (Accuracy): {r2_score(y_test, predictions):.4f}")
print(f"Mean Absolute Error: {mean_absolute_error(y_test, predictions):.2f} points")

print("3. Exporting Model to ONNX format...")
initial_type = [('float_input', FloatTensorType([None, 3]))]
onx = convert_sklearn(model, initial_types=initial_type)

with open("ats_scorer.onnx", "wb") as f:
    f.write(onx.SerializeToString())
    
print("✅ Success! 'ats_scorer.onnx' is ready for Node.js.")