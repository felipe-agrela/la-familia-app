import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TextInput, 
    FlatList, 
    Image, 
    TouchableOpacity, 
    SafeAreaView, 
    Dimensions,
    Animated,
    ActivityIndicator,
    Modal
} from 'react-native';
import { supabase } from '../supabaseClient'; 

const { width: screenWidth } = Dimensions.get('window');

const PRODUTOS_MOCK = [
    { 
        id: '1', 
        nome: 'Pimentão Vermelho', 
        precoDe: 'R$ 7,99', 
        precoPor: 'R$ 6,99', 
        valorNumerico: 6.99,
        categoria: 'Alimentos', 
        promocao: true, 
        imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLUYb1sH420yXy9ygu83o3GgLnKXvkL4Vi0wS9Gv1ZfIPyTq6mE0Zek-y42ggaSv5A8fvzne3aK9GHdXw9m1l_KJSc5ObNQJEAR0n95a5Frg&s=10' 
    },
    { 
        id: '2', 
        nome: 'Tomate Italiano', 
        precoDe: 'R$ 4,99', 
        precoPor: 'R$ 3,05', 
        valorNumerico: 3.05,
        categoria: 'Alimentos', 
        promocao: true, 
        imagem: 'https://static.itdg.com.br/images/auto-auto/d358afb7e26413ae69158e01a449cad1/cesto-com-pimentoes-vermelhos.jpg' 
    },
    { 
        id: '3', 
        nome: 'Banana Nanica', 
        precoDe: 'R$ 5,50', 
        precoPor: 'R$ 4,20', 
        valorNumerico: 4.20,
        categoria: 'Alimentos', 
        promocao: true, 
        imagem: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?q=80&w=300&auto=format&fit=crop' 
    },
    { 
        id: '4', 
        nome: 'Coca Cola Lata', 
        precoDe: 'R$ 5,50', 
        precoPor: 'R$ 4,49', 
        valorNumerico: 4.49,
        categoria: 'Bebidas', 
        promocao: true, 
        imagem: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?q=80&w=300&auto=format&fit=crop' 
    },
    { 
        id: '5', 
        nome: 'Suco de Laranja 1L', 
        precoDe: null, 
        precoPor: 'R$ 12,00', 
        valorNumerico: 12.00,
        categoria: 'Bebidas', 
        promocao: false, 
        imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_687453-MLA99929300735_112025-F.webp' 
    },
    { 
        id: '6', 
        nome: 'Arroz Integral 1kg', 
        precoDe: null, 
        precoPor: 'R$ 8,50', 
        valorNumerico: 8.50,
        categoria: 'Grãos', 
        promocao: false, 
        imagem: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=300&auto=format&fit=crop' 
    },
    { 
        id: '7', 
        nome: 'Feijão Carioca 1kg', 
        precoDe: 'R$ 9,30', 
        precoPor: 'R$ 7,90', 
        valorNumerico: 7.90,
        categoria: 'Grãos', 
        promocao: true, 
        imagem: 'https://http2.mlstatic.com/D_NQ_NP_2X_724359-MLA99446854412_112025-F.webp' 
    },
];

const CATEGORIAS = ['Todos', 'Alimentos', 'Bebidas', 'Grãos'];

