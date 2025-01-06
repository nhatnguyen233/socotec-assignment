import { useState } from 'react';
import {
  Flex,
  Input,
  Button,
  InputGroup,
  Stack,
  InputLeftElement,
  chakra,
  Box,
  Link,
  FormControl,
  InputRightElement,
  FormErrorMessage,
  useToast,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaUserAlt, FaLock } from 'react-icons/fa';
import { Controller, useForm } from 'react-hook-form';
import { SignUpFormData, signUpSchema } from './dtos/signup.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { authApi } from '@apis/auth.api';

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

export const SignUpPage: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmedPassword, setShowConfirmedPassword] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmedPassword: '',
    },
  });

  const handleShowPasswordClick = () => setShowPassword(!showPassword);
  const handleShowConfirmedPasswordClick = () =>
    setShowConfirmedPassword(!showConfirmedPassword);

  const onSubmit = async (data: SignUpFormData) => {
    try {
      await authApi.register(data.email, data.password);
      toast({
        position: 'top-right',
        title: `Sign Up Successfully! Please try to login!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      reset();
      navigate('/login');
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
                <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
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
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleShowPasswordClick}
                    >
                      {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>{errors?.password?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.confirmedPassword}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    color="gray.300"
                    children={<CFaLock color="gray.300" />}
                  />
                  <Controller
                    name="confirmedPassword"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type={showConfirmedPassword ? 'text' : 'password'}
                        placeholder="Confirm password here"
                        paddingInlineStart={`var(--chakra-sizes-10)`}
                      />
                    )}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={handleShowConfirmedPasswordClick}
                    >
                      {showConfirmedPassword ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors?.confirmedPassword?.message}
                </FormErrorMessage>
              </FormControl>
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="teal"
                width="full"
              >
                Sign Up
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
      <Box>
        You already have an account?{' '}
        <Link color="teal.500" onClick={() => navigate('/login')}>
          Login
        </Link>
      </Box>
    </Flex>
  );
};
