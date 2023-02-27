
import Modal from "react-modal"


import { AiOutlineCloseCircle } from 'react-icons/ai'
import { TbListDetails } from 'react-icons/tb'

import styles from './styles.module.scss'

interface ModalProps {
    isOpen: boolean,
    onRequestClose: () => void
    order: any
}

export function ModalOrder({ isOpen, onRequestClose, order }: ModalProps) {

    const customStyles = {
        content: {
            top: '50%',
            bottom: 'auto',
            left: '50%',
            right: 'auto',
            padding: '30px',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#131313',
            borderRadius: '15px',
            width: '50%'
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(5px)'
        }
    }
    return (
        <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
            <div className={styles.top}>
                <TbListDetails size={35} color="#ffff" />
                <button type="button" onClick={onRequestClose} className="react-modal-close" style={{ borderWidth: 0, background: 'transparent' }} >
                    <AiOutlineCloseCircle size={35} color="#dc6565" />
                </button>
            </div>


            <div className={styles.content}>
                <h2>Detalhes do pedido</h2>
                <h3>
                    Mesa: <strong>{order[0].order.table}</strong>
                </h3>
                {order.map(item => (
                    <section key={item.id} className={styles.item}>
                        <span className={styles.itemName}><strong>{item.product.name}</strong></span>
                        <span>Quantidade: {item.amount}</span>
                        <span>{item.product.description}</span>
                    </section>
                ))}
            </div>

        </Modal>
    )
} 