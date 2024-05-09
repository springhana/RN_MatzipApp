import {getFormDataImages} from '@/utils';
import ImagePicker from 'react-native-image-crop-picker';
import useMuateImages from './queries/useMuateImages';
import {useState} from 'react';
import {ImageUri} from '@/types';
import {Alert} from 'react-native';

interface UseImagePickerProps {
  initialImage: ImageUri[];
}

function useImagePicker({initialImage = []}: UseImagePickerProps) {
  const [imageUris, setImageUris] = useState(initialImage);
  const uploadImages = useMuateImages();

  const addImageUris = (uris: string[]) => {
    if (imageUris.length + uris.length > 5) {
      Alert.alert('이미지 개수 초과', '추가 가능한 이미지는 최대 5개입니다.');
      return;
    }
    setImageUris(prev => [...prev, ...uris.map(uri => ({uri}))]);
  };

  const handleChange = () => {
    ImagePicker.openPicker({
      mediaType: 'photo',
      multiple: true,
      includeBase64: true,
      maxFiles: 5,
      cropperChooseText: '완료',
      cropperCancelText: '취소',
    })
      .then(images => {
        const formData = getFormDataImages(images);
        uploadImages.mutate(formData, {
          onSuccess: data => addImageUris(data),
        });
      })
      .catch(error => {
        if (error.code !== 'E_PICKER_CANCELLED') {
          // 에러메시지 표시
        }
      });
  };

  const deleteImageUri = (uri: string) => {
    const newImageUris = imageUris.filter(image => image.uri !== uri);
    setImageUris(newImageUris);
  };

  const chnageImageUrisOrder = (fromIndex: number, toIndex: number) => {
    const copyImageUris = [...imageUris];
    const [removedImage] = copyImageUris.splice(fromIndex, 1);
    copyImageUris.splice(toIndex, 0, removedImage);
    setImageUris(copyImageUris);
  };

  return {
    imageUris,
    handleChange,
    delete: deleteImageUri,
    changeOrder: chnageImageUrisOrder,
  };
}

export default useImagePicker;
