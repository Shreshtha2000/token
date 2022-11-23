from argparse import Namespace
from ast import Global
from flask_socketio import SocketIO, emit
from flask import Flask, render_template, url_for, copy_current_request_context,request,redirect,session,url_for,g
from random import random
from time import sleep
from threading import Thread, Event
import sys
import base64
import cv2
from flask_cors import CORS


__author__ = 'slynn'


app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
app.config['DEBUG'] = False
app.config['USE_RELOADER']=False
print("hello")

socketio2 = SocketIO(app,Secure=True, async_mode=None, logger=True, engineio_logger=True,cors_allowed_origins='*',SameSite=None)
thread3 = Thread()
thread4 = Thread()
thread_stop_event = Event()

cap = cv2.VideoCapture(0)
def vidd():
	while True:
		ret, frame = cap.read()
		print(ret)
		image = cv2.resize(frame, (720,480))
		gray_img = cv2.cvtColor(image,0)
		cv2.imwrite("frame.jpeg" , gray_img)
		socketio2.sleep(0)

def sendv():
	while True:
		print("\n\n")
		print("\n\n")
		with open("frame.jpeg", "rb") as img_file:
			b64_string = base64.b64encode(img_file.read()).decode('utf-8')
			socketio2.emit('sendimage', {'message':str(b64_string)}, namespace='/video')
		socketio2.sleep(0)

@socketio2.on('connect',namespace='/video')
def test_connect2():
    global thread3
    global thread4
    if not thread3.is_alive():
        print("Starting Thread 3")
        thread3 = socketio2.start_background_task(vidd)
    if not thread4.is_alive():
        print("Starting Thread 4")
        thread4 = socketio2.start_background_task(sendv)
@app.route('/test')
def vibe():
    return "hello"

if __name__ == '__main__':
    print("hello")
    socketio2.run(app,host='192.168.0.124',port=5005)