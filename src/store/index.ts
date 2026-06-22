import { create } from 'zustand';
import type {
  ExceptionRecord,
  StationInfo,
  ContactInfo,
  LeaveRecord,
  TodayRideInfo
} from '@/types';
import {
  exceptionListData,
  stationListData,
  contactListData,
  leaveRecordList,
  todayRideData
} from '@/data/mock';

// 消息类型
export type MessageType = 'board' | 'alight' | 'leave_school' | 'exception' | 'leave_request';

export interface MessageRecord {
  id: string;
  type: MessageType;
  title: string;
  description: string;
  time: string;
  studentName: string;
  relatedId?: string;
}

interface AppState {
  // 异常记录
  exceptions: ExceptionRecord[];
  // 站点
  stations: StationInfo[];
  // 联系人
  contacts: ContactInfo[];
  // 请假记录
  leaveRecords: LeaveRecord[];
  // 今日乘车
  todayRide: TodayRideInfo;
  // 消息记录
  messages: MessageRecord[];

  // ===== 异常相关 =====
  updateExceptionStatus: (id: string, status: ExceptionRecord['status']) => void;
  getExceptionById: (id: string) => ExceptionRecord | undefined;

  // ===== 请假相关 =====
  addLeaveRecord: (record: Omit<LeaveRecord>) => boolean;
  hasLeaveOnDate: (date: string) => boolean;

  // ===== 站点相关 =====
  addStation: (station: StationInfo) => void;
  updateStation: (station: StationInfo) => void;
  deleteStation: (id: string) => void;
  setDefaultStation: (id: string) => void;
  getDefaultBoardStation: () => StationInfo | undefined;
  getDefaultAlightStation: () => StationInfo | undefined;

  // ===== 联系人相关 =====
  addContact: (contact: ContactInfo) => void;
  updateContact: (contact: ContactInfo) => void;
  deleteContact: (id: string) => void;
  setPrimaryContact: (id: string) => void;
  getPrimaryContact: () => ContactInfo | undefined;

  // ===== 消息相关 =====
  addMessage: (msg: Omit<MessageRecord, 'id'>) => void;
  getFilteredMessages: (filterType?: string, studentName?: string) => MessageRecord[];

  // ===== 今日乘车 =====
  updateTodayRideLeave: (isLeave: boolean, reason?: string) => void;
}

// 生成初始消息
const generateInitialMessages = (): MessageRecord[] => {
  const msgs: MessageRecord[] = [];
  
  // 从异常生成消息
  exceptionListData.forEach((e) => {
    msgs.push({
      id: `msg-${e.id}`,
      type: 'exception',
      title: e.title,
      description: e.description,
      time: e.time,
      studentName: e.studentName,
      relatedId: e.id
    });
  });

  // 从请假生成消息
  leaveRecordList.forEach((l) => {
    msgs.push({
      id: `msg-${l.id}`,
      type: 'leave_request',
      title: '请假申请',
      description: l.reason,
      time: l.createTime,
      studentName: todayRideData.student.name,
      relatedId: l.id
    });
  });

  // 今日乘车消息
  if (todayRideData.morningNodes[0]?.status === 'done') {
    msgs.push({
      id: 'msg-board-today',
      type: 'board',
      title: '上车刷卡',
      description: `在${todayRideData.morningNodes[0].stationName}刷卡上车`,
      time: `${todayRideData.date} ${todayRideData.morningNodes[0].time}`,
      studentName: todayRideData.student.name
    });
  }
  if (todayRideData.morningNodes[1]?.status === 'done') {
    msgs.push({
      id: 'msg-alight-today',
      type: 'alight',
      title: '到校下车',
      description: `在${todayRideData.morningNodes[1].stationName}下车`,
      time: `${todayRideData.date} ${todayRideData.morningNodes[1].time}`,
      studentName: todayRideData.student.name
    });
  }

  return msgs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
});

