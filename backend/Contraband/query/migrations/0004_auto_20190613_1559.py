# Generated by Django 2.2.2 on 2019-06-13 15:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('query', '0003_auto_20190613_1401'),
    ]

    operations = [
        migrations.AlterField(
            model_name='query',
            name='hash_code',
            field=models.CharField(default='G34VfgQo4jCNvQwwu0TBSyM7RZHz1bb66oZVdzylGVKp08mZv76q1poWLfyAx478', max_length=64, unique=True),
        ),
        migrations.AlterField(
            model_name='queryfilter',
            name='project',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='queryfilter',
            name='status',
            field=models.CharField(blank=True, max_length=40, null=True),
        ),
    ]