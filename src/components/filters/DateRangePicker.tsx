import { useState } from 'react';
import { Box, Button, Dialog, TextInput, FormControl } from '@primer/react';
import { format, parseISO, isValid } from 'date-fns';
import { DateRange } from '@/pages/insights/types';

interface DateRangePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (dateRange: DateRange) => void;
  initialDateRange?: DateRange;
}

export function DateRangePicker({
  isOpen,
  onClose,
  onApply,
  initialDateRange,
}: DateRangePickerProps) {
  const [startDate, setStartDate] = useState(
    initialDateRange ? format(initialDateRange.startDate, 'yyyy-MM-dd') : ''
  );
  const [endDate, setEndDate] = useState(
    initialDateRange ? format(initialDateRange.endDate, 'yyyy-MM-dd') : ''
  );
  const [error, setError] = useState<string | null>(null);

  const handleApply = () => {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    if (!isValid(start) || !isValid(end)) {
      setError('Please enter valid dates');
      return;
    }

    if (start > end) {
      setError('Start date must be before end date');
      return;
    }

    onApply({ startDate: start, endDate: end });
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      onDismiss={onClose}
      aria-labelledby="date-range-dialog"
    >
      <Dialog.Header id="date-range-dialog">Custom Date Range</Dialog.Header>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <FormControl>
            <FormControl.Label>Start Date</FormControl.Label>
            <TextInput
              type="date"
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
                setError(null);
              }}
              block
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>End Date</FormControl.Label>
            <TextInput
              type="date"
              value={endDate}
              onChange={(e) => {
                setEndDate(e.target.value);
                setError(null);
              }}
              block
            />
          </FormControl>
          {error && (
            <Box sx={{ color: 'danger.fg', fontSize: 1 }}>{error}</Box>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 3,
          }}
        >
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="primary" onClick={handleApply}>
            Apply
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
