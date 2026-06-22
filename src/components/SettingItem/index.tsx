import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { SettingItem } from '@/types';
import styles from './index.module.scss';

interface SettingItemProps extends SettingItem {
  onClick?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}

const SettingItemComponent: React.FC<SettingItemProps> = ({
  title,
  value,
  type = 'navigate',
  icon,
  desc,
  onClick,
  isFirst = false,
  isLast = false
}) => {
  return (
    <View
      className={classnames(
        styles.settingItem,
        isFirst && styles.firstItem,
        isLast && styles.lastItem,
        type === 'navigate' && styles.clickable
      )}
      onClick={onClick}
    >
      <View className={styles.itemLeft}>
        {icon && <Text className={styles.itemIcon}>{icon}</Text>}
        <View className={styles.itemContent}>
          <Text className={styles.itemTitle}>{title}</Text>
          {desc && <Text className={styles.itemDesc}>{desc}</Text>}
        </View>
      </View>
      <View className={styles.itemRight}>
        {value && <Text className={styles.itemValue}>{value}</Text>}
        {type === 'navigate' && <Text className={styles.arrowIcon}>›</Text>}
      </View>
    </View>
  );
};

export default SettingItemComponent;
