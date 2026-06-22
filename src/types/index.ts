// 学生信息
export interface StudentInfo {
  id: string;
  name: string;
  grade: string;
  className: string;
  avatar: string;
  studentNo: string;
}

// 乘车记录节点
export interface RideNode {
  id: string;
  type: 'board' | 'alight' | 'leave';
  title: string;
  stationName: string;
  time: string;
  status: 'done' | 'pending' | 'missed';
  description?: string;
  lineName?: string;
}

// 今日乘车数据
export interface TodayRideInfo {
  date: string;
  student: StudentInfo;
  morningNodes: RideNode[];
  afternoonNodes: RideNode[];
  isLeaveRequested: boolean;
  leaveReason?: string;
}

// 异常类型
export type ExceptionType = 'forgot_card' | 'change_line' | 'teacher_confirm' | 'missed_ride';

// 异常状态
export type ExceptionStatus = 'pending' | 'acknowledged' | 'questioned';

// 异常记录
export interface ExceptionRecord {
  id: string;
  type: ExceptionType;
  title: string;
  description: string;
  time: string;
  confirmerName: string;
  confirmerRole: string;
  reason: string;
  status: ExceptionStatus;
  studentName: string;
  lineName?: string;
}

// 站点信息
export interface StationInfo {
  id: string;
  name: string;
  address: string;
  type: 'board' | 'alight' | 'both';
  isDefaultBoard: boolean;
  isDefaultAlight: boolean;
}

// 紧急联系人
export interface ContactInfo {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
}

// 请假记录
export interface LeaveRecord {
  id: string;
  date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  createTime: string;
}

// 设置项类型
export type SettingItemType = 'navigate' | 'switch' | 'info';

// 设置项
export interface SettingItem {
  key: string;
  title: string;
  value?: string;
  type: SettingItemType;
  icon?: string;
  desc?: string;
}
