import os
import pandas as pd
import pytz
from google.transit import gtfs_realtime_pb2

'''
gets all realtime data for the 9
stores in csv
'''

def parse_gtfs_realtime(pb_file):
    feed = gtfs_realtime_pb2.FeedMessage()
    with open(pb_file, "rb") as f:
        feed.ParseFromString(f.read())

    timezone = pytz.timezone('MST')

    data = [
        {
            "timestamp": pd.to_datetime(vehicle.timestamp, unit="s").tz_localize(pytz.utc).astimezone(timezone).strftime('%H:%M:%S'),
            "trip_id": vehicle.trip.trip_id,
            "route_id": vehicle.trip.route_id,
            "vehicle_id": vehicle.vehicle.id,
            "latitude": vehicle.position.latitude,
            "longitude": vehicle.position.longitude,
        }
        for entity in feed.entity if entity.HasField("vehicle")
        for vehicle in [entity.vehicle] if vehicle.trip.route_id == '009'
    ]

    return data

def parse_all_gtfs_realtime(pb_dir):
    pb_files = [os.path.join(pb_dir, pb_file) for pb_file in os.listdir(pb_dir)]
    all_data = []
    for pb_file in pb_files:
        print(pb_file)
        all_data.extend(parse_gtfs_realtime(pb_file))
    return all_data

if __name__ == "__main__":
    pb_dir = "../data/raw/realtime-data/"
    all_data = parse_all_gtfs_realtime(pb_dir)
    df = pd.DataFrame(all_data)
    df.sort_values(by='timestamp', inplace=True)
    df.to_csv("../data/processed/9-realtime-mst.csv", index=False)
    print("done")