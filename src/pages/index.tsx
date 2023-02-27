import Head from 'next/head';
import Image from 'next/image';

import styles from '../styles/home.module.scss';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import chapeuChef from '../../public/chapeu-de-chef.svg';
import logo from '../../public/logo_banner.png';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input/index';

import Link from 'next/link';
import { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../contexts/AuthContext';
import { canSRRGuest } from '../utils/canSRRGuest';

export default function Home() {
  const { signIn } = useContext(AuthContext)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  async function handleLogin(event) {
    event.preventDefault()

    if (email === '' || password === '') {
      setLoginError("Digite o email e a senha")
      return
    }

    let data = {
      email,
      password
    }

    setLoading(true)

    try {
      await signIn(data)
    } catch (err) {
      setLoginError(err.message)
    }

    setLoading(false)
  }

  useEffect(() => {
    if (loginError) {
      //TOAST NOTIFICATION 
      toast.error(loginError, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      })
      setLoginError('')
    }
  }, [loginError])

  return (
    <>
      <div className={styles.centerContainer}>
        <Head>
          <title>CHEFCONNECT - Faça seu login</title>
          <link rel="shortcut icon" href="logo_image.png" />
        </Head>
        <Image className={styles.logo} src={logo} alt="Logo CHEFCONNECT" />
        <div className={styles.containerLogin}>
          <form onSubmit={handleLogin} className={styles.formLogin} action="">
            <Input placeholder='Email' value={email} onChange={(e) => { setEmail(e.target.value) }} />
            <Input type="password" placeholder='Senha' value={password} onChange={(e) => { setPassword(e.target.value) }} />
            <Button type='submit' loading={loading}>Login</Button>
          </form>
          <div className={styles.footer}>
            <Link href="/signup" legacyBehavior>
              <a className={styles.aNoAccount}>Não possui uma conta? Cadastre-se</a>
            </Link>
            <Image alt="Chef hat" src={chapeuChef} />
          </div>
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