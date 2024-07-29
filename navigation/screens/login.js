import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Iniciando sesión con:', email, password);
  };

  return (
    /////////////////////////////////Titulo de la aplicacion y el contenedor donde se encuentra////////////////////////////////////////////////////
    <View style={styles.container}>

      <View style={styles.logoContainer}>

        <Text style={styles.appName}>LOGIN</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={24} color="#64FFDA" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Mail"
            placeholderTextColor="#8E8E93"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={24} color="#64FFDA" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#8E8E93"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={[styles.loginButton, styles.buttonShadow]} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>¿You don't have an account?</Text>
        <TouchableOpacity>
          <Text style={[styles.signupText, styles.signupLink]}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>

  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#282c34',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,

  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
    
  },
  logo: {
    width: 100,
    height: 100,
  },
  appName: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#64FFDA',
    marginTop: 10,
    
  },
  formContainer: {
    width: '100%',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1f24',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginVertical: 10,
    
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 19,
    color: '#ffffff',
    
  },
  loginButton: {
    backgroundColor: '#64FFDA',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,

    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#282c34',
    
  },
  signupContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  signupText: {
    fontSize: 14,
    color: '#8E8E93',
    
  },
  signupLink: {
    color: '#64FFDA',
    marginLeft: 5,
    
  },
});
