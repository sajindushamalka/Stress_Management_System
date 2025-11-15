# # from datetime import datetime, timedelta

# # def create_schedule_with_caps(subjects, unavailable, year, month,
# #                               study_hours_per_day, window_name,
# #                               per_subject_max_sessions):

# #     schedule = []

# #     current_date = datetime(year, month, 1)

# #     # utility for marking unavailable periods
# #     ignore_dates = set([u["date"] for u in unavailable])

# #     for s in subjects:
# #         sid = s["_id"]
# #         needed_sessions = per_subject_max_sessions.get(sid, 1)

# #         while needed_sessions > 0:
# #             if current_date.strftime("%Y-%m-%d") not in ignore_dates:
# #                 schedule.append({
# #                     "date": current_date.strftime("%Y-%m-%d"),
# #                     "subject_id": sid,
# #                     "lecture_name": s["lecture_name"],
# #                     "hours": study_hours_per_day
# #                 })
# #                 needed_sessions -= 1

# #             current_date += timedelta(days=1)

# #     return schedule


# # # # from datetime import datetime, timedelta, time

# # # # SESSION_MINUTES = 30
# # # # BREAK_MINUTES = 15
# # # # WINDOW_START = time(18, 0)  # example evening start
# # # # WINDOW_END = time(23, 0)    # example evening end

# # # # def create_schedule_with_caps(subjects, unavailable, year, month,
# # # #                               study_hours_per_day, window_name,
# # # #                               per_subject_max_sessions):
    
# # # #     schedule = []
# # # #     current_date = datetime(year, month, 1)
    
# # # #     # utility for marking unavailable periods
# # # #     ignore_dates = set([u["date"] for u in unavailable])

# # # #     while current_date.month == month:
# # # #         date_str = current_date.strftime("%Y-%m-%d")
# # # #         if date_str not in ignore_dates:
# # # #             # daily available time
# # # #             cur_time = datetime.combine(current_date.date(), WINDOW_START)
# # # #             day_end = datetime.combine(current_date.date(), WINDOW_END)
            
# # # #             for s in subjects:
# # # #                 sid = s["_id"]
# # # #                 needed_sessions = per_subject_max_sessions.get(sid, 1)
                
# # # #                 while needed_sessions > 0 and cur_time + timedelta(minutes=SESSION_MINUTES) <= day_end:
# # # #                     end_time = cur_time + timedelta(minutes=SESSION_MINUTES)
# # # #                     schedule.append({
# # # #                         "date": current_date.date().isoformat(),
# # # #                         "start_time": cur_time.strftime("%H:%M"),
# # # #                         "end_time": end_time.strftime("%H:%M"),
# # # #                         "subject_id": sid,
# # # #                         "module_name": s["module_name"],
# # # #                         "lecture_name": s["lecture_name"],
# # # #                         "priority": s["priority"],
# # # #                     })
# # # #                     needed_sessions -= 1
# # # #                     # move to next slot including break
# # # #                     cur_time = end_time + timedelta(minutes=BREAK_MINUTES)
# # # #         current_date += timedelta(days=1)
    
# # # #     return schedule

# # from datetime import datetime, timedelta, time

# # SESSION_MINUTES = 30
# # BREAK_MINUTES = 15
# # WINDOW_START = time(18, 0)  # evening start
# # WINDOW_END = time(23, 0)    # evening end

# # def create_schedule_with_caps(subjects, unavailable, year, month,
# #                               study_hours_per_day, window_name,
# #                               per_subject_max_sessions):

# #     schedule = []
# #     current_date = datetime(year, month, 1)
    
# #     # set of unavailable dates
# #     ignore_dates = set([u["date"] for u in unavailable])

# #     while current_date.month == month:
# #         date_str = current_date.strftime("%Y-%m-%d")
# #         if date_str not in ignore_dates:
# #             # available slots for the day
# #             cur_time = datetime.combine(current_date.date(), WINDOW_START)
# #             day_end = datetime.combine(current_date.date(), WINDOW_END)

