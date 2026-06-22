import React from 'react';
import { View, Text } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import type { ExceptionRecord } from '@/types';
import StatusTag from '@/components/StatusTag';
import styles from './index.module.scss';

interface ExceptionCardProps {
  record: ExceptionRecord;
  onClick?: (id: string) => void;
}

const getExceptionIcon = (type: ExceptionRecord['type']) => {
  switch (type) {
    case 'forgot_card':
      return '💳';
    case 'change_line':
      return '🔄';
    case 'teacher_confirm':
      return '👨‍🏫';
    case 'missed_ride':
      return '⚠️';
    default:
      return '📋';
  }
};

const getStatusTagType = (status: ExceptionRecord['status']) => {
  switch (status) {
    case 'pending':
      return 'warning' as const;
    case 'acknowledged':
      return 'success' as const;
    case 'questioned':
      return 'error' as const;
    default:
      return 'default' as const;
  }
};

const getStatusText = (status: ExceptionRecord['status']) => {
  switch (status) {
    case 'pending':
      return '待确认';
    case 'acknowledged':
      return '已知晓';
    case 'questioned':
      return '有疑问';
    default:
      return '';
  }
};

const ExceptionCard: React.FC<ExceptionCardProps> = ({ record, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(record.id);
    } else {
      Taro.navigateTo({
        url: `/pages/exception-detail/index?id=${record.id}`
      });
    }
  };

  return (
    <View
      className={classnames(
        styles.exceptionCard,
        record.status === 'pending' && styles.cardUnread
      )}
      onClick={handleClick}
    >
      <View className={styles.cardHeader}>
        <View className={styles.cardTitleRow}>
          <Text className={styles.exceptionIcon}>{getExceptionIcon(record.type)}</Text>
          <Text className={styles.cardTitle}>{record.title}</Text>
        </View>
        <StatusTag
          type={getStatusTagType(record.status)}
          text={getStatusText(record.status)}
          size="sm"
        />
      </View>
      <Text className={styles.cardDesc}>{record.description}</Text>
      <View className={styles.cardFooter}>
        <Text className={styles.confirmerInfo}>
          确认人：{record.confirmerName} · {record.confirmerRole}
        </Text>
        <Text className={styles.cardTime}>{record.time}</Text>
      </View>
      {record.status === 'pending' && (
        <View className={styles.pendingBadge}>
          <Text className={styles.pendingBadgeText}>请确认</Text>
        </View>
      )}
    </View>
  );
};

export default ExceptionCard;
