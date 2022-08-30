import {
  Flex,
  Box,
  Image,
  Button,
  Text,
  Link,
  useToast,
} from '@chakra-ui/react'

import menteSaLogo from '../../assets/mentesa.svg'
import { InputForm } from '../../components/FormLabel'
import { NavLink, useNavigate } from 'react-router-dom'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { api } from '../../Services/api'
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthContext'
import { setCookie } from 'nookies'
import { AxiosError } from 'axios'

const formData = [
  {
    labelText: 'E-mail',
    placeholder: 'davidaugusto@gmail.com',
    inputType: 'email',
    name: 'email',
  },
  {
    labelText: 'Password',
    placeholder: '********',
    inputType: 'password',
    name: 'password',
  },
]

const LoginValidatorSchema = zod.object({
  email: zod.string().email('E-mail inválido'),
  password: zod.string().min(6, 'O senha deve pelo menos 6 caracteres'),
})

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(LoginValidatorSchema),
  })

  const navigate = useNavigate()
  const toast = useToast()
  const { setUser } = useContext(AuthContext)

  async function handleLogin(inputData) {
    try {
      const { data } = await api.post('/auth', inputData)

      setUser(data.data)
      setCookie(null, 'token', data.token)
      navigate('/home')
    } catch (e) {
      toast({
        title:
          e instanceof AxiosError ? e.response.data.message : 'Erro Interno',
        status: 'error',
        isClosable: true,
        position: 'top-right',
      })
    }
  }

  return (
    <Flex h="100vh">
      <Flex
        direction="column"
        width="40%"
        bg="brand-purple"
        borderRightRadius="md"
        alignItems="center"
      >
        <Image boxSize="150px" src={menteSaLogo} alt="Dan Abramov" />
      </Flex>
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        flex="1"
      >
        <Box
          as="form"
          w="100%"
          p="20%"
          onSubmit={handleSubmit(handleLogin)}
          noValidate
        >
          {formData.map((item, index) => {
            return (
              <InputForm
                error={errors[item.name]}
                key={index}
                labelText={item.labelText}
                placeholder={item.placeholder}
                typeInput={item.inputType}
                {...register(item.name)}
              />
            )
          })}

          <Flex w="100%" justifyContent="end" mt={4}>
            <Link fontSize="lg">Esqueci minha senha</Link>
          </Flex>

          <Button
            color="base-white"
            colorScheme="purple"
            type="submit"
            width="full"
            size="lg"
            mt={4}
          >
            <Text fontSize="lg">Entrar</Text>
          </Button>

          <Flex w="100%" justifyContent="start" gap={2} mt={4}>
            <Text fontSize="lg">Não tem uma conta? </Text>
            <Link
              as={NavLink}
              to="/register"
              fontSize="lg"
              color="brand-purple"
              fontWeight="medium"
            >
              Cadastre-se
            </Link>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  )
}
