from django.contrib import admin
from .models import Ingredient, Disease, Meal, UserProfile, UserMealPlan

@admin.register(Ingredient)
class IngredientAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)

@admin.register(Disease)
class DiseaseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
    filter_horizontal = ('forbidden_ingredients',)

@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'meal_type')
    search_fields = ('name',)
    list_filter = ('meal_type',)
    filter_horizontal = ('ingredients',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'meal_plan_start_date')
    search_fields = ('user__username',)
    filter_horizontal = ('diseases',)

@admin.register(UserMealPlan)
class UserMealPlanAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'date')
    search_fields = ('user__username',)
    list_filter = ('date',)
