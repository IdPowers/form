# coding=utf-8
from __future__ import unicode_literals
from django.conf import settings

from django.core.validators import RegexValidator
from django.db import models
from utils.aws import SerializeS3BotoStorage

from utils.uploads import upload_to


class MethodAcceptingCards(models.Model):
    class Meta:
        verbose_name = 'Method of accepting cards'
        verbose_name_plural = 'Methods of accepting cards'

    PHYSICAL_TERMINAL = 1
    MOBILE_CARD_READERS = 2
    MOBILE_APP = 3
    VIRTUAL_INTERNET_TERMINAL = 4
    PHONE = 5

    METHODS = (
        (PHYSICAL_TERMINAL, 'physical terminal'),
        (MOBILE_CARD_READERS, 'mobile card readers'),
        (MOBILE_APP, 'mobile app'),
        (VIRTUAL_INTERNET_TERMINAL, 'virtual internet terminal'),
        (PHONE, 'phone'),
    )

    method = models.PositiveSmallIntegerField(verbose_name='method', unique=True, choices=METHODS)

    def __unicode__(self):
        return self.get_method_display()


class Company(models.Model):
    class Meta:
        verbose_name = 'company'
        verbose_name_plural = 'companies'

    name = models.CharField(verbose_name='Business legal name', max_length=256)
    phone = models.CharField(
        verbose_name='Business phone', max_length=21, unique=True, validators=[RegexValidator(regex='^\+\d{7,20}$')]
    )
    contact = models.CharField(verbose_name='Business contact', max_length=256)
    number_service_trucks = models.CharField(verbose_name='Number of Service Trucks', max_length=256)
    number_service_pros = models.CharField(verbose_name='Number of Service Pros in the field', max_length=256)
    current_merchant = models.CharField(verbose_name='Current Merchant Processing Provider', max_length=256)
    
    current_method_cards = models.ManyToManyField(
        verbose_name='Current Method of accepting Credit Cards and/or Debit Cards',
        to=MethodAcceptingCards
    )

    average_yrb = models.CharField(
        verbose_name='Average Yearly Revenue of Business', max_length=256)
    average_yrt = models.CharField(
        verbose_name='Average Yearly Revenue of Credit/Debit Transactions', max_length=256)

    average_ymb = models.CharField(
        verbose_name='Average Monthly Revenue of Business', max_length=256)
    average_ymt = models.CharField(
        verbose_name='Average Monthly Revenue of Credit/Debit Transactions', max_length=256)

    cellbills = models.ImageField(
        verbose_name='Merchant processing', upload_to=upload_to,
        storage=SerializeS3BotoStorage(bucket_name=settings.AWS_CELLBILLS_STORAGE_BUCKET_NAME),
        blank=True
    )
    merchantbills = models.ImageField(
        verbose_name='Corporate cell phone bill', upload_to=upload_to,
        storage=SerializeS3BotoStorage(bucket_name=settings.AWS_MERCHANTBILLS_STORAGE_BUCKET_NAME),
        blank=True
    )

    agreement = models.BooleanField(
        verbose_name='Agree 1', default=False, blank=True,
        help_text='Agree to the Terms of Service and Privacy Policy')
    agreement_2 = models.BooleanField(
        verbose_name='Agree 2', default=False, blank=True,
        help_text='By clicking here - you agree that you will process all of your businesses credit and '
                  'debit transactions with Service.com and in exchange you will receive the benefit of Service.com '
                  'paying for your Service Pros Cell Phone Bills'
    )
