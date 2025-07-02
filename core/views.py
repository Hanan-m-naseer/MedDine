from django.shortcuts import render, redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.forms import AuthenticationForm
from django.contrib.auth.decorators import login_required
from datetime import date, timedelta
from .models import Meal, UserProfile, UserMealPlan
from .forms import UserRegisterForm, ProfileForm

def home(request):
    return render(request, 'core/home.html')

def register(request):
    if request.method == 'POST':
        user_form = UserRegisterForm(request.POST)
        if user_form.is_valid():
            user = user_form.save()
            login(request, user)
            return redirect('edit_diseases')
    else:
        user_form = UserRegisterForm()
    return render(request, 'core/register.html', {'form': user_form})

def user_login(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('today_meal')
    else:
        form = AuthenticationForm()
    return render(request, 'core/login.html', {'form': form})

@login_required
def edit_diseases(request):
    profile, _ = UserProfile.objects.get_or_create(user=request.user)
    if request.method == 'POST':
        form = ProfileForm(request.POST, instance=profile)
        if form.is_valid():
            form.save()
            generate_meal_plan(profile)
            return redirect('today_meal')
    else:
        form = ProfileForm(instance=profile)
    return render(request, 'core/edit_diseases.html', {'form': form})

@login_required
def today_meal(request):
    today = date.today()
    plan = UserMealPlan.objects.filter(user=request.user, date=today).first()

    if not plan:
        profile = UserProfile.objects.get(user=request.user)
        generate_meal_plan(profile)
        plan = UserMealPlan.objects.filter(user=request.user, date=today).first()

    return render(request, 'core/today_meal.html', {'plan': plan})

def generate_meal_plan(profile):
    user = profile.user
    start_date = date.today()
    profile.meal_plan_start_date = start_date
    profile.save()

    # Get forbidden ingredients
    forbidden_ingredients = set()
    for disease in profile.diseases.all():
        forbidden_ingredients.update(disease.forbidden_ingredients.all())

    meals = Meal.objects.all()

    # Filter by veg/non-veg
    if profile.preference == 'veg':
        meals = meals.exclude(name__icontains='chicken') \
                     .exclude(name__icontains='mutton') \
                     .exclude(name__icontains='egg') \
                     .exclude(name__icontains='fish')

    # Exclude forbidden ingredients
    if forbidden_ingredients:
        meals = meals.exclude(ingredients__in=forbidden_ingredients)

    # Split meals
    breakfasts = meals.filter(meal_type__iexact='breakfast')
    lunches = meals.filter(meal_type__iexact='lunch')
    dinners = meals.filter(meal_type__iexact='dinner')

    print("Final meals count:", meals.count())
    print("Breakfast count:", breakfasts.count())
    print("Lunch count:", lunches.count())
    print("Dinner count:", dinners.count())

    # Check if any category is empty
    if not breakfasts.exists() or not lunches.exists() or not dinners.exists():
        print("⚠️ Not enough meals to generate a plan. Please add more meals.")
        return

    # Delete existing plans
    UserMealPlan.objects.filter(user=user).delete()

    # Build 5-day plan
    for i in range(5):
        plan_date = start_date + timedelta(days=i)
        breakfast = breakfasts.order_by('?').first()
        lunch = lunches.order_by('?').first()
        dinner = dinners.order_by('?').first()

        UserMealPlan.objects.create(
            user=user,
            date=plan_date,
            breakfast=breakfast,
            lunch=lunch,
            dinner=dinner
        )


def logout_view(request):
    logout(request)
    return redirect('home')

def healthy_meal_plans(request):
    meals = Meal.objects.all()
    return render(request, 'core/healthy_meal_plans.html', {'meals': meals})
