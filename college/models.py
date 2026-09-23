from django.db import models
from adminpanel.models import *
# Create your models here.
class CollegeProfile(models.Model):
    college = models.OneToOneField(
        admin_add_college,
        on_delete=models.CASCADE,
        related_name="college_profile"
    )

    college_email = models.EmailField()
    phone_number = models.CharField(max_length=15)
    address = models.TextField()
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    pincode = models.CharField(max_length=10)

    college_logo = models.ImageField(
        upload_to="college_logo/",
        blank=True,
        null=True
    )

    website = models.URLField(
        blank=True,
        null=True
    )

    director_name = models.CharField(
        max_length=150,
        blank=True
    )


    def __str__(self):
        return self.college.college_name

class CollegeCourses(models.Model):
    college=models.ForeignKey(admin_add_college,on_delete=models.CASCADE)
    course_name=models.ForeignKey(AdminCourses,on_delete=models.CASCADE,related_name='collegecourses')
    created_at=models.DateField(auto_now_add=True)
    updated_at=models.DateField(auto_now=True)
    is_active=models.BooleanField(default=True)

    def __str__(self):
        return self.course_name.course_name

class AddStudent(models.Model):
    name=models.CharField(max_length=100)
    user=models.ForeignKey(User,on_delete=models.CASCADE)
    mobile=models.BigIntegerField()
    dob=models.DateField()
    college_course=models.ForeignKey(CollegeCourses,on_delete=models.CASCADE,related_name="course_details")
    semester=models.ForeignKey(AcademicYearSemester,on_delete=models.SET_NULL,blank=True,null=True)
    admission_date=models.DateField()
    course_end_date=models.DateField()
    is_active=models.BooleanField(default=True)
    college_verify=models.BooleanField(default=True)
    university_verify=models.BooleanField(default=False)
    roll_number=models.CharField(max_length=200)
    registration_number=models.CharField(max_length=250)

    def __str__(self):
        return self.name
    
class AddTeacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    teacher_name = models.CharField(max_length=100)
    teacher_qualification = models.CharField(max_length=200)
    phone = models.CharField(max_length=15)
    designation = models.CharField(max_length=100)
    department = models.ForeignKey(CollegeCourses,on_delete=models.CASCADE)
    appointment_date =models.DateField()
    is_active=models.BooleanField(default=False)
    
    def __str__(self):
        return self.teacher_name

class Add_subject_teacher_combination(models.Model):
    college_course=models.ForeignKey(CollegeCourses,on_delete=models.CASCADE,related_name="subject_teacher_course_details")
    semester=models.ForeignKey(AcademicYearSemester,on_delete=models.SET_NULL,blank=True,null=True)
    teacher=models.ForeignKey(AddTeacher,on_delete=models.CASCADE)
    subject=models.ForeignKey(addSubject,on_delete=models.CASCADE)

    def __str__(self): 
        return f"{self.teacher.teacher_name} - {self.subject.subject_name}"

class CAMarks(models.Model):
    CA_CATEGORIES = [
    ('CA1', 'CA1'),
    ('CA2', 'CA2'),
    ('CA3', 'CA3'),
    ]
    ca_type=models.CharField(max_length=100,choices=CA_CATEGORIES)
    college_data=models.ForeignKey(AddStudent,on_delete=models.CASCADE)
    subject_teacher=models.ForeignKey(Add_subject_teacher_combination,on_delete=models.CASCADE)
    marks=models.DecimalField(max_digits=5,decimal_places=2)
    crated_at=models.DateField(auto_now_add=True)

    def __str__(self):
        return self.ca_type

class PCA_Marks(models.Model):
    student=models.ForeignKey(AddStudent,on_delete=models.CASCADE)
    course = models.ForeignKey(CollegeCourses,on_delete=models.CASCADE,related_name="pca_marks")
    semester = models.ForeignKey(AcademicYearSemester,on_delete=models.CASCADE)
    subject_marks = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.course} - {self.semester}"
    
