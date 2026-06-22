import React, { useState } from 'react';
import { View, Text, Image, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import RideTimeline from '@/components/RideTimeline';
import { useAppStore } from '@/store';
import type { TodayRideInfo } from '@/types';
import styles from './index.module.scss';

const RideTodayPage: React.FC = () => {
  const { todayRide } = useAppStore();
  const [, forceUpdate] = useState(0);

  useDidShow(() => {
    console.log('[RideToday] 页面展示，刷新数据');
    forceUpdate((v) => v + 1);
  });

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = weekdays[date.getDay()];
    return `${month}月${day}日 ${weekday}`;
  };

  const getOverallStatus = () => {
    if (!todayRide) return { text: '加载中...', type: 'pending' };
    if (todayRide.isLeaveRequested) return { text: '今日请假', type: 'leave' };

    const allDone =
      todayRide.afternoonNodes.length > 0 &&
      todayRide.afternoonNodes.every((node) => node.status === 'done');
    const morningDone = todayRide.morningNodes.every((node) => node.status === 'done');

    if (allDone) return { text: '已安全到家', type: 'done' };
    if (morningDone) return { text: '在校中', type: 'school' };
    return { text: '待乘车', type: 'pending' };
  };

  const status = getOverallStatus();

  if (!todayRide) {
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
        console.log('[RideToday] 下拉刷新');
        forceUpdate((v) => v + 1);
        setTimeout(() => {
          Taro.stopPullDownRefresh();
        }, 800);
      }}
    >
      <View className={styles.studentCard}>
        <View className={styles.studentInfo}>
          <Image
            className={styles.studentAvatar}
            src={todayRide.student.avatar}
            mode="aspectFill"
          />
          <View className={styles.studentDetail}>
            <Text className={styles.studentName}>{todayRide.student.name}</Text>
            <Text className={styles.studentClass}>
              {todayRide.student.grade} {todayRide.student.className}
            </Text>
            <Text className={styles.studentNo}>
              学号：{todayRide.student.studentNo}
            </Text>
          </View>
        </View>
        <View className={styles.dateRow}>
          <Text className={styles.dateText}>{formatDate(todayRide.date)}</Text>
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

      {todayRide.isLeaveRequested ? (
        <View className={styles.leaveBanner}>
          <Text className={styles.leaveIcon}>📝</Text>
          <View className={styles.leaveContent}>
            <Text className={styles.leaveTitle}>今日已请假</Text>
            <Text className={styles.leaveReason}>{todayRide.leaveReason || '家长已申请请假'}</Text>
          </View>
        </View>
      ) : (
        <>
          <View className={styles.timelineSection}>
            <RideTimeline title="上午行程" nodes={todayRide.morningNodes} />
          </View>
          <View className={styles.timelineSection}>
            <RideTimeline title="下午行程" nodes={todayRide.afternoonNodes} />
          </View>
        </>
      )}
    </ScrollView>
  );
};

export default RideTodayPage;
