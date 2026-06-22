import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';

type TagType = 'success' | 'warning' | 'error' | 'info' | 'pending' | 'default';

interface StatusTagProps {
  type?: TagType;
  text: string;
  size?: 'sm' | 'md';
}

const StatusTag: React.FC<StatusTagProps> = ({ type = 'default', text, size = 'md' }) => {
  return (
    <View
      className={classnames(styles.tag, styles[`tag${type.charAt(0).toUpperCase() + type.slice(1)}`], styles[`size${size.charAt(0).toUpperCase() + size.slice(1)}`])}
    >
      <Text className={styles.tagText}>{text}</Text>
    </View>
  );
};

export default StatusTag;