export const useAppStore = create<AppState>((set, get) => ({
  exceptions: [...exceptionListData],
  stations: [...stationListData],
  contacts: [...contactListData],
  leaveRecords: [...leaveRecordList],
  todayRide: { ...todayRideData },
  messages: generateInitialMessages(),

  // ===== 异常相关 =====
  updateExceptionStatus: (id, status) => {
    console.log('[Store] 更新异常状态', id, status);
    set((state) => ({
      exceptions: state.exceptions.map((e) =>
        e.id === id ? { ...e, status } : e
      )
    }));
  },

  getExceptionById: (id) => {
    return get().exceptions.find((e) => e.id === id);
  },

  // ===== 请假相关 =====
  addLeaveRecord: (record) => {
    const state = get();
    if (state.leaveRecords.some((r) => r.date === record.date)) {
      console.log('[Store] 该日期已有请假记录');
      return false;
    }
    console.log('[Store] 新增请假记录', record);
    set((s) => ({
      leaveRecords: [record, ...s.leaveRecords]
    }));

    // 如果请假日期是今天，更新今日乘车
    const today = new Date().toISOString().split('T')[0];
    if (record.date === today) {
      get().updateTodayRideLeave(true, record.reason);
    }

    // 添加消息
    get().addMessage({
      type: 'leave_request',
      title: '请假申请',
      description: record.reason,
      time: record.createTime,
      studentName: get().todayRide.student.name,
      relatedId: record.id
    });

    return true;
  },

  hasLeaveOnDate: (date) => {
    return get().leaveRecords.some((r) => r.date === date);
  },

  // ===== 站点相关 =====
  addStation: (station) => {
    console.log('[Store] 新增站点', station);
    set((s) => ({
      stations: [...s.stations, station]
    }));
  },

  updateStation: (station) => {
    console.log('[Store] 更新站点', station);
    set((s) => ({
      stations: s.stations.map((st) => (st.id === station.id ? station : st))
    }));
  },

  deleteStation: (id) => {
    console.log('[Store] 删除站点', id);
    set((s) => ({
      stations: s.stations.filter((st) => st.id !== id)
    }));
  },

  setDefaultStation: (id) => {
    console.log('[Store] 设置默认站点', id);
    set((s) => ({
      stations: s.stations.map((st) => ({
        ...st,
        isDefault: st.id === id
      }))
    }));
  },

  getDefaultBoardStation: () => {
    return get().stations.find((s) => s.type !== 'alight' && s.isDefault);
  },

  getDefaultAlightStation: () => {
    return get().stations.find((s) => s.type !== 'board' && s.isDefault);
  },

  // ===== 联系人相关 =====
  addContact: (contact) => {
    console.log('[Store] 新增联系人', contact);
    set((s) => ({
      contacts: [...s.contacts, contact]
    }));
  },

  updateContact: (contact) => {
    console.log('[Store] 更新联系人', contact);
    set((s) => ({
      contacts: s.contacts.map((c) => (c.id === contact.id ? contact : c)
    }));
  },

  deleteContact: (id) => {
    console.log('[Store] 删除联系人', id);
    set((s) => ({
      contacts: s.contacts.filter((c) => c.id !== id)
    }));
  },

  setPrimaryContact: (id) => {
    console.log('[Store] 设置首要联系人', id);
    set((s) => ({
      contacts: s.contacts.map((c) => ({
        ...c,
        isPrimary: c.id === id
      }))
    }));
  },

  getPrimaryContact: () => {
    return get().contacts.find((c) => c.isPrimary);
  },

  // ===== 消息相关 =====
  addMessage: (msg) => {
    const newMsg = { ...msg, id: `msg-${Date.now()}` };
    console.log('[Store] 新增消息', newMsg);
    set((s) => ({
      messages: [newMsg, ...s.messages]
    }));
  },

  getFilteredMessages: (filterType, studentName) => {
    let result = [...get().messages];
    if (filterType && filterType !== 'all') {
      result = result.filter((m) => m.type === filterType);
    }
    if (studentName) {
      result = result.filter((m) => m.studentName === studentName);
    }
    return result;
  },

  // ===== 今日乘车 =====
  updateTodayRideLeave: (isLeave, reason) => {
    console.log('[Store] 更新今日乘车请假状态', isLeave, reason);
    set((s) => ({
      todayRide: {
        ...s.todayRide,
        isLeaveRequested: isLeave,
        leaveReason: reason
      }
    }));
  }
}));
