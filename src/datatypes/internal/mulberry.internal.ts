export interface FileInfo {
  filename: string;
  label: string;
  checksum: string;
}

export interface ResponseFiles {
  info?: FileInfo[];
  archive?: string; // base64-encoded ZIP
}

export interface MulberryTrackResponse {
  jsonrpc: string;
  id: number;
  result: {
    status: { name: string; title: string; description: string };
    is_finished: boolean;
    data: {
      sys_reg_num: string;
      sys_title: string;
      sys_reg_date: string;
    };
    files?: ResponseFiles;
  };
}

export type TrackApplication = {
  statusName: string;
  statusTitle: string;
  isFinished: boolean;
  applicationNumber: string;
  cesName: string;
  completionDate: string;
  files: FileInfo[] | null;
  archive?: string;
};
