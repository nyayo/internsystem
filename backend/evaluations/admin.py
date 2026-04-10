from django.contrib import admin
from .models import Evaluation, EvaluationCriteria, EvaluationScore

admin.site.register(Evaluation)
admin.site.register(EvaluationCriteria)
admin.site.register(EvaluationScore)
