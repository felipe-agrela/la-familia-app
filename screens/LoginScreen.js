import React, { useState, useLayoutEffect } from 'react'; 
import { 
    StyleSheet, 
    View, 
    Text, 
    TextInput, 
    ActivityIndicator, 
    Image, 
    TouchableOpacity, 
    ScrollView, 
    SafeAreaView,
    Dimensions
} from 'react-native';
import { supabase } from '../supabaseClient'; 

const { height: screenHeight } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [secureMode, setSecureMode] = useState(true);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const handleLoginPress = async () => {
        if (!email || !password) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password,
        });

        setLoading(false);

        if (error) {
            console.log("ERRO DETALHADO DO SUPABASE:", error);
            if (error.message === 'Invalid login credentials' || error.status === 400) {
                alert('Ops!\nE-mail ou senha incorretos. Verifique os dados e tente novamente.');
            } else {
                alert('Erro no Login: ' + error.message);
            }
        } else {
            console.log("USUÁRIO LOGADO COM SUCESSO:", data);
            navigation.navigate('Home', { userEmail: data.user.email });
        }
    };

    const handleGoToRegister = () => {
        navigation.navigate('Cadastrar');
    };

    // Função para abrir a tela Sobre
    const handleGoToAbout = () => {
        navigation.navigate('sobre');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
           
            <TouchableOpacity style={styles.aboutButton} onPress={handleGoToAbout}>
                <Text style={styles.aboutButtonText}>ℹ️</Text>
            </TouchableOpacity>

            <ScrollView 
                contentContainerStyle={styles.scrollContainer}
                bounces={false}
                showsVerticalScrollIndicator={false}
            >
                
                <View style={styles.content}>
                    <Image 
                        source={require('../assets/logo_lafamilia.png-removebg-preview.png')} 
                        style={styles.logo} 
                    />
                    
                    <Text style={styles.brandTitle}>LA FAMÍLIA</Text> 
                    
                    <TextInput
                        style={styles.input}
                        placeholder="Usuário"
                        placeholderTextColor="#666"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />
                    
                    <View style={styles.inputPasswordContainer}>
                        <TextInput
                            style={styles.inputSemBorda}
                            placeholder="Senha"
                            placeholderTextColor="#666"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry={secureMode}
                            autoCapitalize="none"
                            editable={!loading}
                        />
                        <TouchableOpacity 
                            style={styles.botaoOlho} 
                            onPress={() => setSecureMode(!secureMode)}
                        >
                            <Text style={styles.textoOlho}>{secureMode ? "👁️" : "🙈"}</Text>
                        </TouchableOpacity>
                    </View>

                    {loading ? (
                        <ActivityIndicator size="large" color="#E65100" style={styles.loader} />
                    ) : (
                        <TouchableOpacity style={styles.buttonLogin} onPress={handleLoginPress}>
                            <Text style={styles.buttonLoginText}>Login</Text>
                        </TouchableOpacity>
                    )}
                </View>

                
                <View style={styles.footerBackground}>
                    <Text style={styles.textoFrase}>Não tem uma conta?</Text>
                    <TouchableOpacity onPress={handleGoToRegister} style={styles.linkContainer}>
                        <Text style={styles.textolink}>Cadastrar</Text>
                    </TouchableOpacity>
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
    // Estilos adicionados para o botão de Sobre
    aboutButton: {
        position: 'absolute',
        top: 20, // Ajuste dependendo do tamanho da StatusBar do aparelho
        left: 20,
        zIndex: 10, // Garante que o botão fique acima do ScrollView
        padding: 10,
    },
    aboutButtonText: {
        fontSize: 28,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        minHeight: screenHeight,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '10%',
        paddingTop: 40,
        paddingBottom: 20,
    },
    logo: { 
        width: '100%',
        height: screenHeight * 0.18, 
        alignSelf: 'center', 
        resizeMode: 'contain',
        marginBottom: 10,
    },
    brandTitle: { 
        fontSize: 32, 
        fontWeight: '900', 
        textAlign: 'center', 
        color: '#000',
        marginBottom: '8%',
        letterSpacing: 1
    },
    input: { 
        height: 50, 
        borderColor: '#E65100', 
        borderWidth: 1.5, 
        borderRadius: 4, 
        marginBottom: 16, 
        paddingHorizontal: 16, 
        backgroundColor: '#FFE082', 
        fontSize: 16,
        textAlign: 'center',
        color: '#000'
    },
    inputPasswordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#E65100',
        borderWidth: 1.5,
        borderRadius: 4,
        marginBottom: 24,
        backgroundColor: '#FFE082', 
        height: 50,
    },
    inputSemBorda: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 16,
        fontSize: 16,
        textAlign: 'center',
        color: '#000',
        paddingLeft: 48, 
    },
    botaoOlho: {
        width: 48,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoOlho: {
        fontSize: 18,
    },
    buttonLogin: {
        backgroundColor: '#F27438',
        height: 50,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonLoginText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loader: {
        marginVertical: 10,
    },
    footerBackground: {
        backgroundColor: '#F27438',
        borderTopLeftRadius: screenHeight * 0.25,
        borderTopRightRadius: screenHeight * 0.25,
        height: screenHeight * 0.22,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 20,
        width: '100%',
    },
    textoFrase: { 
        fontSize: 14, 
        color: '#000',
        marginBottom: 4
    },
    linkContainer: {
        paddingVertical: 4,
    },
    textolink: { 
        fontSize: 18, 
        color: '#000', 
        fontWeight: 'bold' 
    },
    versionText: {
        position: 'absolute',
        bottom: 12,
        right: 20,
        fontSize: 11,
        color: '#000',
        opacity: 0.6
    }
});