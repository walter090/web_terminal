from django.shortcuts import render


# Create your views here.
def show_terminal(request):
    return render(request, 'base.html')
