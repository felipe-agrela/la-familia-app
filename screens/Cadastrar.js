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
    Dimensions,
    Alert
} from 'react-native';
import { supabase } from '../supabaseClient';
import { TextInputMask } from 'react-native-masked-text';

const { height: screenHeight } = Dimensions.get('window');

export default function Cadastrar({ navigation }) {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [numero, setNumero] = useState('');
    const [cep, setCep] = useState('');
    const [dataNascimento, setDataNascimento] = useState('');
    const [secureMode, setSecureMode] = useState(true);

    
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

   
    const handleGoToLogin = () => {
        navigation.navigate('Login'); 
    };

    const handleRegisterPress = async () => {
        if (!nome || !email || !password || !numero || !cep || !dataNascimento) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (password.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres.');
            return;
        }
        
        if (numero.length < 14) {
            alert('O número de telefone deve ser válido.');
            return;
        }

        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password,
            options: {
                data: {
                    nome_completo: nome,
                    numero_telefone: numero,
                    cep: cep,
                    data_nascimento: dataNascimento,
                }
            }
        });

        setLoading(false);

        if (error) {
            console.log("ERRO DETALHADO DO SUPABASE:", error); 
            Alert.alert('Erro no Cadastro', error.message);
        } else {
            console.log("USUÁRIO CRIADO COM SUCESSO:", data);
            Alert.alert('Sucesso!', 'Conta criada com sucesso!');
            navigation.navigate('Home', { userEmail: data.user.email });
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
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
                    
                    <Text style={styles.brandTitle}>Registre uma nova conta</Text> 
                    
                   
                    <TextInput
                        style={styles.input}
                        placeholder="Nome Completo"
                        placeholderTextColor="#666"
                        value={nome}
                        onChangeText={setNome}
                        autoCapitalize="words"
                        editable={!loading}
                    />

                  
                    <TextInput
                        style={styles.input}
                        placeholder="E-mail"
                        placeholderTextColor="#666"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                    />
                    
                   
                    <TextInputMask
                        type={'custom'}
                        options={{ mask: '99999-999' }}
                        style={styles.input}
                        placeholder="CEP (00000-000)"
                        placeholderTextColor="#666"
                        value={cep} 
                        onChangeText={setCep}
                        keyboardType="numeric"
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

                 
                    <TextInputMask
                        type={'custom'}
                        options={{ mask: '(99)99999-9999' }}
                        style={styles.input}
                        placeholder="Telefone (ex: (00)00000-0000)"
                        placeholderTextColor="#666"
                        value={numero} 
                        onChangeText={setNumero}
                        keyboardType="numeric"
                        editable={!loading}
                    />
                  
                  
                    <TextInputMask
                        type={'datetime'}
                        options={{ format: 'DD/MM/YYYY' }}
                        style={styles.input}
                        placeholder="Data de Nascimento (DD/MM/AAAA)"
                        placeholderTextColor="#666"
                        value={dataNascimento}
                        onChangeText={setDataNascimento}
                        keyboardType="numeric"
                        editable={!loading}
                    />
                    
                 
                    {loading ? (
                        <ActivityIndicator size="large" color="#E65100" style={styles.loader} />
                    ) : (
                        <TouchableOpacity style={styles.buttonRegister} onPress={handleRegisterPress}>
                            <Text style={styles.buttonRegisterText}>Registre-se</Text>
                        </TouchableOpacity>
                    )}
                </View>

          
                <TouchableOpacity onPress={handleGoToLogin} style={styles.loginLinkContainer}>
                    <Text style={styles.textoFraseLink}>Já tem uma conta? <Text style={styles.textolinkBold}>Login !</Text></Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFCA28',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'space-between',
        paddingBottom: 30,
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: '10%',
        paddingTop: 30,
    },
    logo: { 
       width: '100%',
        height: screenHeight * 0.18, 
        alignSelf: 'center', 
        resizeMode: 'contain',
        marginBottom: 10,
    },
    brandTitle: { 
        fontSize: 28, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        color: '#fff',
        marginBottom: 25,
        textShadowColor: 'rgba(0, 0, 0, 0.1)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1
    },
    input: { 
        height: 50, 
        borderColor: '#E65100', 
        borderWidth: 1.5, 
        borderRadius: 25, 
        marginBottom: 14, 
        paddingHorizontal: 20, 
        backgroundColor: '#FFE082', 
        fontSize: 16,
        color: '#000'
    },
    inputPasswordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#E65100',
        borderWidth: 1.5,
        borderRadius: 25,
        marginBottom: 14,
        backgroundColor: '#FFE082', 
        height: 50,
    },
    inputSemBorda: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#000',
    },
    botaoOlho: {
        width: 50,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    textoOlho: {
        fontSize: 18,
    },
    buttonRegister: {
        backgroundColor: '#F27438',
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonRegisterText: {
        color: '#000',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loader: {
        marginVertical: 15,
    },
    loginLinkContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        marginTop: 10
    },
    textoFraseLink: {
        fontSize: 16,
        color: '#fff',
    },
    textolinkBold: {
        fontWeight: 'bold',
        textDecorationLine: 'underline'
    }
});