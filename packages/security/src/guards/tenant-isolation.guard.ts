// packages/security/src/guards/tenant-isolation.guard.ts
import { Injectable, CanActivate, ExecutionContext, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class TenantIsolationGuard implements CanActivate {
    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const tenantId = request.headers['apex-tenant-id'];

        if (!tenantId) {
            throw new BadRequestException('Missing Apex-Tenant-ID');
        }

        // Role: Inject tenant context into request for downstream prisma usage
        request.tenantId = tenantId;
        return true;
    }
}
