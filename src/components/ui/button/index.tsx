import { ButtonHTMLAttributes, ReactNode } from 'react'
import styles from './styles.module.scss'

import { FiLoader } from 'react-icons/fi'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean
    children: ReactNode
}

export function Button({ loading, children, ...rest }: ButtonProps) {
    return (
        <button disabled={loading} className={styles.button} {...rest}>
            {loading ? (
                <FiLoader color='#FFF' size={18}/>
            ) : (
                <a className={styles['button-content']}>{children}</a>
            )}
        </button>
    )
}
