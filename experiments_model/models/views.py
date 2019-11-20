import dataset as dataset
from django.http import HttpResponse, HttpResponseServerError
from django.shortcuts import render

import models.network as mod
from .form import UserForm
from django.http import HttpResponseRedirect
import json
import numpy as np


def index(request):
    if request.method == "POST":
        global name
        global parsed_string
        name = request.POST.get("data_of_experiment")
        parsed_string = json.loads(name)
        i = 0
        global X
        global Y
        n = len(parsed_string)
        X = np.empty(shape=[n, 2])
        Y = np.empty(shape=[n, 1])
        print('это строчка',parsed_string)
        for item in parsed_string:
            X[i, 0] = item['delay']
            X[i, 1] = item['distance']
            Y[i] = item['onField']
            i = i + 1
            #X[i] = item.time
        #return HttpResponse("<h2>Hello, {0}</h2>".format(name))
        print("Входные значенияяя", X)
        mod.getPrediction(X, Y, parsed_string[0]['delay'])

        return HttpResponseRedirect('/thanks/')
    else:
        userform = UserForm()
        return render(request, "model.html", {"form": userform})


def thanks(request):
    return HttpResponse("<h2>Hello, {0}</h2>".format(name))

