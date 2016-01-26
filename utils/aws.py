# coding=utf-8
from __future__ import unicode_literals

from django.utils.deconstruct import deconstructible
from storages.backends.s3boto import S3BotoStorage

__author__ = 'vadim'


@deconstructible
class SerializeS3BotoStorage(S3BotoStorage):
    pass