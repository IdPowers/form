# coding=utf-8
from __future__ import unicode_literals
from django.conf import settings

from django.conf.urls import url, include, patterns
from django.contrib import admin

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'', include('applications.companies.urls', namespace='companies')),
]

if settings.DEBUG:
    import debug_toolbar
    urlpatterns += patterns(
        '',
       url(r'^__debug__/', include(debug_toolbar.urls)),
    )