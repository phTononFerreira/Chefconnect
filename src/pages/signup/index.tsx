import Head from 'next/head'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'

import styles from '../../styles/signup.module.scss'

import logo from '../../../public/logo_image.png'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input/index'

import { FiUserPlus } from 'react-icons/fi'

import { AuthContext } from '@/contexts/AuthContext'
import { canSRRGuest } from '@/utils/canSRRGuest'
import Link from 'next/link'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'



export default function SignUp() {
    const { singUp } = useContext(AuthContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const [loading, setLoading] = useState(false)
    const [signUpError, setSignUpError] = useState('')

    useEffect(() => {
        if (signUpError) {
            //TOAST NOTIFICATION 
            toast.error(signUpError, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            })
            setSignUpError('')
        }
    }, [signUpError])

    async function handleSignUp(event) {
        event.preventDefault()

        if (name === '' || email === '' || password === '') {
            setSignUpError('Preencha todos os dados')
            return
        }

        setLoading(true)

        try {
            await singUp({ name, email, password })
            
        } catch (err) {
            setSignUpError(err.message)
        }

        setLoading(false)
    }

    return (
        <>
            <div className={styles.centerContainer}>
                <Head>
                    <title>CHEFCONNECT - Cadastro</title>
                    <link rel="shortcut icon" href="logo_image.png" />
                </Head>
                <Link href='/' legacyBehavior>
                    <Image className={styles.logo} src={logo} alt="Logo CHEFCONNECT" />
                </Link>
                <div className={styles.containerLogin}>
                    <h1><FiUserPlus size={50} />Crie sua conta</h1>
                    <form className={styles.formLogin} action="" onSubmit={handleSignUp}>
                        <Input placeholder='Nome' value={name} onChange={(e) => { setName(e.target.value) }} />
                        <Input placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
                        <Input type="password" value={password} placeholder='Senha' onChange={(e) => { setPassword(e.target.value) }} />
                        <Button type='submit' loading={loading}>Cadastrar</Button>
                    </form>

                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSRRGuest(async (ctx) => {
    return {
      props: {}
    }
  })