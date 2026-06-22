import React, { useState } from 'react';
import { View, Text, ScrollView } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { contactListData } from '@/data/mock';
import type { ContactInfo } from '@/types';
import styles from './index.module.scss';

const ContactManagePage: React.FC = () => {
  const [contacts, setContacts] = useState<ContactInfo[]>(contactListData);

  const handleCall = (phone: string) => {
    Taro.showModal({
      title: '拨打电话',
      content: `确认拨打 ${phone}？`,
      success: (res) => {
        if (res.confirm) {
          console.log('[ContactManage] 拨打电话:', phone);
          Taro.showToast({ title: '正在呼叫...', icon: 'none' });
        }
      }
    });
  };

  const handleSetPrimary = (id: string) => {
    setContacts((prev) =>
      prev.map((c) => ({
        ...c,
        isPrimary: c.id === id ? true : false
      }))
    );
    Taro.showToast({ title: '设置成功', icon: 'success' });
    console.log('[ContactManage] 设置首要联系人，ID:', id);
  };

  const handleEdit = (contact: ContactInfo) => {
    Taro.showToast({ title: '编辑功能开发中', icon: 'none' });
  };

  const handleDelete = (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact?.isPrimary) {
      Taro.showToast({ title: '首要联系人不能删除', icon: 'none' });
      return;
    }

    Taro.showModal({
      title: '删除联系人',
      content: '确认删除该联系人吗？',
      success: (res) => {
        if (res.confirm) {
          setContacts((prev) => prev.filter((c) => c.id !== id));
          Taro.showToast({ title: '删除成功', icon: 'success' });
          console.log('[ContactManage] 删除联系人，ID:', id);
        }
      }
    });
  };

  const handleAdd = () => {
    Taro.showToast({ title: '添加功能开发中', icon: 'none' });
  };

  return (
    <View className={styles.pageContainer}>
      <ScrollView scrollY>
        <View className={styles.section}>
          <Text className={styles.sectionTitle}>紧急联系人</Text>
          {contacts.length > 0 ? (
            contacts.map((contact) => (
              <View key={contact.id} className={styles.contactCard}>
                <View className={styles.contactHeader}>
                  <View className={styles.contactAvatar}>
                    <Text className={styles.contactAvatarText}>
                      {contact.name.charAt(0)}
                    </Text>
                  </View>
                  <View className={styles.contactInfo}>
                    <View className={styles.contactName}>
                      <Text>{contact.name}</Text>
                      {contact.isPrimary && (
                        <View className={styles.primaryBadge}>
                          <Text>首要联系人</Text>
                        </View>
                      )}
                    </View>
                    <Text className={styles.contactRelation}>{contact.relation}</Text>
                  </View>
                </View>
                <View className={styles.contactDetail}>
                  <Text className={styles.detailLabel}>联系电话</Text>
                  <Text className={styles.detailValue}>{contact.phone}</Text>
                  <View className={styles.phoneBtn} onClick={() => handleCall(contact.phone)}>
                    <Text>📞 拨打</Text>
                  </View>
                </View>
                <View className={styles.actionRow}>
                  {!contact.isPrimary && (
                    <View
                      className={classnames(styles.actionBtn, styles.btnPrimary)}
                      onClick={() => handleSetPrimary(contact.id)}
                    >
                      <Text>设为首要</Text>
                    </View>
                  )}
                  <View className={styles.actionBtn} onClick={() => handleEdit(contact)}>
                    <Text>编辑</Text>
                  </View>
                  <View className={styles.actionBtn} onClick={() => handleDelete(contact.id)}>
                    <Text>删除</Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>👥</Text>
              <Text className={styles.emptyText}>暂无紧急联系人</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className={styles.addBtn}>
        <View className={styles.addBtnInner} onClick={handleAdd}>
          <Text>+ 添加联系人</Text>
        </View>
      </View>
    </View>
  );
};

export default ContactManagePage;
