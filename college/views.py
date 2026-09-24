from django.shortcuts import render,redirect,get_object_or_404
from adminpanel.models import *
from .models import *
from django.contrib import messages
from django.contrib.auth.models import User
from datetime import date,datetime
from django.http import JsonResponse
from datetime import datetime
# Create your views here.
def college_nav(request):
    return render(request,"college_nav.html")

def college_login(request):
    # admin add college model comes from adminpanel model
    colleges=admin_add_college.objects.all()
    if request.method=='POST':
        college_id=request.POST.get('college_name')
        college_code=request.POST.get('college_code').upper()
        is_available=admin_add_college.objects.filter(id=college_id,college_code=college_code).first()
        if is_available:
            request.session['college_id']=is_available.id
            request.session['college_name']=is_available.college_name
            return redirect('college_dashboard')
        messages.error(request,"your college code does not matching with your college name")
        return redirect('college_login')
    return render(request,"college_login.html",{
        'colleges':colleges
    })

# college logout
def college_logout(request):
    request.session.pop('college_id', None)
    messages.error(request,'you successfully logged out')
    return redirect('college_login')

# college dashboard
def college_dashboard(request):
    return render(request,"college_dashboard.html")

# college profile
def college_profile(request):
    college_id=request.session.get('college_id')
    is_present=CollegeProfile.objects.filter(college_id=college_id)
    if is_present:
        return redirect('college_edit_profile')
    
    college_details=admin_add_college.objects.filter(id=college_id).first()
    
    if request.method=='POST':
        college_email=request.POST.get('college_email')
        phone_number=request.POST.get('phone_number')
        address=request.POST.get('address').upper()
        city=request.POST.get('city').upper()
        district=request.POST.get('district').upper()
        state=request.POST.get('state').upper()
        pincode=request.POST.get('pincode')
        website=request.POST.get('website')
        director_name=request.POST.get('director_name').upper()
        college_logo=request.FILES.get('college_logo')

        CollegeProfile.objects.create(
            college_id=college_id,
            college_email=college_email,
            phone_number=phone_number,
            address=address,
            city=city,
            district=district,
            state=state,
            pincode=pincode,
            website=website if website else None,
            college_logo=college_logo if college_logo else None,
            director_name=director_name
        )
        messages.success(request,"College added successfully")
        return redirect('college_profile')

    return render(request,"college_profile.html",{
        'college_details':college_details
    })

# college profile edit
def college_edit_profile(request):
    college_id=request.session.get('college_id')
    
    colleges=CollegeProfile.objects.select_related('college').filter(college_id=college_id).first()
    if not colleges:
        messages.error(request,"At first add your details then you can edit details")
        return redirect('college_profile')
    if request.method=='POST':
            college_email=request.POST.get('college_email')
            phone_number=request.POST.get('phone_number')
            address=request.POST.get('address').upper()
            city=request.POST.get('city').upper()
            district=request.POST.get('district').upper()
            state=request.POST.get('state').upper()
            pincode=request.POST.get('pincode')
            website=request.POST.get('website')
            director_name=request.POST.get('director_name').upper()
            college_logo=request.FILES.get('college_logo')
            colleges.college_email=college_email
            colleges.phone_number=phone_number
            colleges.address=address
            colleges.city=city
            colleges.district=district
            colleges.state=state
            colleges.pincode=pincode
            colleges.website=website
            colleges.director_name=director_name
            colleges.college_logo=college_logo
            colleges.save()
            messages.success(request,"College details edited successfully")
    return render(request,"college_edit_profile.html",{
        'colleges':colleges
    })

# college add course
def college_add_course(request):
    college_id=request.session.get('college_id')
    courses=AdminCourses.objects.all().order_by('course_duration')
    if request.method=='POST':
        course_id=request.POST.get('course_name')
        is_active=request.POST.get('is_active')
        if CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id,course_name_id=course_id).exists():
            messages.error(request,"This course already exist")
            return redirect('college_add_course')
        CollegeCourses.objects.create(
            college_id=college_id,
            course_name_id=course_id,
            is_active=is_active
        )
        
        messages.success(request,"Course added successfully to your college")
        return redirect('college_add_course')
        
    return render(request,"college_add_course.html",{
        'courses':courses
    })

# college manage course
def college_manage_course(request):
    college_id=request.session.get('college_id')
    courses=CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id)
    return render(request,"college_manage_courses.html",{
        'courses':courses
    })

# college edit course
def college_edit_course(request,id):
    course=CollegeCourses.objects.get(id=id)
    if request.method=='POST':
        is_active=request.POST.get('is_active')
        if is_active == "True":
            course.is_active = True
        else:
            course.is_active = False
        course.save()
        messages.success(request,"Data Updated sucessfully")
        return redirect('college_edit_course',id=id)
    return render(request,"college_edit_courses.html",{
        'course':course
    })

