from pyo import *
import time
import os

def slow_reverberate_work(upload_path):
	originalFile = upload_path

	s = Server(audio='offline').boot()
	t = SndTable(originalFile)
	
	#Adjust pitchAdj to change speed/pitch
	pitchAdj = .81
	length = t.getDur()/pitchAdj

	a = SfPlayer(originalFile, pitchAdj, mul=.6)
	# Adds a stereo reverberation to the signal
	rev = Freeverb(a, size=0.85, damp=0.70, bal=0.30).out()
	s.recordOptions(
    	dur=length,  # give some room for the reverb trail! This is what decides the files length
    	filename=originalFile.replace(".flac","SlowedReverbedFree.wav"),
    	fileformat="WAV",
	)
	s.start()
	s.shutdown()

	return originalFile.replace(".flac","SlowedReverbedFree.wav")