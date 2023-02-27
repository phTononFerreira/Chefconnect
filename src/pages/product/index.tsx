import Head from 'next/head';
import Header from '../../components/Header/index';
import { canSRRAuth } from '../../utils/canSSRAuth';

import styles from '../../styles/product.module.scss';

import { Button } from '@/components/ui/button';
import { Input, TextArea } from '@/components/ui/input';
import { useEffect, useState } from 'react';
import { FaPlusCircle } from 'react-icons/fa';
import { MdFastfood } from 'react-icons/md';

import { setupApiClient } from '@/services/api';

import Router from 'next/router';
import { toast } from 'react-toastify';

export default function Product() {
    const [avatarURL, setAvatarURL] = useState('')
    const [imageAvatar, setImageAvatar] = useState('')
    const [categories, setCategories] = useState([])

    const [productCategory, setProductCategory] = useState('')
    const [productName, setProductName] = useState('')
    const [productPrice, setProductPrice] = useState('')
    const [productDescription, setProductDescription] = useState('')

    async function addProduct(e) {
        e.preventDefault()

        const data = new FormData()

        if (!productCategory || !productName || !productPrice || !productDescription || productCategory === 'null') {
            toast.error("Preencha os dados do produto")
            return
        }

        data.append('name', productName)
        data.append('price', productPrice)
        data.append('description', productDescription)
        data.append('category_id', productCategory)
        data.append('file', imageAvatar)
        try {
            const api = setupApiClient()
            await api.post('/products', data)
            toast.success("Produto cadastrado com sucesso!")

            Router.push('/menu')
        } catch (err) {
            toast.error(err)
        }


    }

    async function loadCategoriesList() {
        const apiClient = setupApiClient()
        try {
            const response = await apiClient.get('/categories');
            setCategories(response.data)
        } catch {
            toast.error("Erro ao carregar lista de categorias")
        }
    }

    useEffect(() => {
        loadCategoriesList()
    }, [])

    function handleFile(e) {
        if (!e.target.files) {
            return
        }

        const img = e.target.files[0]
        if (!img) {
            return
        }

        if (img.type === 'image/jpeg' || img.type === 'image/png') {
            setImageAvatar(img)
            setAvatarURL(URL.createObjectURL(e.target.files[0]))
        }


    }

    return (
        <>
            <Head>
                <title>CHEFCONNECT - Novo produto</title>
                <link rel="shortcut icon" href="logo_image.png" />
            </Head>
            <div>
                <Header />
                <div>
                    <div className={styles.centerDiv}>
                        <h1><MdFastfood />Novo produto</h1>
                        <form className={styles.formDiv} onSubmit={addProduct}>
                            <label className={styles.imgInsert}>
                                <span>
                                    <FaPlusCircle color='white' size={50} />
                                </span>
                                {avatarURL ?
                                    (<img className={styles.preview} src={avatarURL} alt='Foto do produto' />) :
                                    (<></>)
                                }

                                <input type="file" accept='image/png, image/jpeg' onChange={handleFile} />
                            </label>
                            <select onChange={(e) => { setProductCategory(e.target.value) }}>
                                <option value={'null'}>🔤 Categorias</option>
                                {categories.map((category) => {
                                    return <option value={category.id} key={category.id}>{category.name}</option>
                                })}
                            </select>
                            <Input placeholder='Nome' value={productName} onChange={(e) => { setProductName(e.target.value) }} />
                            <Input placeholder='Valor (R$)' value={productPrice} onChange={(e) => { setProductPrice(e.target.value) }} />
                            <TextArea placeholder='Descrição' value={productDescription} onChange={(e) => { setProductDescription(e.target.value) }} />
                            <Button type='submit'>Cadastrar produto</Button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export const getServerSideProps = canSRRAuth(async (ctx) => {

    return {
        props: {}
    }
})