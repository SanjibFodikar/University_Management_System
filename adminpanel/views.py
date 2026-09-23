from django.shortcuts import render,redirect,get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate,login,logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import admin_add_college
from django.contrib.auth.hashers import make_password
from college.models import *
from django.http import JsonResponse
from django.utils import timezone
import json
# Create your views here.

# admin nav
def admin_nav(request):
    return render(request,"admin_nav.html")

# admin login

def admin_login(request):
    if request.method=='POST':
        username=request.POST.get('username')
        password=request.POST.get('password')
        user=authenticate(request,username=username,password=password)
        if user is not None and user.is_superuser:
            login(request,user)
            return redirect('admin_dashboard')
        messages.error(request,"admin is not found. please enter correct username and password")
    return render(request,"admin_login.html")

# admin dashboard

@login_required
def admin_dashboard(request):

    return render(request,"admin_dashboard.html")

# admin add college
# it is changeale fixed it currently
@login_required
def add_college(request):
    count=admin_add_college.objects.all().count()+1
    code="MAK"
    if request.method=='POST':
        college_name=request.POST.get('college_name').strip().upper()
        college_type=request.POST.get('college_type')
        code += str(count)
        college_code=code
        admin_add_college.objects.create(
            college_name=college_name,
            college_code=college_code,
            college_types=college_type
        )

        messages.success(request,"College Added Successfully")
        return redirect('admin_add_college')

    print(count)
    return render(request,"admin_addcollege.html")

# admin logout
def admin_logout(request):
    logout(request)
    return redirect('admin_login')

@login_required
def admin_manage_college(request):
    colleges=admin_add_college.objects.all()
    return render(request,"admin_manageCollege.html",{
        'colleges':colleges
    })

def admin_edit_college(request,id):
    colleges=admin_add_college.objects.filter(id=id).first()
    if request.method=='POST':
        college_name=request.POST.get('college_name').upper()
        college_code=request.POST.get('college_code')
        college_type=request.POST.get('college_type')
        colleges.college_name=college_name
        colleges.college_code=college_code
        colleges.college_types=college_type
        colleges.save()
        messages.success(request,"Data Updated Sucessfully")
    return render(request,"admin_edit_college.html",{
        'college':colleges
    })

def admin_view_college(request,id):
    college=admin_add_college.objects.get(id=id)
    return render(request,'admin_viewCollege.html',{
        'college':college,
        
    })

def admin_delete_college(request,id):
    college=admin_add_college.objects.get(id=id)
    college.delete()
    messages.success(request,"College Deleted Sucessfully")
    return redirect('admin_manage_college')

def admin_year_semester(request):
    if request.method=='POST':
        year=request.POST.get('year')
        semester=request.POST.get('semester')
        is_active=request.POST.get('is_active')
        try:
            AcademicYearSemester.objects.create(
                year=year,
                semester=semester,
                is_active=is_active
                )
            messages.success(request,"semester and year added sucessfully")
            return redirect('admin_year_semester')
        except Exception as e:
            messages.error(request,"duplicate entry not aloowed")
        
        
    return render(request,"admin_add_year_semester.html")

def manage_year_semester(request):
    academic_year_semesters=AcademicYearSemester.objects.all().order_by('year')
    return render(request,"manage_year_and_semester.html",{
        'academic_year_semesters':academic_year_semesters
    })

# admin add course
def admin_add_course(request):
    
    if request.method=='POST':
        course_name=request.POST.get('course_name').upper()
        course_duration=request.POST.get('course_duration',"")
        is_active=request.POST.get('is_active')
        if AdminCourses.objects.filter(course_name=course_name,course_duration=course_duration).exists():
            messages.error(request,"Course already exist")
            return redirect('admin_add_course')
        if course_name and course_duration and is_active:

            AdminCourses.objects.create(
            course_name=course_name,
            course_duration=course_duration,
            is_active=is_active
            )
            
            messages.success(request,"Course added sucessfully")
            return redirect('admin_add_course')
    return render(request,"admin_add_course.html")

def admin_manage_course(request):
    courses=AdminCourses.objects.all().order_by('course_name')
    return render(request,"admin_manage_courses.html",{
        'courses':courses
    })

