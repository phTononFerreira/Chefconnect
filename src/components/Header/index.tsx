import Image from 'next/image'
import Link from 'next/link'

import styles from './styles.module.scss'

import { BiCategory, BiFoodMenu } from 'react-icons/bi'
import { FiLogOut } from 'react-icons/fi'


import { AuthContext } from '@/contexts/AuthContext'
import { useContext } from 'react'
import logo from '../../../public/logo_image.png'

export default function Header() {
    const {singOut} = useContext(AuthContext)

    return (
        <header className={styles.mainHeader}>
            <Link href='/' legacyBehavior>
                <Image className={styles.logo} src={logo} alt="Logo CHEFCONNECT" />
            </Link>

            <div className={styles.divItems}>
                <Link href='/category' legacyBehavior>
                    <a className={styles.item}><BiCategory />Categorias</a>
                </Link>
                <Link href='/menu' legacyBehavior>
                    <a className={styles.item}><BiFoodMenu />Cardápio</a>
                </Link>
                <Link href='/' legacyBehavior>
                    <button onClick={singOut} className={styles.item}><FiLogOut /></button>
                </Link>
            </div>
        </header>
    )
}