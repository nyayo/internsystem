from rest_framework.permissions import BasePermission

class IsActiveAccount(BasePermission):
    """
    Blocks suspended and deactivated accounts from any API access.
    
    """
    message = 'Your account is not active.'
 
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.account_status == 'active'
        )
        
        
class IsStudent(BasePermission):
    message = 'Access restricted to students.'
 
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'student'
        )

class IsWorkplaceSupervisor(BasePermission):
    message = 'Access restricted to workplace supervisors.'
 
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'workplace_supervisor'
        )

class IsAcademicSupervisor(BasePermission):
    message = 'Access restricted to academic supervisors.'
 
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'academic_supervisor'
        )
        
class IsInternshipAdministrator(BasePermission):
    message = 'Access restricted to internship administrators.'
 
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == 'internship_administrator'
        )

class IsPlacementOwner(BasePermission):
    message = "You can only access your own placement."

    def has_object_permission(self, request, view, obj):
        return obj.student == request.user


class IsLinkedToPlacement(BasePermission):
    message = "You are not linked to this placement."

    def has_object_permission(self, request, view, obj):
        user = request.user
        return (
            user == obj.student
            or user == obj.academic_supervisor
            or user == obj.workplace_supervisor
            or user == obj.approved_by
            or user.role == "internship_administrator"
        )
        
class IsAssignedEvaluator(BasePermission):
    message = "You are not the evaluator for this evaluation."

    def has_object_permission(self, request, view, obj):
        return obj.evaluator == request.user


class IsAssignedAcademicSupervisor(BasePermission):
    message = "You are not the academic supervisor for this placement."

    def has_object_permission(self, request, view, obj):
        return obj.placement.academic_supervisor == request.user


class CanViewEvaluation(BasePermission):
    message = "You are not linked to this placement."

    def has_object_permission(self, request, view, obj):
        user = request.user
        return (
            user == obj.placement.student
            or user == obj.placement.workplace_supervisor
            or user == obj.placement.academic_supervisor
            or user.role == "internship_administrator"
        )