# admin edit course
def admin_edit_course(request,id):
    course=AdminCourses.objects.get(id=id)
    if request.method=='POST':
        course_name=request.POST.get('course_name').upper()
        course_duration=request.POST.get('course_duration')
        is_active=request.POST.get('is_active')
        course.course_name=course_name
        course.course_duration=course_duration 
        if is_active == "True":
            course.is_active = True
        else:
            course.is_active = False
        course.save()
        messages.success(request,"Data Updated sucessfully")
        return redirect('admin_edit_course',id=id)
    return render(request,"admin_edit_course.html",{
        'course':course
    })

def admin_delete_course(request,id):
    course=AdminCourses.objects.get(id=id)
    course.delete()
    messages.success(request,"Course deleted successfully")
    return redirect('admin_manage_course')

def admin_edit_year_semester(request,id):
    academic_year_semester=AcademicYearSemester.objects.get(id=id)
    if request.method=='POST':
        year=request.POST.get('year')
        semester=request.POST.get('semester')
        if AcademicYearSemester.objects.filter(year=year,semester=semester).exclude(id=id).exists():
            messages.error(request,"This Year and semester already present")
            return redirect('admin_edit_year_semester',id=id)
        is_active=request.POST.get('is_active')
        
        academic_year_semester.year=year
        academic_year_semester.semester=semester
        academic_year_semester.is_active=is_active
        academic_year_semester.save()
        messages.success(request,"year and semester updated sucessfully")
        return redirect('admin_edit_year_semester',id=id)
    return render(request,"admin_edit_year_semester.html",{
        'academic_year_semester':academic_year_semester
    })

def delete_year_semester(request,id):
    semester=AcademicYearSemester.objects.get(id=id)
    semester.delete()
    messages.success(request,"Year and semester deleted sucessfully")
    return redirect('manage_year_semester')

def admin_manage_student(request):
    colleges=admin_add_college.objects.all()
    return render(request,"admin_manage_student.html",{
        'colleges':colleges
    })

def get_course(request,id):
    college_course = CollegeCourses.objects.filter(college_id=id).values('id','course_name__course_name')
    return JsonResponse({
        "courses": list(college_course)
    })


def get_studentData(request,college_id,course_id,semester_id=None):
    students=""
    if semester_id:
        students=AddStudent.objects.select_related('user','college_course','semester').filter(college_course_id=course_id,college_course__college_id=college_id,semester_id=semester_id).values(
            'id','name','user__email','mobile','dob','college_course__college__college_name','college_course__course_name__course_name','semester__year',
            'semester__semester','admission_date','course_end_date','is_active','college_verify','university_verify','roll_number','registration_number')
        
    else:    
        students=AddStudent.objects.select_related('user','college_course','semester').filter(college_course_id=course_id,college_course__college_id=college_id).values(
        'id','name','user__email','mobile','dob','college_course__college__college_name','college_course__course_name__course_name','semester__year',
        'semester__semester','admission_date','course_end_date','is_active','college_verify','university_verify','roll_number','registration_number')
        
    return JsonResponse(list(students),safe=False)

# student semester
def get_studentSemester(request,college_id,course_id):
    semesters=AddStudent.objects.select_related('college_course','semester').filter(college_course_id=course_id,college_course__college_id=college_id).values('semester__semester','semester__id').distinct()
    return JsonResponse(list(semesters),safe=False)

# student approved and reject operation are performing inside that function
def admin_approved_student(request,id):
    student=AddStudent.objects.select_related('user','college_course','semester').get(id=id)
    action=request.GET.get('action')
    if action=='reject':
        data=[]
        student.university_verify=False
        student.save()
        data=[{
            'is_active':student.is_active,
            'university_verify':student.university_verify
        }]
        return JsonResponse(data,safe=False)
    
    roll_number=f"{student.college_course.course_name}{student.college_course.college.college_code}{student.admission_date.year}{student.id:03d}"
    registration_number=f"{5498}{student.college_course.course_name}{student.college_course.college.college_code}{student.admission_date.year}{student.id:03d}"
    data=[]
    if not student.roll_number:
        student.roll_number=roll_number
        student.user.username=roll_number
        student.user.save()
    if not student.registration_number:
        student.registration_number=registration_number
    student.university_verify=True
    student.save()
    data=[{
         'is_active':student.is_active,
         'university_verify': student.university_verify,
         'roll_number': student.roll_number,
         'registration_number': student.registration_number,
    }] 
    return JsonResponse(data,safe=False)

