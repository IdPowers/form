# coding=utf-8
from __future__ import unicode_literals

from django.contrib import admin
from applications.companies.models import Company, MethodAcceptingCards


class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone', 'contact']
    filter_horizontal = ['current_method_cards']


class MethodAcceptingCardsAdmin(admin.ModelAdmin):
    list_display = ['method']


admin.site.register(Company, CompanyAdmin)
admin.site.register(MethodAcceptingCards, MethodAcceptingCardsAdmin)