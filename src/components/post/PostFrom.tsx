import React, {useEffect, useRef, useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet, ScrollView} from 'react-native';
import Octicons from 'react-native-vector-icons/Octicons';
import {LatLng} from 'react-native-maps';
import {useNavigation} from '@react-navigation/core';
import {StackNavigationProp} from '@react-navigation/stack';
import {FeedStackParamList} from '@/navigations/stack/FeedStackNavigator';

import {colors} from '@/constants';
import InputField from '@/components/common/InputField';
import CustomButton from '@/components/common/CustomButton';
import {TextInput} from 'react-native-gesture-handler';
import useForm from '@/hooks/useForm';
import {getDateWithSeparator, validateAddPost} from '@/utils';
import AddPostHeaderRight from '@/components/post/AddPostHeaderRight';
import useMutateCreatePost from '@/hooks/queries/useMutateCreatePost';
import {MarkerColor} from '@/types/domain';
import useGetAddress from '@/hooks/useGetAddress';
import MarkerSelector from '@/components/post/MarkerSelector';
import ScoreInput from '@/components/post/ScoreInput';
import DataPickerOption from '@/components/post/DataPickerOption';
import useModal from '@/hooks/useModal';
import ImageInput from '@/components/post/ImageInput';
import usePermission from '@/hooks/usePermission';
import useImagePicker from '@/hooks/useImagePicker';
import PreviewImageList from '@/components/common/PreviewImageList';
import useDetailStore from '@/store/useDetailPostStore';
import useMutateUpdatePost from '@/hooks/queries/useMutateUpdatePost';
import useThemeStore from '@/store/useThemeStore';

interface PostFromProps {
  isEdit?: boolean;
  location: LatLng;
}

function PostFrom({location, isEdit = false}: PostFromProps) {
  const {theme} = useThemeStore();
  const navigation = useNavigation<StackNavigationProp<FeedStackParamList>>();
  const descriptionRef = useRef<TextInput | null>(null);
  const createPost = useMutateCreatePost();
  const updatePost = useMutateUpdatePost();
  const {detailPost} = useDetailStore();
  const isEditMode = isEdit && detailPost; // 수정 하는 상태
  const address = useGetAddress(location);
  const addPost = useForm({
    initialValue: {
      title: isEditMode ? detailPost.title : '',
      description: isEditMode ? detailPost.description : '',
    },
    validate: validateAddPost,
  });

  const [markerColor, setMarkerColor] = useState<MarkerColor>(
    isEditMode ? detailPost.color : 'RED',
  );
  const [score, setScore] = useState(isEditMode ? detailPost.score : 5);
  const [date, setDate] = useState(
    isEditMode ? new Date(String(detailPost.date)) : new Date(),
  );
  const [isPicked, setisPicked] = useState(false);
  const datePickerModal = useModal();
  const imagePicker = useImagePicker({
    initialImage: isEditMode ? detailPost?.images : [],
  });
  usePermission('PHOTO');

  const handleConfirmDate = () => {
    setisPicked(true);
    datePickerModal.hide();
  };

  const handleChangeDate = (pickedDate: Date) => {
    setDate(pickedDate);
  };

  const handleSelectMarker = (name: MarkerColor) => {
    setMarkerColor(name);
  };

  const handleChangeScore = (score: number) => {
    setScore(score);
  };

  const handleSubmit = () => {
    const body = {
      date,
      title: addPost.values.title,
      description: addPost.values.description,
      color: markerColor,
      score,
      imageUris: imagePicker.imageUris,
    };

    if (isEditMode) {
      // update
      updatePost.mutate(
        {id: detailPost.id, body},
        {onSuccess: () => navigation.goBack()},
      );
      return;
    }

    createPost.mutate(
      {address, ...location, ...body},
      {
        onSuccess: () => navigation.goBack(),
      },
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => AddPostHeaderRight(handleSubmit),
    });
  }, [handleSubmit, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <InputField
            value={address}
            disabled
            icon={
              <Octicons
                name="location"
                size={16}
                color={colors[theme].GRAY_500}
              />
            }
          />
          <CustomButton
            variant="outlined"
            size="large"
            label={
              isPicked || isEditMode
                ? getDateWithSeparator(date, '. ')
                : '날짜 선택'
            }
            onPress={datePickerModal.show}
          />
          <InputField
            placeholder="제목을 입력하세요"
            error={addPost.errors.title}
            touched={addPost.touched.title}
            blurOnSubmit={false}
            returnKeyType="next"
            onSubmitEditing={() => descriptionRef.current?.focus()}
            {...addPost.getTextInputProps('title')}
          />
          <InputField
            ref={descriptionRef}
            placeholder="기록하고 싶은 내용을 입력하세요. (선택)"
            error={addPost.errors.description}
            touched={addPost.touched.description}
            multiline
            returnKeyType="next"
            {...addPost.getTextInputProps('description')}
          />
          <MarkerSelector
            score={score}
            markerColor={markerColor}
            onPressMarker={handleSelectMarker}
          />
          <ScoreInput score={score} onChangeScore={handleChangeScore} />
          <View style={styles.imagesViewer}>
            <ImageInput onChange={imagePicker.handleChange} />
            <PreviewImageList
              imageUris={imagePicker.imageUris}
              onDelete={imagePicker.delete}
              onChangeOrder={imagePicker.changeOrder}
              showOption
            />
          </View>
          <DataPickerOption
            date={date}
            isVisible={datePickerModal.isVisible}
            onChangeDate={handleChangeDate}
            onConfirmDate={handleConfirmDate}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    marginBottom: 10,
  },
  inputContainer: {
    gap: 20,
    marginBottom: 20,
  },
  imagesViewer: {
    flexDirection: 'row',
  },
});

export default PostFrom;