def admin_create_subject(request):
    courses=AdminCourses.objects.all()
    semester_years=AcademicYearSemester.objects.all().order_by('year')
    if request.method=='POST':
        course_id=request.POST.get('course')
        semester_years_id=request.POST.get('year_semester')
        subject_names = request.POST.getlist('subject_name[]')
        paper_codes = request.POST.getlist('paper_code[]')
        subject_types = request.POST.getlist('subject_type[]')
        paper_choices = request.POST.getlist('paper_choice[]')
        for subject_name, paper_code, subject_type, paper_choice in zip(
              subject_names,
              paper_codes,
              subject_types,
              paper_choices
        ):
            addSubject.objects.create(
                course_id=course_id,
                year_semester_id=semester_years_id,
                subject_name=subject_name.strip().title(),
                subject_type=subject_type,
                paper_choice=paper_choice,
                paper_code=paper_code.upper()
            )
        messages.success(request,"Subject Added Successfully")
        return redirect('admin_create_subject')

    return render(request,"create_subject.html",{
        'courses':courses,
        'year_semesters':semester_years
    })

def admin_manage_subject(request):
    courses=AdminCourses.objects.all()
    year_semesters=AcademicYearSemester.objects.all().order_by('year')
    return render(request,"manage_subject.html",{
        'courses':courses,
        'year_semesters':year_semesters
    })

def ajax_manage_subject(request,course,semester):
    subjects=addSubject.objects.filter(course_id=course,year_semester_id=semester)
    data=[]
    for subject in subjects:
        data.append({
            'id':subject.id,
            'course':subject.course.course_name,
            'year':subject.year_semester.year,
            'semester':subject.year_semester.semester,
            'subject_name':subject.subject_name,
            'subject_type':subject.subject_type,
            'paper_code':subject.paper_code,
            'paper_choice':subject.paper_choice,
            'created_date':subject.creation_date
        })
    return JsonResponse(data,safe=False)

def admin_edit_subject(request,id):
    courses=AdminCourses.objects.all()
    year_semesters=AcademicYearSemester.objects.all()
    subject=get_object_or_404(addSubject,id=id)
    if request.method=='POST':
        course=request.POST.get('course')
        year_semester=request.POST.get('year_semester')
        subject_name=request.POST.get('subject_name')
        paper_code=request.POST.get('paper_code')
        subject_type=request.POST.get('subject_type')
        paper_choice=request.POST.get('paper_choice')
        subject.course_id=course
        subject.year_semester_id=year_semester
        subject.subject_name=subject_name.strip().title()
        subject.subject_type=subject_type
        subject.paper_code=paper_code.upper()
        subject.paper_choice=paper_choice
        subject.save()
        messages.success(request,'Subject updated sucessfully')
        return redirect('admin_edit_subject',id=id)
    return render(request,"admin_edit_subject.html",{
        'courses':courses,
        'year_semesters':year_semesters,
        'subject':subject
    })

def admin_delete_subject(request,id):
    subject=get_object_or_404(addSubject,id=id)
    subject.delete()
    messages.success(request,"Data deleted successfully")
    return redirect('admin_manage_subject')

from collections import defaultdict

def university_notification(request):

    notifications = UniversityNotification.objects.select_related('college','student__college_course__course_name','student__semester','teacher').order_by('-created_at')

    college_notifications = defaultdict(list)

    for notification in notifications:
        college_notifications[notification.college].append(notification)

    unread_count = notifications.filter(is_read=False).count()
    request.session['unread_count']=unread_count
    return render(
        request,
        "university_notification.html",
        {
            'college_notifications': dict(college_notifications),
            'unread_count': unread_count,
        }
    )

