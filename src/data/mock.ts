import type {
  TodayRideInfo,
  ExceptionRecord,
  StationInfo,
  ContactInfo,
  LeaveRecord
} from '@/types';

// 今日乘车数据
export const todayRideData: TodayRideInfo = {
  date: '2026-06-22',
  student: {
    id: 's001',
    name: '李小乐',
    grade: '三年级',
    className: '2班',
    avatar: 'https://picsum.photos/id/64/200/200',
    studentNo: '20230218'
  },
  morningNodes: [
    {
      id: 'm1',
      type: 'board',
      title: '上车刷卡',
      stationName: '阳光花园南门站',
      time: '07:25',
      status: 'done',
      lineName: '3号线路'
    },
    {
      id: 'm2',
      type: 'alight',
      title: '到校下车',
      stationName: '实验小学站',
      time: '07:52',
      status: 'done',
      description: '司机确认下车'
    }
  ],
  afternoonNodes: [
    {
      id: 'a1',
      type: 'leave',
      title: '放学离校',
      stationName: '实验小学站',
      time: '',
      status: 'pending',
      lineName: '3号线路'
    },
    {
      id: 'a2',
      type: 'alight',
      title: '到家下车',
      stationName: '阳光花园南门站',
      time: '',
      status: 'pending'
    }
  ],
  isLeaveRequested: false
};

// 异常记录列表
export const exceptionListData: ExceptionRecord[] = [
  {
    id: 'e001',
    type: 'teacher_confirm',
    title: '老师人工确认上车',
    description: '学生已安全上车',
    time: '2026-06-22 07:25',
    confirmerName: '王老师',
    confirmerRole: '班主任',
    reason: '学生今天忘带学生卡，由我人工确认上车',
    status: 'pending',
    studentName: '李小乐',
    lineName: '3号线路'
  },
  {
    id: 'e002',
    type: 'change_line',
    title: '改乘其他线路',
    description: '学生改乘5号线路',
    time: '2026-06-20 16:30',
    confirmerName: '张师傅',
    confirmerRole: '5号线司机',
    reason: '因家里临时有事，提前放学时间调整为5号线路',
    status: 'acknowledged',
    studentName: '李小乐',
    lineName: '5号线路'
  },
  {
    id: 'e003',
    type: 'forgot_card',
    title: '未刷卡异常',
    description: '早晨未刷卡上车',
    time: '2026-06-19 07:30',
    confirmerName: '李师傅',
    confirmerRole: '3号线司机',
    reason: '学生可能忘带卡，请家长确认',
    status: 'questioned',
    studentName: '李小乐',
    lineName: '3号线路'
  },
  {
    id: 'e004',
    type: 'missed_ride',
    title: '未乘车提醒',
    description: '下午未乘车',
    time: '2026-06-18 16:40',
    confirmerName: '系统',
    confirmerRole: '系统检测',
    reason: '学生未出现在乘车名单中，已确认请假',
    status: 'acknowledged',
    studentName: '李小乐'
  },
  {
    id: 'e005',
    type: 'teacher_confirm',
    title: '老师确认离校',
    description: '已确认安全离校',
    time: '2026-06-17 16:45',
    confirmerName: '刘老师',
    confirmerRole: '值班老师',
    reason: '学生因值日，由老师护送离校',
    status: 'acknowledged',
    studentName: '李小乐',
    lineName: '3号线路'
  }
];

// 常用站点列表
export const stationListData: StationInfo[] = [
  {
    id: 'st001',
    name: '阳光花园南门站',
    address: '阳光花园小区南门',
    type: 'both',
    isDefaultBoard: true,
    isDefaultAlight: false
  },
  {
    id: 'st002',
    name: '实验小学站',
    address: '实验小学正门东侧',
    type: 'both',
    isDefaultBoard: false,
    isDefaultAlight: true
  },
  {
    id: 'st003',
    name: '中心广场站',
    address: '中心广场北侧公交站',
    type: 'board',
    isDefaultBoard: false,
    isDefaultAlight: false
  }
];

// 紧急联系人列表
export const contactListData: ContactInfo[] = [
  {
    id: 'c001',
    name: '李建国',
    relation: '父亲',
    phone: '138****5678',
    isPrimary: true
  },
  {
    id: 'c002',
    name: '王丽华',
    relation: '母亲',
    phone: '139****1234',
    isPrimary: false
  }
];

// 请假记录列表
export const leaveRecordList: LeaveRecord[] = [
  {
    id: 'l001',
    date: '2026-06-25',
    reason: '家中有事，需请假一天',
    status: 'approved',
    createTime: '2026-06-22 10:30'
  },
  {
    id: 'l002',
    date: '2026-06-18',
    reason: '身体不适，请假休息',
    status: 'approved',
    createTime: '2026-06-17 20:15'
  }
];
