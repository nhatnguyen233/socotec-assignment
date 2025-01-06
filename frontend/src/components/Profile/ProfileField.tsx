import React from 'react';
import { Text, Input, FormErrorMessage, FormControl } from '@chakra-ui/react';
import { PasswordInput } from '@components/PasswordInput';

interface ProfileFieldProps {
  label: string;
  value: string;
  errorMessage?: string;
  isPasswordField?: boolean;
  isEditable?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileField: React.FC<ProfileFieldProps> = ({
  isEditable,
  label,
  value,
  isPasswordField,
  onChange,
  errorMessage,
}) => {
  return (
    <FormControl isInvalid={!!errorMessage} mb={4}>
      <Text fontSize="lg" fontWeight="semibold" color="teal.500" width="120px">
        {label}
      </Text>
      {/* Input or Display Section */}
      {isPasswordField ? (
        <PasswordInput
          value={value}
          onChange={onChange}
          isEditable={isEditable}
        />
      ) : (
        <Input
          flex={1}
          value={value}
          onChange={onChange}
          variant="outline"
          size="sm"
          readOnly={!isEditable}
          focusBorderColor="teal.500"
        />
      )}
      <FormErrorMessage>{errorMessage}</FormErrorMessage>
    </FormControl>
  );
};
