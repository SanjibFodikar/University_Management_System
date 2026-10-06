from django.urls import path
from . import views

urlpatterns = [
    path('',views.home,name="home"),
    path('base/',views.base,name="base"),
    path('membersarea/',views.membersarea,name="membersarea"),
    path('visitNotice/<int:id>/',views.visitNotice,name="visitNotice"),
    path('letter_notices/',views.letter_notices,name="letter_notices"),
    path('application_notices/',views.application_notices,name="application_notices")
]
