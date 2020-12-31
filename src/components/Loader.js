import React from 'react';
import {View, ActivityIndicator, Text, StyleSheet, Modal} from 'react-native';

const Loader = (props) => {
  return (
    <>
      {props.status === true && (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={props.status}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <ActivityIndicator size="large" />
                <Text style={styles.modalText}>{props.text}</Text>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 100,
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
  modalText: {
    fontSize: 20,
  },
});
export default Loader;
