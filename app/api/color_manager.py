from skimage.color import rgb2lab, lab2rgb
import numpy as np


class ColorRequestManager(object):

    color_flex = 6

    @staticmethod
    def hex_list_to_query(hex_list):
        query = {"$and": []}
        for hex_string in hex_list:
            lab = ColorRequestManager.hex_to_lab(hex_string)
            hex_subdict = {
                "lab": {
                    "$elemMatch": {
                        "l": {
                            "$lte": lab[0] + ColorRequestManager.color_flex,
                            "$gte": lab[0] - ColorRequestManager.color_flex
                        },
                        "a": {
                            "$lte": lab[1] + ColorRequestManager.color_flex,
                            "$gte": lab[1] - ColorRequestManager.color_flex
                        },
                        "b": {
                            "$lte": lab[2] + ColorRequestManager.color_flex,
                            "$gte": lab[2] - ColorRequestManager.color_flex
                        }
                    }
                }
            }
            query["$and"].append(hex_subdict)

        return query

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
        rgb = ColorRequestManager.hex_to_rgb(hex_string)
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
        return ColorRequestManager.rgb_to_hex(rgb)
