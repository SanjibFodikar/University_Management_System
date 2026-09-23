from django.db import models
from college.models import *
# Create your models here.

class Photo_Signature(models.Model):
    college=models.ForeignKey(admin_add_college,on_delete=models.CASCADE)
    student=models.ForeignKey(AddStudent,on_delete=models.CASCADE)
    student_photo=models.ImageField(upload_to="studentPhoto/")
    student_signature=models.ImageField(upload_to="studentSignature/")

    def __str__(self):
        return self.college_id.college_name