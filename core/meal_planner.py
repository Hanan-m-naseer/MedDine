# core/meal_planner.py
import datetime
import random
from .models import User, Meal, Ingredient, UserMealPlan

def generate_user_meal_plan(user: User, days: int = 5):
    """
    Generates a meal plan for a user for a specified number of days,
    avoiding ingredients forbidden by the user's diseases.
    """
    # 1. Get all forbidden ingredient IDs for the user
    user_diseases = user.userprofile.diseases.all()
    if not user_diseases.exists():
        # Handle case where user has no specified diseases
        forbidden_ingredient_ids = []
    else:
        # Get a flat, unique list of ingredient IDs to forbid
        forbidden_ingredient_ids = list(
            Ingredient.objects.filter(disease__in=user_diseases)
            .values_list('id', flat=True)
            .distinct()
        )

    # 2. Get all available meals, excluding those with forbidden ingredients
    available_meals = Meal.objects.exclude(ingredients__id__in=forbidden_ingredient_ids)

    # 3. Separate meals by type for easy selection
    # Using list() to execute the query once and allow random.choice
    available_breakfasts = list(available_meals.filter(meal_type='B'))
    available_lunches = list(available_meals.filter(meal_type='L'))
    available_dinners = list(available_meals.filter(meal_type='D'))

    # Check if we have enough meals to generate a plan
    if not all([available_breakfasts, available_lunches, available_dinners]):
        # You should handle this more gracefully in a real app
        # e.g., return an error message to the user.
        raise ValueError("Not enough meal variety to generate a plan. Please add more meals to the database.")

    # 4. Clear any existing future meal plan for this user
    today = datetime.date.today()
    UserMealPlan.objects.filter(user=user, plan_date__gte=today).delete()

    # 5. Generate and save the new meal plan
    new_plan = []
    for i in range(days):
        plan_date = today + datetime.timedelta(days=i)

        # Select one random meal of each type
        breakfast = random.choice(available_breakfasts)
        lunch = random.choice(available_lunches)
        dinner = random.choice(available_dinners)

        # Create the plan entries
        new_plan.append(UserMealPlan(user=user, meal=breakfast, plan_date=plan_date))
        new_plan.append(UserMealPlan(user=user, meal=lunch, plan_date=plan_date))
        new_plan.append(UserMealPlan(user=user, meal=dinner, plan_date=plan_date))

    UserMealPlan.objects.bulk_create(new_plan)

    return True # Indicate success