def mark_as_read(request,id):
    notification=UniversityNotification.objects.get(id=id)
    notification.is_read=True
    notification.save()
    request.session['unread_count']=UniversityNotification.objects.filter(is_read=False).count()
    print(id)
    return redirect('university_notification')

def delete_read_message_all(request):
    messages_read=UniversityNotification.objects.select_related('college','student','teacher').filter(is_read=True)
    if messages_read:
       messages_read.delete()
       messages.success(request,"All read notifications deleted successfully")
    else:
        messages.error(request,"No Read Notifications are available")
    return redirect('university_notification')

def delete_unread_message_all(request):
    messages_unread=UniversityNotification.objects.select_related('college','student','teacher').filter(is_read=False)
    if messages_unread:
        messages_unread.delete()
        messages.success(request,"All unread notifications deleted successfully")
    else:
        messages.error(request,"No Unread Notifications are available")
    return redirect('university_notification')

def mark_all_as_read(request):
    all_read=UniversityNotification.objects.select_related('college','student','teacher').filter(is_read=False).update(is_read=True)
    messages.success(request, "All notifications marked as read")
    return redirect('university_notification')

def delete_all_notification(request):
    all_delete=UniversityNotification.objects.all()
    if all_delete:
       all_delete.delete()
       messages.success(request, "All notifications Deleted Successfully")
    else:
        messages.error(request,"No notifications are available")
    return redirect('university_notification')

def delete_perticular_notification(request,id):
    perticular_notification=get_object_or_404(UniversityNotification,id=id)
    student=perticular_notification.student.name
    perticular_notification.delete()
    messages.success(request,f"notification deleted for {student}")
    return redirect('university_notification')

def admin_add_notice(request):
    if request.method=='POST':
        title=request.POST.get('title').title()
        description=request.POST.get('description').title()
        date=request.POST.get('notice_date')
        is_active=request.POST.get('is_active')
        AdminNotice.objects.create(
           title=title,
           description=description,
           notice_date=date,
           is_active=is_active
        )
        messages.success(request,"Notice added successfully")
        return redirect('admin_add_notice')
    return render(request,"admin_add_notice.html")

def admin_manage_notice(request):
    notices=AdminNotice.objects.all()
    return render(request,"admin_manage_notice.html",{
        'notices':notices
    })

def admin_edit_notice(request,id):
    notice=get_object_or_404(AdminNotice,id=id)
    if request.method=='POST':
        title=request.POST.get('title')
        description=request.POST.get('description')
        is_active=request.POST.get('is_active')
        notice.title=title
        notice.description=description
        notice.is_active=is_active
        notice.save()
        messages.success(request,"Notice is edited successfully")
        return redirect('admin_edit_notice',id=id)
    return render(request,"admin_edit_notice.html",{
        'notice':notice
    })

def admin_delete_notice(request,id):
    notice=get_object_or_404(AdminNotice,id=id)
    notice.delete()
    messages.success(request,"Notice is deleted successfully")
    return redirect('admin_manage_notice')

def admin_view_notice(request,id):
    notice=get_object_or_404(AdminNotice,id=id)
    return render(request,"admin_view_notice.html",{
        'notice':notice
    })

def admin_visit_ca1(request):
    colleges=admin_add_college.objects.all()
    return render(request,"admin_visit_ca.html",{
        'colleges':colleges
    })

def ca_marks_fetch(request,id):
    print(id)
    data_ca = (CAMarks.objects.filter(college_data__college_course__college_id=id).values(
        'ca_type',
    )
    .distinct())
    data_course=(CAMarks.objects.filter(college_data__college_course__college_id=id).values(
        'college_data__college_course__course_name__course_name',
        'college_data__college_course_id',
    )
    .distinct())
    data_semester=(CAMarks.objects.filter(college_data__college_course__college_id=id).values(
        'subject_teacher__semester_id',
        'subject_teacher__semester__semester',
        'subject_teacher__semester__year'
    )
    .distinct())
    return JsonResponse({
        'ca_type':list(data_ca),
        'course_type':list(data_course),
        'semester_type':list(data_semester),
    })

