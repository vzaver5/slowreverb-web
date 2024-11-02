from pyo import Server, SndTable, SfPlayer, Freeverb, sndinfo
import sys

def slow_reverberate_work(original_file):
    print("Processing file(srw): ", original_file, file=sys.stderr)
    s = Server(audio='offline').boot()

    info = sndinfo(original_file)
    print(info, file =sys.stderr)
    t = SndTable(original_file)
	#Adjust pitchAdj to change speed/pitch
    pitchAdj = .81
    length = t.getDur()/pitchAdj

    a = SfPlayer(original_file, pitchAdj, mul=.6)
	#    #Adds a stereo reverberation to the signal
    a = Freeverb(a, size=0.85, damp=0.70, bal=0.30).out()
    s.recordOptions(
    	dur=length,  # give some room for the reverb trail! This is what decides the files length
    	filename=original_file.replace(".wav","SlowedReverbedFree.wav"),
    	fileformat="WAV",
	   )
    s.start()
    s.shutdown()

    return original_file.replace(".wav","SlowedReverbedFree.wav")