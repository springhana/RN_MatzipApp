import {createPost} from '@/api';
import queryClient from '@/api/queryClient';
import {queryKeys} from '@/constants';
import {Marker} from '@/types';
import {UseMutationOptionsCustomOptions} from '@/types/common';
import {useMutation} from '@tanstack/react-query';

function useMutateCreatePost(
  mutationOptions?: UseMutationOptionsCustomOptions,
) {
  return useMutation({
    mutationFn: createPost,
    onSuccess: newPost => {
      // queryClient.invalidateQueries({
      //   queryKey: [queryKeys.MARKER, queryKeys.GET_MARKERS],
      // });

      // 서버에서 데이터를 직접 보내주고 있다면 캐쉬를 직접 업데이트 하면서 네트워크 장점을 줄 일 수 있다.
      queryClient.setQueryData<Marker[]>(
        [queryKeys.MARKER, queryKeys.GET_MARKERS],
        existingMarkers => {
          const newMarker = {
            id: newPost.id,
            latitude: newPost.latitude,
            longitude: newPost.longitude,
            color: newPost.color,
            score: newPost.score,
          };

          return existingMarkers
            ? [...existingMarkers, newMarker]
            : [newMarker];
        },
      );
    },
    ...mutationOptions,
  });
}

export default useMutateCreatePost;
