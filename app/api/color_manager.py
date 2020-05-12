from skimage.color import rgb2lab, lab2rgb
import numpy as np


class ColorRequestManager(object):

    color_flex = 1.76

    @staticmethod
    def hex_list_to_query(hex_list):
        paletteSize = len(hex_list)
        query = {"$and": []}
        for hex_string in hex_list:
            lab = ColorRequestManager.hex_to_lab(hex_string)
            or_subdict = {
                "$or": []
            }
            for lab_num in range(paletteSize):  # 1, 2, 3...
                and_subdict = {
                    "$and": []
                }
                for field, number in zip(['l', 'a', 'b'], lab):
                    and_subdict["$and"].extend([
                        {f"lab.{lab_num}.{field}": {
                            "$lt": number + ColorRequestManager.color_flex
                        }},
                        {f"lab.{lab_num}.{field}": {
                            "$gt": number - ColorRequestManager.color_flex
                        }}
                    ]
                    )
                or_subdict["$or"].append(
                    and_subdict
                )
            query["$and"].append(or_subdict)

        print(query)
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
