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

