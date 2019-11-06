#!/bin/sh
tmux new-session -d '/home/pi/development/PistonLightRepo/PistonLightLaunch.sh'
tmux split-window -v 'homebridge'
