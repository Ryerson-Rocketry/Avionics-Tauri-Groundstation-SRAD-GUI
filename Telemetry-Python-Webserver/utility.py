import numpy as np

#should let start_point and end_point be a 1x3 matrix where [lat, long, alt]
def get_pitch_yaw(start_point, end_point):
    start_vec = np.array(start_point)
    end_vec =  np.array(end_point)

    direction_vec = start_vec - end_vec
    norm_vec = direction_vec/np.linalg.vector_norm(direction_vec) #https://stackoverflow.com/questions/9171158/how-do-you-get-the-magnitude-of-a-vector-in-numpy
    
    pitch_angle = pitch(norm_vec)
    #print ("CALCULATED PITCH AS: " + str(pitch_angle) + " USING: " + str(start_vec[2]) + " " + str(end_vec[2])  +  " " + str(norm_vec))
    yaw_angle = yaw(norm_vec)

    return pitch_angle, yaw_angle


def pitch(normal_vector):
    
    angle = np.arcsin(-normal_vector[2])
    angle = np.rad2deg(angle)

    return -angle


def yaw(normal_vector):
    angle = np.arctan2(normal_vector[1], normal_vector[0])
    angle = np.rad2deg(angle)

    return angle




if __name__ == "__main__":
    print ("performing test pitch and yaw")
    #pitch, yaw = get_pitch_yaw([3.691244, 3.1559273,3], [5.6912043, 7.1560501, 5])
    pitch, yaw = get_pitch_yaw([42.74, -77.18, -235], [42.72, -77.15, 236.0])


    print("PITCH ANGLE: " + str(pitch) +  ", YAW ANGLE: " + str(yaw))