export default function HomeScreen({ route, navigation }) {
    const { userEmail } = route?.params || { userEmail: 'cliente' };

    const [nomeUsuario, setNomeUsuario] = useState('');
    const [loadingUser, setLoadingUser] = useState(true);
    const [busca, setBusca] = useState('');
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todos');
    const [filtrarApenasOfertas, setFiltrarApenasOfertas] = useState(false);
    
    const [menuAberto, setMenuAberto] = useState(false);
    const animacaoMenu = useState(new Animated.Value(-screenWidth * 0.5))[0];

    const [carrinho, setCarrinho] = useState([]);
    const [carrinhoVisivel, setCarrinhoVisivel] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({ headerShown: false });
    }, [navigation]);

    useEffect(() => {
        async function buscarDadosUsuario() {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                
                if (user && user.user_metadata && user.user_metadata.nome_completo) {
                    setNomeUsuario(user.user_metadata.nome_completo);
                } else {
                    const nomeFallback = userEmail.split('@')[0];
                    setNomeUsuario(nomeFallback);
                }
            } catch (err) {
                console.log("Erro ao carregar nome:", err);
            } finally {
                setLoadingUser(false);
            }
        }
        buscarDadosUsuario();
    }, [userEmail]);

    const handleLogoff = async () => {
        try {
            await supabase.auth.signOut();
            alternarMenu();
            navigation.replace('Login');
        } catch (error) {
            console.log("Erro ao deslogar:", error);
        }
    };

    const alternarMenu = () => {
        if (menuAberto) {
            Animated.timing(animacaoMenu, {
                toValue: -screenWidth * 0.5,
                duration: 220,
                useNativeDriver: false
            }).start(() => setMenuAberto(false));
        } else {
            setMenuAberto(true);
            Animated.timing(animacaoMenu, {
                toValue: 0,
                duration: 220,
                useNativeDriver: false
            }).start();
        }
    };

    const adicionarAoCarrinho = (produto) => {
        setCarrinho((itensAtuais) => {
            const existe = itensAtuais.find(item => item.id === produto.id);
            if (existe) {
                return itensAtuais.map(item => 
                    item.id === produto.id 
                        ? { ...item, quantidade: Math.min(item.quantidade + 1, 99) }
                        : item
                );
            }
            return [...itensAtuais, { ...produto, quantidade: 1 }];
        });
    };

    const mudarQuantidade = (id, tipo) => {
        setCarrinho((itensAtuais) => 
            itensAtuais.map(item => {
                if (item.id === id) {
                    let novaQtde = item.quantidade + (tipo === 'mais' ? 1 : -1);
                    if (novaQtde >= 1 && novaQtde <= 99) {
                        return { ...item, quantidade: novaQtde };
                    }
                }
                return item;
            })
        );
    };

    const removerDoCarrinho = (id) => {
        setCarrinho((itensAtuais) => itensAtuais.filter(item => item.id !== id));
    };

    const obtenerValorTotal = () => {
        const total = carrinho.reduce((acc, item) => acc + (item.valorNumerico * item.quantidade), 0);
        return total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const totalItensNoContador = carrinho.reduce((acc, item) => acc + item.quantidade, 0);

    const produtosFiltrados = PRODUTOS_MOCK.filter(produto => {
        const bateBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());
        const bateCategoria = categoriaSelecionada === 'Todos' || produto.categoria === categoriaSelecionada;
        const bateOferta = !filtrarApenasOfertas || produto.promocao;

        return bateBusca && bateCategoria && bateOferta;
    });

    const renderProduto = ({ item }) => (
        <View style={styles.cardProduto}>
            <Image source={{ uri: item.imagem }} style={styles.imagemProduto} />
            <View style={styles.infoProduto}>
                <Text style={styles.nomeProduto}>{item.nome}</Text>
                {item.precoDe && <Text style={styles.precoDe}>De: {item.precoDe}</Text>}
                <Text style={styles.precoPor}>POR: {item.precoPor}</Text>
                
                <TouchableOpacity 
                    style={styles.botaoAdicionar} 
                    onPress={() => adicionarAoCarrinho(item)}
                >
                    <Text style={styles.textoBotaoAdicionar}>🛒 Adicionar ao carrinho</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderItemCarrinho = ({ item }) => (
        <View style={styles.itemCarrinhoContainer}>
            <Image source={{ uri: item.imagem }} style={styles.imagemCarrinhoItem} />
            <View style={styles.infoCarrinhoItem}>
                <Text style={styles.nomeCarrinhoItem} numberOfLines={1}>{item.nome}</Text>
                <Text style={styles.precoCarrinhoItem}>{item.precoPor}</Text>
                
                <View style={styles.controlesQuantidade}>
                    <TouchableOpacity 
                        style={styles.botaoAjusteQuantidade} 
                        onPress={() => mudarQuantidade(item.id, 'menos')}
                    >
                        <Text style={styles.textoAjusteQuantidade}>-</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.numeroQuantidadeTexto}>{item.quantidade}</Text>
                    
                    <TouchableOpacity 
                        style={styles.botaoAjusteQuantidade} 
                        onPress={() => mudarQuantidade(item.id, 'mais')}
                    >
                        <Text style={styles.textoAjusteQuantidade}>+</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity style={styles.botaoDeletarItem} onPress={() => removerDoCarrinho(item.id)}>
                <Text style={styles.textoDeletarItem}>🗑️</Text>
            </TouchableOpacity>
        </View>
    );

   
    const renderHeaderDaLista = () => (
        <View>
           
            <View style={styles.header}>
                <TouchableOpacity onPress={alternarMenu} style={styles.botaoHamburguer}>
                    <Text style={styles.textoHamburguer}>≡</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.carrinhoHeaderBotao} onPress={() => setCarrinhoVisivel(true)}>
                    <Text style={styles.carrinhoHeaderIcone}>🛒</Text>
                    {totalItensNoContador > 0 && (
                        <View style={styles.carrinhoBadgeContador}>
                            <Text style={styles.carrinhoBadgeTexto}>{totalItensNoContador}</Text>
                        </View>
                    )}
                </TouchableOpacity>
            </View>

          
            <View style={styles.subHeader}>
                {loadingUser ? (
                    <ActivityIndicator size="small" color="#000" />
                ) : (
                    <Text style={styles.textoBoasVindas}>Bem vindo, {nomeUsuario}!</Text>
                )}
                <Text style={styles.textoSubtitulo}>Estamos felizes com a sua volta.</Text>
            </View>

            
            <View style={styles.rowPesquisaFiltro}>
                <View style={styles.containerPesquisa}>
                    <TextInput 
                        style={styles.inputPesquisa}
                        placeholder="Busque aqui..."
                        placeholderTextColor="#999"
                        value={busca}
                        onChangeText={setBusca}
                    />
                    <Text style={styles.iconeLupa}>🔍</Text>
                </View>
                
                <TouchableOpacity 
                    style={[styles.botaoFiltroMix, filtrarApenasOfertas && styles.botaoFiltroMixAtivo]}
                    onPress={() => setFiltrarApenasOfertas(!filtrarApenasOfertas)}
                >
                    <Text style={[styles.textoFiltroMix, filtrarApenasOfertas && styles.textoFiltroMixAtivo]}>
                        % Ofertas
                    </Text>
                </TouchableOpacity>
            </View>

            
            <View style={styles.containerCategorias}>
                <FlatList 
                    data={CATEGORIAS}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={[
                                styles.botaoCategoria, 
                                categoriaSelecionada === item && styles.botaoCategoriaAtivo
                            ]}
                            onPress={() => setCategoriaSelecionada(item)}
                        >
                            <Text style={[
                                styles.textoCategoria,
                                categoriaSelecionada === item && styles.textoCategoriaAtivo
                            ]}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            
          
            <FlatList 
                data={produtosFiltrados}
                keyExtractor={(item) => item.id}
                renderItem={renderProduto}
                ListHeaderComponent={renderHeaderDaLista}
                contentContainerStyle={styles.listaProdutos}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text style={styles.textoListaVazia}>Nenhum item corresponde aos filtros.</Text>
                }
            />

         
            {menuAberto && (
                <TouchableOpacity style={styles.mascaraMenu} activeOpacity={1} onPress={alternarMenu} />
            )}
            <Animated.View style={[styles.menuLateral, { left: animacaoMenu }]}>
                <View style={styles.topoMenuLateral}>
                
                    <Text style={styles.tituloMenuLateral}>La Família</Text>
                </View>

                <View style={styles.opcoesMenu}>
                    <TouchableOpacity style={styles.itemMenu} onPress={alternarMenu}>
                        <Text style={styles.textoItemMenu}>🏠  Início</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.divisorMenu} />

                    <TouchableOpacity style={[styles.itemMenu, styles.itemLogoff]} onPress={handleLogoff}>
                        <Text style={[styles.textoItemMenu, styles.textoLogoff]}>🚪  Logoff (Sair)</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>

           
            <Modal
                animationType="slide"
                transparent={true}
                visible={carrinhoVisivel}
                onRequestClose={() => setCarrinhoVisivel(false)}
            >
                <View style={styles.carrinhoModalMascara}>
                    <View style={styles.carrinhoModalContainer}>
                        <View style={styles.carrinhoModalHeader}>
                            <Text style={styles.carrinhoModalTitulo}>Meu Carrinho</Text>
                            <TouchableOpacity 
                                style={styles.carrinhoModalFecharBotao} 
                                onPress={() => setCarrinhoVisivel(false)}
                            >
                                <Text style={styles.carrinhoModalFecharTexto}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <FlatList 
                            data={carrinho}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItemCarrinho}
                            contentContainerStyle={styles.carrinhoModalLista}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <Text style={styles.carrinhoVazioTexto}>Nenhum item por aqui ainda!</Text>
                            }
                        />

                        {carrinho.length > 0 && (
                            <View style={styles.carrinhoModalRodape}>
                                <View style={styles.carrinhoModalPrecoContainer}>
                                    <Text style={styles.carrinhoModalPrecoLabel}>Total da compra:</Text>
                                    <Text style={styles.carrinhoModalPrecoValor}>{obtenerValorTotal()}</Text>
                                </View>
                                
                                <TouchableOpacity 
                                    style={styles.carrinhoModalBotaoComprar}
                                    onPress={() => {
                                        setCarrinhoVisivel(false);
                                        setCarrinho([]); 
                                        navigation.navigate('comprafinalizada');
                                    }}
                                >
                                    <Text style={styles.carrinhoModalBotaoComprarTexto}>Comprar</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFCA28', 
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 15,
    },
    botaoHamburguer: {
        width: 45,
        height: 45,
        justifyContent: 'center',
    },
    textoHamburguer: {
        fontSize: 36,
        color: '#000',
    },
    carrinhoHeaderBotao: {
        width: 45,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    carrinhoHeaderIcone: {
        fontSize: 26,
    },
    carrinhoBadgeContador: {
        position: 'absolute',
        top: 0,
        right: 0,
        backgroundColor: '#D32F2F',
        borderRadius: 10,
        minWidth: 18,
        height: 18,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
    },
    carrinhoBadgeTexto: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: 'bold',
    },
    subHeader: {
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    textoBoasVindas: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#FFF',
    },
    textoSubtitulo: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 2,
    },
    rowPesquisaFiltro: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 15,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    containerPesquisa: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 8,
        height: 46,
        alignItems: 'center',
        paddingHorizontal: 15,
        marginRight: 10,
        elevation: 2,
    },
    inputPesquisa: {
        flex: 1,
        height: '100%',
        fontSize: 16,
        color: '#000',
    },
    iconeLupa: {
        fontSize: 18,
    },
    botaoFiltroMix: {
        backgroundColor: '#FFF',
        height: 46,
        borderRadius: 8,
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#F27438',
        borderWidth: 1.5,
        elevation: 2,
    },
    botaoFiltroMixAtivo: {
        backgroundColor: '#F27438',
    },
    textoFiltroMix: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#F27438',
    },
    textoFiltroMixAtivo: {
        color: '#FFF',
    },
    containerCategorias: {
        paddingLeft: 20,
        marginBottom: 15,
    },
    botaoCategoria: {
        backgroundColor: '#FFF',
        paddingHorizontal: 18,
        paddingVertical: 8,
        borderRadius: 6,
        marginRight: 10,
        elevation: 1,
    },
    botaoCategoriaAtivo: {
        backgroundColor: '#F27438', 
    },
    textoCategoria: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    textoCategoriaAtivo: {
        color: '#FFF',
        fontWeight: 'bold',
    },
    listaProdutos: {
        paddingBottom: 20,
    },
    cardProduto: {
        backgroundColor: '#FFE082', 
        borderRadius: 12,
        flexDirection: 'row',
        padding: 12,
        marginBottom: 14,
        marginHorizontal: 20, // Movido para o card para alinhar com o header
        alignItems: 'center',
        position: 'relative',
        elevation: 2,
    },
    imagemProduto: {
        width: 85,
        height: 85,
        borderRadius: 8,
        backgroundColor: '#FFF',
        resizeMode: 'cover',
    },
    infoProduto: {
        flex: 1,
        marginLeft: 15,
        justifyContent: 'center',
    },
    nomeProduto: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    precoDe: {
        fontSize: 13,
        color: '#777',
        textDecorationLine: 'line-through',
    },
    precoPor: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#E65100', 
        marginVertical: 2,
    },
    botaoAdicionar: {
        backgroundColor: '#F27438',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
        marginTop: 6,
        alignSelf: 'flex-start',
    },
    textoBotaoAdicionar: {
        color: '#FFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
    textoListaVazia: {
        textAlign: 'center',
        marginTop: 40,
        fontSize: 15,
        color: '#FFF',
        fontWeight: '500',
    },
    mascaraMenu: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        zIndex: 10,
    },
    menuLateral: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: screenWidth * 0.5, 
        backgroundColor: '#FFF',
        zIndex: 11,
        paddingTop: 55,
        paddingHorizontal: 15,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 5,
    },
    topoMenuLateral: {
        alignItems: 'flex-start', 
        paddingLeft: 8, 
        marginBottom: 25,
    },
    tituloMenuLateral: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 6,
        textAlign: 'left', 
    },
    opcoesMenu: {
        flex: 1,
    },
    itemMenu: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 6,
    },
    textoItemMenu: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    divisorMenu: {
        height: 1,
        backgroundColor: '#EEE',
        marginVertical: 6,
    },
    itemLogoff: {
        backgroundColor: '#FEEBEE', 
    },
    textoLogoff: {
        color: '#D32F2F',
        fontWeight: 'bold',
    },
    carrinhoModalMascara: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    carrinhoModalContainer: {
        backgroundColor: '#FFF',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        minHeight: '45%',
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    carrinhoModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
        paddingBottom: 12,
    },
    carrinhoModalTitulo: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    carrinhoModalFecharBotao: {
        backgroundColor: '#FFEBEE',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    carrinhoModalFecharTexto: {
        color: '#D32F2F',
        fontSize: 16,
        fontWeight: 'bold',
    },
    carrinhoModalLista: {
        paddingVertical: 15,
    },
    carrinhoVazioTexto: {
        textAlign: 'center',
        color: '#999',
        fontSize: 15,
        marginVertical: 30,
    },
    itemCarrinhoContainer: {
        flexDirection: 'row',
        backgroundColor: '#FAFAFA',
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    imagemCarrinhoItem: {
        width: 55,
        height: 55,
        borderRadius: 6,
        backgroundColor: '#EEE',
    },
    infoCarrinhoItem: {
        flex: 1,
        marginLeft: 12,
    },
    nomeCarrinhoItem: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#333',
    },
    precoCarrinhoItem: {
        fontSize: 14,
        color: '#E65100',
        fontWeight: 'bold',
        marginTop: 2,
    },
    controlesQuantidade: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 6,
    },
    botaoAjusteQuantidade: {
        backgroundColor: '#E0E0E0',
        width: 26,
        height: 26,
        borderRadius: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoAjusteQuantidade: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
    },
    numeroQuantidadeTexto: {
        fontSize: 14,
        fontWeight: 'bold',
        marginHorizontal: 12,
        color: '#333',
        minWidth: 20,
        textAlign: 'center',
    },
    botaoDeletarItem: {
        padding: 8,
    },
    textoDeletarItem: {
        fontSize: 18,
    },
    carrinhoModalRodape: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F0F0F0',
        paddingVertical: 18,
        backgroundColor: '#FFF',
    },
    carrinhoModalPrecoContainer: {
        flexDirection: 'column',
    },
    carrinhoModalPrecoLabel: {
        fontSize: 13,
        color: '#777',
    },
    carrinhoModalPrecoValor: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    carrinhoModalBotaoComprar: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 28,
        paddingVertical: 12,
        borderRadius: 8,
        elevation: 2,
    },
    carrinhoModalBotaoComprarTexto: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});