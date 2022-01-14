import { StyleSheet, useWindowDimensions } from 'react-native';

 

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical:2,
    paddingHorizontal:10,
  },
  image: {
    height: 50,
    width: 50,
    borderRadius: 30,
    marginRight: 10,
    backgroundColor:"#000"
  },
  badgeContainer: {
    backgroundColor: '#2c6bed',
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fafafa',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 41,
    top: 2,
  },
  badgeText: {
    color: '#fafafa',
    fontSize: 12
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 3,
  },
  text: {
    color: 'grey',
  }
});

export default styles;