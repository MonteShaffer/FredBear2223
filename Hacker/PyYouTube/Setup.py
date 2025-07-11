#!/usr/bin/env python
import argparse
import sys
import os
import time



# cli.py has default command options ...
# https://github.com/JuanBindez/pytubefix/blob/main/pytubefix/cli.py


# stackoverflow.com/questions/230751/how-to-flush-output-of-print-function
# https://opensource.com/article/19/7/parse-arguments-python
def getOptions(args=sys.argv[1:]):
    parser = argparse.ArgumentParser(description="Parses command.")
    parser.add_argument("-k", "--key", default="8pFZADlWurg", help="Remote YouTube key")
    parser.add_argument("-l", "--local", default=".",  help="Local Path")
    parser.add_argument("-s", "--sleep", type=int, default=250, help="Milliseconds to wait for looping.")
    parser.add_argument("-v", "--verbose",dest='verbose',action='store_true', help="Verbose mode.")
    options = parser.parse_args(args)
    return options

options = getOptions()    
print(options)
if options.local == ".":
    options.local = ""


from pytubefix import YouTube
from pytubefix.cli import on_progress

# three url forms work in pytube
url = "https://youtu.be/" + options.key

yt = YouTube(url, on_progress_callback=on_progress)
print(yt.title)
# yt.title


# options.key = yt.video_id

ys = yt.streams.get_highest_resolution()
ys.download(output_path=options.local, filename_prefix=yt.video_id+"_", skip_existing=True)


# usage 
# python ./Setup.py 
# python ./Setup.py -k 9bZkp7q19f0