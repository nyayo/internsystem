from celery import shared_task
from django.utils import timezone

@shared_task(name="evaluations.tasks.create_evaluations_for_active_placements")
def create_evaluations_for_active_placements():
    """
    Runs daily at 07:15 EAT.
    Creates midterm and final Evaluation records for any active placement
    that does not already have them.
    Uses get_or_create so it is safe to run multiple times.
    """
    from placements.models import InternshipPlacement
    from .models import Evaluation

    active_placements = InternshipPlacement.objects.filter(
        status="active",
        workplace_supervisor__isnull=False,
    )

    created_count = 0
    for placement in active_placements:
        for eval_type in ("midterm", "final"):
            _, created = Evaluation.objects.get_or_create(
                placement       = placement,
                evaluator       = placement.workplace_supervisor,
                evaluation_type = eval_type,
                defaults        = {"status": "not_started"},
            )
            if created:
                created_count += 1

    return f"Created {created_count} new evaluation record(s)."