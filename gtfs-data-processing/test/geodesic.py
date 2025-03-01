from geopy.distance import geodesic


def check_distance(point1, point2):
    return geodesic(point1, point2).meters


points = [(53.61790084838867,-113.4906997680664)]


expected_point = (53.61786,-113.489753)


for point in points:
    print(check_distance(point, expected_point))