'use client';
import React from 'react';
import { CreatePropertyModal } from '../../components/CreatePropertyModal';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../dashboard/layout';

export default function CreateProperty() {
  const navigate = useNavigate();

  return (
    <>
      <DashboardLayout />
      <div className="fixed inset-0 z-50">
        <CreatePropertyModal
          isOpen={true}
          onClose={() => navigate('/dashboard')}
        />
      </div>
    </>
  );
} 