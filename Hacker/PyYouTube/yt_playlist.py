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
    parser.add_argument("-k", "--key", default="PLiMQZQcJLtJi7RmbWqV5NSWZBxzH02SgZ", help="Remote YouTube playlist")
    parser.add_argument("-l", "--local", default=".",  help="Local Path")
    parser.add_argument("-s", "--sleep", type=int, default=250, help="Milliseconds to wait for looping.")
    parser.add_argument("-v", "--verbose",dest='verbose',action='store_true', help="Verbose mode.")
    options = parser.parse_args(args)
    return options

options = getOptions()    
print(options)
if options.local == ".":
    options.local = ""
    
if options.local == "":
    options.local = os.path.dirname(__file__)+os.sep
    
outpath = options.local + "list^"+options.key+os.sep
if not os.path.isdir(outpath):
    os.makedirs(outpath) 


from pytubefix import Playlist
from pytubefix.cli import on_progress

# two url forms work in pytube
url = "https://www.youtube.com/playlist?list=" + options.key

pl = Playlist(url)
counter = 0
outpath = options.local + "list^"+options.key+"^"+pl.title+os.sep
if not os.path.isdir(outpath):
    os.makedirs(outpath) 
print(outpath)
for yt in pl.videos:
    counter += 1;
    ys = yt.streams.get_highest_resolution()
    pre = str(counter)+"^"+yt.video_id+"^"+ys.resolution+"^"
    print(pre)
    ys.download(output_path=outpath, filename_prefix=pre, skip_existing=True)

# usage 
# python ./yt_playlist.py 
# python ./yt_playlist.py -k PLS1QulWo1RIaJECMeUT4LFwJ-ghgoSH6n
# python ./yt_playlist.py -k PL740tr9UNFE2EeshVPtSHZgD3QpFVgbDc
