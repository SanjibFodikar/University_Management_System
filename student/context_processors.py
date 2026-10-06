from .models import Photo_Signature

def student_context(request):

    if not request.user.is_authenticated:
        return {
            'student_photo': None,
            'student_signature': None,
        }

    user = request.user

    photo_signature = Photo_Signature.objects.filter(
        student__user=user
    ).first()

    return {
        'student_photo': photo_signature.student_photo if photo_signature else None,
        'student_signature': photo_signature.student_signature if photo_signature else None,
    }