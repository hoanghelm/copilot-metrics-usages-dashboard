import { SegmentedControl } from '@primer/react';
import { TimeFrame } from '@/pages/insights/types';

interface TimeFrameToggleProps {
  value: TimeFrame;
  onChange: (value: TimeFrame) => void;
}

export function TimeFrameToggle({ value, onChange }: TimeFrameToggleProps) {
  return (
    <SegmentedControl aria-label="Time frame">
      <SegmentedControl.Button
        selected={value === 'daily'}
        onClick={() => onChange('daily')}
      >
        Daily
      </SegmentedControl.Button>
      <SegmentedControl.Button
        selected={value === 'weekly'}
        onClick={() => onChange('weekly')}
      >
        Weekly
      </SegmentedControl.Button>
      <SegmentedControl.Button
        selected={value === 'monthly'}
        onClick={() => onChange('monthly')}
      >
        Monthly
      </SegmentedControl.Button>
    </SegmentedControl>
  );
}