def college_delete_course(request,id):
    course=CollegeCourses.objects.get(id=id)
    course.delete()
    messages.success(request,"Course deleted successfully")
    return redirect('college_manage_course')

# college add student
def college_add_student(request):
    college_id=request.session.get('college_id')
    courses=CollegeCourses.objects.filter(college_id=college_id,is_active=True)
    semesters=AcademicYearSemester.objects.all().order_by('year')
    if request.method=='POST':
        name=request.POST.get('name').upper()
        email=request.POST.get('email')
        mobile=request.POST.get('mobile')
        dob=request.POST.get('dob')
        college_course_id = request.POST.get('college_course')
        semester_id = request.POST.get('semester')
        admission_date=request.POST.get('admission_date')
        course_end_date=request.POST.get('course_end_date')
        college_course = CollegeCourses.objects.get(
            id=college_course_id,
            college_id=college_id,
            is_active=True
        )
        semester = AcademicYearSemester.objects.get(
            id=semester_id
        )

        dob = datetime.strptime(dob, '%Y-%m-%d').date()
        today = date.today()
        age = today.year - dob.year
        if (today.month, today.day) < (dob.month, dob.day):
          age -= 1
        if age<17:
              messages.error(request,"dob does not match eligibilty criteria")
              return redirect('college_add_student')
        user = User.objects.filter(email=email).first()

        if user:
          messages.error(request,"A student with this email already exists.")
          return redirect('college_add_student')

        user = User.objects.create_user(
          username=f"temp_{email}",
          email=email,
        )

        user.set_password(dob.strftime('%Y-%m-%d'))
        user.save()
        student=AddStudent.objects.create(
            name=name,
            user=user,
            mobile=mobile,
            dob=dob,
            college_course=college_course,
            semester=semester,
            admission_date=admission_date,
            course_end_date=course_end_date,
        )
        # this notification is create for university when college add student
        college_name=get_object_or_404(admin_add_college,id=college_id)
        UniversityNotification.objects.create(
            notification_type="student_added",
            college_id=college_id,
            student=student,
            message=f'{college_name.college_name} added '
                    f'{student.name} in '
                    f'{student.college_course.course_name.course_name} '
                    f'{student.semester}'
        )
        messages.success(request,"Data added successfully")
        return redirect('college_add_student')
    return render(request,"college_add_student.html",{
        'courses':courses,
        'semesters':semesters
    })

def college_manage_student(request):
    college_id = request.session.get('college_id')
    courses=CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id)
    students = AddStudent.objects.filter(
        college_course__college_id=college_id
    )

    student_id = request.GET.get('id')

    if student_id:
        student = AddStudent.objects.get(
            id=student_id,
            college_course__college_id=college_id
        )

        if student.is_active:
            student.is_active = False
            # this notification is create for university when college inactive student
            college_name=get_object_or_404(admin_add_college,id=college_id)
            UniversityNotification.objects.create(
                notification_type="student_updated",
                college_id=college_id,
                student=student,
                message=f'{college_name} Inactive '
                        f'{student.name} in '
                        f'{student.college_course.course_name.course_name} '
                        f'{student.semester}'
                    )
            if student.university_verify:
                student.university_verify=False
        else:
            student.is_active = True
            # this notification is create for university when college active student
            college_name=get_object_or_404(admin_add_college,id=college_id)
            UniversityNotification.objects.create(
                notification_type="student_updated",
                college_id=college_id,
                student=student,
                message=f'{college_name} Active '
                        f'{student.name} in '
                        f'{student.college_course.course_name.course_name} '
                        f'{student.semester}'
                    )
        student.save()

    return render(request, "college_manage_student.html", {
        'students': students,
        'courses':courses
    })

