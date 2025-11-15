from flask import Flask, request, jsonify
import math
import traceback
from joblib import load
from collections import defaultdict
from feature_prep import prepare_features_for_subjects
from scheduler import create_schedule_with_caps
from flask_cors import CORS
# -------------------------
# Load ML Model
# -------------------------
MODEL_PATH = "rf_hours_model.joblib"
ml_model = load(MODEL_PATH)

# Study settings
SESSION_MINUTES = 30   # 1-hour sessions

# -------------------------
# Flask App
# -------------------------
app = Flask(__name__)
CORS(app)  

@app.route("/generate_timetable", methods=["POST"])
def generate_timetable():
    try:
        payload = request.get_json()
        if not payload:
            return jsonify({"error": "Invalid JSON"}), 400

        print(payload.get("year"))
        # Extract values
        year = payload.get("year")
        month = payload.get("month")
        study_hours_per_day = float(payload.get("study_hours_per_day", 2))
        preferred_window = payload.get("preferred_window", "evening")
        subjects = payload.get("subjects", [])
        unavailable = payload.get("unavailable", [])

        if not subjects:
            return jsonify({"error": "No subjects provided"}), 400

        # -------------------------
        # 1) ML PREDICTION
        # -------------------------
        per_subject_sessions = predict_hours_and_sessions(ml_model, subjects)

        # -------------------------
        # 2) SCHEDULE GENERATION
        # -------------------------
    
        WINDOWS = {
            "morning": (6, 12),
            "afternoon": (12, 18),
            "evening": (18, 22),
            "flexible": (6, 22)
        }

        # In your /generate_timetable route:
        window_start, window_end = WINDOWS.get(preferred_window.lower(), (18, 22))

        schedule = create_schedule_with_caps(
            subjects=subjects,
            unavailable=unavailable,
            year=year,
            month=month,
            study_hours_per_day=study_hours_per_day,
            per_subject_max_sessions=per_subject_sessions,
            window_start=window_start,
            window_end=window_end
        )

        print(schedule)


        return jsonify({
            "per_subject_sessions": per_subject_sessions,
            "schedule": schedule
        })


    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

# -------------------------
# ML Prediction Function
# -------------------------
def predict_hours_and_sessions(model, subjects, session_minutes=SESSION_MINUTES):
    X = prepare_features_for_subjects(subjects)

    if len(X) == 0:
        return {}

    pred_hours = model.predict(X)
    sessions = {}

    for s, h in zip(subjects, pred_hours):
        if "_id" not in s:
            raise Exception("Subject missing _id: " + str(s))

        est_sessions = max(1, int(math.ceil(h / (session_minutes / 60.0))))

        sessions[s["_id"]] = est_sessions

    return sessions

def format_schedule_by_date(schedule):
    formatted = defaultdict(list)
    for item in schedule:
        date = item["date"]
        start = item["start_time"]
        end = item["end_time"]
        subject = item["module_name"]
        lecture = item["lecture_name"]
        priority = item["priority"]
        formatted[date].append(f"  {start} - {end}  | {subject} ({lecture})  priority={priority}")
    
    # Convert to dict with ordered dates
    return {d: formatted[d] for d in sorted(formatted.keys())}

@app.route("/test", methods=["GET"])
def test_api():
    return {"message": "API is working!", "status": "success"}, 200


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8086)


