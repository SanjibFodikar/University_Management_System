from django.urls import path
from . import views
urlpatterns = [
    path('',views.student_dashboard,name="student_dashboard"),
    path('student_login/',views.student_login,name="student_login"),
    path('student_logout/',views.student_logout,name="student_logout"),
    path('student_forgot_password/',views.student_forgot_password,name="student_forgot_password"),
    path('enter_otp/',views.enterotp,name="enterotp"),
    path('getPassword/',views.getPassword,name="getPassword"),
    path('visit_ca1_marks/',views.visit_ca1_marks,name="visit_ca1_marks"),
    path('visit_ca2_marks/',views.visit_ca2_marks,name="visit_ca2_marks"),
    path('visit_ca3_marks/',views.visit_ca3_marks,name="visit_ca3_marks"),
    path('student_visit_pca_marks/',views.student_visit_pca_marks,name="student_visit_pca_marks"),
    path('upload_photo_signature/',views.upload_photo_signature,name="upload_photo_signature"),
    path('download_admit/',views.download_admit,name="download_admit")
]
