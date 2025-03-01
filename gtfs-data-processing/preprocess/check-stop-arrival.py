from geopy.distance import geodesic
from datetime import datetime, timedelta
import pandas as pd

def check_distance(point1, point2):
    return geodesic(point1, point2).meters

def check_stop_arrival():
    df_realtime = pd.read_csv("../data/processed/9-realtime-mst.csv")
    df_stop_times = pd.read_csv("../data/processed/9-stop_times.csv")

    df_realtime['Arrived'] = False

    for index, row in df_realtime.iterrows():
        print("Processing row", index)
        if index == 1000:
            break
        bus_lat = row['latitude']
        bus_lon = row['longitude']
        bus_trip_id = row['trip_id']
        bus_time = datetime.strptime(row['timestamp'], '%H:%M:%S')

        # Filter stop times to only include rows within 30 minutes of the current bus_time
        df_stop_times_filtered = df_stop_times[
            (pd.to_datetime(df_stop_times['arrival_time'], format='%H:%M:%S') - bus_time).abs() <= timedelta(minutes=30)
        ]

        for _, stop in df_stop_times_filtered.iterrows():
            stop_lat = stop['stop_lat']
            stop_lon = stop['stop_lon']
            stop_time = datetime.strptime(stop['arrival_time'], '%H:%M:%S')

            # Check if the route_id matches
            if bus_trip_id == stop['trip_id']:
                # Calculate the distance between the bus and the stop
                distance = check_distance((bus_lat, bus_lon), (stop_lat, stop_lon))

                # Check if the bus is within 500 meters of the stop
                if distance <= 500:
                    # Check if the time is within 30 minutes
                    if abs((bus_time - stop_time).total_seconds()) <= 1800:
                        print("found")
                        df_realtime.at[index, 'Arrived'] = True
                        df_realtime.at[index, 'Stop'] = stop['stop_id']
                        df_realtime.at[index, 'expected_arrival'] = stop['arrival_time']
                        df_realtime.at[index, 'differential'] = (bus_time - stop_time).total_seconds()
                        break

    df_realtime.to_csv("../data/processed/9-realtime-mst-with-arrivals.csv", index=False)

if __name__ == "__main__":
    check_stop_arrival()
    print("done")