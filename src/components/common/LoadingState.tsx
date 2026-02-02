import { Box, Spinner, Text } from '@primer/react';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 400,
        gap: 3,
      }}
    >
      <Spinner size="large" />
      <Text sx={{ color: 'fg.muted' }}>{message}</Text>
    </Box>
  );
}
