import React, { useState, useEffect } from 'react';
import { useStudent } from '../../context/StudentContext';
import { 
  organisationTypes, 
  remunerationTypes, 
  intakeCohorts 
} from '../../data/dashboardData';
import { validatePlacementApplication } from '../../services/studentFormService';
import './StudentFormStyles.css';

export default function PlacementApplicationModal({ placement, onClose, onSubmit }) {
}
const { placementDraft, savePlacementDraft, clearPlacementDraft } = useStudent();

const getInitialData = () => {
  if (placement && placement.status !== 'draft') return placement;
  if (placementDraft) return placementDraft;

  return {
    organisationName: '',
    organisationType: '',
    organisationDistrict: '',
    organisationAddress: '',
    department: '',
    wpSupervisorName: '',
    wpSupervisorEmail: '',
    wpSupervisorPhone: '',
    wpSupervisorTitle: '',
    startDate: '',
    endDate: '',
    intakeCohort: '',
    remunerationType: 'unpaid',
    placementFee: '',
    requestLetter: null,
    acceptanceLetter: null,
  };
};