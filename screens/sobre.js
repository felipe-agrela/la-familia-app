import React, { useLayoutEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    Dimensions
} from 'react-native';

const { height: screenHeight } = Dimensions.get('window');

export default function SobreScreen({ navigation }) {
    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const integrantes = [
        { id: '1', nome: 'Felipe Agrela', funcao: 'Desenvolvedor Back-end e Analista de Banco de Dados', foto: require('../assets/aura.jpg') },
        { id: '2', nome: 'Cauê Esteves', funcao: 'Desenvolvedor Back-end e Desenvolvedor Front-end', foto: require('../assets/phineas.jpg') },
        { id: '3', nome: 'Sophia Lima', funcao: 'Desenvolvedor Front-end', foto: require('../assets/patrick.png') },
        { id: '4', nome: 'Brian Felix', funcao: 'Gerente de Projeto', foto: require('../assets/brian.jpg') },
        { id: '5', nome: 'João Gabriel', funcao: 'Desenvolvedor Front-end', foto: require('../assets/skibidi.jpeg') },
    ];

    return (
        <SafeAreaView style={styles.safeArea}>
            {/* Botão flutuante fixo no topo */}
            <View style={styles.headerFixo}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.backButtonText}>⬅️ Voltar</Text>
                </TouchableOpacity>
            </View>

            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                bounces={true}
                showsVerticalScrollIndicator={true}
            >
                <View style={styles.content}>
                    <Text style={styles.titlePage}>SOBRE O GRUPO</Text>
                    <Text style={styles.subtitlePage}>Conheça os integrantes da equipe "La Família"</Text>
                    
                    {/* Container com todos os integrantes */}
                    <View style={styles.teamContainer}>
                        {integrantes.map((membro) => (
                            <View key={membro.id} style={styles.cardMembro}>
                                <View style={styles.circuloFoto}>
                                    <Image source={membro.foto} style={styles.fotoMembro} />
                                </View>
                                <Text style={styles.nomeMembro}>{membro.nome}</Text>
                                <Text style={styles.funcaoMembro}>{membro.funcao}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Rodapé integrado ao fluxo do Scroll */}
                <View style={styles.footerBackground}>
                    <Text style={styles.footerText}>Trabalho Acadêmico - 2026</Text>
                    <Text style={styles.versionText}>V 1.0</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFCA28',
    },
    headerFixo: {
        position: 'absolute',
        top: 20,
        left: 20,
        zIndex: 50,
    },
    backButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: '#F27438',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4
    },
    backButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000',
    },
    scrollContainer: {
        flexGrow: 1,
        paddingTop: 90,
    },
    content: {
        alignItems: 'center',
        paddingHorizontal: '8%',
        paddingBottom: 20,
    },
    titlePage: {
        fontSize: 28,
        fontWeight: '900',
        color: '#000',
        textAlign: 'center',
        letterSpacing: 1,
    },
    subtitlePage: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        marginBottom: 30,
        fontWeight: '500'
    },
    teamContainer: {
        width: '100%',
    },
    cardMembro: {
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#FFE082',
        width: '100%',
        paddingVertical: 20,
        borderRadius: 12,
        borderColor: '#E65100',
        borderWidth: 1.5,
    },
    circuloFoto: {
        width: 110,
        height: 110,
        borderRadius: 55,
        backgroundColor: '#FFF',
        overflow: 'hidden', // Corta tudo o que passar da borda arredondada
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#F27438',
        borderWidth: 2,
        marginBottom: 12,
    },
    fotoMembro: {
        width: '100%', // Força a imagem a ter a largura total do círculo
        height: '100%', // Força a imagem a ter a altura total do círculo
        resizeMode: 'cover', // Redimensiona mantendo a proporção correta e preenchendo o espaço todo
    },
    nomeMembro: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        paddingHorizontal: 10
    },
    funcaoMembro: {
        fontSize: 14,
        color: '#E65100',
        fontWeight: '600',
        marginTop: 4,
        textAlign: 'center',
        paddingHorizontal: 15
    },
    footerBackground: {
        backgroundColor: '#F27438',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 25,
        alignItems: 'center',
        width: '100%',
        marginTop: 10,
    },
    footerText: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500'
    },
    versionText: {
        marginTop: 5,
        fontSize: 11,
        color: '#000',
        opacity: 0.6
    }
});