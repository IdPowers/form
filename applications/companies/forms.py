# coding=utf-8
from __future__ import unicode_literals

from django import forms
from applications.companies.models import Company

__author__ = 'vadim'


class CompanyForm(forms.ModelForm):
    class Meta:
        model = Company
        fields = '__all__'
        widgets = {
            'current_method_cards': forms.CheckboxSelectMultiple()
        }

    def clean_agreement(self):
        value = self.cleaned_data.get('agreement')
        if not value:
            raise forms.ValidationError("Your didn't agree")

        return value

    def clean_agreement_2(self):
        value = self.cleaned_data.get('agreement_2')
        if not value:
            raise forms.ValidationError("Your didn't agree")

        return value