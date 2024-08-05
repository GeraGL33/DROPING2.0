import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native';
import { BarCodeScanner } from "expo-barcode-scanner";
import { Ionicons } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDW7ONSg5yL4ZHXhMpJuH8SJEraySuqgO8",
    authDomain: "drop-firebase-a0e56.firebaseapp.com",
    projectId: "drop-firebase-a0e56",
    storageBucket: "drop-firebase-a0e56.appspot.com",
    messagingSenderId: "567200799139",
    appId: "1:567200799139:web:9b9d850f7de21738d92216"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ConsultarDrop = () => {
    const [serialNumber, setSerialNumber] = useState('');
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        })();

        // Escuchar cambios en la colección 'reports'
        const unsubscribe = onSnapshot(collection(db, "reports"), (snapshot) => {
            const reports = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setReportData(reports);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleScanSerialNumber = ({ type, data }) => {
        setSerialNumber(data);
        setShowCameraModal(false);
    };

    const filteredReports = reportData.filter(report => 
        report.data && report.data.split('|')[1] === serialNumber
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.title}>Consultar Reporte</Text>
                </View>

                <View style={styles.formSection}>
                    <Text style={styles.label}>Número de Serie</Text>
                    <TouchableOpacity style={styles.inputContainer} onPress={() => setShowCameraModal(true)}>
                        <Text style={styles.inputText}>{serialNumber || 'Escanear el número de serie'}</Text>
                        <Ionicons name="barcode-outline" size={24} color="#eb3f59" />
                    </TouchableOpacity>

                    {/* Modal para escanear */}
                </View>

                <TouchableOpacity style={styles.scanButton} onPress={() => setShowCameraModal(true)}>
                    <Text style={styles.scanButtonText}>Escanear Número de Serie</Text>
                </TouchableOpacity>

                {loading ? (
                    <ActivityIndicator size="large" color="#64FFDA" />
                ) : filteredReports.length > 0 ? (
                    <View style={styles.reportContainer}>
                        {filteredReports.map((report, index) => {
                            const [lineNumber, serialNum, date, missingComponents] = report.data.split('|');
                            const componentsList = missingComponents.split(',').map(item => item.trim());
                            return (
                                <View key={index} style={styles.reportBlock}>
                                    <Text style={styles.reportLine}>Número de Línea: {lineNumber}</Text>
                                    <Text style={styles.reportLine}>Número de Serie: {serialNum}</Text>
                                    <Text style={styles.reportLine}>Fecha: {new Date(date).toLocaleDateString()}</Text>
                                    <Text style={styles.reportLine}>Componentes Faltantes:</Text>
                                    <View style={styles.componentList}>
                                        {componentsList.map((component, compIndex) => (
                                            <Text key={compIndex} style={styles.componentItem}>• {component}</Text>
                                        ))}
                                    </View>
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <Text style={styles.noDataText}>No se encontraron datos para este número de serie.</Text>
                )}
            </ScrollView>

            <Modal visible={showCameraModal} animationType="slide">
                <View style={styles.modalContainer}>
                    <BarCodeScanner
                        onBarCodeScanned={handleScanSerialNumber}
                        style={StyleSheet.absoluteFillObject}
                    />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setShowCameraModal(false)}>
                        <Ionicons name="close-circle" size={40} color="#eb3f59" />
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        marginTop: 10
    },
    scrollView: {
        padding: 20,
    },
    header: {
        width: '100%',
        backgroundColor: '#282c34',
        alignItems: 'center',
        paddingVertical: 20,
        marginBottom: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#64FFDA',
        fontFamily: 'monospace',
        textTransform: 'uppercase',
        letterSpacing: 1.5,
    },
    formSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#282c34',
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        borderWidth: 1,
        borderColor: '#64FFDA',
        shadowColor: '#000',
        shadowOffset: {
            width: 10,
            height: 5,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    inputText: {
        fontSize: 16,
        color: '#8892B0',
    },
    scanButton: {
        backgroundColor: '#64FFDA',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    scanButtonText: {
        color: '#282c34',
        fontSize: 16,
        fontWeight: 'bold',
    },
    reportContainer: {
        marginTop: 20,
    },
    reportBlock: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        borderColor: '#64FFDA',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    reportLine: {
        fontSize: 16,
        color: '#282c34',
        marginBottom: 5,
    },
    componentList: {
        marginTop: 5,
        marginLeft: 10,
        padding: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 5,
    },
    componentItem: {
        textAlign: 'left',
        color: '#282c34',
        marginBottom: 2,
    },
    noDataText: {
        fontSize: 16,
        color: '#8892B0',
        marginTop: 20,
        textAlign: 'center',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
});

export default ConsultarDrop;
