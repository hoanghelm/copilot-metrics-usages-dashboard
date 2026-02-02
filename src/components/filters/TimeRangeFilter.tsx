import { SegmentedControl, ActionMenu, ActionList, Button, Box } from '@primer/react';
import { CalendarIcon, ChevronDownIcon } from '@primer/octicons-react';
import { TimeRange } from '@/pages/insights/types';
import { format } from 'date-fns';

interface TimeRangeFilterProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
  customDateRange?: {
    startDate: Date;
    endDate: Date;
  };
  onCustomDateClick?: () => void;
  variant?: 'segmented' | 'dropdown';
}

const SEGMENTED_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: '7_days', label: '7d' },
  { value: '14_days', label: '14d' },
  { value: '28_days', label: '28d' },
];

const DROPDOWN_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: 'current_month', label: 'Current month' },
  { value: 'previous_month', label: 'Previous month' },
  { value: '3_months', label: 'Last 3 months' },
  { value: '6_months', label: 'Last 6 months' },
  { value: '1_year', label: 'Last year' },
  { value: 'custom', label: 'Custom range' },
];

export function TimeRangeFilter({
  value,
  onChange,
  customDateRange,
  onCustomDateClick,
  variant = 'segmented',
}: TimeRangeFilterProps) {
  const getDisplayLabel = () => {
    if (value === 'custom' && customDateRange) {
      return `${format(customDateRange.startDate, 'MMM d, yyyy')} - ${format(
        customDateRange.endDate,
        'MMM d, yyyy'
      )}`;
    }
    const allOptions = [...SEGMENTED_OPTIONS, ...DROPDOWN_OPTIONS];
    return allOptions.find((opt) => opt.value === value)?.label || 'Last 28 days';
  };

  if (variant === 'segmented') {
    const selectedIndex = SEGMENTED_OPTIONS.findIndex((opt) => opt.value === value);

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <SegmentedControl
          aria-label="Time period"
          onChange={(index) => {
            onChange(SEGMENTED_OPTIONS[index].value);
          }}
        >
          {SEGMENTED_OPTIONS.map((option, index) => (
            <SegmentedControl.Button
              key={option.value}
              selected={selectedIndex === index}
            >
              {option.label}
            </SegmentedControl.Button>
          ))}
        </SegmentedControl>
        {onCustomDateClick && (
          <Button
            variant="invisible"
            leadingVisual={CalendarIcon}
            onClick={onCustomDateClick}
            sx={{ color: 'fg.muted' }}
            size="small"
          >
            Custom
          </Button>
        )}
      </Box>
    );
  }

  return (
    <ActionMenu>
      <ActionMenu.Anchor>
        <Button
          leadingVisual={CalendarIcon}
          trailingAction={ChevronDownIcon}
          sx={{ color: 'fg.default' }}
        >
          {getDisplayLabel()}
        </Button>
      </ActionMenu.Anchor>
      <ActionMenu.Overlay width="medium">
        <ActionList selectionVariant="single">
          {DROPDOWN_OPTIONS.map((option) => (
            <ActionList.Item
              key={option.value}
              selected={value === option.value}
              onSelect={() => {
                if (option.value === 'custom' && onCustomDateClick) {
                  onCustomDateClick();
                } else {
                  onChange(option.value);
                }
              }}
            >
              {option.label}
            </ActionList.Item>
          ))}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  );
}