def college_edit_student(request,id):
    student=get_object_or_404(AddStudent.objects.select_related('college_course','semester','user'),id=id)
    college_id = request.session.get('college_id')
    courses=CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id)
    semesters=AcademicYearSemester.objects.all().order_by('year')
    if request.method=='POST':
            name=request.POST.get('student_name').upper()
            email=request.POST.get('email')
            mobile=request.POST.get('mobile')
            dob=request.POST.get('dob')
            college_course_id = request.POST.get('college_course')
            semester_id = request.POST.get('semester')
            admission_date=request.POST.get('admission_date')
            course_end_date=request.POST.get('course_end_date')
            college_course = CollegeCourses.objects.get(id=college_course_id,college_id=college_id,is_active=True)
            semester = AcademicYearSemester.objects.get(id=semester_id)
    
            dob = datetime.strptime(dob, '%Y-%m-%d').date()
            today = date.today()
            age = today.year - dob.year
            if (today.month, today.day) < (dob.month, dob.day):
              age -= 1
              if age<17:
                  messages.error(request,"dob does not match eligibilty criteria")
                  return redirect('college_add_student')
    
            
            if User.objects.filter( email=email ).exclude( id=student.user.id ).exists(): 
                messages.error( request, "A student with this email already exists." ) 
                return redirect( 'college_edit_student', id=id )

            user=student.user
            user.email=email
            user.set_password(dob.strftime('%Y-%m-%d'))
            user.save()
            student.user=user
            student.name=name
            student.mobile=mobile
            student.dob=dob
            student.college_course=college_course
            student.semester=semester
            student.admission_date=admission_date
            student.course_end_date=course_end_date
            student.save()
            messages.success(request,"Student Data Updated successfully")
            return redirect('college_edit_student',id=id)
    return render(request,"college_edit_student.html",{
        'student':student,
        'courses':courses,
        'semesters':semesters
    })

def college_delete_student(request,id):
    student=get_object_or_404(AddStudent,id=id)
    student.delete()
    messages.success(request,"Student data deleted successfully")
    return redirect('college_manage_student')

def college_visit_subject(request):
    college_id=request.session.get('college_id')
    courses=CollegeCourses.objects.filter(college_id=college_id)
    semester_years=AcademicYearSemester.objects.all().order_by('year')
    return render(request,"college_visit_subjects.html",{
        'courses':courses,
        'semester_years':semester_years
    })

def fetch_college_subject(request,course_id,semester_id):
    print(course_id,semester_id)
    subjects=addSubject.objects.filter(course_id=course_id,year_semester_id=semester_id)
    data=[]
    for subject in subjects:
      print(subject.course.course_name)
      data.append({
        'id':subject.id,
        'subject_name':subject.subject_name,
        'subject_type':subject.subject_type,
        'paper_code':subject.paper_code,
        'paper_choice':subject.paper_choice,
        'course_name':subject.course.course_name,
        'year':subject.year_semester.year,
        'semester':subject.year_semester.semester,
      })
    return JsonResponse(data,safe=False)

def college_add_teacher(request):
    college_id=request.session.get('college_id')
    departments=CollegeCourses.objects.filter(college_id=college_id)
    if request.method=='POST':
        name=request.POST.get('teacher_name').strip().title()
        email=request.POST.get('email')
        user_data=User.objects.filter(username=email).first()
        if AddTeacher.objects.filter(user=user_data).exists():
            messages.error(request,"This email already exists")
            return redirect('college_add_teacher')
        teacher_qualification=request.POST.get('teacher_qualification').upper()
        phone=request.POST.get('phone')
        designation=request.POST.get('designation').title()
        department_id=request.POST.get('department')
        department=CollegeCourses.objects.get(course_name__id=department_id)
        appointment_date=request.POST.get('appointment_date')
        appointment_date_obj=datetime.strptime(appointment_date,'%Y-%m-%d').date()
        formatted_date = appointment_date_obj.strftime("%d-%m-%y")
        password=formatted_date.replace('-','')
        user=User.objects.create_user(
            username=email,
        )
        user.set_password(password)
        user.save()
        teacher=AddTeacher.objects.create(
            user=user,
            teacher_name=name,
            teacher_qualification=teacher_qualification,
            phone=phone,
            designation=designation,
            department=department,
            appointment_date=appointment_date_obj,
            is_active=True 
        )
        teacher.save()
        messages.success(request,"Teacher added successfully")
        return redirect('college_add_teacher')
    return render(request,"college_add_teacher.html",{
        'departments':departments
    })

def college_manage_teacher(request):
    teachers=AddTeacher.objects.select_related('user','department').all()
    return render(request,"college_manage_teacher.html",{
        'teachers':teachers
    })

