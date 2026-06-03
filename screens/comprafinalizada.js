import React from 'react';
import { 
    StyleSheet, 
    View, 
    Text, 
    TouchableOpacity, 
    SafeAreaView 
} from 'react-native';

export default function comprafinalizada({ navigation }) {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.conteudoCentral}>
                
                <Text style={styles.iconeSucesso}>🎉</Text>
                
               
                <Text style={styles.textoPrincipal}>COMPRA FINALIZADA!!!</Text>
                
                <Text style={styles.textoSubtitulo}>
                    Obrigado por comprar na La Família. Seu pedido já está sendo preparado!
                </Text>

                <TouchableOpacity 
                    style={styles.botaoVoltar}
                    onPress={() => navigation.navigate('Home')}
                >
                    <Text style={styles.textoBotaoVoltar}>Voltar para o Início</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFCA28',
    },
    conteudoCentral: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    iconeSucesso: {
        fontSize: 64,
        marginBottom: 20,
    },
    textoPrincipal: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFF',
        textAlign: 'center',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.15)',
        textShadowOffset: { width: 1, height: 2 },
        textShadowRadius: 3,
    },
    textoSubtitulo: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 22,
    },
    botaoVoltar: {
        backgroundColor: '#FFF',
        paddingVertical: 14,
        paddingHorizontal: 35,
        borderRadius: 8,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    textoBotaoVoltar: {
        color: '#F27438',
        fontSize: 16,
        fontWeight: 'bold',
    },
});