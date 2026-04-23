import React, { useState, useMemo } from 'react';
import { accountStatusChoices } from '../../data/dashboardData';

export default function SupervisorsPage({ workplaceSupervisors, academicSupervisors }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    accountStatus: '',
  });

   // Combine all supervisors
  const allSupervisors = useMemo(() => {
    const wpSups = workplaceSupervisors.map(s => ({ ...s, role: 'workplace_supervisor' }));
    const acSups = academicSupervisors.map(s => ({ ...s, role: 'academic_supervisor' }));
    return [...wpSups, ...acSups];
  }, [workplaceSupervisors, academicSupervisors]);