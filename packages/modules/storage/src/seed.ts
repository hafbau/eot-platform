import { db } from './database';
import { 
  UserRole, 
  ProjectStatus, 
  ContractType, 
  DelayType, 
  DelayStatus, 
  ClaimStatus, 
  EvidenceType,
  Priority,
  ActionItemStatus 
} from './generated/client';

export async function seedDatabase() {
  console.log('Starting database seeding...');

  try {
    // Clean existing data (in reverse dependency order)
    await db.auditLog.deleteMany({});
    await db.analyticsEvent.deleteMany({});
    await db.evidence.deleteMany({});
    await db.claim.deleteMany({});
    await db.delayEvent.deleteMany({});
    await db.actionItem.deleteMany({});
    await db.schedule.deleteMany({});
    await db.project.deleteMany({});
    await db.fileMetadata.deleteMany({});
    await db.storageQuota.deleteMany({});
    await db.sessionData.deleteMany({});
    await db.mfaSettings.deleteMany({});
    await db.passwordResetToken.deleteMany({});
    await db.user.deleteMany({});
    await db.organization.deleteMany({});

    // 1. Create Organization
    const organization = await db.organization.create({
      data: {
        id: 'org-1',
        name: 'Acme Construction Ltd',
        domain: 'acme-construction.com',
        isActive: true,
        settings: {
          timezone: 'Asia/Dubai',
          dateFormat: 'DD/MM/YYYY',
          features: ['delay-detection', 'claim-management', 'evidence-collection'],
        },
      },
    });

    console.log('✓ Organization created');

    // 2. Create Users
    const users = await Promise.all([
      db.user.create({
        data: {
          id: 'user-1',
          email: 'david.chen@acme-construction.com',
          firstName: 'David',
          lastName: 'Chen',
          role: UserRole.DIRECTOR,
          organizationId: organization.id,
          isActive: true,
          lastLoginAt: new Date('2025-07-14T09:30:00Z'),
        },
      }),
      db.user.create({
        data: {
          id: 'user-2',
          email: 'sarah.williams@acme-construction.com',
          firstName: 'Sarah',
          lastName: 'Williams',
          role: UserRole.PROJECT_MANAGER,
          organizationId: organization.id,
          isActive: true,
          lastLoginAt: new Date('2025-07-14T08:15:00Z'),
        },
      }),
      db.user.create({
        data: {
          id: 'user-3',
          email: 'ahmed.hassan@acme-construction.com',
          firstName: 'Ahmed',
          lastName: 'Hassan',
          role: UserRole.SCHEDULER,
          organizationId: organization.id,
          isActive: true,
          lastLoginAt: new Date('2025-07-14T07:45:00Z'),
        },
      }),
    ]);

    console.log('✓ Users created');

    // 3. Create Projects
    const projects = await Promise.all([
      db.project.create({
        data: {
          id: 'project-1',
          name: 'Dubai Marina Tower Complex',
          description: 'Construction of a 45-story mixed-use tower complex in Dubai Marina',
          location: 'Dubai, UAE',
          organizationId: organization.id,
          status: ProjectStatus.ACTIVE,
          contractValue: 450000000,
          contractType: ContractType.FIDIC_YELLOW,
          startDate: new Date('2025-01-01'),
          plannedCompletion: new Date('2027-12-31'),
          currentCompletion: new Date('2025-07-14'),
          healthScore: 78,
          projectManagerId: users[1].id, // Sarah Williams
          metadata: {
            clientName: 'Dubai Marina Development Corp',
            contractNumber: 'DMT-2024-001',
            totalUnits: 320,
            floors: 45,
          },
        },
      }),
      db.project.create({
        data: {
          id: 'project-2',
          name: 'London Bridge Infrastructure',
          description: 'Major infrastructure upgrade project for London Bridge area',
          location: 'London, UK',
          organizationId: organization.id,
          status: ProjectStatus.ACTIVE,
          contractValue: 280000000,
          contractType: ContractType.NEC4,
          startDate: new Date('2024-06-01'),
          plannedCompletion: new Date('2026-05-31'),
          currentCompletion: new Date('2025-07-14'),
          healthScore: 85,
          projectManagerId: users[1].id, // Sarah Williams
          metadata: {
            clientName: 'Transport for London',
            contractNumber: 'LBI-2024-002',
            scope: 'Road, rail, and pedestrian infrastructure',
          },
        },
      }),
      db.project.create({
        data: {
          id: 'project-3',
          name: 'Singapore Metro Extension',
          description: 'Extension of the Singapore Metro system with 12 new stations',
          location: 'Singapore',
          organizationId: organization.id,
          status: ProjectStatus.ACTIVE,
          contractValue: 650000000,
          contractType: ContractType.FIDIC_RED,
          startDate: new Date('2024-03-01'),
          plannedCompletion: new Date('2027-02-28'),
          currentCompletion: new Date('2025-07-14'),
          healthScore: 92,
          projectManagerId: users[0].id, // David Chen
          metadata: {
            clientName: 'Land Transport Authority Singapore',
            contractNumber: 'SME-2024-003',
            stations: 12,
            lineExtension: 'Circle Line Extension',
          },
        },
      }),
    ]);

    console.log('✓ Projects created');

    // 4. Create Delay Events
    const delayEvents = await Promise.all([
      db.delayEvent.create({
        data: {
          id: 'delay-1',
          projectId: projects[0].id,
          activityId: 'ACT-001',
          activityName: 'Foundation Pour Zone A',
          detectionDate: new Date('2025-03-15'),
          delayDays: 15,
          causeType: DelayType.CLIENT_DELAY,
          probabilityScore: 85,
          evidenceStrength: 85,
          status: DelayStatus.CLAIM_SUBMITTED,
          description: 'Client design change requiring reinforcement redesign',
          estimatedCost: 1200000,
          criticalPath: true,
          detectedById: users[2].id, // Ahmed Hassan
          metadata: {
            originalStartDate: '2025-03-01',
            newStartDate: '2025-03-16',
            impactedActivities: ['ACT-002', 'ACT-003'],
          },
        },
      }),
      db.delayEvent.create({
        data: {
          id: 'delay-2',
          projectId: projects[0].id,
          activityId: 'ACT-002',
          activityName: 'Steel Erection Tower B',
          detectionDate: new Date('2025-04-02'),
          delayDays: 8,
          causeType: DelayType.WEATHER,
          probabilityScore: 65,
          evidenceStrength: 70,
          status: DelayStatus.UNDER_REVIEW,
          description: 'Extended rainfall period affecting steel erection work',
          estimatedCost: 450000,
          criticalPath: false,
          detectedById: users[2].id, // Ahmed Hassan
          metadata: {
            weatherData: {
              rainDays: 8,
              averageRainfall: '45mm/day',
              windSpeed: '25km/h average',
            },
          },
        },
      }),
      db.delayEvent.create({
        data: {
          id: 'delay-3',
          projectId: projects[0].id,
          activityId: 'ACT-003',
          activityName: 'MEP Rough-in Level 5',
          detectionDate: new Date('2025-05-10'),
          delayDays: 12,
          causeType: DelayType.THIRD_PARTY,
          probabilityScore: 78,
          evidenceStrength: 82,
          status: DelayStatus.CLAIM_PREPARED,
          description: 'Utility company delay in power connection approval',
          estimatedCost: 680000,
          criticalPath: true,
          detectedById: users[2].id, // Ahmed Hassan
          metadata: {
            utilityCompany: 'Dubai Electricity & Water Authority',
            applicationDate: '2025-04-15',
            approvalDelay: '3 weeks beyond committed date',
          },
        },
      }),
    ]);

    console.log('✓ Delay Events created');

    // 5. Create Claims
    const claims = await Promise.all([
      db.claim.create({
        data: {
          id: 'claim-1',
          projectId: projects[0].id,
          delayEventId: delayEvents[0].id,
          referenceNumber: 'EOT-2025-001',
          title: 'Foundation Design Change Delay',
          description: 'Extension of Time claim for foundation design change delays',
          submissionDate: new Date('2025-03-20'),
          noticeDate: new Date('2025-03-16'),
          claimAmount: 1200000,
          timeImpactDays: 15,
          status: ClaimStatus.UNDER_EVALUATION,
          responseDueDate: new Date('2025-04-17'),
          submittedById: users[1].id, // Sarah Williams
          workflow: {
            currentStage: 'client-review',
            history: [
              { stage: 'draft', date: '2025-03-15', user: 'Sarah Williams' },
              { stage: 'submitted', date: '2025-03-20', user: 'Sarah Williams' },
            ],
          },
          metadata: {
            contractClause: 'FIDIC Yellow Book 8.4',
            submissionMethod: 'Email + Portal',
            clientContact: 'John Smith - Project Director',
          },
        },
      }),
      db.claim.create({
        data: {
          id: 'claim-2',
          projectId: projects[0].id,
          delayEventId: delayEvents[2].id,
          referenceNumber: 'EOT-2025-002',
          title: 'MEP Utility Connection Delay',
          description: 'Extension of Time claim for utility connection delays',
          submissionDate: null,
          noticeDate: new Date('2025-05-11'),
          claimAmount: 680000,
          timeImpactDays: 12,
          status: ClaimStatus.DRAFT,
          responseDueDate: null,
          submittedById: users[1].id, // Sarah Williams
          workflow: {
            currentStage: 'preparation',
            history: [
              { stage: 'identified', date: '2025-05-10', user: 'Ahmed Hassan' },
              { stage: 'draft', date: '2025-05-11', user: 'Sarah Williams' },
            ],
          },
          metadata: {
            contractClause: 'FIDIC Yellow Book 8.4',
            preparationStatus: '75% complete',
          },
        },
      }),
    ]);

    console.log('✓ Claims created');

    // 6. Create Evidence
    await Promise.all([
      db.evidence.create({
        data: {
          id: 'evidence-1',
          delayEventId: delayEvents[0].id,
          claimId: claims[0].id,
          type: EvidenceType.EMAIL,
          title: 'Client Design Change Request',
          description: 'Email from client PM requesting foundation design review',
          sourceSystem: 'Email',
          filePath: '/evidence/email_001.pdf',
          relevanceScore: 95,
          extractedText: 'Please hold foundation work pending design review. New soil conditions require reinforcement modifications...',
          uploadedById: users[1].id, // Sarah Williams
          metadata: {
            from: 'client.pm@dubaimarina.com',
            to: 'sarah.williams@acme-construction.com',
            date: '2025-03-15T14:30:00Z',
            subject: 'Foundation Design Review Required - URGENT',
            attachments: ['soil_report_v2.pdf', 'design_changes.dwg'],
          },
        },
      }),
      db.evidence.create({
        data: {
          id: 'evidence-2',
          delayEventId: delayEvents[0].id,
          claimId: claims[0].id,
          type: EvidenceType.RFI,
          title: 'RFI-234 Reinforcement Clarification',
          description: 'Request for Information regarding reinforcement details',
          sourceSystem: 'Project Management System',
          filePath: '/evidence/rfi_234.pdf',
          relevanceScore: 90,
          extractedText: 'Clarification required on reinforcement specifications for Zone A foundation following soil report updates...',
          uploadedById: users[2].id, // Ahmed Hassan
          metadata: {
            rfiNumber: 'RFI-234',
            submittedBy: 'Ahmed Hassan',
            submittedDate: '2025-03-16T09:00:00Z',
            status: 'Answered',
            responseDate: '2025-03-18T15:30:00Z',
            category: 'Structural',
          },
        },
      }),
      db.evidence.create({
        data: {
          id: 'evidence-3',
          delayEventId: delayEvents[0].id,
          claimId: claims[0].id,
          type: EvidenceType.CHANGE_ORDER,
          title: 'Design Change Notice DCN-089',
          description: 'Official design change notice for foundation modifications',
          sourceSystem: 'Document Management',
          filePath: '/evidence/dcn_089.pdf',
          relevanceScore: 98,
          extractedText: 'Design change notice for foundation reinforcement modifications as per updated soil conditions report...',
          uploadedById: users[1].id, // Sarah Williams
          metadata: {
            changeOrderNumber: 'DCN-089',
            approvedBy: 'Client Chief Engineer',
            approvedDate: '2025-03-18T16:00:00Z',
            costImpact: 1200000,
            timeImpact: '15 days',
            category: 'Design Change',
            priority: 'High',
          },
        },
      }),
    ]);

    console.log('✓ Evidence created');

    // 7. Create Action Items
    await Promise.all([
      db.actionItem.create({
        data: {
          id: 'action-1',
          title: 'Review Foundation Delay Evidence',
          description: 'Review and approve evidence collection for foundation delay claim',
          priority: Priority.HIGH,
          dueDate: new Date('2025-07-16'),
          projectId: projects[0].id,
          assignedToId: users[1].id, // Sarah Williams
          status: ActionItemStatus.PENDING,
          metadata: {
            estimatedHours: 4,
            category: 'Review',
            relatedClaim: 'EOT-2025-001',
          },
        },
      }),
      db.actionItem.create({
        data: {
          id: 'action-2',
          title: 'Prepare MEP Delay Claim',
          description: 'Prepare claim documentation for MEP utility connection delay',
          priority: Priority.MEDIUM,
          dueDate: new Date('2025-07-18'),
          projectId: projects[0].id,
          assignedToId: users[0].id, // David Chen
          status: ActionItemStatus.IN_PROGRESS,
          metadata: {
            estimatedHours: 8,
            category: 'Preparation',
            relatedClaim: 'EOT-2025-002',
            completionPercentage: 60,
          },
        },
      }),
      db.actionItem.create({
        data: {
          id: 'action-3',
          title: 'Schedule Client Meeting',
          description: 'Schedule meeting with client to discuss major claim settlement',
          priority: Priority.MEDIUM,
          dueDate: new Date('2025-07-20'),
          projectId: projects[1].id,
          assignedToId: users[1].id, // Sarah Williams
          status: ActionItemStatus.PENDING,
          metadata: {
            estimatedHours: 2,
            category: 'Coordination',
            meetingType: 'Settlement Discussion',
          },
        },
      }),
    ]);

    console.log('✓ Action Items created');

    // 8. Create Storage Quota
    await db.storageQuota.create({
      data: {
        organizationId: organization.id,
        usedBytes: BigInt(1024 * 1024 * 1024 * 5), // 5GB used
        limitBytes: BigInt(1024 * 1024 * 1024 * 100), // 100GB limit
        fileCount: 247,
        maxFileCount: 10000,
      },
    });

    console.log('✓ Storage Quota created');

    // 9. Create some Analytics Events
    await Promise.all([
      db.analyticsEvent.create({
        data: {
          eventType: 'delay_detected',
          userId: users[2].id,
          organizationId: organization.id,
          properties: {
            projectId: projects[0].id,
            delayType: 'CLIENT_DELAY',
            delayDays: 15,
            criticalPath: true,
          },
          timestamp: new Date('2025-03-15T10:30:00Z'),
        },
      }),
      db.analyticsEvent.create({
        data: {
          eventType: 'claim_submitted',
          userId: users[1].id,
          organizationId: organization.id,
          properties: {
            projectId: projects[0].id,
            claimId: claims[0].id,
            claimAmount: 1200000,
            claimType: 'EOT',
          },
          timestamp: new Date('2025-03-20T11:15:00Z'),
        },
      }),
      db.analyticsEvent.create({
        data: {
          eventType: 'evidence_uploaded',
          userId: users[1].id,
          organizationId: organization.id,
          properties: {
            projectId: projects[0].id,
            evidenceType: 'EMAIL',
            relevanceScore: 95,
          },
          timestamp: new Date('2025-03-15T14:45:00Z'),
        },
      }),
    ]);

    console.log('✓ Analytics Events created');

    // 10. Create Audit Logs
    await Promise.all([
      db.auditLog.create({
        data: {
          action: 'CREATE',
          entityType: 'Project',
          entityId: projects[0].id,
          userId: users[1].id,
          organizationId: organization.id,
          changes: {
            created: {
              name: 'Dubai Marina Tower Complex',
              contractValue: 450000000,
              status: 'ACTIVE',
            },
          },
          metadata: {
            userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
            ipAddress: '192.168.1.100',
          },
        },
      }),
      db.auditLog.create({
        data: {
          action: 'UPDATE',
          entityType: 'DelayEvent',
          entityId: delayEvents[0].id,
          userId: users[1].id,
          organizationId: organization.id,
          changes: {
            status: { from: 'DETECTED', to: 'CLAIM_SUBMITTED' },
            updatedAt: { from: '2025-03-15T10:30:00Z', to: '2025-03-20T11:15:00Z' },
          },
          metadata: {
            reason: 'Claim submitted to client',
          },
        },
      }),
    ]);

    console.log('✓ Audit Logs created');

    console.log('🎉 Database seeding completed successfully!');

    // Return summary
    return {
      organizations: 1,
      users: 3,
      projects: 3,
      delayEvents: 3,
      claims: 2,
      evidence: 3,
      actionItems: 3,
      analyticsEvents: 3,
      auditLogs: 2,
    };

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}

// Script execution for direct running
if (require.main === module) {
  seedDatabase()
    .then((result) => {
      console.log('Seed Summary:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await db.$disconnect();
    });
}