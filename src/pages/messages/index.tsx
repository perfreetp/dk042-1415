import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore, MessageType } from '@/store';
import type { MessageRecord } from '@/store';
import styles from './index.module.scss';

const typeOptions = [
  { key: 'all', label: '全部', icon: '📋' },
  { key: 'board', label: '上车刷卡', icon: '🚌' },
  { key: 'alight', label: '到校下车', icon: '🏫' },
  { key: 'leave_school', label: '放学离校', icon: '🎒' },
  { key: 'exception', label: '异常提醒', icon: '⚠️' },
  { key: 'leave_request', label: '请假申请', icon: '📝' }
];

const studentOptions = [
  { key: 'all', label: '全部孩子' },
  { key: '李小乐', label: '李小乐' }
];

const getIconClass = (type: MessageType): string => {
  switch (type) {
    case 'board':
      return 'iconBoard';
    case 'alight':
      return 'iconAlight';
    case 'leave_school':
      return 'iconLeave';
    case 'exception':
      return 'iconException';
    case 'leave_request':
      return 'iconRequest';
    default:
      return '';
  }
};

const getIconEmoji = (type: MessageType): string => {
  switch (type) {
    case 'board':
      return '🚌';
    case 'alight':
      return '🏫';
    case 'leave_school':
      return '🎒';
    case 'exception':
      return '⚠️';
    case 'leave_request':
      return '📝';
    default:
      return '📋';
  }
};

const MessagesPage: React.FC = () => {
  const { getFilteredMessages, todayRide } = useAppStore();
  const [activeType, setActiveType] = useState<string>('all');
  const [activeStudent, setActiveStudent] = useState<string>('all');
  const [, forceUpdate] = useState(0);

  useDidShow(() => {
    console.log('[Messages] 页面展示，刷新消息');
    forceUpdate((v) => v + 1);
  });

  const filteredMessages = useMemo(() => {
    return getFilteredMessages(activeType, activeStudent === 'all' ? undefined : activeStudent);
  }, [activeType, activeStudent, getFilteredMessages]);

  // 按日期分组
  const groupedMessages = useMemo(() => {
    const groups: { [key: string]: MessageRecord[] } = {};
    filteredMessages.forEach((msg) => {
      // 提取日期部分
      const dateMatch = msg.time.match(/(\d{4}-\d{2}-\d{2})/);
      const dateKey = dateMatch ? dateMatch[1] : msg.time.split(' ')[0] || '其他';
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].push(msg);
    });
    return Object.entries(groups).sort((a, b) => (a[0] < b[0] ? 1 : -1));
  }, [filteredMessages]);

  const formatDateLabel = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (dateStr === today) return '今天';
    if (dateStr === yesterday) return '昨天';
    return dateStr;
  };

  const formatTime = (timeStr: string) => {
    // 如果已经包含时间部分，提取 HH:mm
    const match = timeStr.match(/(\d{1,2}:\d{2})/);
    if (match) return match[1];
    return timeStr;
  };

  const handleMessageClick = (msg: MessageRecord) => {
    if (msg.type === 'exception' && msg.relatedId) {
      Taro.navigateTo({
        url: `/pages/exception-detail/index?id=${msg.relatedId}`
      });
    }
  };

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.headerSection}>
        <View className={styles.filterSection}>
          <View className={styles.filterRow}>
            <Text className={styles.filterLabel}>消息类型</Text>
            <View className={styles.filterOptions}>
              {typeOptions.map((opt) => (
                <View
                  key={opt.key}
                  className={classnames(
                    styles.filterOption,
                    activeType === opt.key && styles.active
                  )}
                  onClick={() => setActiveType(opt.key)}
                >
                  <Text className={styles.filterOptionText}>{opt.label}</Text>
                </View>
              ))}
            </View>
          </View>
          <View className={styles.filterRow}>
            <Text className={styles.filterLabel}>选择孩子</Text>
            <View className={styles.filterOptions}>
              {studentOptions.map((opt) => (
                <View
                  key={opt.key}
                  className={classnames(
                    styles.filterOption,
                    activeStudent === opt.key && styles.active
                  )}
                  onClick={() => setActiveStudent(opt.key)}
                >
                  <Text className={styles.filterOptionText}>{opt.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View className={styles.messageList}>
        {groupedMessages.length > 0 ? (
          groupedMessages.map(([date, msgs]) => (
            <View key={date}>
              <Text className={styles.dateGroupHeader}>{formatDateLabel(date)}</Text>
              {msgs.map((msg) => (
                <View
                  key={msg.id}
                  className={styles.messageCard}
                  onClick={() => handleMessageClick(msg)}
                >
                  <View className={styles.messageHeader}>
                    <View
                      className={classnames(styles.messageIcon, styles[getIconClass(msg.type)])}
                    >
                      <Text>{getIconEmoji(msg.type)}</Text>
                    </View>
                    <View className={styles.messageInfo}>
                      <Text className={styles.messageTitle}>{msg.title}</Text>
                      <Text className={styles.messageTime}>{formatTime(msg.time)}</Text>
                    </View>
                  </View>
                  <Text className={styles.messageDesc}>{msg.description}</Text>
                </View>
              ))}
            </View>
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>🔔</Text>
            <Text className={styles.emptyText}>暂无消息记录</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default MessagesPage;
