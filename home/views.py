from django.shortcuts import render,get_object_or_404
from adminpanel.models import AdminNotice
# Create your views here.

def home(request):
    notices=AdminNotice.objects.all().order_by('notice_date')
    return render(request,"index.html",{
        'notices':notices
    })

def base(request):
    return render(request,"base.html")

def membersarea(request):
    return render(request,"members_area.html")

def visitNotice(request,id):
    notice=get_object_or_404(AdminNotice,id=id)
    return render(request,"visit_notice.html",{
        'notice':notice
    })