import {uploadImages} from '@/api';
import {UseMutationOptionsCustomOptions} from '@/types';
import {useMutation} from '@tanstack/react-query';

function useMuateImages(mutationOptions?: UseMutationOptionsCustomOptions) {
  return useMutation({
    mutationFn: uploadImages,
    ...mutationOptions,
  });
}
export default useMuateImages;
