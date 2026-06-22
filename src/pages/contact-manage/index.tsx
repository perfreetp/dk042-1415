import React, { useState } from 'react';
import { View, Text, ScrollView, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import { useAppStore } from '@/store';
import type { ContactInfo } from '@/types';
import styles from './index.module.scss';

const ContactManagePage: React.FC = () => {
  const { contacts, addContact, updateContact, deleteContact, setPrimaryContact } = useAppStore();
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    phone: ''
  });

  const openAddModal = () => {
    setEditingContact(null);
    setFormData({ name: '', relation: '', phone: '' });
    setShowModal(true);
  };

  const openEditModal = (contact: ContactInfo) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      relation: contact.relation,
      phone: contact.phone
    });
    setShowModal(true);
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      Taro.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!formData.relation.trim()) {
      Taro.showToast({ title: '请输入关系', icon: 'none' });
      return;
    }
    if (!/^1\d{10}$/.test(formData.phone.replace(/\*/g, '0')) {
      if (formData.phone.length < 7) {
        Taro.showToast({ title: '请输入正确的手机号', icon: 'none' });
        return;
      }
    }

    if (editingContact) {
      updateContact({
        ...editingContact,
        name: formData.name,
        relation: formData.relation,
        phone: formData.phone
      });
      Taro.showToast({ title: '修改成功', icon: 'success' });
    } else {
      const newContact: ContactInfo = {
        id: `c-${Date.now()}`,
        name: formData.name,
        relation: formData.relation,
        phone: formData.phone,
        isPrimary: contacts.length === 0
      };
      addContact(newContact);
      Taro.showToast({ title: '添加成功', icon: 'success' });
    }
    setShowModal(false);
  };

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
    setPrimaryContact(id);
    Taro.showToast({ title: '设置成功', icon: 'success' });
    console.log('[ContactManage] 设置首要联系人，ID:', id);
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
          deleteContact(id);
          Taro.showToast({ title: '删除成功', icon: 'success' });
        }
      }
    });
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
                  <View className={styles.actionBtn} onClick={() => openEditModal(contact)}>
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
        <View className={styles.addBtnInner} onClick={openAddModal}>
          <Text>+ 添加联系人</Text>
        </View>
      </View>

      {showModal && (
        <View className={modalStyles.modalMask}>
          <View className={modalStyles.modalContent}>
            <Text className={modalStyles.modalTitle}>
              {editingContact ? '编辑联系人' : '添加联系人'}
            </Text>

            <View className={modalStyles.formItem}>
              <Text className={modalStyles.formLabel}>姓名</Text>
              <Input
                className={modalStyles.formInput}
                placeholder="请输入姓名"
                value={formData.name}
                onInput={(e) => setFormData({ ...formData, name: e.detail.value })}
                maxlength={20}
              />
            </View>

            <View className={modalStyles.formItem}>
              <Text className={modalStyles.formLabel}>关系</Text>
              <Input
                className={modalStyles.formInput}
                placeholder="如：父亲、母亲、爷爷"
                value={formData.relation}
                onInput={(e) => setFormData({ ...formData, relation: e.detail.value })}
                maxlength={10}
              />
            </View>

            <View className={modalStyles.formItem}>
              <Text className={modalStyles.formLabel}>手机号</Text>
              <Input
                className={modalStyles.formInput}
                type="number"
                placeholder="请输入手机号"
                value={formData.phone}
                onInput={(e) => setFormData({ ...formData, phone: e.detail.value })}
                maxlength={11}
              />
            </View>

            <View className={modalStyles.modalActions}>
              <View
                className={classnames(modalStyles.modalBtn, modalStyles.modalBtnCancel)}
                onClick={() => setShowModal(false)}
              >
                <Text>取消</Text>
              </View>
              <View
                className={classnames(modalStyles.modalBtn, modalStyles.modalBtnConfirm)}
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

const modalStyles = {
  modalMask: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999
  },
  modalContent: {
    width: '600rpx',
    backgroundColor: '#fff',
    borderRadius: '24rpx',
    padding: '40rpx',
    boxSizing: 'border-box' as const
  },
  modalTitle: {
    fontSize: '36rpx',
    fontWeight: 600,
    color: '#1d2129',
    textAlign: 'center' as const,
    marginBottom: '40rpx'
  },
  formItem: {
    marginBottom: '32rpx'
  },
  formLabel: {
    fontSize: '28rpx',
    color: '#4e5969',
    marginBottom: '16rpx',
    display: 'block'
  },
  formInput: {
    width: '100%',
    height: '80rpx',
    backgroundColor: '#f5f6f7',
    borderRadius: '12rpx',
    padding: '0 24rpx',
    fontSize: '28rpx',
    boxSizing: 'border-box' as const
  },
  modalActions: {
    display: 'flex' as const,
    gap: '24rpx',
    marginTop: '40rpx'
  },
  modalBtn: {
    flex: 1,
    height: '88rpx',
    borderRadius: '48rpx',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  modalBtnCancel: {
    backgroundColor: '#f2f3f5'
  },
  modalBtnConfirm: {
    backgroundColor: '#2E7DFF'
  }
};

export default ContactManagePage;