def fetch_students_ca_data(request, college_id, course_id, semester_id, ca_type):

    data = CAMarks.objects.select_related(
        'college_data',
        'subject_teacher',
        'subject_teacher__semester'
    ).filter(
        college_data__college_course__college_id=college_id,
        college_data__college_course_id=course_id,
        subject_teacher__semester_id=semester_id,
        ca_type=ca_type
    ).order_by(
        'college_data__roll_number'
    )
    students = {}
    for item in data:
        student_id = item.college_data.id
        if student_id not in students:
            students[student_id] = {
                'name': item.college_data.name,
                'college':item.subject_teacher.college_course.college.college_name,
                'roll_number': item.college_data.roll_number,
                'ca_type': item.ca_type,
                'semester': item.subject_teacher.semester.semester,
                'year': item.subject_teacher.semester.year,
                'subjects': []
            }

        students[student_id]['subjects'].append({
            'subject': str(item.subject_teacher),
            'marks': item.marks
        })

    return JsonResponse(list(students.values()), safe=False)

def admin_visit_pca(request):
    colleges=admin_add_college.objects.all()
    return render(request,"admin_visit_pca.html",{
        'colleges':colleges
    })

def fetch_course_semester(request,college_id):
    print(college_id)
    pca_course_semester=PCA_Marks.objects.select_related('student','course','semester').filter(course__college_id=college_id).values(
        'course_id',
        'course__course_name__course_name',
        'semester_id',
        'semester__year',
        'semester__semester'

    ).distinct()
    return JsonResponse(list(pca_course_semester),safe=False)

from django.http import JsonResponse

def admin_get_pca_marks(request, college_id, course_id, semester_id):

    pca_marks = PCA_Marks.objects.select_related(
        'student',
        'course',
        'semester'
    ).filter(
        course__college_id=college_id,
        course_id=course_id,
        semester_id=semester_id
    )

    students_data = []

    for pca in pca_marks:

        subject_marks = []

        for key, item in pca.subject_marks.items():

            subject = addSubject.objects.get(id=key)

            subject_marks.append({
                'subject_id': key,
                'subject_name': subject.subject_name,
                'subject_code': subject.paper_code,
                'marks': item
            })

        students_data.append({

            'student_id': pca.student_id,

            'student_name': pca.student.name,

            'roll_number': pca.student.roll_number,

            'registration_number': pca.student.registration_number,

            'course_name': pca.course.course_name.course_name,

            'year': pca.semester.year,

            'semester': pca.semester.semester,

            'subjects': subject_marks

        })

    return JsonResponse(students_data, safe=False)

def generate_admit_card(request):
    colleges=admin_add_college.objects.all()
    subjects=""
    if request.method=='POST' and request.POST.get('admit_btn'):
        college_id=request.POST.get('college')
        course_id=request.POST.get('course')
        semester_id=request.POST.get('semester')
        try:
            course=CollegeCourses.objects.select_related('college','course_name').get(course_name_id=course_id)
            admit_data=AdmitCardGenerate.objects.select_related('college','course','semester').get(
                college_id=college_id,
                course=course,
                semester_id=semester_id,
                created_at__year=timezone.now().year
            )
            print(admit_data)
            return JsonResponse({
                'exists':True,
                'college_id':college_id,
                'course_id':course_id,
                'semester_id':semester_id,
                'data':admit_data.subject_date_time
            })
        except AdmitCardGenerate.DoesNotExist:
            subjects=addSubject.objects.select_related('course','year_semester').filter(course_id=course_id,year_semester_id=semester_id).values(
                'id',
                'subject_name',
                'paper_code',
                'course_id',
                'year_semester_id'
            )
            return JsonResponse({
                'exists':False,
                'subjects':list(subjects),
                'college_id':college_id,
                'course_id':course_id,
                'semester_id':semester_id
            })
        except CollegeCourses.DoesNotExist:
            return JsonResponse({
                'success': False,
                'message': 'Course not found.'
            })
        except Exception as e:
            print(e)
            return JsonResponse({
                'exists':False,
                'message':str(e)
            })
        
    return render(request,"generate_admit_card.html",{
        'colleges':colleges
    })

