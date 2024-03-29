# Generated by Django 4.0.5 on 2022-06-17 22:11

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Product',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50)),
                ('description', models.TextField(blank=True, max_length=300, null=True)),
                ('price', models.DecimalField(decimal_places=2, max_digits=7)),
                ('num_stock', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)])),
                ('image', models.ImageField(blank=True, null=True, upload_to='')),
                ('category', models.CharField(choices=[('Sunglasses', 'Sunglasses'), ('Towels', 'Towels'), ('Blankets', 'Blankets'), ('Umbrellas', 'Umbrellas'), ('Surfboards', 'Surfboards'), ('Floats', 'Floats'), ('Games', 'Games')], max_length=20)),
                ('avg_rating', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=3)),
                ('num_reviews', models.IntegerField(blank=True, default=0, validators=[django.core.validators.MinValueValidator(0)])),
                ('on_sale', models.BooleanField(default=False)),
                ('sale_price', models.DecimalField(blank=True, decimal_places=2, default=0, max_digits=7, null=True)),
                ('featured', models.BooleanField(blank=True, default=False)),
                ('date_created', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='ProductColor',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('color', models.CharField(max_length=15)),
                ('num_stock', models.IntegerField(default=0, validators=[django.core.validators.MinValueValidator(0)])),
                ('date_created', models.DateTimeField(auto_now_add=True)),
                ('product', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='products.product')),
            ],
            options={
                'unique_together': {('name', 'product')},
            },
        ),
    ]
