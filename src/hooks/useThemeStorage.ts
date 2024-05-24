import useThemeStore from '@/store/useThemeStore';
import {ThemeMode} from '@/types';
import {getEncryptStorage, setEncryptStorage} from '@/utils';
import {useEffect} from 'react';
import {useColorScheme} from 'react-native';

function useThemeStorage() {
  const systemTheme = useColorScheme(); // 현재 디바이스 다크모드인지 설정아는 방법
  const {theme, isSystem, setTheme, setSystemTheme} = useThemeStore();

  const setMode = async (mode: ThemeMode) => {
    await setEncryptStorage('themeMode', mode);
    setTheme(mode);
  };

  const setSystem = async (flag: boolean) => {
    await setEncryptStorage('themeSystem', flag);
    setSystemTheme(flag);
  };

  // 재실행 했을 경우 설정 정보를 가져오기 위해 useEffect 사용
  useEffect(() => {
    async () => {
      const mode = (await getEncryptStorage('themeMode')) ?? 'light';
      const systemMode = (await getEncryptStorage('themeSystem')) ?? 'false';
      const newMode = systemMode ? systemTheme : mode;
      setTheme(newMode);
      setSystemTheme(systemMode);
    };
  }, []);

  return {theme, isSystem, setMode, setSystem};
}

export default useThemeStorage;
