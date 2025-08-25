export type User = {
  id: string;
  name: string;
  employeeId: string;
  role: 'Technician' | 'Supervisor';
};

export type LockoutLog = {
  id: string;
  lockedBy: User;
  lockTimestamp: Date;
  unlockedBy?: User | null;
  unlockTimestamp?: Date | null;
  contactNumber: string;
  workPermitNo: string;
  jobDescription: string;
};

export type VCSDevice = {
  id: string;
  name: string;
  location: string;
  status: 'ENERGIZED' | 'LOCKED-OUT';
  currentLock?: {
    lockedBy: User;
    lockTimestamp: Date;
    contactNumber: string;
    workPermitNo: string;
    jobDescription: string;
  } | null;
  history: LockoutLog[];
};
