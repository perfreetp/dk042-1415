import React, { useState } from 'react';
import { View, Text, Textarea } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';

const reasonOptions = [
  '身体不适',
  '家中有事',
  '外出旅行',
  '其他原因'
];

const LeaveRequestPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedReason, setSelectedReason] = useState<string>('');
  const [reasonText, setReasonText] = useState<string>('');

  const handleDateChange = () => {
    const today = new Date();
    const defaultDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    // 使用 Taro 的日期选择器
    // 这里我们用简单的方式模拟
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      dates.push(
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      );
    }

    Taro.showActionSheet({
      itemList: dates,
      success: (res) => {
        setSelectedDate(dates[res.tapIndex]);
      }
    });
  };

  const handleReasonTagClick = (reason: string) => {
    setSelectedReason(reason);
    if (reason !== '其他原因') {
      setReasonText(reason);
    }
  };

  const handleTextInput = (e: any) => {
    setReasonText(e.detail.value);
  };

  const canSubmit = selectedDate && reasonText.trim().length > 0;

  const handleSubmit = () => {
    if (!canSubmit) {
      Taro.showToast({ title: '请填写完整信息', icon: 'none' });
      return;
    }

    console.log('[LeaveRequest] 提交请假申请', {
      date: selectedDate,
      reason: reasonText
    });

    Taro.showModal({
      title: '提交确认',
      content: `确认请假日期：${selectedDate}\n请假原因：${reasonText}`,
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '提交成功', icon: 'success' });
          setTimeout(() => {
            Taro.navigateBack();
          }, 1500);
        }
      }
    });
  };

  return (
    <View className={styles.pageContainer}>
      <View className={styles.formSection}>
        <Text className={styles.sectionTitle}>请假信息</Text>

        <View className={styles.formItem} onClick={handleDateChange}>
          <Text className={styles.formLabel}>请假日期</Text>
          <View className={styles.formValue}>
            <View className={styles.datePicker}>
              {selectedDate ? (
                <Text className={styles.dateText}>{selectedDate}</Text>
              ) : (
                <Text className={styles.datePlaceholder}>请选择请假日期</Text>
              )}
              <Text className={styles.arrowIcon}>›</Text>
            </View>
          </View>
        </View>

        <View className={styles.formItem}>
          <Text className={styles.formLabel}>请假原因</Text>
          <View className={styles.formValue}>
            <View className={styles.reasonTags}>
              {reasonOptions.map((reason) => (
                <View
                  key={reason}
                  className={classnames(
                    styles.reasonTag,
                    selectedReason === reason && styles.active
                  )}
                  onClick={() => handleReasonTagClick(reason)}
                >
                  <Text className={styles.reasonTagText}>{reason}</Text>
                </View>
              ))}
            </View>
            <Textarea
              className={styles.textarea}
              placeholder="请详细描述请假原因..."
              placeholderClass={styles.textareaPlaceholder}
              value={reasonText}
              onInput={handleTextInput}
              maxlength={200}
              autoHeight
            />
            <Text className={styles.charCount}>{reasonText.length}/200</Text>
          </View>
        </View>
      </View>

      <View className={styles.tipsSection}>
        <Text className={styles.tipsTitle}>温馨提示</Text>
        <Text className={styles.tipsContent}>
          1. 请提前至少2小时提交请假申请
        </Text>
        <Text className={styles.tipsContent}>
          2. 请假申请提交后，学校会尽快审核
        </Text>
        <Text className={styles.tipsContent}>
          3. 如有紧急情况，请直接联系班主任
        </Text>
      </View>

      <View className={styles.bottomBar}>
        <View
          className={classnames(styles.submitBtn, !canSubmit && styles.disabled)}
          onClick={handleSubmit}
        >
          <Text className={styles.submitBtnText}>提交申请</Text>
        </View>
      </View>
    </View>
  );
};

export default LeaveRequestPage;
