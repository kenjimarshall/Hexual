from sklearn.cluster import KMeans
import skimage.io
from skimage.color import rgb2lab, lab2rgb
from collections import Counter
from PIL import Image
import numpy as np
import io
import base64


class ClusterManager(object):
    def __init__(self, n_clusters=4):
        self.km = KMeans(n_clusters=4, n_init=5, max_iter=100)

    def fit_from_bytes(self, img):
        img = self.bytes_to_arr(img)
        return self.fit(img)

    def fit(self, img):
        print(img.shape)
        if img.shape[2] == 4:  # transparency channel
            img = img[:, :, :3]
        print(img.shape)
        img = img.reshape(-1, 3)
        self.km.fit(img)
        rgb_palette = self.km.cluster_centers_
        index_weight_pairs = list(Counter(self.km.labels_).items())
        sorted_index_weight_pairs = sorted(
            index_weight_pairs, key=lambda x: x[1], reverse=True)
        sorted_indices = [pair[0] for pair in sorted_index_weight_pairs]
        rgb_palette = rgb_palette[sorted_indices]
        hex_palette = self.vec_rgb_to_hex(rgb_palette)
        return hex_palette

    def bytes_to_arr(self, image_data):
        image = Image.open(io.BytesIO(image_data))
        image_arr = np.array(image)
        if image_arr.ndim == 2:  # greyscale
            image_arr = np.stack((image_arr, image_arr, image_arr), axis=2)
        return image_arr

    def vec_rgb_to_hex(self, rgb):
        '''
        Convert np array of rgb values (n, 3) into hex strings 
        '''
        hexes = []
        rgb = rgb.astype(np.uint8)
        for rgb_code in rgb:
            hexes.append(self.rgb_to_hex(rgb_code))
        return hexes

    def rgb_to_hex(self, rgb):
        '''
        convert a tuple of rgb numbers into a hex string
        '''
        return "#%02x%02x%02x" % (rgb[0], rgb[1], rgb[2])
