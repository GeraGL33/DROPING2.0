import { React, useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, Modal, TextInput, Button, ScrollView } from 'react-native';
import { BarCodeScanner } from "expo-barcode-scanner";

import { Ionicons } from '@expo/vector-icons';


const ConsultarDrop = () => {
    const [serialNumber, setSerialNumber] = useState('');
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const handleScanSerialNumber = ({ type, data }) => {
        setSerialNumber(data);
        setScannedBarcodes([...scannedBarcodes, { type, data }]);
        setShowCameraModal(false);
    };

    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.title}>View Drop</Text>
                </View>



                <View style={styles.formSection}>
                    <Text style={styles.label}>Serial Number</Text>


                    <TouchableOpacity style={styles.inputContainer} onPress={() => setShowCameraModal(true)}>
                        <Text style={styles.inputText}>{serialNumber || 'Scan the serial number'}</Text>
                        <Ionicons name="barcode-outline" size={24} color="#eb3f59" />
                    </TouchableOpacity>


                    <Modal visible={showCameraModal} animationType="slide">
                        <SafeAreaView style={styles.modalContainer}>
                            {hasPermission === null ? (
                                <Text>Soliciting the permission to use the camera...</Text>
                            ) : hasPermission === false ? (
                                <Text> Permission to use the camera has not been granted.</Text>
                            ) : (
                                <BarCodeScanner
                                    onBarCodeScanned={handleScanSerialNumber}
                                    style={StyleSheet.absoluteFillObject}
                                />
                            )}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setShowCameraModal(false)}
                            >
                                <Text style={styles.closeButtonText}>Close </Text>
                            </TouchableOpacity>
                        </SafeAreaView>
                    </Modal>

                </View>
            </ScrollView>
        </SafeAreaView>

    );
};

export default ConsultarDrop;

const styles = StyleSheet.create(
    {
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
        formContainer: {
            marginBottom: 20,

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

        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 350,
            marginTop: 350

        },
        closeButton: {
            backgroundColor: '#64FFDA',
            padding: 10,
            borderRadius: 5,
            marginTop: 150,
            marginLeft: 255
        },
        closeButtonText: {
            color: '#282c34',
            fontWeight: 'bold',
        },




    });