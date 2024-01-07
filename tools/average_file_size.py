# Credit to ChatGPT
import os
from mutagen.mp4 import MP4

folder_path = './data/audio'  # Replace with your folder path

total_size_mb = 0
total_duration_minutes = 0
n = 0

for file in os.listdir(folder_path):
    if file.endswith(".m4a"):
        n += 1
        file_path = os.path.join(folder_path, file)
        audio = MP4(file_path)

        # Size in kilobytes
        file_size_mb = os.path.getsize(file_path) / 1024 / 1024
        total_size_mb += file_size_mb

        # Duration in minutes
        duration_sec = audio.info.length
        duration_min = duration_sec / 60
        total_duration_minutes += duration_min

if total_duration_minutes > 0:
    avg_kb_per_minute = total_size_mb / total_duration_minutes
else:
    avg_kb_per_minute = 0

print(f"Number of files: {n}")
print(f"Total size: {total_size_mb:.2f} mb")
print(f"Duration: {total_duration_minutes:.1f} min")
print(f"Size Ratio: {avg_kb_per_minute:.2f} mb/min")