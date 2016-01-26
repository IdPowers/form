# coding=utf-8
from __future__ import unicode_literals

from .base import *

DEBUG = False

ALLOWED_HOSTS += ['service.smart-cms.ru']

__author__ = 'vadim'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'companies',
        'USER': 'postgres',
        'PASSWORD': 'z6wWBZS1',
        'HOST': 'localhost',
        'PORT': '5432',
    }
}