import React from 'react';
import { categories } from '../../utils/categories';
import {
  Container,
  Title,
  Amount,
  Footer,
  Category,
  Icon,
  CategoryName,
  Date as DateText,
} from './styles';

interface Category {
  name: string;
  icon: string;
}

export interface TransactionCardProps {
  type: 'positive' | 'negative';
  name: string;
  amount: string;
  category: string;
  date: string;
}

interface Props {
  data: TransactionCardProps;
}

const TransactionCard = ({ data }: Props) => {
  const { name, amount, category, date, type } = data;
  const selectedCategory = categories.find((item) => item.key === category);

  const formatDateToBR = (date: string) => {
    return Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(new Date(date));
  };

  return (
    <Container>
      <Title>{name}</Title>
      <Amount type={type}>
        {type === 'negative' && '- '}
        {amount}
      </Amount>
      <Footer>
        <Category>
          <Icon name={selectedCategory?.icon} />
          <CategoryName>{selectedCategory?.name}</CategoryName>
        </Category>
        <DateText>{formatDateToBR(date)}</DateText>
      </Footer>
    </Container>
  );
};

export { TransactionCard };
