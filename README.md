# Hexual

Online at [hexual.ca](http://www.hexual.ca).

Hexual is a tool to explore albums via their artwork. Built with MongoDB, Flask, and React.

# Data

Hexual is built on a MongoDB database with over 700, 000 unique albums (and growing). To collect the data, the Python scripts in the data folder pull album meta-data from the [Spotify API](https://developer.spotify.com/documentation/web-api/), and the artwork color palette is found using K-Means clustering. The artists searched are parsed from Jason Scott's awesome resource: [Experiment with one million album covers](https://blog.archive.org/2015/05/27/experiment-with-one-million-album-covers/).

# Web Application

The web application offers three main ways to explore the database:

### Palette

Choose up to four colours, and search the database for albums that perfectly match all the specified colours (i.e. aren't perceptibly different), or match all but one of the colours in case none of the perfect matches are satisfactory.

### Search

Search for any artist or album to see if it's in our collection.

### Browse

Choose a genre (from Spotify's exhaustive list including grunge, art rock, conscious hip-hop, and more) and 1000 randomly selected albums and their palettes will be displayed to you.