def fetch_course_semester_to_generate_admit(request,college_id):
    course_semester=AddStudent.objects.select_related('college_course','college_course__college','college_course__course_name','semester').filter(
        college_course__college_id=college_id
    ).values(
        'college_course__course_name_id',
        'college_course__course_name__course_name',
        'semester_id',
        'semester__year',
        'semester__semester'
    ).distinct()
    return JsonResponse(list(course_semester),safe=False)

def put_data_admit_card(request):
    if request.method == "POST":
        subject_ids = request.POST.getlist('subject_id')
        subject_codes=request.POST.getlist('subject_code')
        subject_names=request.POST.getlist('subject_name')
        course_id=request.POST.get('course_id')
        semester_id=request.POST.get('semester_id')
        college_id=request.POST.get('college_id')
        course=CollegeCourses.objects.get(course_name_id=course_id,college_id=college_id)
        data=[]
        for subject_id,subject_code,subject_name in zip(subject_ids,subject_codes,subject_names):
            exam_date = request.POST.get(f'exam_date_{subject_id}')
            exam_time = request.POST.get(f'exam_time_{subject_id}')
            data.append({
                'subject_id':subject_id,
                'subject_name':subject_name,
                'subject_code':subject_code,
                'exam_date':exam_date,
                'exam_time':exam_time
            })
        AdmitCardGenerate.objects.create(
            college_id=college_id,
            course=course,
            semester_id=semester_id,
            subject_date_time=data
        )
        return JsonResponse({
            "success": True,
            "message": "Admit Card Generated Successfully."
        })
    
from django.views.decorators.http import require_POST
import json

@require_POST
def update_admit_card(request):
    try:
        data = json.loads(request.body)
        print("REQUEST DATA:", data)
        college_id = data.get('college_id')
        course_id = data.get('course_id')
        semester_id = data.get('semester_id')
        subject_data = data.get('subject_data')

        if not college_id or not course_id or not semester_id:

            return JsonResponse({
                'success': False,
                'message': 'College, Course and Semester are required.'
            }, status=400)


        if not isinstance(subject_data, dict) or not subject_data:

            return JsonResponse({
                'success': False,
                'message': 'Subject examination data is required.'
            }, status=400)


        course = CollegeCourses.objects.get(
            course_name_id=course_id,
            college_id=college_id
        )


        admit_card = AdmitCardGenerate.objects.filter(
            college_id=college_id,
            course=course,
            semester_id=semester_id,
            is_active=True
        ).first()


        if not admit_card:

            return JsonResponse({
                'success': False,
                'message': 'Admit card record not found.'
            }, status=404)


        existing_data = admit_card.subject_date_time

        
        if not isinstance(existing_data, list):

            return JsonResponse({
                'success': False,
                'message': 'Existing admit card data format is invalid.'
            }, status=400)


        for subject in existing_data:

            subject_id = str(
                subject.get('subject_id')
            )

            if subject_id in subject_data:

                subject['exam_date'] = subject_data[
                    subject_id
                ].get('exam_date')

                subject['exam_time'] = subject_data[
                    subject_id
                ].get('exam_time')


        admit_card.subject_date_time = existing_data

        admit_card.save(
            update_fields=['subject_date_time']
        )


        return JsonResponse({
            'success': True,
            'message': 'Admit card examination details updated successfully.'
        })


    except json.JSONDecodeError:

        return JsonResponse({
            'success': False,
            'message': 'Invalid JSON data.'
        }, status=400)


    except CollegeCourses.DoesNotExist:

        return JsonResponse({
            'success': False,
            'message': 'Course not found.'
        }, status=404)


    except Exception as e:

        print("ERROR:", e)

        return JsonResponse({
            'success': False,
            'message': str(e)
        }, status=500)

def admin_visit_teacher(request):
    colleges=admin_add_college.objects.all()
    return render(request,"admin_visit_teacher.html",{
        'colleges':colleges
    })


def getTeacher(request,college_id):
    teachers=AddTeacher.objects.select_related('user','department').filter(department__college_id=college_id,is_active=True).values(
        'user__username',
        'teacher_name',
        'teacher_qualification',
        'phone',
        'designation',
        'department__course_name__course_name',
        'appointment_date'
    )
    print(teachers)
    return JsonResponse(list(teachers),safe=False)