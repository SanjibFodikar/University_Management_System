from django.db import models
from django.contrib.auth.models import User

# Create your models here.

# admin college add models
class admin_add_college(models.Model):
    COLLEGE_CHOICE=(
        ('PRIVATE','PRIVATE'),
        ('GOVERNMENT','GOVERNMENT')
    )
    college_name=models.CharField(max_length=150)
    college_code=models.CharField(max_length=20)
    college_types=models.CharField(max_length=100,choices=COLLEGE_CHOICE)
    created_at=models.DateTimeField(auto_now_add=True)
    def __str__(self):
       return self.college_name

class AcademicYearSemester(models.Model):

    YEAR_CHOICES = [
        ("1st Year", "1st Year"),
        ("2nd Year", "2nd Year"),
        ("3rd Year", "3rd Year"),
        ("4th Year", "4th Year"),
    ]

    SEMESTER_CHOICES = [
        ("1st Semester", "1st Semester"),
        ("2nd Semester", "2nd Semester"),
    ]

    year = models.CharField(max_length=100,choices=YEAR_CHOICES)

    semester = models.CharField(
        max_length=100,choices=SEMESTER_CHOICES
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = (
            "year",
            "semester"
        )

    def __str__(self):

        return f"{self.year} - {self.semester}"

class AdminCourses(models.Model):
    YEARS_CHOICES = (
        ('1 Years','1 Years'),
        ('2 Years','2 Years'),
        ('3 Years','3 Years'),
        ('4 Years','4 Years')
    )
    course_name=models.CharField(max_length=100)
    course_duration=models.CharField(max_length=10,choices=YEARS_CHOICES)
    created_at=models.DateField(auto_now_add=True)
    is_active=models.BooleanField(default=True)

    def __str__(self):
        return self.course_name

class addSubject(models.Model):

    PAPER_TYPE_CHOICES = [
        ('theory', 'Theory'),
        ('lab', 'Lab'),
    ]

    PAPER_CHOICE = [
        ('major', 'Major'),
        ('minor', 'Minor'),
    ]

    course = models.ForeignKey(
        AdminCourses,
        on_delete=models.CASCADE
    )

    year_semester = models.ForeignKey(
        AcademicYearSemester,
        on_delete=models.CASCADE
    )

    subject_name = models.CharField(
        max_length=100
    )

    subject_type = models.CharField(
        max_length=10,
        choices=PAPER_TYPE_CHOICES,
        default='theory'
    )

    paper_choice = models.CharField(
        max_length=10,
        choices=PAPER_CHOICE,
        default='major'
    )

    paper_code = models.CharField(
        max_length=10
    )

    creation_date = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.subject_name


class UniversityNotification(models.Model):
 
    NOTIFICATION_TYPE_CHOICES = (
        ('student_added', 'Student Added'),
        ('teacher_added', 'Teacher Added'),
        ('student_updated', 'Student Updated'),
        ('teacher_updated', 'Teacher Updated'),
        ('subject_teacher_added', 'Subject Teacher Added'),
        ('ca1_added','CA1_Added'),
        ('ca2_added','CA2_Added'),
        ('ca3_added','CA3_Added')
    )

    notification_type = models.CharField(
        max_length=50,
        choices=NOTIFICATION_TYPE_CHOICES
    )

    college = models.ForeignKey(
        admin_add_college,
        on_delete=models.CASCADE,
        related_name='notifications'
    )

    student = models.ForeignKey(
        'college.AddStudent',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )

    teacher = models.ForeignKey(
        'college.AddTeacher',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )

    message = models.CharField(
        max_length=255
    )

    is_read = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.message


class AdminNotice(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    notice_date = models.DateField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class AdmitCard(models.Model):
    EXAM_TYPE=[
        ('Even','Even'),
        ('Odd','Odd')
    ]
    student=models.ForeignKey('college.AddStudent',on_delete=models.CASCADE,related_name="studentAdmitCard")
    CardNumber=models.CharField(max_length=100)
    ExamDate=models.DateField()
    GeneratedAt=models.DateTimeField(auto_now_add=True)
    is_active=models.BooleanField(default=True)
    Exam_Type=models.CharField(choices=EXAM_TYPE,max_length=100)

    def __str__(self):
        return self.student.name

class AdmitCardGenerate(models.Model):
    college = models.ForeignKey(admin_add_college,on_delete=models.CASCADE,related_name='admit_cards_Generate')
    course = models.ForeignKey('college.CollegeCourses',on_delete=models.CASCADE,related_name='admit_cards_Generate')
    semester = models.ForeignKey(AcademicYearSemester,on_delete=models.CASCADE,related_name='admit_cards')
    subject_date_time = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    def __str__(self):
        return str(self.created_at)

