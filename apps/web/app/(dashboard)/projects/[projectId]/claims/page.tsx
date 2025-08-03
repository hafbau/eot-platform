'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@eot/ui';
import { ArrowLeft, Gavel, Plus } from 'lucide-react';

const ClaimsPage = () => {
  const params = useParams();
  const projectId = params?.projectId as string;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href={`/projects/${projectId}/dashboard`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Project Claims</h1>
            <p className="mt-2 text-gray-600">Manage extension of time claims</p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Claim
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="text-center py-12">
          <Gavel className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No claims yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Extension of time claims will be displayed here when created.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClaimsPage;