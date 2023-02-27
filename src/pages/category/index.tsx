import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Head from 'next/head';
import { useEffect, useState } from 'react';

import styles from '../../styles/category.module.scss';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import { canSRRAuth } from "@/utils/canSSRAuth";
import { AiFillPlusCircle } from 'react-icons/ai';
import { BiCategory } from 'react-icons/bi';
import { IoMdListBox } from 'react-icons/io';

import { setupApiClient } from "@/services/api";

export default function Category() {
    const [category, setCategory] = useState('')
    const [loading, setLoading] = useState(false)
    const [listaCategorias, setListaCategorias] = useState([])

    async function loadCategoriesList() {
        const apiClient = setupApiClient()
        try {
            const response = await apiClient.get('/categories');
            setListaCategorias(response.data)
        } catch {
            toast.error("Erro ao carregar lista de categorias")
        }
    }

    useEffect(() => {
        loadCategoriesList()
    }, [])

    async function handleAddCategory(event) {
        event.preventDefault()

        if (category == '') {
            toast.error("Digite o nome da categoria")
            return
        }

        setLoading(true)
        await new Promise(r => setTimeout(r, 500))
        const apiClient = setupApiClient()
        try {
            await apiClient.post('/categories', { name: category })
            toast.success("Categoria criada com sucesso!")
            loadCategoriesList()
        } catch (err) {
            if (err.name === 'AxiosError') {
                toast.error("Esta categria já existe")
            } else if (err.name === 'TypeError') {
                toast.error("Erro de conexão")
            } else {
                toast.error(err)
            }
        }
        setLoading(false)

    }

    return (
        <>
            <Head>
                <title>CHEFCONNECT - Categorias</title>
                <link rel="shortcut icon" href="logo_image.png" />
            </Head>
            <Header />
            <div className={styles.createCategoryContainer}>
                <h1><BiCategory />Criar nova categoria</h1>
                <form className={styles.categoryForm} onSubmit={handleAddCategory}>
                    <Input placeholder="Nome da categoria" value={category} onChange={(e) => { setCategory(e.target.value) }} />
                    <Button loading={loading} type="submit"><AiFillPlusCircle size={30} /></Button>
                </form>
            </div>
            <div className={styles.centerDiv}>
                <div className={styles.listCategoryContainer}>
                    <h1><IoMdListBox />Categorias listadas</h1>
                    <ul className={styles.list}>
                        {listaCategorias.length != 0 ? (listaCategorias.map((item) => {
                            return (<li key={item.id}>{item.name}</li>)
                        })) :
                            (<li>Não há nenhuma categoria :(</li>)}
                    </ul>
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