def college_edit_teacher(request, id):
    college_id=request.session.get('college_id')
    teacher = get_object_or_404(AddTeacher.objects.select_related('user', 'department'),id=id)
    departments=CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id)
    if request.method == 'POST':

        name = request.POST.get('teacher_name', '').strip().title()
        email = request.POST.get('email', '').strip()
        teacher_qualification = request.POST.get('teacher_qualification', '').upper()
        phone = request.POST.get('phone', '').strip()
        designation = request.POST.get('designation', '').strip().title()

        department_id = request.POST.get('department')
        appointment_date = request.POST.get('appointment_date')

        # Check email belongs to another user
        if User.objects.filter(username=email).exclude(id=teacher.user.id).exists():

            messages.error(request, "This email already exists.")
            return redirect('college_edit_teacher', id=id)

        # Get department
        department = get_object_or_404(CollegeCourses,course_name__id=department_id)
        print(department)

        # Convert date
        appointment_date_obj = datetime.strptime(appointment_date,'%Y-%m-%d').date()
        formatted_date = appointment_date_obj.strftime("%d-%m-%y")
        password=formatted_date.replace('-','')

        # Update User
        user = teacher.user
        user.username = email
        user.set_password(password)
        user.save()

        # Update Teacher
        teacher.teacher_name = name
        teacher.teacher_qualification = teacher_qualification
        teacher.phone = phone
        teacher.designation = designation
        teacher.department = department
        teacher.appointment_date = appointment_date_obj
        teacher.save()

        messages.success(request,"Teacher details updated successfully.")

        return redirect('college_edit_teacher',id=id)

    return render(request,"college_edit_teacher.html",{'teacher': teacher,'departments':departments})

def college_delete_teacher(request,id):
    teacher=get_object_or_404(AddTeacher,id=id)
    teacher.delete()
    messages.error(request,"Teacher Deleted Successfully")
    return redirect('college_manage_teacher')

def add_subject_teacher_combination(request):
    college_id = request.session.get('college_id')
    courses=CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id)
    semesters=AcademicYearSemester.objects.all().order_by('year')
    teachers=AddTeacher.objects.select_related('user','department','department__college','department__course_name').filter(department__college_id=college_id)
    if request.method=='POST':
        course_id=request.POST.get('course')
        course=CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id,course_name_id=course_id,is_active=True).first()
        semester_id=request.POST.get('semester')
        subject_id=request.POST.get('subject')
        teacher_id=request.POST.get('teacher')
        Add_subject_teacher_combination.objects.create(
            college_course=course,
            semester_id=semester_id,
            teacher_id=teacher_id,
            subject_id=subject_id
        )
        messages.success(request,"Teacher is successfully added to that perticular subject")
        return redirect('add_subject_teacher_combination')
    return render(request,"add_subject_teachers_combination.html",{
        'courses':courses,
        'semesters':semesters,
        'teachers':teachers
    })

def get_subject(request,id):
    subjects=addSubject.objects.filter(course_id=id)
    data=[]
    for i in subjects:
        data.append({
            'id':i.id,
            'subject_name':i.subject_name,
            'paper_code':i.paper_code,
            'paper_type':i.subject_type
        })
    return JsonResponse(data,safe=False)

def manage_subject_teacher_combination(request):
    college_id = request.session.get('college_id')
    courses=CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id)
    semesters=AcademicYearSemester.objects.all().order_by('year')
    subject_teachers=Add_subject_teacher_combination.objects.select_related('college_course','semester','teacher','subject').filter(college_course__college_id=college_id).order_by('college_course__course_name')
    return render(request,"manage_subject_teacher_combination.html",{
        'courses':courses,
        'semesters':semesters,
        'subject_teachers':subject_teachers
    })

def edit_subject_teacher_combination(request, id):

    college_id = request.session.get('college_id')

    combination = get_object_or_404(Add_subject_teacher_combination.objects.select_related('college_course','semester','subject','teacher'),
        id=id,college_course__college_id=college_id)

    courses = CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id)
    semesters = AcademicYearSemester.objects.all().order_by('year')
    teachers = AddTeacher.objects.select_related('user','department','department__college','department__course_name'
    ).filter(department__college_id=college_id)
    if request.method=='POST':
        course_id=request.POST.get('course')
        course=get_object_or_404(CollegeCourses,course_name__id=course_id)
        semester=request.POST.get('semester')
        subject=request.POST.get('subject')
        teacher=request.POST.get('teacher')
        combination.college_course_id=course
        combination.semester_id=semester
        combination.subject_id=subject
        combination.teacher_id=teacher
        combination.save()
        messages.success(request,"Teacher subject updated successfully")
        return redirect('edit_subject_teacher_combination', id=id)
    return render(
        request,
        'edit_subject_teacher_combination.html',
        {
            'courses': courses,
            'semesters': semesters,
            'teachers': teachers,
            'combination': combination,
        }
    )

def getSubject(request,course_id,semester_id):
    subjects=addSubject.objects.select_related('course','year_semester').filter(course__id=course_id,year_semester_id=semester_id)
    print(course_id,semester_id)
    print(subjects)
    data=[]
    for item in subjects:
        data.append(
           {
            'id': item.id,
            'subject_name': item.subject_name
          }
        
        )
    return JsonResponse(data,safe=False)

