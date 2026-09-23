from django.urls import path
from . import views

urlpatterns = [
    path('',views.home,name="home"),
    path('base/',views.base,name="base"),
    path('membersarea/',views.membersarea,name="membersarea"),
    path('visitNotice/<int:id>/',views.visitNotice,name="visitNotice")
]
