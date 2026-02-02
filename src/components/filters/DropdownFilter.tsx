import { ActionMenu, ActionList, Button, Box, Text } from '@primer/react';
import { ChevronDownIcon, CheckIcon } from '@primer/octicons-react';

interface DropdownFilterProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
}

export function DropdownFilter({
  label,
  options,
  selectedOptions,
  onToggle,
}: DropdownFilterProps) {
  const displayLabel =
    selectedOptions.length === 0
      ? label
      : selectedOptions.length === 1
      ? selectedOptions[0]
      : `${selectedOptions.length} selected`;

  return (
    <ActionMenu>
      <ActionMenu.Anchor>
        <Button trailingAction={ChevronDownIcon} sx={{ color: 'fg.default' }}>
          {displayLabel}
        </Button>
      </ActionMenu.Anchor>
      <ActionMenu.Overlay width="medium">
        <ActionList>
          {options.length === 0 ? (
            <ActionList.Item disabled>No options available</ActionList.Item>
          ) : (
            options.map((option) => (
              <ActionList.Item
                key={option}
                onSelect={() => onToggle(option)}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                >
                  <Text>{option}</Text>
                  {selectedOptions.includes(option) && (
                    <CheckIcon size={16} />
                  )}
                </Box>
              </ActionList.Item>
            ))
          )}
        </ActionList>
      </ActionMenu.Overlay>
    </ActionMenu>
  );
}