def delete_subject_teacher_combination(request,id):
    combination=get_object_or_404(Add_subject_teacher_combination.objects.select_related('college_course','semester','teacher','subject'),id=id)
    combination.delete()
    messages.success(request,"Teacher Subject Combination Deleted Successfully")
    return redirect('manage_subject_teacher_combination')

# add ca1 marks
def add_ca1_marks(request):

    students = ""
    subjects = ""
    college_id = request.session.get('college_id')
    courses = CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id)
    semesters = AcademicYearSemester.objects.all().order_by('year')

    if request.method == 'POST' and request.POST.get('fetchDetails'):
        course = request.POST.get('course')
        year_semester = request.POST.get('year_semester')
        try:
            marked_student_ids=CAMarks.objects.filter(college_data__college_course_id=course,college_data__semester_id=year_semester,ca_type='CA1').values_list('college_data_id', flat=True)

            if marked_student_ids:
               students = AddStudent.objects.select_related('user','college_course','semester').filter(college_course__college_id=college_id,college_course_id=course,semester_id=year_semester,is_active=True,university_verify=True).exclude(
               id__in=marked_student_ids
            )
            # if no student found
               if not students:
                   messages.success(request,"You have no student left to enter marks in this course")
                   return redirect('add_ca_marks')
            else:
                students = AddStudent.objects.select_related('user','college_course','semester').filter(college_course__college_id=college_id,college_course_id=course,semester_id=year_semester,is_active=True,university_verify=True)
                
        except Exception as e:
            pass
        subjects = Add_subject_teacher_combination.objects.filter(college_course_id=course )

    # save ca marks ajax
    if request.method == 'POST' and request.POST.get('saveMarks'):

        student_id = request.POST.get('student_id')
        ca_type = request.POST.get('ca_type')
        # Student check
        student = AddStudent.objects.filter(id=student_id,college_course__college_id=college_id,is_active=True,university_verify=True).first()

        if not student:
            return JsonResponse({
                'success': False,
                'message': 'Student not found.'
            })

        # CA type check
        if ca_type not in ['CA1', 'CA2', 'CA3']:
            return JsonResponse({
                'success': False,
                'message': 'Please select a valid CA type.'
            })


        saved_count = 0

        # loop through marks
        for key, value in request.POST.items():

            if key.startswith('marks_'):

                subject_teacher_id = key.replace(
                    'marks_',
                    ''
                )

                marks = value.strip()

                if marks == '':
                    continue

                # Get subject-teacher combination
                subject_teacher = Add_subject_teacher_combination.objects.filter(
                    id=subject_teacher_id,
                    college_course_id=student.college_course_id
                ).first()

                if not subject_teacher:
                    continue

                # check existing marks
                ca_mark = CAMarks.objects.filter(college_data=student,subject_teacher=subject_teacher,ca_type=ca_type).first()

                if ca_mark:
                    # Existing marks → UPDATE
                    ca_mark.marks = marks
                    ca_mark.save()

                else:
                    # New marks → CREATE
                    CAMarks.objects.create(
                        ca_type=ca_type,
                        college_data=student,
                        subject_teacher=subject_teacher,
                        marks=marks
                    )
                saved_count += 1
 
        # success response
        return JsonResponse({
            'success': True,
            'message': f'{saved_count} subject marks saved successfully.'
        })

    # NORMAL PAGE LOAD
    
    return render(request,"add_ca1_marks.html",
        {
            'courses': courses,
            'semesters': semesters,
            'students': students,
            'subjects': subjects
        }
    )

