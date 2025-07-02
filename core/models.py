from django.db import models
from django.contrib.auth.models import User

class Ingredient(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Disease(models.Model):
    name = models.CharField(max_length=100)
    forbidden_ingredients = models.ManyToManyField(Ingredient, blank=True)

    def __str__(self):
        return self.name


class Meal(models.Model):
    MEAL_TYPES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
    ]

    name = models.CharField(max_length=100)
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES)
    image = models.ImageField(upload_to='meal_images/')
    preparation_steps = models.TextField()
    nutrition_chart = models.JSONField()
    ingredients = models.ManyToManyField(Ingredient, blank=True)

    def __str__(self):
        return f"{self.name} ({self.meal_type})"


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    diseases = models.ManyToManyField(Disease, blank=True)
    meal_plan_start_date = models.DateField(null=True, blank=True)
    VEGETARIAN_CHOICES = [
        ('veg', 'Vegetarian'),
        ('nonveg', 'Non-Vegetarian'),
    ]
    preference = models.CharField(max_length=10, choices=VEGETARIAN_CHOICES, default='veg')

    def __str__(self):
        return self.user.username


class UserMealPlan(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    date = models.DateField()
    breakfast = models.ForeignKey(Meal, related_name='breakfast_meals', on_delete=models.SET_NULL, null=True, blank=True)
    lunch = models.ForeignKey(Meal, related_name='lunch_meals', on_delete=models.SET_NULL, null=True, blank=True)
    dinner = models.ForeignKey(Meal, related_name='dinner_meals', on_delete=models.SET_NULL, null=True, blank=True)



    class Meta:
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date}"
