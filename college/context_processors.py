from .models import CollegeProfile

def college_context(request):

    college_id = request.session.get('college_id')

    college_logo = None

    if college_id:

        college = CollegeProfile.objects.filter(
            college_id=college_id
        ).first()

        if college and college.college_logo:
            college_logo = college.college_logo

    return {
        'college_logo': college_logo
    }