# add ca2 marks
def add_ca2_marks(request):

    students = ""
    subjects = ""
    college_id = request.session.get('college_id')
    courses = CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id)
    semesters = AcademicYearSemester.objects.all().order_by('year')

    if request.method == 'POST' and request.POST.get('fetchDetails'):
        course = request.POST.get('course')
        year_semester = request.POST.get('year_semester')
        try:
            marked_student_ids=CAMarks.objects.filter(college_data__college_course_id=course,college_data__semester_id=year_semester,ca_type='CA2').values_list('college_data_id', flat=True)

            if marked_student_ids:
               students = AddStudent.objects.select_related('user','college_course','semester').filter(college_course__college_id=college_id,college_course_id=course,semester_id=year_semester,is_active=True,university_verify=True).exclude(
               id__in=marked_student_ids
            )
            # if no student found
               if not students:
                   messages.success(request,"You have no student left to enter marks in this course")
                   return redirect('add_ca_marks')
            else:
                students = AddStudent.objects.select_related('user','college_course','semester').filter(college_course__college_id=college_id,college_course_id=course,semester_id=year_semester,is_active=True,university_verify=True)
                
        except Exception as e:
            pass
        subjects = Add_subject_teacher_combination.objects.filter(college_course_id=course )

    # save ca marks ajax
    if request.method == 'POST' and request.POST.get('saveMarks'):

        student_id = request.POST.get('student_id')
        ca_type = request.POST.get('ca_type')
        # Student check
        student = AddStudent.objects.filter(id=student_id,college_course__college_id=college_id,is_active=True,university_verify=True).first()

        if not student:
            return JsonResponse({
                'success': False,
                'message': 'Student not found.'
            })

        # CA type check
        if ca_type not in ['CA1', 'CA2', 'CA3']:
            return JsonResponse({
                'success': False,
                'message': 'Please select a valid CA type.'
            })


        saved_count = 0

        # loop through marks
        for key, value in request.POST.items():

            if key.startswith('marks_'):

                subject_teacher_id = key.replace(
                    'marks_',
                    ''
                )

                marks = value.strip()

                if marks == '':
                    continue

                # Get subject-teacher combination
                subject_teacher = Add_subject_teacher_combination.objects.filter(
                    id=subject_teacher_id,
                    college_course_id=student.college_course_id
                ).first()

                if not subject_teacher:
                    continue

                # check existing marks
                ca_mark = CAMarks.objects.filter(college_data=student,subject_teacher=subject_teacher,ca_type=ca_type).first()

                if ca_mark:
                    # Existing marks → UPDATE
                    ca_mark.marks = marks
                    ca_mark.save()

                else:
                    # New marks → CREATE
                    CAMarks.objects.create(
                        ca_type=ca_type,
                        college_data=student,
                        subject_teacher=subject_teacher,
                        marks=marks
                    )
                saved_count += 1
 
        # success response
        return JsonResponse({
            'success': True,
            'message': f'{saved_count} subject marks saved successfully.'
        })

    # NORMAL PAGE LOAD
    
    return render(request,"add_ca2_marks.html",
        {
            'courses': courses,
            'semesters': semesters,
            'students': students,
            'subjects': subjects
        }
    )

# add ca3 marks
def add_ca3_marks(request):

    students = ""
    subjects = ""
    college_id = request.session.get('college_id')
    courses = CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id)
    semesters = AcademicYearSemester.objects.all().order_by('year')

    if request.method == 'POST' and request.POST.get('fetchDetails'):
        course = request.POST.get('course')
        year_semester = request.POST.get('year_semester')
        try:
            marked_student_ids=CAMarks.objects.filter(college_data__college_course_id=course,college_data__semester_id=year_semester,ca_type='CA3').values_list('college_data_id', flat=True)

            if marked_student_ids:
               students = AddStudent.objects.select_related('user','college_course','semester').filter(college_course__college_id=college_id,college_course_id=course,semester_id=year_semester,is_active=True,university_verify=True).exclude(
               id__in=marked_student_ids
            )
            # if no student found
               if not students:
                   messages.success(request,"You have no student left to enter marks in this course")
                   return redirect('add_ca_marks')
            else:
                students = AddStudent.objects.select_related('user','college_course','semester').filter(college_course__college_id=college_id,college_course_id=course,semester_id=year_semester,is_active=True,university_verify=True)
                
        except Exception as e:
            pass
        subjects = Add_subject_teacher_combination.objects.filter(college_course_id=course )

    # save ca marks ajax
    if request.method == 'POST' and request.POST.get('saveMarks'):

        student_id = request.POST.get('student_id')
        ca_type = request.POST.get('ca_type')
        # Student check
        student = AddStudent.objects.filter(id=student_id,college_course__college_id=college_id,is_active=True,university_verify=True).first()

        if not student:
            return JsonResponse({
                'success': False,
                'message': 'Student not found.'
            })

        # CA type check
        if ca_type not in ['CA1', 'CA2', 'CA3']:
            return JsonResponse({
                'success': False,
                'message': 'Please select a valid CA type.'
            })


        saved_count = 0

        # loop through marks
        for key, value in request.POST.items():

            if key.startswith('marks_'):

                subject_teacher_id = key.replace(
                    'marks_',
                    ''
                )

                marks = value.strip()

                if marks == '':
                    continue

                # Get subject-teacher combination
                subject_teacher = Add_subject_teacher_combination.objects.filter(
                    id=subject_teacher_id,
                    college_course_id=student.college_course_id
                ).first()

                if not subject_teacher:
                    continue

                # check existing marks
                ca_mark = CAMarks.objects.filter(college_data=student,subject_teacher=subject_teacher,ca_type=ca_type).first()

                if ca_mark:
                    # Existing marks → UPDATE
                    ca_mark.marks = marks
                    ca_mark.save()

                else:
                    # New marks → CREATE
                    CAMarks.objects.create(
                        ca_type=ca_type,
                        college_data=student,
                        subject_teacher=subject_teacher,
                        marks=marks
                    )
                saved_count += 1
 
        # success response
        return JsonResponse({
            'success': True,
            'message': f'{saved_count} subject marks saved successfully.'
        })

    # NORMAL PAGE LOAD
    
    return render(request,"add_ca3_marks.html",
        {
            'courses': courses,
            'semesters': semesters,
            'students': students,
            'subjects': subjects
        }
    )

