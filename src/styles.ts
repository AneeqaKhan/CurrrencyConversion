import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '500',
  },
  converterContainer: {
    padding: 20,
    width: '100%',
  },
  dropdown: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
  },
  placeholderStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  selectedTextStyle: {
    fontSize: 16,
    paddingLeft: 10,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputContainer: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 12,
    marginVertical: 30,
    alignItems:'center',
    flexDirection: 'row'
  },
  input: {
    height: 50,
    width:'100%',
    paddingLeft: 10
  },
  equals: {
    alignSelf: 'center',
  },
  conversionText: {
    alignSelf: 'center',
    margin: 15,
    fontSize: 12,
  },
  dropdownItem: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownTextItem: {
    fontSize: 16,
    paddingLeft: 10,
  },
  errorText: {
    color:'red'
  }
});
