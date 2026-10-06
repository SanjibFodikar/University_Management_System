from django.shortcuts import render,redirect,get_object_or_404
from college.models import *
from django.contrib.auth import authenticate,login,logout
from django.contrib import messages
from .utils import generateOTP
from django.core.mail import send_mail
from datetime import timedelta,datetime
from django.utils import timezone
import os
from .models import *
from django.contrib.auth.decorators import login_required

# Create your views here.

def student_dashboard(request):
    return render(request,"student_dashboard.html")

# student login
def student_login(request):
    context={}
    if request.method=='POST':
        username=request.POST.get('username')
        password=request.POST.get('password')
        print(password)
        user = authenticate(
            request,username=username,password=password
        )
        if user is not None and not user.is_staff:
            student=AddStudent.objects.filter(user=user).first()
            if student:
                login(request, user)
                request.session['student_name']=student.name
                return redirect('student_dashboard')
        context['student_not_find']="invalid user name or password"
        return render(request,'members_area.html',context)
    return render(request,"members_area.html")

# student logout
def student_logout(request):
    logout(request)
    return redirect('student_login')

def student_forgot_password(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        email = request.POST.get('email')

        try:
            user = User.objects.get(
                username=username,
                email=email
            )

            student = AddStudent.objects.get(user=user)

            otp = generateOTP()

            request.session['send_otp'] = str(otp)
            request.session['forgot_user_id'] = user.id
            request.session['otp_verified'] = False
            request.session['email_session'] = email
            send_mail(
                'Your OTP',
                f'Your OTP is {otp}. It is valid for verification.',
                'sanjibdjango2005@gmail.com',
                [email],
                fail_silently=False
            )
            # otp expire function
            otp_expire(request)
            return redirect('enterotp')

        except User.DoesNotExist:
            messages.error(
                request,
                "Username and email do not match"
            )

        except AddStudent.DoesNotExist:
            messages.error(
                request,
                "Student not found"
            )

    return render(
        request,
        "student_forgot_password.html"
    )
# verify otp and resend otp

def enterotp(request):
    # resend otp
    if request.method == 'POST' and request.POST.get('resend') == 'resend':
       return resend_otp(request)
       
    if request.method == 'POST' and request.POST.get('verify') == 'verify':
        return verify_otp(request)
    return render(request, "enterOTP.html")

def resend_otp(request):
    email=request.session.get('email_session')
    otp = generateOTP()
    request.session['otp_verified'] = False
    send_mail(
                'Your OTP',
                f'Your OTP is {otp}. It is valid for verification.',
                'sanjibdjango2005@gmail.com',
                [email],
                fail_silently=False
            )
    otp_expire(request)
    request.session['send_otp'] = str(otp)
    return redirect('enterotp')

def verify_otp(request):
    otp_expire_time = request.session.get('otp_expiry')
    if otp_expire_time:
                expiry_time = datetime.fromisoformat(otp_expire_time)
                if timezone.is_naive(expiry_time):
                  expiry_time = timezone.make_aware(expiry_time,timezone.get_current_timezone())
                
                if timezone.now() > expiry_time:
                    messages.error(request,"3 minutes expired. Please resend your OTP.") 
                    request.session.pop('otp_expiry', None)
                    request.session.pop('send_otp', None)
    
                    return redirect('enterotp')
                else:
                    sendotp = request.session.get('send_otp')
                    getotp = request.POST.get('otp')
                    if sendotp == str(getotp):
                        request.session['otp_verified'] = True
                        return redirect('student_forgot_password')
                    else:
                        messages.error(request,"Invalid OTP")
    
# password enter for forgor password
def getPassword(request):
    if request.method=='POST':
        password=request.POST.get('password')
        user_id=request.session.get('forgot_user_id')
        user=User.objects.get(id=user_id)
        user.set_password(password)
        user.save()
        request.session.pop('forgot_user_id',None)
        request.session.pop('otp_verified',None)
        request.session.pop('send_otp',None)
        request.session.pop('email_session',None)
        messages.success(request,"password updated successfully")
    return redirect('student_forgot_password')

# otp expire time select
def otp_expire(request):
    current_time = timezone.now()
    expiry_time = current_time + timedelta(minutes=3)
    request.session['otp_expiry'] = expiry_time.isoformat()

def visit_ca1_marks(request):
    user=request.user
    students=CAMarks.objects.filter(college_data__user=user,ca_type='CA1')
    return render(request,"visit_ca_marks.html",{
        'students':students
    })

def visit_ca2_marks(request):
    user=request.user
    students=CAMarks.objects.filter(college_data__user=user,ca_type='CA2')
    return render(request,"visit_ca_marks.html",{
        'students':students
    })

def visit_ca3_marks(request):
    user=request.user
    students=CAMarks.objects.filter(college_data__user=user,ca_type='CA3')
    return render(request,"visit_ca_marks.html",{
        'students':students
    })

def student_visit_pca_marks(request):
    user=request.user
    student=PCA_Marks.objects.select_related('student','course','semester').get(student__user=user)
    subjects=addSubject.objects.filter(course__course_name=student.course,year_semester=student.semester,subject_type='lab')
    
    return render(request,"student_visit_pca_marks.html",{
        'student':student,
        'subjects':subjects
    })

def upload_photo_signature(request):
    user=request.user
    student=AddStudent.objects.get(user=user)
    college=student.college_course.college
    photo_signature=""
    try:
       photo_signature=Photo_Signature.objects.filter(student=student,college=college).first()
       if request.method=='POST':
        photo = request.FILES.get('student_photo')
        student_signature = request.FILES.get('student_signature')
        if photo:
            extension = os.path.splitext(photo.name)[1].lower()
            if extension not in ['.jpg', '.jpeg', '.png']:
               messages.error(request, "Only JPG, JPEG and PNG files are allowed.")
               return redirect('upload_photo_signature')

        if student_signature:
            extension = os.path.splitext(photo.name)[1].lower()
            if extension not in ['.jpg', '.jpeg', '.png']:
                messages.error(request, "Only JPG, JPEG and PNG files are allowed.")
                return redirect('upload_photo_signature')
            
        if photo_signature:
            if photo:
                photo_signature.student_photo = photo
            if student_signature:
                photo_signature.student_signature = student_signature
            photo_signature.save()
            messages.success(request,"Photo and Signature updated successfully!")
            return redirect('upload_photo_signature')
        
        Photo_Signature.objects.create(
            college=college,
            student=student,
            student_photo=photo,
            student_signature=student_signature
        )
        messages.success(request,"Signature and Photo uploaded successfully")
    except Exception as e:
        print(e)
    return render(request,"upload_photos_signature.html",{
        'photo_signature':photo_signature
    })

def download_admit(request):
    user=request.user
    student=AddStudent.objects.select_related('college_course','semester').get(user=user)
    college=student.college_course.college
    course=student.college_course
    semester=student.semester
    admit_card=AdmitCardGenerate.objects.select_related('college','course','semester').filter(
        college=college,
        course=course,
        semester=semester
    ).first()
    photo_signature=Photo_Signature.objects.filter(college=college,student=student).first()
    return render(request,"download_admit.html",{
        'student':student,
        'admit_card':admit_card,
        'photo_signature':photo_signature
    })



@login_required
def semester_result(request):

    # ==========================================
    # 1. LOGGED-IN STUDENT
    # ==========================================

    user = request.user

    student = AddStudent.objects.select_related(
        'college_course',
        'semester'
    ).get(user=user)


    # ==========================================
    # 2. UNIVERSITY WRITTEN MARKS
    # ==========================================

    university_result = UniversityExamMarks.objects.filter(
        student=student
    ).first()


    # ==========================================
    # 3. CA MARKS
    # ==========================================

    ca_marks = CAMarks.objects.filter(
        college_data=student
    ).select_related(
        'subject_teacher__subject'
    )


    # ==========================================
    # 4. PCA MARKS
    # ==========================================

    pca_marks = PCA_Marks.objects.filter(
        student=student,
        course=student.college_course,
        semester=student.semester
    ).first()


    # ==========================================
    # 5. CREATE CA DICTIONARY
    # ==========================================

    ca_data = {}

    for ca in ca_marks:

        subject_id = str(
            ca.subject_teacher.subject.id
        )

        if subject_id not in ca_data:
            ca_data[subject_id] = {}

        ca_data[subject_id][ca.ca_type] = float(
            ca.marks
        )


    # ==========================================
    # 6. CREATE PCA DICTIONARY
    # ==========================================

    pca_data = {}

    if pca_marks:

        subject_marks = pca_marks.subject_marks

        # JSON is DICTIONARY
        if isinstance(subject_marks, dict):

            for subject_id, marks in subject_marks.items():

                try:
                    pca_data[str(subject_id)] = float(marks)

                except (TypeError, ValueError):
                    pca_data[str(subject_id)] = 0


        # JSON is LIST
        elif isinstance(subject_marks, list):

            for item in subject_marks:

                if not isinstance(item, dict):
                    continue

                subject_id = item.get(
                    "subject_id",
                    item.get("id")
                )

                marks = item.get(
                    "marks",
                    0
                )

                if subject_id is not None:

                    try:
                        pca_data[str(subject_id)] = float(
                            marks
                        )

                    except (TypeError, ValueError):
                        pca_data[str(subject_id)] = 0


    # ==========================================
    # 7. FINAL RESULT LIST
    # ==========================================

    final_results = []


    # ==========================================
    # 8. PROCESS UNIVERSITY SUBJECTS
    # ==========================================

    if university_result:

        for subject in university_result.subjects_marks:

            # ----------------------------------
            # SUBJECT ID
            # ----------------------------------

            subject_id = str(
                subject.get(
                    "subject_id",
                    subject.get("id")
                )
            )


            # ----------------------------------
            # SUBJECT INFORMATION
            # ----------------------------------

            subject_name = subject.get(
                "subject_name",
                "Unknown Subject"
            )

            subject_code = subject.get(
                "subject_code",
                ""
            )

            subject_type = subject.get(
                "subject_type",
                "Theory"
            )


            # ----------------------------------
            # WRITTEN MARKS
            # ----------------------------------

            try:

                written = float(
                    subject.get("marks", 0)
                )

            except (TypeError, ValueError):

                written = 0


            # ==================================
            # THEORY SUBJECT
            # ==================================

            if subject_type.lower() == "theory":

                student_ca = ca_data.get(
                    subject_id,
                    {}
                )

                ca1 = student_ca.get("CA1", 0)
                ca2 = student_ca.get("CA2", 0)
                ca3 = student_ca.get("CA3", 0)


                # CA Average
                ca_average = (
                    ca1 +
                    ca2 +
                    ca3
                ) / 3


                # Final Marks
                final_marks = (
                    5 +
                    written +
                    ca_average
                )


            # ==================================
            # LAB SUBJECT
            # ==================================

            else:

                pca = pca_data.get(
                    subject_id,
                    0
                )


                # Final Marks
                final_marks = (
                    5 +
                    written +
                    pca
                )


            # ==================================
            # MAXIMUM 100
            # ==================================

            final_marks = min(
                round(final_marks, 2),
                100
            )


            # ==================================
            # GRADE
            # ==================================

            if final_marks >= 90:

                grade = "A+"

            elif final_marks >= 80:

                grade = "A"

            elif final_marks >= 70:

                grade = "B+"

            elif final_marks >= 60:

                grade = "B"

            elif final_marks >= 50:

                grade = "C"

            elif final_marks >= 40:

                grade = "D"

            else:

                grade = "F"


            # ==================================
            # ADD RESULT
            # ==================================

            final_results.append({

                "subject_id": subject_id,

                "subject_code": subject_code,

                "subject_name": subject_name,

                "subject_type": subject_type,

                "final_marks": final_marks,

                "grade": grade,

            })


    # ==========================================
    # 9. OVERALL CALCULATION
    # ==========================================

    total_subjects = len(final_results)

    total_marks = sum(
        subject["final_marks"]
        for subject in final_results
    )


    # ==========================================
    # 10. OVERALL PERCENTAGE
    # ==========================================

    if total_subjects > 0:

        percentage = (
            total_marks /
            (total_subjects * 100)
        ) * 100

        percentage = round(
            percentage,
            2
        )

    else:

        percentage = 0


    # ==========================================
    # 11. CHECK ANY SUBJECT FAILED
    # ==========================================

    failed_subjects = [
        subject
        for subject in final_results
        if subject["grade"] == "F"
    ]


    # ==========================================
    # 12. OVERALL RESULT
    # ==========================================

    if failed_subjects:

        overall_result = "FAIL"

    else:

        overall_result = "PASS"


    # ==========================================
    # 13. OVERALL GRADE
    # ==========================================

    if percentage >= 90:

        overall_grade = "A+"

    elif percentage >= 80:

        overall_grade = "A"

    elif percentage >= 70:

        overall_grade = "B+"

    elif percentage >= 60:

        overall_grade = "B"

    elif percentage >= 50:

        overall_grade = "C"

    elif percentage >= 40:

        overall_grade = "D"

    else:

        overall_grade = "F"

    photo_signature=Photo_Signature.objects.filter(
            student__user=user
        ).first()
    
   
    # ==========================================
    # 14. CONTEXT
    # ==========================================

    context = {

        "student": student,

        "final_results": final_results,

        "total_subjects": total_subjects,

        "total_marks": round(total_marks, 2),

        "percentage": percentage,

        "overall_grade": overall_grade,

        "overall_result": overall_result,

        "failed_subjects": failed_subjects,

        "photo_signature": photo_signature

    }


    # ==========================================
    # 15. RENDER
    # ==========================================

    
    return render(
        request,
        "semester_result.html",
        context
    )


def student_profile(request):
    user=request.user
    student=Photo_Signature.objects.select_related('college','student').filter(
        student__user=user
    ).first()
    return render(request,"student_profile.html",{
        'student':student
    })

def change_password(request):
    user=request.user
    if request.method == 'POST':
        current_password=request.POST.get('current_password')
        new_password=request.POST.get('new_password')
        student=AddStudent.objects.filter(user=user).first()
        if student.user.check_password(current_password):
            student.user.set_password(new_password)
            student.user.save()
            messages.success(request,"Password Changes Successfully")
        else:
            messages.error(request,"invalid password")
            return redirect('change_password')
    return render(request,"changepassword.html")