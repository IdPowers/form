# coding=utf-8
from __future__ import unicode_literals

from .dev import *

__author__ = 'vadim'


DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql_psycopg2',
        'NAME': 'companies',
        'USER': 'postgres',
        'PASSWORD': '1111',
        'HOST': '213.234.26.90',
        'PORT': '5432',
    }
}