# coding=utf-8
from __future__ import unicode_literals

from django.views.generic import CreateView

from applications.companies.forms import CompanyForm
from utils.views.generic import AjaxCreateView


class IndexView(CreateView):
    form_class = CompanyForm
    template_name = 'companies/index.html'


class AjaxCompanyCreateView(AjaxCreateView):
    form_class = CompanyForm

    def get_form_kwargs(self):
        print self.request.FILES
        return super(AjaxCompanyCreateView, self).get_form_kwargs()