import React, { useState } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import type { StationInfo } from '@/types';
import styles from './index.module.scss';

const canBoardType = (type: StationInfo['type']) => type === 'board' || type === 'both';
const canAlightType = (type: StationInfo['type']) => type === 'alight' || type === 'both';

const StationManagePage: React.FC = () => {
  const {
    stations,
    addStation,
    updateStation,
    deleteStation,
    setDefaultBoardStation,
    setDefaultAlightStation
  } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [editingStation, setEditingStation] = useState<StationInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    type: 'board' as 'board' | 'alight' | 'both'
  });

  const openAddModal = () => {
    setEditingStation(null);
    setFormData({ name: '', address: '', type: 'board' });
    setShowModal(true);
  };

  const openEditModal = (station: StationInfo) => {
    setEditingStation(station);
    setFormData({
      name: station.name,
      address: station.address,
      type: station.type
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请输入站点名称', icon: 'none' });
      return;
    }
    if (!formData.address.trim()) {
      Taro.showToast({ title: '请输入站点地址', icon: 'none' });
      return;
    }

    if (editingStation) {
      updateStation({
        ...editingStation,
        name: formData.name,
        address: formData.address,
        type: formData.type
      });
      Taro.showToast({ title: '修改成功', icon: 'success' });
    } else {
      const newStation: StationInfo = {
        id: `st-${Date.now()}`,
        name: formData.name,
        address: formData.address,
        type: formData.type,
        isDefaultBoard: false,
        isDefaultAlight: false
      };
      addStation(newStation);
      Taro.showToast({ title: '添加成功', icon: 'success' });
    }
    setShowModal(false);
  };

  const handleSetDefaultBoard = (id: string) => {
    setDefaultBoardStation(id);
    Taro.showToast({ title: '已设为默认上车点', icon: 'success' });
    console.log('[StationManage] 设置默认上车点，ID:', id);
  };

  const handleSetDefaultAlight = (id: string) => {
    setDefaultAlightStation(id);
    Taro.showToast({ title: '已设为默认下车点', icon: 'success' });
    console.log('[StationManage] 设置默认下车点，ID:', id);
  };

  const handleDelete = (id: string) => {
    const station = stations.find((s) => s.id === id);
    if (station?.isDefaultBoard || station?.isDefaultAlight) {
      Taro.showToast({ title: '默认站点不能删除，请先取消默认', icon: 'none' });
      return;
    }

    Taro.showModal({
      title: '删除站点',
      content: '确认删除该站点吗？',
      success: (res) => {
        if (res.confirm) {
          deleteStation(id);
          Taro.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
  };

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

  const boardStations = stations.filter((s) => s.type !== 'alight');
  const alightStations = stations.filter((s) => s.type !== 'board');

  const renderStationCard = (station: StationInfo) => {
    const isBoard = canBoardType(station.type);
    const isAlight = canAlightType(station.type);
    return (
      <View key={station.id} className={styles.stationCard}>
        <View className={styles.stationHeader}>
          <Text className={styles.stationName}>{station.name}</Text>
          <View className={classnames(styles.typeTag, styles[getTypeTagClass(station.type)])}>
            <Text>{getTypeTagText(station.type)}</Text>
          </View>
        </View>
        <Text className={styles.stationAddress}>{station.address}</Text>
        <View className={styles.defaultBadges}>
          {station.isDefaultBoard && (
            <View className={styles.defaultBadgeItem}>
              <View className={styles.defaultDot} />
              <Text className={styles.defaultText}>默认上车点</Text>
            </View>
          )}
          {station.isDefaultAlight && (
            <View className={classnames(styles.defaultBadgeItem, styles.badgeAlight)}>
              <View className={styles.defaultDot} />
              <Text className={styles.defaultText}>默认下车点</Text>
            </View>
          )}
        </View>
        <View className={styles.stationFooter}>
          <View className={styles.actionBtns}>
            {isBoard && !station.isDefaultBoard && (
              <View
                className={classnames(styles.actionBtn, styles.btnPrimary)}
                onClick={() => handleSetDefaultBoard(station.id)}
              >
                <Text>设为默认上车点</Text>
              </View>
            )}
            {isAlight && !station.isDefaultAlight && (
              <View
                className={classnames(styles.actionBtn, styles.btnPrimary)}
                onClick={() => handleSetDefaultAlight(station.id)}
              >
                <Text>设为默认下车点</Text>
              </View>
            )}
            <View className={styles.actionBtn} onClick={() => openEditModal(station)}>
              <Text>编辑</Text>
            </View>
            <View className={styles.actionBtn} onClick={() => handleDelete(station.id)}>
              <Text>删除</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

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
        <View className={styles.addBtnInner} onClick={openAddModal}>
          <Text>+ 添加站点</Text>
        </View>
      </View>

      {showModal && (
        <View className={styles.modalMask}>
          <View className={styles.modalContent}>
            <Text className={styles.modalTitle}>
              {editingStation ? '编辑站点' : '添加站点'}
            </Text>

            <View className={styles.modalFormItem}>
              <Text className={styles.modalFormLabel}>站点名称</Text>
              <Input
                className={styles.modalFormInput}
                placeholder="请输入站点名称"
                value={formData.name}
                onInput={(e) => setFormData({ ...formData, name: e.detail.value })}
                maxlength={20}
              />
            </View>

            <View className={styles.modalFormItem}>
              <Text className={styles.modalFormLabel}>站点地址</Text>
              <Input
                className={styles.modalFormInput}
                placeholder="请输入站点地址"
                value={formData.address}
                onInput={(e) => setFormData({ ...formData, address: e.detail.value })}
                maxlength={50}
              />
            </View>

            <View className={styles.modalFormItem}>
              <Text className={styles.modalFormLabel}>站点类型</Text>
              <View className={styles.typeOptions}>
                {[
                  { key: 'board', label: '上车点' },
                  { key: 'alight', label: '下车点' },
                  { key: 'both', label: '上下车点' }
                ].map((opt) => (
                  <View
                    key={opt.key}
                    className={classnames(
                      styles.typeOption,
                      formData.type === opt.key && styles.typeOptionActive
                    )}
                    onClick={() => setFormData({ ...formData, type: opt.key as any })}
                  >
                    <Text className={styles.typeOptionText}>{opt.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View className={styles.modalActions}>
              <View
                className={classnames(styles.modalBtn, styles.modalBtnCancel)}
                onClick={() => setShowModal(false)}
              >
                <Text>取消</Text>
              </View>
              <View
                className={classnames(styles.modalBtn, styles.modalBtnConfirm)}
                onClick={handleSubmit}
              >
                <Text>确定</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default StationManagePage;
