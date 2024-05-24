import {useEffect} from 'react';

import {MutationFunction, useMutation, useQuery} from '@tanstack/react-query';
import {
  ResponseProfile,
  ResponseToken,
  appleLogin,
  deleteAccount,
  editCategory,
  editProfile,
  getAccessToken,
  getProfile,
  kakaoLogin,
  logout,
  postLogin,
  postSignup,
} from '@/api/auth';
import {UseMutationCustomOptions, UseQueryCustomOptions} from '@/types/common';
import {
  removeEncryptStorage,
  setEncryptStorage,
  removeHeader,
  setHeadere,
} from '@/utils';
import queryClient from '@/api/queryClient';
import {numbers, queryKeys, storageKeys} from '@/constants';
import {Category, Profile} from '@/types';

function useSignup(mutaionOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: postSignup,
    ...mutaionOptions,
  });
}

function useLogin<T>(
  loginAPI: MutationFunction<ResponseToken, T>,
  mutaionOptions?: UseMutationCustomOptions,
) {
  return useMutation({
    mutationFn: loginAPI,
    onSuccess: ({accessToken, refreshToken}) => {
      setHeadere('Authorization', `Bearer ${accessToken}`);
      setEncryptStorage(storageKeys.REFRESH_TOKEN, refreshToken);
    },
    onSettled: () => {
      queryClient.refetchQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
      });
      queryClient.invalidateQueries({
        queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
      });
    },
    ...mutaionOptions,
  });
}

function useEmailLogin(mutaionOptions?: UseMutationCustomOptions) {
  return useLogin(postLogin, mutaionOptions);
}

function useKakaoLogin(mutaionOptions?: UseMutationCustomOptions) {
  return useLogin(kakaoLogin, mutaionOptions);
}

function useAppleLogin(mutaionOptions?: UseMutationCustomOptions) {
  return useLogin(appleLogin, mutaionOptions);
}

function useGetRefreshToken() {
  const {isSuccess, data, isError} = useQuery({
    queryKey: [queryKeys.AUTH, queryKeys.GET_ACCESS_TOKEN],
    queryFn: getAccessToken,
    staleTime: numbers.ACCESS_TOKEN_REFRESH_TIME,
    refetchInterval: numbers.ACCESS_TOKEN_REFRESH_TIME, // 시간 주기에 따라 refetch
    refetchOnReconnect: true, // 자동 갱신 (자동 연결)
    refetchIntervalInBackground: true, // 벡그라운드에서 refetch
  });

  useEffect(() => {
    if (isSuccess) {
      setHeadere('Authorization', `Bearer ${data.accessToken}`);
      setEncryptStorage(storageKeys.REFRESH_TOKEN, data.refreshToken);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError) {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
    }
  }, [isError]);

  return {isSuccess, isError};
}

type ResponseSelectProfile = {categories: Category} & Profile;

const transformPrifleCategory = (
  data: ResponseProfile,
): ResponseSelectProfile => {
  const {BLUE, GREEN, PURPLE, RED, YELLOW, ...rest} = data;
  const categories = {BLUE, GREEN, PURPLE, RED, YELLOW};

  return {categories, ...rest};
};

function useGetProfile(
  queryOptions?: UseQueryCustomOptions<ResponseProfile, ResponseSelectProfile>,
) {
  return useQuery({
    queryFn: getProfile,
    queryKey: [queryKeys.AUTH, queryKeys.GET_PROFILE],
    select: transformPrifleCategory, // <= 반환값을 변경해 줄 수 있다.
    ...queryOptions,
  });
}

function useMutateCategory(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: editCategory,
    onSuccess: newProfile => {
      queryClient.setQueryData(
        [queryKeys.AUTH, queryKeys.GET_PROFILE],
        newProfile,
      );
    },
    ...mutationOptions,
  });
}

function useUpdateProfile(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: editProfile,
    onSuccess: newProfile => {
      // 성공할 경우 쿼리 키를 가져와서 newProfile을 새로운 데이터로 사용한다.
      queryClient.setQueryData(
        [queryKeys.AUTH, queryKeys.GET_PROFILE],
        newProfile,
      );
    },
    ...mutationOptions,
  });
}

function useLogout(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      removeHeader('Authorization');
      removeEncryptStorage(storageKeys.REFRESH_TOKEN);
      queryClient.resetQueries({queryKey: [queryKeys.AUTH]}); // AUTH 관련 키들 모두 리셋
    },

    ...mutationOptions,
  });
}

function useMutateDeleteAccount(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: deleteAccount,
    ...mutationOptions,
  });
}

function useAuth() {
  const signupMutation = useSignup();
  const refreshTokenQuery = useGetRefreshToken();
  const getProfileQuery = useGetProfile({
    enabled: refreshTokenQuery.isSuccess,
  });
  const isLogin = getProfileQuery.isSuccess;
  const loginMutation = useEmailLogin();
  const kakaoLoginMutation = useKakaoLogin();
  const appleLoginMutation = useAppleLogin();
  const logoutMutation = useLogout();
  const profileMutation = useUpdateProfile();
  const deleteAccountMutation = useMutateDeleteAccount({
    onSuccess: () => logoutMutation.mutate(null),
  });
  const categoryMutation = useMutateCategory();

  return {
    signupMutation,
    loginMutation,
    kakaoLoginMutation,
    isLogin,
    getProfileQuery,
    appleLoginMutation,
    logoutMutation,
    profileMutation,
    deleteAccountMutation,
    categoryMutation,
  };
}

export default useAuth;
