import Head from 'next/head'
import Header from '../../components/Header/index'
import { canSRRAuth } from '../../utils/canSSRAuth'

import styles from '../../styles/dashboard.module.scss'

import { setupApiClient } from '@/services/api'

import { useEffect, useState } from 'react'
import { RxUpdate } from 'react-icons/rx'
import { toast } from 'react-toastify'

import Modal from 'react-modal'
import { ModalOrder } from '../../components/ModalOrder/index'

export default function Dashboard() {
    const [orderList, setOrderList] = useState([])
    const [modalItem, setModalItem] = useState()
    const [modalVisible, setModalVisible] = useState(false)

    function handleCloseModal(){
        setModalVisible(false)
    }

    async function handleLoadOrders() {
        const api = setupApiClient()
        try {
            const response = await api.get('/orders');
            setOrderList(response.data)
        } catch {
            toast.error("Erro ao carregar lista de pedidos")
        }
    }

    async function handleOpenModal(id: string) {
        const api = setupApiClient()
        try {
            const response = await api.get('/orders/details', {
                params: {
                    order_id: id
                }
            });
            setModalItem(response.data)
            setModalVisible(true)
        } catch {
            toast.error("Erro ao carregar os detalhes do pedido")
        }
    }

    useEffect(() => {
        handleLoadOrders()
    }, [])

    Modal.setAppElement('#__next')

    return (
        <>
            <Head>
                <title>CHEFCONNECT - Painel</title>
                <link rel="shortcut icon" href="logo_image.png" />
            </Head>
            <div>
                <Header />
                <div className={styles.mainDiv}>
                    <div className={styles.top}>
                        <h1>Pedidos</h1>
                        <button onClick={() => { handleLoadOrders() }}><RxUpdate size={25} /></button>
                    </div>

                    {orderList.length != 0 ? (orderList.map((order) => {
                        return (
                            <section key={order.id} className={styles.content}>
                                <button onClick={() => handleOpenModal(order.id)} className={styles.orderBto}>
                                    <div className={styles.tag}></div>
                                    <h2>Mesa {order.table}</h2>
                                </button>
                            </section>)
                    })) :
                        (<span className={styles.errorMSG}>{'Não há nenhum pedido no momento...'}</span>)}

                </div>

                {modalVisible && (<ModalOrder isOpen={modalVisible} onRequestClose={()=>{setModalVisible(false)}} order={modalItem}/>)}
            </div>
        </>
    )
}

export const getServerSideProps = canSRRAuth(async (ctx) => {

    return {
        props: {}
    }
})