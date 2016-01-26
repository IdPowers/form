# coding=utf-8
from __future__ import unicode_literals

from django.conf.urls import url
from applications.companies import views

__author__ = 'vadim'


urlpatterns = [
    url(r'^$', views.IndexView.as_view(), name='index'),
    url(r'^ajax/company/create/$', views.AjaxCompanyCreateView.as_view(), name='ajax_company_create'),
]
