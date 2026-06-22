import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import classnames from 'classnames';
import ExceptionCard from '@/components/ExceptionCard';
import { useAppStore } from '@/store';
import type { ExceptionRecord, ExceptionStatus } from '@/types';
import styles from './index.module.scss';

type FilterType = 'all' | ExceptionStatus;

const ExceptionPage: React.FC = () => {
  const { exceptions } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useDidShow(() => {
    console.log('[Exception] 页面展示，刷新异常列表');
  });

  const filteredList = exceptions.filter((item) => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  const pendingCount = exceptions.filter((item) => item.status === 'pending').length;
  const acknowledgedCount = exceptions.filter(
    (item) => item.status === 'acknowledged'
  ).length;
  const questionedCount = exceptions.filter((item) => item.status === 'questioned').length;

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待确认' },
    { key: 'acknowledged', label: '已知晓' },
    { key: 'questioned', label: '有疑问' }
  ];

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.headerSection}>
        <View className={styles.summaryCard}>
          <View className={styles.summaryItem}>
            <Text className={classnames(styles.summaryNumber, styles.warning)}>{pendingCount}</Text>
            <Text className={styles.summaryLabel}>待确认</Text>
          </View>
          <View className={styles.summaryDivider} />
          <View className={styles.summaryItem}>
            <Text className={classnames(styles.summaryNumber, styles.success)}>
              {acknowledgedCount}
            </Text>
            <Text className={styles.summaryLabel}>已知晓</Text>
          </View>
          <View className={styles.summaryDivider} />
          <View className={styles.summaryItem}>
            <Text className={classnames(styles.summaryNumber, styles.error)}>
              {questionedCount}
            </Text>
            <Text className={styles.summaryLabel}>有疑问</Text>
          </View>
        </View>
      </View>

      <View className={styles.filterTabs}>
        {filters.map((filter) => (
          <View
            key={filter.key}
            className={classnames(styles.filterTab, activeFilter === filter.key && styles.active)}
            onClick={() => setActiveFilter(filter.key)}
          >
            <Text className={styles.filterTabText}>{filter.label}</Text>
          </View>
        ))}
      </View>

      <View className={styles.listContainer}>
        <Text className={styles.listTitle}>异常记录</Text>
        {filteredList.length > 0 ? (
          filteredList.map((record: ExceptionRecord) => (
            <ExceptionCard key={record.id} record={record} />
          ))
        ) : (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>暂无异常记录</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ExceptionPage;
