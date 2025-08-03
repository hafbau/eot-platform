'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@eot/ui';
import { ArrowLeft, FileText, Upload } from 'lucide-react';

const EvidencePage = () => {
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
            <h1 className="text-3xl font-bold text-gray-900">Project Evidence</h1>
            <p className="mt-2 text-gray-600">Manage project documentation and evidence</p>
          </div>
        </div>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Upload Evidence
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No evidence uploaded</h3>
          <p className="mt-1 text-sm text-gray-500">
            Project documents and evidence will be displayed here when uploaded.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EvidencePage;