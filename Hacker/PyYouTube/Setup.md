---
title: 'Downloading YouTube Videos with Python'
name: "FredBear2223"
email: "monte.shaffer@gmail.com"
output:
  html_document
---

# Windows 11 Setup
* Install Python
* Install `pytubefix`
```
pip install pytubefix
```
* Setup RStudio to run python 

```{r}
install.packages("reticulate", dependencies = TRUE);
library(reticulate);
```

```{python}
x = 9

def squared(x):
 return x*x

print(squared(x))
```
* Download YouTube video
https://github.com/JuanBindez/pytubefix


```{python}
#!pip install pytubefix
py_run_file("Setup.py")
```

# setup ffmpeg for .cli.py to also work 



