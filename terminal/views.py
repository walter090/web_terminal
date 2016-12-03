from django.shortcuts import render
from django.http import HttpResponse


# Create your views here.
def show_terminal(request):
    return render(request, 'term_base.html')


def show_sample(request):
    return render(request, 'test.html')


def get_list(request):
    response = 'rger'
    if request.is_ajax():
        # if request.method == 'POST':
        #     return HttpResponse(response)
        arg = request.POST.get('arg')
        return HttpResponse(arg)
