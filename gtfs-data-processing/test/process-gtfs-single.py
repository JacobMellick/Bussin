from google.transit import gtfs_realtime_pb2

'''
chill script to load a single pb file and print out the vehicle info for da 9
'''

# load a random ass pb
feed = gtfs_realtime_pb2.FeedMessage()
with open('../data/raw/realtime-data/1740668438.pb', 'rb') as f:
    feed.ParseFromString(f.read())
    for entity in feed.entity:
        if entity.HasField("vehicle"):
            vehicle = entity.vehicle
            if vehicle.trip.route_id == '009':
                print(vehicle)