# manage ca marks
def manage_ca_marks(request):
    students=""
    college_id = request.session.get('college_id')
    courses=courses = CollegeCourses.objects.select_related('college','course_name').filter(college_id=college_id)
    semesters = AcademicYearSemester.objects.all().order_by('year')
    if request.method=='POST':
        course_id=request.POST.get('course')
        semester_id=request.POST.get('year_semester')
        ca_type=request.POST.get('ca_type')
        college_data=AddStudent.objects.filter(college_course_id=course_id,semester_id=semester_id)
        students = CAMarks.objects.filter(college_data__college_course_id=course_id,college_data__semester_id=semester_id,ca_type=ca_type).select_related(
        'college_data',
        'subject_teacher',
        'subject_teacher__subject'
        )
        
    return render(request,"manage_ca_marks.html",{
        'courses':courses,
        'semesters':semesters,
        'students':students
    })

# edit ca marks
def edit_ca_marks(request,id,type):
    students=CAMarks.objects.select_related('college_data','subject_teacher').filter(college_data_id=id,subject_teacher__subject__subject_type='theory',ca_type=type)
    if request.method=='POST':
        marks_ids = request.POST.getlist("marks_id[]")
        marks_values = request.POST.getlist("marks[]")
        print(marks_ids,marks_values)
        for marks_id,marks_value in zip(marks_ids,marks_values):
            CAmarks=CAMarks.objects.get(id=marks_id)
            CAmarks.marks=marks_value
            CAmarks.save()
        messages.success(request,"Numbers are updated successfully")
        return redirect('edit_ca_marks',id=id,type=type)
    return render(request,"edit_ca_marks.html",{
      'students':students  
    })

# add pca marks
def add_pca_marks(request):
    college_id = request.session.get('college_id')
    subjects=""
    students=""
   
    courses= addSubject.objects.select_related('course','year_semester').filter(course__collegecourses__college_id=college_id,subject_type='lab')
    if request.method=='POST' and request.POST.get('fetchDetails'):
        course=request.POST.get('course')
        request.session['pca_course']=course
        semester=request.POST.get('year_semester')
        request.session['year_semester']=semester
        student_id=PCA_Marks.objects.select_related('student','course','semester').filter(course__college_id=college_id,course__course_name_id=course,semester_id=semester).values_list('student_id', flat=True)
        if student_id:
            students=AddStudent.objects.select_related('user','college_course','semester').filter(college_course__college_id=college_id,college_course__course_name_id=course,semester_id=semester,is_active=True).exclude(id__in=student_id)
        else:
            students=AddStudent.objects.select_related('user','college_course','semester').filter(college_course__college_id=college_id,college_course__course_name_id=course,semester_id=semester,is_active=True)
        subjects= addSubject.objects.select_related('course','year_semester').filter(course_id=course,year_semester_id=semester,subject_type='lab')

    if request.method=='POST' and request.POST.get('saveMarks'):
        student_id=request.POST.get('student_id')
        course=request.session.get('pca_course')
        semester=request.session.get('year_semester')
        college_course=CollegeCourses.objects.select_related('course_name').get(college_id=college_id,course_name_id=course)
        subject_marks = {}
        for key, value in request.POST.items():
                if key.startswith('marks_pca_'):
                    subject_id=key.replace('marks_pca_','')

                    subject_marks[subject_id]=value

        PCA_Marks.objects.create(
            student_id=student_id,
            course=college_course,
            semester_id=semester,
            subject_marks=subject_marks
            )
        return JsonResponse({
        'success': True,
        'message': "Request received successfully"
         })
    
    return render(request, "college_add_pca_marks.html", {
        'courses': courses,
        'subjects':subjects,
        'students':students
    })

def manage_pca_marks(request):
    college_id = request.session.get('college_id')
    courseSemester=PCA_Marks.objects.select_related('student','course','semester').filter(course__college_id=college_id).values(
        'course_id',
        'course__course_name__course_name',
        'semester_id',
        'semester__year',
        'semester__semester'
    ).distinct()
    return render(request,"manage_pca_marks.html",{
        'courseSemester':courseSemester
    })

