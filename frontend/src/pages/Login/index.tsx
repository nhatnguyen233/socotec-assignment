import { useState } from 'react';
import {
  Flex,
  Heading,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  Avatar,
  FormControl,
  InputRightElement,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { Controller, useForm } from 'react-hook-form';
import { LoginFormData, loginSchema } from './dtos/login.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@apis/auth.api';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export const LoginPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleShowClick = () => setShowPassword(!showPassword);

  const onSubmit = async (formData: LoginFormData) => {
    try {
      const { data } = await authApi.login(formData.email, formData.password);
      if (data?.isSuccess) {
        const { data: rawData } = data;
        localStorage.setItem('authToken', rawData.accessToken);
        localStorage.setItem('userInfo', JSON.stringify(rawData.userInfo));
        navigate(`/profile/${rawData?.userInfo?.id}`);
      }
      reset();
    } catch {
      toast({
        position: 'top-right',
        title: `Invalid credentials`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      backgroundColor="gray.200"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Avatar bg="teal.500" />
        <Heading color="teal.400">Welcome</Heading>
        <Box minW={{ base: '90%', md: '468px' }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              spacing={4}
              p="1rem"
              backgroundColor="whiteAlpha.900"
              boxShadow="md"
            >
              <FormControl isInvalid={!!errors.email}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={<CFaUserAlt color="gray.300" />}
                  />
                  <Controller
                    name="email"
                    control={control}
                    rules={{
                      required: 'Email is required',
                      pattern: {
                        value:
                          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                        message: 'Invalid email address',
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="email"
                        placeholder="Email address"
                        paddingInlineStart={`var(--chakra-sizes-10)`}
                      />
                    )}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.password}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        paddingInlineStart={`var(--chakra-sizes-10)`}
                      />
                    )}
                  />
                  <InputRightElement width="4.5rem">
                    <Button h="1.75rem" size="sm" onClick={handleShowClick}>
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        New to us?{' '}
        <Link color="teal.500" onClick={() => navigate('/sign-up')}>
          Sign Up
        </Link>
      </Box>
    </Flex>
  );
};
