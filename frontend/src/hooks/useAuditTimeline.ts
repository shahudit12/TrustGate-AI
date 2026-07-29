import { useCallback } from 'react';
import { useAuditStore } from '../store/auditStore';
import { AuditEventType, AuditTimelineEntry } from '../types/audit';

export function useAuditTimeline() {
  const { timeline, startTimeline, addEvent: storeAddEvent, clearTimeline, getElapsedMs } = useAuditStore();

  const addEvent = useCallback((
    eventType: AuditEventType,
    description: string,
    status: AuditTimelineEntry['status'] = 'info',
    icon?: string
  ) => {
    let defaultIcon = '🔵';
    if (status === 'success') defaultIcon = '✅';
    if (status === 'error') defaultIcon = '❌';
    if (status === 'warning') defaultIcon = '⚠️';

    storeAddEvent(eventType, description, status, icon || defaultIcon);
  }, [storeAddEvent]);

  const exportTimeline = useCallback(() => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(timeline, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `audit-timeline-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }, [timeline]);

  return {
    timeline,
    startTimeline,
    addEvent,
    clearTimeline,
    getElapsedMs,
    exportTimeline
  };
}
