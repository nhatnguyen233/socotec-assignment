import { Button } from "@chakra-ui/react";

interface ProfileActionProps {
  isEditable: boolean;
  cancel?: () => void;
  edit?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ProfileAction: React.FC<ProfileActionProps> = ({
  isEditable,
  cancel,
  edit,
}) => {
  return (
    <>
      {isEditable ? (
        <>
          <Button colorScheme="teal" type="submit" mr={2}>
            Save
          </Button>
          <Button colorScheme="gray" type="button" onClick={cancel}>
            Cancel
          </Button>
        </>
      ) : (
        <Button colorScheme="teal" type="button" onClick={edit}>
          Update Profile
        </Button>
      )}
    </>
  );
};
