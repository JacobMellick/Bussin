import pandas as pd

'''
Script to get all stop times for the 9
Uses trips.txt to match trip_ids to route_ids
'''

def get_nine_trips():
    """ Extracts trip IDs for route 9 and returns the DataFrame. """
    trips_path = '../data/raw/ets-data/trips.txt'
    try:
        df = pd.read_csv(trips_path, usecols=['trip_id', 'route_id'], dtype={'trip_id': str, 'route_id': str})
        nine_trips = df[df['route_id'] == '009']
        return nine_trips
    except FileNotFoundError:
        print(f"Error: {trips_path} not found.")
        return pd.DataFrame(columns=['trip_id', 'route_id'])


def get_nine_stops(nine_trips):
    """ Extracts stop times for route 9 and saves processed data. """
    stop_times_path = '../data/raw/ets-data/stop_times.txt'
    stops_path = '../data/raw/ets-data/stops.txt'

    try:
        df_stop_times = pd.read_csv(stop_times_path, usecols=['trip_id', 'arrival_time', 'stop_id'], dtype={'trip_id': str, 'arrival_time': str, 'stop_id': str})
        df_stops = pd.read_csv(stops_path, usecols=['stop_id', 'stop_lat', 'stop_lon'], dtype={'stop_id': str, 'stop_lat': float, 'stop_lon': float})

        # Remove rows where arrival_time starts with "24:"
        for i in range(8):
            print(i)
            df_stop_times = df_stop_times[~df_stop_times['arrival_time'].str.startswith(f'0{i}:')]
        
        for i in range(22, 32):
            print(i)
            df_stop_times = df_stop_times[~df_stop_times['arrival_time'].str.startswith(f'{i}:')]

        # Convert arrival_time to datetime format %H:%M:%S
        df_stop_times['arrival_time'] = pd.to_datetime(df_stop_times['arrival_time'], format='%H:%M:%S').dt.strftime('%H:%M:%S')

        # Merge stop times with stop locations
        nine_stops_locations = df_stop_times.merge(df_stops, on='stop_id')

        # Merge with trips to filter only route 9
        nine_stops = nine_stops_locations.merge(nine_trips, on='trip_id')

        nine_stops = nine_stops.sort_values(by='arrival_time')
        # Save final result
        nine_stops.to_csv('../data/processed/9-stop_times.csv', index=False)
        print("Saved 9-stop_times.csv successfully.")

    except FileNotFoundError as e:
        print(f"Error: {e.filename} not found.")

if __name__ == "__main__":
    nine_trips_df = get_nine_trips()
    if not nine_trips_df.empty:
        get_nine_stops(nine_trips_df)