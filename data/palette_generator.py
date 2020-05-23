from sklearn.cluster import KMeans
from skimage import io
from skimage.color import rgb2lab, lab2rgb, gray2rgb
import numpy as np
from collections import Counter


class PaletteGenerator(object):

    def __init__(self, n_clusters=4):
        self.km = KMeans(n_clusters=n_clusters, n_jobs=-
                         1, n_init=5, max_iter=100)

    def fit(self, img):
        if img.ndim == 2:  # greyscale
            img = np.stack((img, img, img), axis=2)  # convert to rgb
        img = rgb2lab(img * 1/255, illuminant="E",
                      observer="10")  # expects normalized rgb
        img = img.reshape(-1, 3)
        self.km.fit(img)
        lab_palette = self.km.cluster_centers_
        index_weight_pairs = list(Counter(self.km.labels_).items())
        sorted_index_weight_pairs = sorted(
            index_weight_pairs, key=lambda x: x[1], reverse=True)
        sorted_indices = [pair[0] for pair in sorted_index_weight_pairs]
        lab_palette = lab_palette[sorted_indices]
        hex_palette = self.vec_lab_to_hex(lab_palette)
        return hex_palette, lab_palette

    def vec_rgb_to_hex(self, rgb):
        '''
        Convert np array of rgb values (n, 3) into hex strings 
        '''
        hexes = []
        rgb = rgb.astype(np.uint8)
        for rgb_code in rgb:
            hexes.append(self.rgb_to_hex(rgb_code))
        return hexes

    def vec_lab_to_hex(self, lab):
        '''
        Convert np array of rgb values (n, 3) into hex strings 
        '''
        hexes = []
        for lab_row in lab:
            hexes.append(self.lab_to_hex(lab_row))
        return hexes

    def np_rgb_to_lab(self, rgb):
        return rgb2lab(rgb, illuminant="E", observer="10")

    def np_lab_to_rgb(self, lab):
        return lab2rgb(lab, illuminant="E", observer="10")

    @staticmethod
    def rgb_to_hex(rgb):
        '''
        convert a tuple of rgb numbers into a hex string
        '''
        return "#%02x%02x%02x" % (rgb[0], rgb[1], rgb[2])

    @staticmethod
    def hex_to_rgb(hex_string):
        '''
        convert a hex string to its RGB representation
        '''
        hex_string = hex_string.strip()
        r = int(hex_string[1:3], 16)
        g = int(hex_string[3: 5], 16)
        b = int(hex_string[5:], 16)
        return (r, g, b)

    @staticmethod
    def hex_to_lab(hex_string):
        '''
        single hex string
        '''
        rgb = PaletteGenerator.hex_to_rgb(hex_string)
        # to put in shape (1, 1, 3) normalized
        rgb_arr = np.array([[rgb]]) * 1/255
        return tuple(rgb2lab(rgb_arr, illuminant="E", observer="10").ravel())

    @staticmethod
    def lab_to_hex(lab):
        '''
        single lab array-like (3 values)
        '''

        rgb = tuple((lab2rgb([[lab]], illuminant="E",
                             observer="10")*255).astype(np.uint8).ravel())
        return PaletteGenerator.rgb_to_hex(rgb)

    def fit_from_url(self, url):
        img = self.url_to_img(url)

        return self.fit(img)

    def url_to_img(self, url):
        return io.imread(url)
