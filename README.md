# slowreverb-web  
Web implementation of Slow Reverb Python Application  
website url: https://slowitdownboomba.netlify.app/

Project Setup:  
React:  
Create new React project.  
Move all files from react-frontend into your projects 'src' directory  
Move 'package.json' to the directory src is contained in: '.../src/..'  

Flask:  
Create directory for Flask.  
Create a venv.  
Pip install:  
  Flask, Flask-CORS, pyo  
Move all files from flask-backend to venv directory.  

-------
Start servers:  
Start React Server  
Open Browser and go to 'http://localhost:3000/'  

Start Flask Server  
Open Browser and go to 'http://127.0.0.1:5000/'  

-------
To Use:  
Drag and drop .flac files to the drop box  
Click on 'SlowAndReverberate'  
File will be downloaded that is a Slowed and Reverberated form of the original file.  

This uses the Freeverb implementation.  
