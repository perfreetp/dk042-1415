import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { stationListData } from '@/data/mock';
import type { StationInfo } from '@/types';
import styles from './index.module.scss';

const StationManagePage: React.FC = () => {
  const [stations, setStations] = useState<StationInfo[]>(stationListData);

  const getTypeTagText = (type: StationInfo['type']) => {
    switch (type) {
      case 'board':
        return '上车点';
      case 'alight':
        return '下车点';
      case 'both':
        return '上下车点';
      default:
        return '';
    }
  };

  const getTypeTagClass = (type: StationInfo['type']) => {
    switch (type) {
      case 'alight':
        return 'tagAlight';
      case 'both':
        return 'tagBoth';
      default:
        return '';
    }
  };

  const handleSetDefault = (id: string) => {
    setStations((prev) =>
      prev.map((s) => ({
        ...s,
        isDefault: s.id === id ? true : s.isDefault
      }))
    );
    Taro.showToast({ title: '设置成功', icon: 'success' });
    console.log('[StationManage] 设置默认站点，ID:', id);
  };

  const handleEdit = (station: StationInfo) => {
    Taro.showToast({ title: '编辑功能开发中', icon: 'none' });
  };

  const handleDelete = (id: string) => {
    Taro.showModal({
      title: '删除站点',
      content: '确认删除该站点吗？',
      success: (res) => {
        if (res.confirm) {
          setStations((prev) => prev.filter((s) => s.id !== id));
          Taro.showToast({ title: '删除成功', icon: 'success' });
          console.log('[StationManage] 删除站点，ID:', id);
        }
      }
    });
  };

  const handleAdd = () => {
    Taro.showToast({ title: '添加功能开发中', icon: 'none' });
  };

  const boardStations = stations.filter((s) => s.type !== 'alight');
  const alightStations = stations.filter((s) => s.type !== 'board');

  const renderStationCard = (station: StationInfo) => (
    <View key={station.id} className={styles.stationCard}>
      <View className={styles.stationHeader}>
        <Text className={styles.stationName}>{station.name}</Text>
        <View className={classnames(styles.typeTag, styles[getTypeTagClass(station.type)])}>
          <Text>{getTypeTagText(station.type)}</Text>
        </View>
      </View>
      <Text className={styles.stationAddress}>{station.address}</Text>
      <View className={styles.stationFooter}>
        <View className={styles.defaultBadge}>
          {station.isDefault && (
            <>
              <View className={styles.defaultDot} />
              <Text className={styles.defaultText}>默认站点</Text>
            </>
          )}
        </View>
        <View className={styles.actionBtns}>
          {!station.isDefault && (
            <View
              className={classnames(styles.actionBtn, styles.btnPrimary)}
              onClick={() => handleSetDefault(station.id)}
            >
              <Text>设为默认</Text>
            </View>
          )}
          <View className={styles.actionBtn} onClick={() => handleEdit(station)}>
            <Text>编辑</Text>
          </View>
          <View className={styles.actionBtn} onClick={() => handleDelete(station.id)}>
            <Text>删除</Text>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View className={styles.pageContainer}>
      <ScrollView scrollY>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>上车点</Text>
          {boardStations.length > 0 ? (
            boardStations.map(renderStationCard)
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📍</Text>
              <Text className={styles.emptyText}>暂无上车点</Text>
            </View>
          )}
        </View>

        <View className={styles.section}>
          <Text className={styles.sectionTitle}>下车点</Text>
          {alightStations.length > 0 ? (
            alightStations.map(renderStationCard)
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>📍</Text>
              <Text className={styles.emptyText}>暂无下车点</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className={styles.addBtn}>
        <View className={styles.addBtnInner} onClick={handleAdd}>
          <Text>+ 添加站点</Text>
        </View>
      </View>
    </View>
  );
};

export default StationManagePage;
