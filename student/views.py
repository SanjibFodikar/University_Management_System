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