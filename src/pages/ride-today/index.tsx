import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import RideTimeline from '@/components/RideTimeline';
import { todayRideData } from '@/data/mock';
import type { TodayRideInfo } from '@/types';
import styles from './index.module.scss';

const RideTodayPage: React.FC = () => {
  const [rideData, setRideData] = useState<TodayRideInfo | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    console.log('[RideToday] 加载今日乘车数据');
    setTimeout(() => {
      setRideData(todayRideData);
    }, 300);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日 ${weekday}`;
  };

  const getOverallStatus = () => {
    if (!rideData) return { text: '加载中...', type: 'pending' };
    if (rideData.isLeaveRequested) return { text: '今日请假', type: 'leave' };

    const allDone =
      rideData.afternoonNodes.length > 0 &&
      rideData.afternoonNodes.every((node) => node.status === 'done');
    const morningDone = rideData.morningNodes.every((node) => node.status === 'done');

    if (allDone) return { text: '已安全到家', type: 'done' };
    if (morningDone) return { text: '在校中', type: 'school' };
    return { text: '待乘车', type: 'pending' };
  };

  const status = getOverallStatus();

  if (!rideData) {
    return (
      <View className={styles.pageContainer}>
        <View className={styles.emptyTip}>加载中...</View>
      </View>
    );
  }

  return (
    <ScrollView
      className={styles.pageContainer}
      scrollY
      refresherEnabled
      onRefresherRefresh={() => {
        loadData();
        setTimeout(() => {
          Taro.stopPullDownRefresh();
        }, 1000);
      }}
    >
      <View className={styles.studentCard}>
        <View className={styles.studentInfo}>
          <Image
            className={styles.studentAvatar}
            src={rideData.student.avatar}
            mode="aspectFill"
          />
          <View className={styles.studentDetail}>
            <Text className={styles.studentName}>{rideData.student.name}</Text>
            <Text className={styles.studentClass}>
              {rideData.student.grade} {rideData.student.className}
            </Text>
            <Text className={styles.studentNo}>
              学号：{rideData.student.studentNo}
            </Text>
          </View>
        </View>
        <View className={styles.dateRow}>
          <Text className={styles.dateText}>{formatDate(rideData.date)}</Text>
          <View className={styles.statusBadge}>
            <View
              className={styles.statusDot}
              style={{
                backgroundColor:
                  status.type === 'done' || status.type === 'school'
                    ? '#00E676'
                    : status.type === 'leave'
                    ? '#FF7D00'
                    : '#FFD700'
              }}
            />
            <Text className={styles.statusText}>{status.text}</Text>
          </View>
        </View>
      </View>

      {rideData.isLeaveRequested ? (
        <View className={styles.leaveBanner}>
          <Text className={styles.leaveIcon}>📝</Text>
          <View className={styles.leaveContent}>
            <Text className={styles.leaveTitle}>今日已请假</Text>
            <Text className={styles.leaveReason}>{rideData.leaveReason || '家长已申请请假'}</Text>
          </View>
        </View>
      ) : (
        <>
          <View className={styles.timelineSection}>
            <RideTimeline title="上午行程" nodes={rideData.morningNodes} />
          </View>
          <View className={styles.timelineSection}>
            <RideTimeline title="下午行程" nodes={rideData.afternoonNodes} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default RideTodayPage;
