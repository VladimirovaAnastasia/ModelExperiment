from django import forms


class UserForm(forms.Form):
    data_of_experiment = forms.CharField()