import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import Head from "next/head";
import { useEffect, useState } from 'react';

import styles from '../../styles/menu.module.scss';

import { toast } from 'react-toastify';

import { BiFoodMenu } from 'react-icons/bi';
import { MdFastfood } from 'react-icons/md';

import { setupApiClient } from "@/services/api";
import Router from "next/router";


export default function Menu() {
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [productCategory, setProductCategory] = useState('null')

    function compare(a, b) {
        if (a.category_name < b.category_name)
            return -1;
        if (a.category_name > b.category_name)
            return 1;
        return 0;
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

    async function loadProducts() {
        const apiClient = setupApiClient()
        try {
            const response = await apiClient.get('/products');
            const produtosBannerID = response.data
            const categoriesLocal = await apiClient.get('/categories')

            const newProdutos = await produtosBannerID.map(item => {
                const category = categoriesLocal.data.find((c) => c.id === item.category_id)
                return { ...item, category_name: category.name }
            })

            console.log(productCategory)

            if (productCategory !== 'null') {
                var produtosFiltered = await newProdutos.filter((p) => p.category_name === productCategory)
            } else {
                var produtosFiltered = newProdutos
            }

            const newProdutosSorted = produtosFiltered.sort(compare);

            setProducts(newProdutosSorted)
        } catch {
            toast.error("Erro ao carregar lista de produtos")
        }
    }

    useEffect(() => {
        loadProducts()
        loadCategoriesList()
    }, [])

    useEffect(() => {
        loadProducts()
    }, [productCategory])

    return (
        <>
            <Head>
                <title>CHEFCONNECT - Menu</title>
                <link rel="shortcut icon" href="logo_image.png" />
            </Head>
            <Header />
            <div className={styles.centerDiv}>
                <h1><BiFoodMenu size={40} />Cardápio</h1>

                <Button onClick={() => { Router.push('/product') }}><MdFastfood size={30} />Cadastrar produto</Button>

                <div className={styles.gridContainer}>
                    <div className={styles.categoryDiv}>
                        <select onChange={(e) => { setProductCategory(e.target.value) }}>
                            <option value={'null'}>Todos produtos</option>
                            {categories.map((category) => {
                                return <option value={category.name} key={category.id}>{category.name}</option>
                            })}
                        </select>
                    </div>
                    <div className={styles.grid}>
                        {products.length != 0 ? (products.map((item) => {
                            return (
                                <div className={styles.product}>
                                    <img className={styles.Pimg} src={`http://localhost:3333/files/${item.banner}`} alt="" />
                                    <span className={styles.Pname}>{item.name}</span>
                                    <span className={styles.Pvalor}>R$ {item.price}</span>
                                    <span className={styles.Pcategory}>{item.category_name}</span>
                                </div>)
                        })) :
                        (<span className={styles.errorMSG}>{'Não há nenhum produto :('}</span>)}


                    </div>
                </div>
            </div>
        </>
    )


}