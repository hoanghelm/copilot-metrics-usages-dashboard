import { Box, Header as PrimerHeader, Text } from '@primer/react';
import { CopilotIcon } from '@primer/octicons-react';

export function Header() {
  return (
    <PrimerHeader
      sx={{
        bg: 'canvas.inset',
        borderBottom: '1px solid',
        borderColor: 'border.default',
        px: 4,
      }}
    >
      <PrimerHeader.Item>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <CopilotIcon size={24} />
          <Text sx={{ fontWeight: 'semibold', fontSize: 2 }}>
            Copilot Usage Metrics
          </Text>
        </Box>
      </PrimerHeader.Item>
    </PrimerHeader>
  );
}
