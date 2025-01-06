import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronLeftIcon, DeleteIcon } from '@chakra-ui/icons';
import { Controller, useForm } from 'react-hook-form';
import {
  ProfileFormUpdateSchema,
  ProfileFormUpdateDto,
  ProfileType,
} from './dtos/profile.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileField } from './ProfileField';
import { ProfileHeader } from './ProfileHeader';
import { ProfileAction } from './ProfileAction';
import { userApi } from '@apis/user.api';
import { getImageURL } from '@utils/upload.util';
import { useNavigate } from 'react-router-dom';
import { ConfirmationDialog } from '@components/ConfirmationDialog';
import { CustomIconButton } from '@components/CustomIconButton';

const FIELD_CONFIGS = [
  { name: 'phoneNumber', label: 'Phone Number' },
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
  { name: 'country', label: 'Country' },
  { name: 'city', label: 'City' },
  { name: 'position', label: 'Position' },
];

export const Profile: React.FC<{ id: string }> = ({ id: userId }) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(
    '/images/default-avatar.jpeg'
  );
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [profileData, setProfileData] = useState<Partial<ProfileType>>({});

  const { control, handleSubmit, reset, watch } = useForm<ProfileFormUpdateDto>(
    {
      defaultValues: {
        firstName: '',
        lastName: '',
        phoneNumber: '',
        country: '',
        city: '',
        position: '',
      },
      resolver: zodResolver(ProfileFormUpdateSchema),
    }
  );

  const fetchProfileData = async (id: string) => {
    try {
      const { data: rawData } = await userApi.getUserProfile(id);

      if (rawData?.isSuccess && rawData?.data) {
        const {
          id,
          email = '',
          first_name = '',
          last_name = '',
          country = '',
          city = '',
          phone_number = '',
          position = '',
          avatar_url = '',
        } = rawData.data;

        const updatedData = {
          id,
          email,
          firstName: first_name ?? '',
          lastName: last_name ?? '',
          country: country ?? '',
          city: city ?? '',
          phoneNumber: phone_number ?? '',
          position: position ?? '',
          avatarUrl: avatar_url ?? '',
        };
        if (updatedData?.avatarUrl) {
          setAvatarPreview(getImageURL(updatedData?.avatarUrl));
        }
        setProfileData(updatedData);
        reset(updatedData);
      }
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    }
  };

  const handleCancel = () => {
    reset(profileData);
    setIsEditing(false);
  };

  const handleEdit = () => setIsEditing(true);

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
      setUploadedFile(file);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const onSubmit = async (data: ProfileFormUpdateDto) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (uploadedFile) formData.append('avatar', uploadedFile);

      await userApi.updateUserProfile(userId, formData);
      toast({
        position: 'top-right',
        title: 'Profile updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchProfileData(userId);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleDelete = async () => {
    try {
      await userApi.deleteUserProfile(userId); // Call to delete user profile
      toast({
        position: 'top-right',
        title: 'Profile deleted successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      handleLogout();
    } catch (error) {
      console.error('Failed to delete profile:', error);
    }
    onDeleteClose(); // Close the delete confirmation dialog
  };

  useEffect(() => {
    fetchProfileData(userId);
  }, [userId]);

  return (
    <Box maxW="lg" mx="auto" p={4} bg="gray.50" minHeight="100vh">
      <Card
        boxShadow="lg"
        borderRadius="xl"
        bg="white"
        border="1px solid"
        borderColor="gray.200"
        position="relative"
      >
        <CustomIconButton
          icon={<ChevronLeftIcon />}
          ariaLabel="Back"
          top={6}
          left={4}
          onClick={onOpen}
        />

        <CustomIconButton
          icon={<DeleteIcon />}
          ariaLabel="Delete Profile"
          top={6}
          right={4}
          onClick={onDeleteOpen}
        />

        <ConfirmationDialog
          isOpen={isOpen}
          title="Confirm Logout"
          message="Are you sure you want to log out?"
          confirmText="Logout"
          onClose={onClose}
          onConfirm={handleLogout}
        />
        <ConfirmationDialog
          isOpen={isDeleteOpen}
          title="Confirm Profile Deletion"
          message="Are you sure you want to delete your profile? This action cannot be undone."
          confirmText="Delete"
          onClose={onDeleteClose}
          onConfirm={handleDelete}
        />

        <CardHeader bg="teal.600" color="white" p={4}>
          <ProfileHeader
            name={`${watch('firstName')} ${watch('lastName')}`}
            position={watch('position') ?? ''}
            avatarPreview={avatarPreview}
            handleAvatarChange={handleAvatarChange}
            isUploadable={isEditing}
          />
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardBody>
            <Flex direction="column" align="center" justify="center">
              <ProfileField
                label="Email"
                value={profileData?.email ?? ''}
                isEditable={false}
              />
              {FIELD_CONFIGS.map(({ name, label }) => (
                <Controller
                  key={name}
                  name={name as keyof ProfileFormUpdateDto}
                  control={control}
                  render={({ field, fieldState }) => (
                    <ProfileField
                      label={label}
                      value={field.value ?? ''}
                      isEditable={isEditing}
                      onChange={field.onChange}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                />
              ))}
            </Flex>
          </CardBody>
          <CardFooter
            bg="gray.100"
            p={4}
            textAlign="center"
            justifyContent="center"
          >
            <ProfileAction
              isEditable={isEditing}
              cancel={handleCancel}
              edit={handleEdit}
            />
          </CardFooter>
        </form>
      </Card>
    </Box>
  );
};
