import React, { useState } from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

interface PasswordInputProps {
  isEditable?: boolean;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  value,
  isEditable,
  onChange,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <InputGroup flex={1}>
      <InputRightElement>
        <IconButton
          aria-label={isPasswordVisible ? "Hide Password" : "Show Password"}
          icon={isPasswordVisible ? <ViewOffIcon /> : <ViewIcon />}
          onClick={handleTogglePasswordVisibility}
          variant="link"
          size="sm"
        />
      </InputRightElement>
      <Input
        type={isPasswordVisible ? "text" : "password"}
        value={value}
        readOnly={!isEditable}
        onChange={onChange}
        pr="4.5rem" // Space for the icon button
      />
    </InputGroup>
  );
};
