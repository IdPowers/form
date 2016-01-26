import os 
import uuid 


__author__ = 'aser'


class UploadTo(object):
    def __init__(self, prefix=None):
        self.prefix = prefix

    def __call__(self, *args, **kwargs):
        return self.upload_to(*args, prefix=self.prefix)

    @staticmethod
    def upload_to(instance, filename, prefix=None):
        """
        Auto generate name for File and Image fields.
        :param instance: Instance of Model
        :param filename: Name of uploaded file
        :param prefix: Add to path
        :return:
        """
        name, ext = os.path.splitext(filename)
        filename = "%s%s" % (uuid.uuid4(), ext or '.jpg')
        basedir = os.path.join(instance._meta.app_label, instance._meta.model_name)
        if prefix:
            basedir = os.path.join(basedir, prefix)
        return os.path.join(basedir, filename[:2], filename[2:4], filename)


def upload_to(instance, filename):
    """
    Auto generate name for File and Image fields.
    :param instance: Instance of Model
    :param filename: Name of uploaded file
    :return:
    """
    name, ext = os.path.splitext(filename)
    filename = "%s%s" % (uuid.uuid4(), ext or '.jpg')
    # basedir = os.path.join(instance._meta.app_label, instance._meta.model_name)
    return filename