# #             # prepare remaining sessions per subject
# #             remaining_sessions = {
# #                 s["_id"]: per_subject_max_sessions.get(s["_id"], 1)
# #                 for s in subjects
# #             }

# #             # round-robin allocation until no slots or no remaining sessions
# #             while cur_time + timedelta(minutes=SESSION_MINUTES) <= day_end and sum(remaining_sessions.values()) > 0:
# #                 for s in subjects:
# #                     sid = s["_id"]
# #                     if remaining_sessions[sid] > 0 and cur_time + timedelta(minutes=SESSION_MINUTES) <= day_end:
# #                         end_time = cur_time + timedelta(minutes=SESSION_MINUTES)
# #                         schedule.append({
# #                             "date": current_date.date().isoformat(),
# #                             "start_time": cur_time.strftime("%H:%M"),
# #                             "end_time": end_time.strftime("%H:%M"),
# #                             "subject_id": sid,
# #                             "module_name": s["module_name"],
# #                             "lecture_name": s["lecture_name"],
# #                             "priority": s["priority"]
# #                         })
# #                         remaining_sessions[sid] -= 1
# #                         # move to next slot including break
# #                         cur_time = end_time + timedelta(minutes=BREAK_MINUTES)
# #                         # break inner loop to do round-robin
# #                         break

# #         current_date += timedelta(days=1)
    
# #     return schedule


# # # from datetime import datetime, timedelta

# # # def create_schedule_with_caps(subjects, unavailable, year, month,
# # #                               study_hours_per_day, window_name,
# # #                               per_subject_max_sessions):
# # #     schedule = []
# # #     current_date = datetime(year, month, 1)

# # #     # set of unavailable dates
# # #     ignore_dates = set([u["date"] for u in unavailable])

# # #     # copy of remaining sessions
# # #     remaining_sessions = {s["_id"]: per_subject_max_sessions.get(s["_id"], 1) for s in subjects}

# # #     while current_date.month == month and sum(remaining_sessions.values()) > 0:
# # #         date_str = current_date.strftime("%Y-%m-%d")
# # #         if date_str not in ignore_dates:
# # #             # round-robin allocation for this day
# # #             for s in sorted(subjects, key=lambda x: -x["priority"]):  # optional: high priority first
# # #                 sid = s["_id"]
# # #                 if remaining_sessions[sid] > 0:
# # #                     schedule.append({
# # #                         "date": date_str,
# # #                         "subject_id": sid,
# # #                         "lecture_name": s["lecture_name"],
# # #                         "module_name": s["module_name"],
# # #                         "priority": s["priority"],
# # #                         "hours": study_hours_per_day  # can later split into slots
# # #                     })
# # #                     remaining_sessions[sid] -= 1
# # #         current_date += timedelta(days=1)

# # #     return schedule
# from datetime import datetime, timedelta
# from collections import defaultdict

# # constants
# SLOT_MINUTES = 30       # 30-minute slots
# BREAK_MINUTES = 15      # break between slots
# SLOTS_PER_SESSION = 2   # 1-hour sessions = 2 slots
# DAY_START = 18          # evening window start hour
# DAY_END = 22            # evening window end hour

# def create_schedule_with_caps(subjects, unavailable, year, month,
#                               study_hours_per_day,
#                               per_subject_max_sessions):
#     """
#     Creates a schedule with start/end times for each session.
#     Fairly distributes sessions across subjects.
#     """
#     schedule = []

#     # Build unavailable set per date
#     unavailable_set = defaultdict(list)
#     for u in unavailable:
#         unavailable_set[u["date"]].append(u.get("time"))

#     # Build daily slots
#     def generate_day_slots(day):
#         slots = []
#         start_time = datetime(year, month, day, DAY_START, 0)
#         end_time = datetime(year, month, day, DAY_END, 0)
#         while start_time + timedelta(minutes=SLOT_MINUTES * SLOTS_PER_SESSION) <= end_time:
#             slots.append(start_time)
#             start_time += timedelta(minutes=SLOT_MINUTES + BREAK_MINUTES)  # add break
#         return slots