def fetchpcadata(request,course,semester):
    print(course,semester)
    college_id = request.session.get('college_id')
    pca_marks=PCA_Marks.objects.select_related('student','course','semester').filter(course__college_id=college_id,course_id=course,semester_id=semester).values(
        'id',
        'student_id',
        'student__name',
        'student__roll_number',
        'student__registration_number',
        'student__is_active',
        'student__university_verify',
        'course_id',
        'course__course_name__course_name',
        'semester_id',
        'semester__year',
        'semester__semester',
        'subject_marks',
    ).order_by('student__is_active')
    data = list(pca_marks)

    for pca in data:

        subject_marks = pca['subject_marks']
        subjects = []
        for subject_id, marks in subject_marks.items():
            subject = addSubject.objects.get(id=subject_id)
            subjects.append({
                'subject_id': subject_id,
                'subject_name': subject.subject_name,
                'subject_code':subject.paper_code,
                'marks': marks
            })
        pca['subjects'] = subjects
    
    return JsonResponse(data,safe=False)

def edit_pca_marks(request):
    if request.method=='POST':
      studentId=request.POST.get('studentId')
      subjects_id=request.POST.getlist('subjectIds')
      marks=request.POST.getlist('marks')
      pca_marks=PCA_Marks.objects.select_related('student','course','semester').get(student_id=studentId)
      student_marks={}
      for i in range(len(subjects_id)):
          subject_id=subjects_id[i]
          mark=marks[i]
          student_marks[subject_id]=mark

      pca_marks.subject_marks=student_marks
      pca_marks.save()
      
    return JsonResponse({
        "status": "success"
    })

def add_examination_marks(request):
    college_id = request.session.get('college_id')
    # i am getting course and semester from here of a college
    course_semester=AddStudent.objects.select_related('college_course','semester').filter(college_course__college_id=college_id)
    return render(request,"add_examination_marks.html",{
        'course_semester':course_semester
    })

def fetch_details_for_exam_marks(request,course_id,semester_id):
    college_id = request.session.get('college_id')
    print(course_id,semester_id)
    try:
        marks_provided_student=UniversityExamMarks.objects.select_related('student','subjects_marks').filter(
            student__college_course__college_id=college_id,
            student__college_course__course_name_id=course_id,
            student__semester_id=semester_id,
            student__is_active=True
        )
        students=AddStudent.objects.select_related('college_course','semester').filter(
            college_course__college_id=college_id,
            college_course__course_name_id=course_id,
            semester_id=semester_id,
            is_active=True
        ).exclude(
            id__in=marks_provided_student.values_list('student_id', flat=True)
        ).values(
            'id','name','college_course_id','college_course__course_name__course_name',
            'semester__year','semester__semester','roll_number','registration_number'
        )
        subjects=addSubject.objects.select_related('course','year_semester').filter(course_id=course_id,year_semester_id=semester_id)
        print(subjects)
        return JsonResponse({
            'students':list(students),
            'subjects':list(subjects.values())
        })
    except Exception as e:
        print(e)

import json
def save_university_exam_marks(request):
    if request.method=="POST":
        try:
          data=json.loads(request.body)
          student_id=data.get('student_id')
          subject_marks=data.get('subjects')
          UniversityExamMarks.objects.create(
              student_id=student_id,
              subjects_marks=subject_marks
          )
          return JsonResponse({
              'message':'Marks enter successfully'
          },status=201)
        except Exception as e:
            return JsonResponse({
                'message':'Problem occurse , try again'
            },status=401)


from django.views.decorators.csrf import csrf_exempt
@csrf_exempt
def manage_examination_marks(request):
    college_id = request.session.get('college_id')
    # i am getting course and semester from here of a college
    course_semester=AddStudent.objects.select_related('college_course','semester').filter(college_course__college_id=college_id)
    if request.method=="POST":
        data=json.loads(request.body)
        print(data,"yes")
        course_id=data.get('course')
        semester_id=data.get('semester')
        students = UniversityExamMarks.objects.select_related(
            'student'
        ).filter(
            student__college_course__college_id=college_id,
            student__college_course__course_name_id=course_id,
            student__semester_id=semester_id,
            student__is_active=True
        ).values(
            'student__name',
            'student__college_course__course_name__course_name',
            'student__semester__year',
            'student__semester__semester',
            'student__roll_number',
            'student__registration_number',
            'subjects_marks'
        )
        return JsonResponse(list(students),safe=False)
        
    return render(request,"manage_examination_marks.html",{
        'course_semester':course_semester
    })