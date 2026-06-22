import React from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import SettingItem from '@/components/SettingItem';
import StatusTag from '@/components/StatusTag';
import { useAppStore } from '@/store';
import styles from './index.module.scss';

const SettingsPage: React.FC = () => {
  const {
    stations,
    contacts,
    leaveRecords,
    getDefaultBoardStation,
    getDefaultAlightStation
  } = useAppStore();

  useDidShow(() => {
    console.log('[Settings] 页面展示，刷新数据');
  });

  const handleLeaveRequest = () => {
    Taro.navigateTo({ url: '/pages/leave-request/index' });
  };

  const handleStationManage = () => {
    Taro.navigateTo({ url: '/pages/station-manage/index' });
  };

  const handleContactManage = () => {
    Taro.navigateTo({ url: '/pages/contact-manage/index' });
  };

  const handleMessageList = () => {
    Taro.navigateTo({ url: '/pages/messages/index' });
  };

  const handleContactSchool = () => {
    Taro.showModal({
      title: '联系学校',
      content: '客服电话：400-123-4567\n工作日：08:00-18:00',
      showCancel: true,
      confirmText: '拨打'
    });
  };

  const defaultBoardStation = getDefaultBoardStation();
  const defaultAlightStation = getDefaultAlightStation();
  const primaryContact = contacts.find((c) => c.isPrimary);

  return (
    <ScrollView className={styles.pageContainer} scrollY>
      <View className={styles.headerSection}>
        <View className={styles.quickActions}>
          <View className={`${styles.quickActionCard} ${styles.primaryAction}`} onClick={handleLeaveRequest}>
            <Text className={styles.actionIcon}>📝</Text>
            <Text className={styles.actionTitle}>申请请假</Text>
            <Text className={styles.actionDesc}>临时不坐车，提前告知</Text>
          </View>
          <View className={styles.quickActionCard} onClick={handleMessageList}>
            <Text className={styles.actionIcon}>�</Text>
            <Text className={styles.actionTitle}>消息记录</Text>
            <Text className={styles.actionDesc}>查看所有通知消息</Text>
          </View>
        </View>
      </View>

      <Text className={styles.sectionTitle}>接送设置</Text>
      <View className={styles.settingsGroup}>
        <SettingItem
          icon="📍"
          title="上下车点"
          desc="设置常用的上车站点和下车站点"
          type="navigate"
          isFirst
          onClick={handleStationManage}
        />
        <View className={styles.stationsPreview}>
          <View className={styles.stationItem}>
            <Text className={styles.stationLabel}>上车点</Text>
            <Text className={styles.stationName}>
              {defaultBoardStation?.name || '未设置'}
            </Text>
          </View>
          <View className={styles.stationItem}>
            <Text className={styles.stationLabel}>下车点</Text>
            <Text className={styles.stationName}>
              {defaultAlightStation?.name || '未设置'}
            </Text>
          </View>
        </View>

        <SettingItem
          icon="👥"
          title="紧急联系人"
          desc={primaryContact ? `首要联系人：${primaryContact.name}` : '设置可联系的紧急联系人'}
          type="navigate"
          onClick={handleContactManage}
        />
        <View className={styles.contactsPreview}>
          {contacts.slice(0, 2).map((contact) => (
            <View key={contact.id} className={styles.contactItem}>
              <View className={styles.contactAvatar}>
                <Text className={styles.contactAvatarText}>
                  {contact.name.charAt(0)}
                </Text>
              </View>
              <View className={styles.contactInfo}>
                <Text className={styles.contactName}>
                  {contact.name}
                  {contact.isPrimary && (
                    <View className={styles.primaryBadge}>
                      <Text>首选</Text>
                    </View>
                  )}
                </Text>
                <Text className={styles.contactRelation}>{contact.relation}</Text>
              </View>
              <Text className={styles.contactPhone}>{contact.phone}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text className={styles.sectionTitle}>请假记录</Text>
      <View className={styles.leaveRecords}>
        {leaveRecords.length > 0 ? (
          leaveRecords.map((record) => (
            <View key={record.id} className={styles.leaveRecordItem}>
              <View className={styles.leaveRecordInfo}>
                <Text className={styles.leaveRecordDate}>{record.date}</Text>
                <Text className={styles.leaveRecordReason}>{record.reason}</Text>
              </View>
              <View className={styles.leaveRecordStatus}>
                <StatusTag
                  type={record.status === 'approved' ? 'success' : record.status === 'rejected' ? 'error' : 'warning'}
                  text={record.status === 'approved' ? '已批准' : record.status === 'rejected' ? '已拒绝' : '待审批'}
                  size="sm"
                />
              </View>
            </View>
          ))
        ) : (
          <View style={{ textAlign: 'center', padding: '40rpx', color: '#86909C' }}>
            <Text>暂无请假记录</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default SettingsPage;
