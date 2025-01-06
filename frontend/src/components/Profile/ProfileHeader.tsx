import { Avatar, Flex, Input, Text } from "@chakra-ui/react";

interface ProfileHeaderProps {
  name: string;
  avatarPreview: string;
  isUploadable: boolean;
  position: string;
  handleAvatarChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  position,
  isUploadable,
  avatarPreview,
  handleAvatarChange,
}) => {
  return (
    <Flex direction="column" align="center">
      <label htmlFor="avatar-upload">
        <Avatar
          size="2xl"
          name={name}
          src={avatarPreview}
          mb={4}
          borderWidth="4px"
          borderStyle="solid"
          borderColor="teal.400"
          cursor={isUploadable ? "pointer" : "normal"}
          sx={{
            _hover: isUploadable
              ? {
                  filter: "brightness(0.8)", // Darkens the avatar slightly
                  transition: "0.2s ease-in-out", // Smooth transition
                }
              : "",
          }}
        />
      </label>
      {isUploadable && (
        <Input
          id="avatar-upload"
          type="file"
          accept="image/*"
          display="none"
          onChange={handleAvatarChange}
        />
      )}

      <Text fontSize="2xl" fontWeight="bold">
        {name}
      </Text>
      <Text fontSize="lg" color="teal.100">
        {position}
      </Text>
    </Flex>
  );
};
