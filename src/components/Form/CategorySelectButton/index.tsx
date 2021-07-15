import React from 'react';
import { TouchableOpacityProps } from 'react-native';
import { Container, Category, Icon } from './styles';

interface Props extends TouchableOpacityProps {
  title: string;
}

export const CategorySelectButton = ({ title, onPress }: Props) => {
  return (
    <Container onPress={onPress}>
      <Category>{title}</Category>
      <Icon name="chevron-down" />
    </Container>
  );
};
