from pymavlink import mavutil

# Create the connection
master = mavutil.mavlink_connection('COM5')
# Wait a heartbeat before sending commands
master.wait_heartbeat()

# Send a positive x value, negative y, negative z,
# positive rotation and no button.
# https://mavlink.io/en/messages/common.html#MANUAL_CONTROL
# Warning: Because of some legacy workaround, z will work between [0-1000]
# where 0 is full reverse, 500 is no output and 1000 is full throttle.
# x,y and r will be between [-1000 and 1000].
master.mav.command_long_send(master.target_system,master.target_component, mavutil.mavlink.MAV_CMD_DO_TRIGGER_CONTROL,0,1,0,-1,0,0,0,0)
msg = master.recv_match(type = ['COMMAND_ACK'],blocking = True)
print(msg)
buttons = 1 + 1 << 3 + 1 << 7
master.mav.manual_control_send(
    master.target_system,
    0,
    0,
    500, # 500 means neutral throttle
    0,
    buttons)
print(dir(mavutil.mavlink))
msg = master.recv_match(type = ['COMMAND_ACK'],blocking = True)
print(msg)