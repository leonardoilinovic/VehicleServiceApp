using FluentValidation;
using FluentValidation.AspNetCore;
using VehicleServiceApp.Models;

public class ServiceRecordValidator : AbstractValidator<ServiceRecord>
{
    public ServiceRecordValidator()
    {
        RuleFor(x => x.VehicleId)
            .GreaterThan(0)
            .WithMessage("Vehicle ID is required.");

        RuleFor(x => x.ServiceStart)
    .NotEmpty().WithMessage("Start time is required.");

        RuleFor(x => x.ServiceEnd)
            .NotEmpty().WithMessage("End time is required.")
            .GreaterThan(x => x.ServiceStart)
            .WithMessage("End time must be after start time.");


        RuleFor(x => x.TotalCost)
            .GreaterThan(0)
            .WithMessage("Total cost must be greater than 0.");
    }
}
