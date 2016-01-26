# coding=utf-8
from __future__ import unicode_literals

import json
from traceback import print_exc

from django.core.exceptions import ImproperlyConfigured, ObjectDoesNotExist, MultipleObjectsReturned
from django.core.paginator import InvalidPage
from django.http.response import HttpResponse, Http404
from django.utils.translation import ugettext as _
from django.views.generic.edit import FormMixin, BaseCreateView, ModelFormMixin
from django.views.generic.list import MultipleObjectMixin, BaseListView, MultipleObjectTemplateResponseMixin
from django.views.generic.base import View

__author__ = 'vadim'


class AjaxResponseMixin(object):
    method = 'POST'

    def dispatch(self, request, *args, **kwargs):
        request.data = getattr(self.request, self.method).copy()
        return super(AjaxResponseMixin, self).dispatch(request, *args, **kwargs)

    def get(self, request, *args, **kwargs):
        return self.render_to_json(self.get_json(self.get_context_data(**kwargs)))

    def post(self, request, *args, **kwargs):
        return self.render_to_json(self.get_json(self.get_context_data(**kwargs)))

    def get_context_data(self, **kwargs):
        return super(AjaxResponseMixin, self).get_context_data(**kwargs)

    def render_to_json(self, context, status=200):
        json_content = json.dumps(context, ensure_ascii=False)
        if isinstance(json_content, unicode):
            json_content = json_content.encode('utf-8')

        return HttpResponse(content=json_content, content_type='application/json; charset=UTF-8', status=status)

    def get_json(self, context):
        return context


class AjaxView(AjaxResponseMixin, View):
    pass


class AjaxFormMixin(FormMixin):
    def form_valid(self, form):
        return self.render_to_json({'success': True})

    def form_invalid(self, form):
        return self.render_to_json({
            'errors': [
                {'name': name, 'errors': errors}
                for name, errors in form.errors.iteritems()
            ]
        }, status=400)


class AjaxModelFormMixin(AjaxFormMixin, ModelFormMixin):
    def form_valid(self, form):
        """
        If the form is valid, save the associated model.
        """
        self.object = form.save()
        return super(AjaxModelFormMixin, self).form_valid(form)


class AjaxProcessFormView(AjaxView):
    def get(self, request, *args, **kwargs):
        return self.get_post(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        return self.get_post(request, *args, **kwargs)

    def get_post(self, request, *args, **kwargs):
        form = self.get_form()
        if form.is_valid():
            return self.form_valid(form)
        else:
            return self.form_invalid(form)


class AjaxFormView(AjaxFormMixin, AjaxProcessFormView):
    pass


class AjaxCreateView(AjaxModelFormMixin, AjaxProcessFormView):
    def get(self, request, *args, **kwargs):
        self.object = None
        return super(AjaxCreateView, self).get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        self.object = None
        return super(AjaxCreateView, self).post(request, *args, **kwargs)