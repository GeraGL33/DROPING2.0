import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, SafeAreaView, Text, View, TouchableOpacity, ScrollView, ActivityIndicator, Modal, TextInput, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from '@react-native-picker/picker';

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

const ReportsScreen = () => {
  const pickerRef = useRef(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [showLinePicker, setShowLinePicker] = useState(false);
  const [selectedLine, setSelectedLine] = useState(null);


  useEffect(() => {
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

  const handleDateChange = (date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }

  };


  const filteredReports = reportData.filter(report => {
    const [lineNumber, serialNum, dateString, missingComponents] = report.data.split('|');
    const reportDate = new Date(dateString).toLocaleDateString();
    return report.data && reportDate === selectedDate.toLocaleDateString();
  });

  const handleEditReport = (report) => {
    setSelectedReport(report);
    const [lineNumber, serialNum, dateString, missingComponents] = report.data.split('|');
    setEditedData({ lineNumber, serialNum, dateString, missingComponents });
    setShowEditModal(true);
  };

  const handleSaveChanges = async () => {
    if (selectedReport) {
      const updatedData = `${selectedLine}|${editedData.serialNum}|${editedData.dateString}|${editedData.missingComponents}`;
      await updateDoc(doc(db, "reports", selectedReport.id), { data: updatedData });
      setShowEditModal(false);
    }

  };
  const handleLineseletion = (line) => {
    setSelectedLine(line);
    setShowLinePicker(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Report by date</Text>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.label}>Date</Text>
          <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.inputText}>{selectedDate.toLocaleDateString()}</Text>
            <Ionicons name="calendar-outline" size={24} color="#eb3f59" />
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={showDatePicker}
            mode="date"
            onConfirm={handleDateChange}
            onCancel={() => setShowDatePicker(false)}
            date={selectedDate}
          />
        </View>

        {loading ? (
          <ActivityIndicator size="large" color="#64FFDA" />
        ) : filteredReports.length > 0 ? (
          <View style={styles.reportContainer}>
            {filteredReports.map((report, index) => {
              const [lineNumber, serialNum, dateString, missingComponents] = report.data.split('|');
              const componentsList = missingComponents.split(',').map(item => item.trim());
              return (
                <TouchableOpacity key={index} style={styles.reportBlock} onPress={() => handleEditReport(report)}>
                  <Text style={styles.reportLine}>Number: {lineNumber}</Text>
                  <Text style={styles.reportLine}>Serial Number: {serialNum}</Text>
                  <Text style={styles.reportLine}>Date: {new Date(dateString).toLocaleDateString()}</Text>
                  <Text style={styles.reportLine}>Missing Components:</Text>
                  <View style={styles.componentList}>
                    {componentsList.map((component, compIndex) => (
                      <Text key={compIndex} style={styles.componentItem}>• {component}</Text>
                    ))}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <Text style={styles.noDataText}>No data were found for this date.</Text>
        )}
      </ScrollView>

      <Modal visible={showEditModal} animationType="slide">
        <SafeAreaView style={styles.container}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit Report</Text>

            <Text style={styles.label}>Line Number</Text>
            <TouchableOpacity style={styles.inputContainer} onPress={() => setShowLinePicker(true)}>
              <Text style={styles.inputText}>{selectedLine || 'Select the line'}</Text>
              <Ionicons name="chevron-down" size={24} color="#eb3f59" />
            </TouchableOpacity>


            <Modal visible={showLinePicker} animationType="fade" transparent>
              <View style={styles.pickerModalContainer}>
                <View style={styles.pickerContainer}>
                  <Text style={styles.pickerTitle}>Select Line</Text>
                  <Picker
                    ref={pickerRef}
                    selectedValue={selectedLine}
                    onValueChange={handleLineseletion}
                    style={styles.picker}
                    itemStyle={styles.pickerItem}
                  >
                    {Array.from({ length: 15 }, (_, index) => (
                      <Picker.Item key={index} label={`Line ${index + 1}`} value={`Line ${index + 1}`} />
                    ))}
                  </Picker>
                  <TouchableOpacity style={styles.pickerCloseButton} onPress={() => setShowLinePicker(false)}>
                    <Text style={styles.pickerCloseButtonText}>Confirm</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TextInput
              style={styles.input}
              placeholder="Número de Serie"
              value={editedData.serialNum}
              onChangeText={(text) => setEditedData({ ...editedData, serialNum: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Fecha"
              value={editedData.dateString}
              onChangeText={(text) => setEditedData({ ...editedData, dateString: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Componentes Faltantes"
              value={editedData.missingComponents}
              onChangeText={(text) => setEditedData({ ...editedData, missingComponents: text })}
            />
            <View style={styles.modalButtons}>
              <Button title="Guardar" onPress={handleSaveChanges} />
              <Button title="Cancelar" onPress={() => setShowEditModal(false)} />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};
export default ReportsScreen;


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
    fontSize: 19,
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
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '80%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#282c34',
    marginBottom: 15,
  },
  picker: {
    width: '100%',
    height: 250,
  },
  pickerItem: {
    fontSize: 20,
    color: '#282c34',
  },
  pickerCloseButton: {
    backgroundColor: '#64FFDA',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  pickerCloseButtonText: {
    color: '#282c34',
    fontWeight: 'bold',
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 350,
    marginTop: 350
  },
  inputText: {
    fontSize: 16,
    color: '#8892B0',
    align: 'center',
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
  pickerModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    width: '80%',
    paddingVertical: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    color: '#e20b0b',
    marginTop: 20,
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#64FFDA',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});