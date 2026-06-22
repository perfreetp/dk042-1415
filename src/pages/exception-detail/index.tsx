import React, { useState, useEffect } from 'react';
import { View, Text } from '@tarojs/components';
import Taro, { useRouter, useDidShow } from '@tarojs/taro';
import StatusTag from '@/components/StatusTag';
import { useAppStore } from '@/store';
import type { ExceptionRecord } from '@/types';
import styles from './index.module.scss';

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

const ExceptionDetailPage: React.FC = () => {
  const router = useRouter();
  const { getExceptionById, updateExceptionStatus, addMessage, todayRide } = useAppStore();
  const [record, setRecord] = useState<ExceptionRecord | null>(null);
  const [status, setStatus] = useState<ExceptionRecord['status']>('pending');

  const loadData = () => {
    const id = router.params.id;
    const found = getExceptionById(id);
    if (found) {
      setRecord(found);
      setStatus(found.status);
    }
    console.log('[ExceptionDetail] 加载异常详情，ID:', id);
  };

  useEffect(() => {
    loadData();
  }, [router.params.id]);

  useDidShow(() => {
    loadData();
  });

  const handleAcknowledge = () => {
    Taro.showModal({
      title: '确认知晓',
      content: '确认已知晓此异常情况？',
      success: (res) => {
        if (res.confirm && record) {
          updateExceptionStatus(record.id, 'acknowledged');
          setStatus('acknowledged');
          addMessage({
            type: 'exception',
            title: `已确认：${record.title}`,
            description: '家长已确认知晓',
            time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
            studentName: todayRide.student.name,
            relatedId: record.id
          });
          Taro.showToast({ title: '已确认', icon: 'success' });
          console.log('[ExceptionDetail] 家长确认知晓异常');
        }
      }
    });
  };

  const handleQuestion = () => {
    Taro.showModal({
      title: '联系学校',
      content: `有疑问可联系学校\n客服电话：400-123-4567\n工作时间：08:00-18:00`,
      showCancel: true,
      confirmText: '拨打电话',
      success: (res) => {
        if (res.confirm && record) {
          updateExceptionStatus(record.id, 'questioned');
          setStatus('questioned');
          addMessage({
            type: 'exception',
            title: `有疑问：${record.title}`,
            description: '家长对此有疑问，将联系学校',
            time: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-'),
            studentName: todayRide.student.name,
            relatedId: record.id
          });
          console.log('[ExceptionDetail] 家长标记有疑问');
        }
      }
    });
  };

  if (!record) {
    return (
      <View className={styles.pageContainer}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const isPending = status === 'pending';

  return (
    <View className={styles.pageContainer}>
      <View className={styles.exceptionHeader}>
        <Text className={styles.exceptionTypeIcon}>{getExceptionIcon(record.type)}</Text>
        <Text className={styles.exceptionTitle}>{record.title}</Text>
        <Text className={styles.exceptionTime}>{record.time}</Text>
      </View>

      <View className={styles.statusBanner}>
        <Text className={styles.statusLabel}>当前状态</Text>
        <StatusTag
          type={status === 'pending' ? 'warning' : status === 'acknowledged' ? 'success' : 'error'}
          text={status === 'pending' ? '待确认' : status === 'acknowledged' ? '已知晓' : '有疑问'}
        />
      </View>

      <View className={styles.sectionCard}>
        <Text className={styles.sectionTitle}>异常详情</Text>
        <View className={styles.detailItem}>
          <Text className={styles.detailLabel}>学生姓名</Text>
          <Text className={styles.detailValue}>{record.studentName}</Text>
        </View>
        <View className={styles.detailItem}>
          <Text className={styles.detailLabel}>异常类型</Text>
          <Text className={styles.detailValue}>{record.description}</Text>
        </View>
        {record.lineName && (
          <View className={styles.detailItem}>
            <Text className={styles.detailLabel}>涉及线路</Text>
            <Text className={styles.detailValue}>{record.lineName}</Text>
          </View>
        )}
      </View>

      <View className={styles.sectionCard}>
        <Text className={styles.sectionTitle}>确认人信息</Text>
        <View className={styles.confirmerSection}>
          <View className={styles.confirmerAvatar}>
            <Text className={styles.confirmerAvatarText}>
              {record.confirmerName.charAt(0)}
            </Text>
          </View>
          <View className={styles.confirmerInfo}>
            <Text className={styles.confirmerName}>{record.confirmerName}</Text>
            <Text className={styles.confirmerRole}>{record.confirmerRole}</Text>
          </View>
        </View>
        <View className={styles.reasonBox}>
          <Text className={styles.reasonText}>{record.reason}</Text>
        </View>
      </View>

      {isPending && (
        <View className={styles.bottomActions}>
          <View className={`${styles.actionBtn} ${styles.btnSecondary}`} onClick={handleQuestion}>
            <Text>有疑问联系学校</Text>
          </View>
          <View className={`${styles.actionBtn} ${styles.btnPrimary}`} onClick={handleAcknowledge}>
            <Text>知晓</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default ExceptionDetailPage;
