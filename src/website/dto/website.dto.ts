import { DeploymentPlatform } from '../entities/website.entity';

export class CreateWebsiteDto {
    domain: string;
    deploymentPlatform?: DeploymentPlatform;
    darkVisitorPropertyId?: string;
    userId: string;
}

export class UpdateWebsiteDto {
    domain?: string;
    deploymentPlatform?: DeploymentPlatform;
    darkVisitorPropertyId?: string;
    status?: 'pending' | 'active' | 'failed';
}
