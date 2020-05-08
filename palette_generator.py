from sklearn.cluster import KMeans
from skimage import io
import numpy as np


class PaletteGenerator(object):

    def __init__(self, n_clusters=4):
        self.km = KMeans(n_clusters=n_clusters, n_jobs=-
                         1, n_init=5, max_iter=100)

    def fit(self, img):
        if img.ndim == 2:  # greyscale
            img = img.reshape(-1, 1)
            img = np.hstack((img, img, img))
        else:  # rgb
            img = img.reshape(-1, 3)
        self.km.fit(img)
        return self.rgb_to_hex(self.km.cluster_centers_)

    def rgb_to_hex(self, rgb):
        hexes = []
        rgb = rgb.astype(np.uint8)
        for rgb_code in rgb:
            hexes.append("#%02x%02x%02x" %
                         (rgb_code[0], rgb_code[1], rgb_code[2]))
        return hexes

    def fit_from_url(self, url):
        img = self.url_to_img(url)
        print(img.shape)

        return self.fit(img)

    def url_to_img(self, url):
        return io.imread(url)
