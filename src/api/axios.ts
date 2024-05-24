import axios from 'axios';

import {Platform} from 'react-native';
import Config from 'react-native-config';

const axiosInstance = axios.create({
  baseURL:
    Platform.OS === 'android'
      ? Config.IPCONFIG // http://192.168.68.53:3030, http://10.0.2.2:3030
      : 'http://localhost:3030',

  withCredentials: true,
});

export default axiosInstance;
