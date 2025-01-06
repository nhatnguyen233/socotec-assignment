import { IconButton } from '@chakra-ui/react';

interface CustomIconButtonProps {
  ariaLabel?: string;
  icon: React.ReactElement;
  onClick?: () => void;
  position?: 'absolute' | 'relative' | 'fixed' | 'sticky';
  top?: number | string;
  left?: number | string;
  right?: number | string;
  bottom?: number | string;
  color?: string;
}

export const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  ariaLabel = '',
  icon,
  onClick,
  position = 'absolute',
  top,
  left,
  right,
  bottom,
  color = 'white',
}) => {
  return (
    <IconButton
      aria-label={ariaLabel}
      icon={icon}
      variant="link"
      color={color}
      fontSize="2rem"
      position={position}
      top={top}
      left={left}
      right={right}
      bottom={bottom}
      onClick={onClick}
      sx={{
        '&:active': {
          color: 'teal.700', // Color on active
        },
      }}
    />
  );
};
