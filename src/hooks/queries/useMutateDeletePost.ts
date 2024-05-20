import {deletePost} from '@/api';
import queryClient from '@/api/queryClient';
import {queryKeys} from '@/constants';
import {Marker, UseMutationCustomOptions} from '@/types';
import {useMutation} from '@tanstack/react-query';

function useMutateDeletePost(mutationOptions?: UseMutationCustomOptions) {
  return useMutation({
    mutationFn: deletePost,
    onSuccess: deleteId => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.POST, queryKeys.GET_POST],
      });
      //   queryClient.invalidateQueries({
      //     queryKey: [queryKeys.MARKER, queryKeys.GET_MARKERS],
      //   });

      // 직접 업데이트
      queryClient.setQueryData<Marker[]>(
        [queryKeys.MARKER, queryKeys.GET_MARKERS],
        existingMarkers => {
          return existingMarkers?.filter(marker => marker.id !== deleteId);
        },
      );
    },
    ...mutationOptions,
  });
}

export default useMutateDeletePost;