#     # Collect all days in month
#     num_days = (datetime(year + int(month/12), month % 12 + 1, 1) - timedelta(days=1)).day
#     day_to_slots = {day: generate_day_slots(day) for day in range(1, num_days + 1)}

#     # Distribute sessions round-robin across subjects
#     subject_sessions_remaining = {
#         s["_id"]: per_subject_max_sessions.get(s["_id"], 1) for s in subjects
#     }

#     day = 1
#     while any(v > 0 for v in subject_sessions_remaining.values()) and day <= num_days:
#         slots = day_to_slots.get(day, [])
#         if not slots:
#             day += 1
#             continue
#         for slot_time in slots:
#             # find next subject with remaining sessions
#             next_subject = None
#             for s in subjects:
#                 if subject_sessions_remaining[s["_id"]] > 0:
#                     next_subject = s
#                     break
#             if not next_subject:
#                 break  # all done

#             # skip if day is unavailable
#             date_str = slot_time.date().isoformat()
#             if date_str in unavailable_set:
#                 continue

#             # assign session
#             end_time = slot_time + timedelta(minutes=SLOT_MINUTES * SLOTS_PER_SESSION)
#             schedule.append({
#                 "date": date_str,
#                 "start_time": slot_time.time().strftime("%H:%M"),
#                 "end_time": end_time.time().strftime("%H:%M"),
#                 "subject_id": next_subject["_id"],
#                 "module_name": next_subject["module_name"],
#                 "lecture_name": next_subject["lecture_name"],
#                 "priority": next_subject.get("priority", 1)
#             })
#             subject_sessions_remaining[next_subject["_id"]] -= 1

#         day += 1

#     # Sort by date and start_time
#     schedule.sort(key=lambda x: (x["date"], x["start_time"]))
#     return schedule

from datetime import datetime, timedelta

SESSION_MINUTES = 45   # length of one session
BREAK_MINUTES = 15     # break between sessions

def create_schedule_with_caps(subjects, unavailable, year, month,
                              study_hours_per_day,
                              per_subject_max_sessions,
                              window_start=18, window_end=22):
    schedule = []
    
    # Track next available slot per day
    day_slots = {}
    
    # Ignore unavailable dates
    ignore_dates = set([u["date"] for u in unavailable])
    
    # Loop over subjects and allocate sessions
    for s in subjects:
        sid = s["_id"]
        needed_sessions = per_subject_max_sessions.get(sid, 1)
        
        current_date = datetime(year, month, 1, window_start, 0)
        while needed_sessions > 0:
            date_str = current_date.strftime("%Y-%m-%d")
            if date_str not in ignore_dates:
                # Initialize next available time for this day
                if date_str not in day_slots:
                    day_slots[date_str] = datetime(year, month, current_date.day, window_start, 0)
                
                # Get the next available start time
                start_time = day_slots[date_str]
                end_time = start_time + timedelta(minutes=SESSION_MINUTES)
                
                # Make sure we don’t go beyond the allowed window
                if end_time.hour + end_time.minute/60.0 > window_end:
                    # Move to next day
                    current_date += timedelta(days=1)
                    continue
                
                # Add session
                schedule.append({
                    "date": date_str,
                    "start_time": start_time.strftime("%H:%M"),
                    "end_time": end_time.strftime("%H:%M"),
                    "subject_id": sid,
                    "module_name": s["module_name"],
                    "lecture_name": s["lecture_name"],
                    "priority": s["priority"]
                })
                
                needed_sessions -= 1
                
                # Update next available time for this day (after break)
                day_slots[date_str] = end_time + timedelta(minutes=BREAK_MINUTES)
            
            # Move to next day if window is exhausted
            current_date += timedelta(days=1)
    
    # Sort schedule by date and start_time
    schedule.sort(key=lambda x: (x['date'], x['start_time']))
    return schedule
