import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import type { RideNode } from '@/types';
import styles from './index.module.scss';

interface RideTimelineProps {
  title: string;
  nodes: RideNode[];
}

const getNodeIcon = (type: RideNode['type'], status: RideNode['status']) => {
  if (status === 'done') {
    if (type === 'board') return '🚌';
    if (type === 'alight') return '✅';
    if (type === 'leave') return '🏫';
  }
  if (status === 'pending') return '⏳';
  if (status === 'missed') return '⚠️';
  return '📍';
};

const RideTimeline: React.FC<RideTimelineProps> = ({ title, nodes }) => {
  return (
    <View className={styles.timelineCard}>
      <View className={styles.cardHeader}>
        <Text className={styles.cardTitle}>{title}</Text>
      </View>
      <View className={styles.timelineContainer}>
        {nodes.map((node, index) => (
          <View key={node.id} className={styles.timelineItem}>
            <View className={styles.timelineLeft}>
              <View
                className={classnames(
                  styles.nodeDot,
                  node.status === 'done' && styles.dotDone,
                  node.status === 'pending' && styles.dotPending,
                  node.status === 'missed' && styles.dotMissed
                )}
              >
                <Text className={styles.nodeIcon}>{getNodeIcon(node.type, node.status)}</Text>
              </View>
              {index < nodes.length - 1 && (
                <View
                  className={classnames(
                    styles.timelineLine,
                    node.status === 'done' && styles.lineDone
                  )}
                />
              )}
            </View>
            <View className={styles.timelineContent}>
              <View className={styles.nodeHeader}>
                <Text
                  className={classnames(
                    styles.nodeTitle,
                    node.status === 'pending' && styles.titlePending
                  )}
                >
                  {node.title}
                </Text>
                {node.time && (
                  <Text className={styles.nodeTime}>{node.time}</Text>
                )}
              </View>
              <Text className={styles.nodeStation}>{node.stationName}</Text>
              {node.lineName && (
                <View className={styles.lineBadge}>
                  <Text className={styles.lineBadgeText}>{node.lineName}</Text>
                </View>
              )}
              {node.description && (
                <Text className={styles.nodeDesc}>{node.description}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default RideTimeline;
