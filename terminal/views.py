from django.shortcuts import render
from django.http import HttpResponse
from .util import cmd
import json


# Create your views here.
def show_terminal(request):
    return render(request, 'term_base.html')


def show_sample(request):
    return render(request, 'test.html')


def get_list(request):
    if request.is_ajax():
        arg = request.POST.get('arg')
        return HttpResponse(cmd.cmd_ls(arg))


def change_dir(request):
    if request.is_ajax():
        current_dir = request.POST.get('currentDir')
        command = request.POST.get('command')
        return HttpResponse(json.dumps(cmd.cmd_cd(current_dir, command)))
