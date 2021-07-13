import React from 'react';
import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserWrapper,
  UserGreeting,
  UserName,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
} from './styles';
import { HighlightCard } from '../../components/HighlightCard';
import {
  TransactionCard,
  TransactionCardProps,
} from '../../components/TransactionCard';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

const Dashboard = () => {
  const data: DataListProps[] = [
    {
      id: '1',
      type: 'positive',
      title: 'Desenvolvimento de site',
      amount: 'R$ 12.000,00',
      category: { name: 'Vendas', icon: 'dollar-sign' },
      date: '13/04/2020',
    },
    {
      id: '2',
      type: 'negative',
      title: 'Pastel do Jair',
      amount: 'R$ 50,00',
      category: { name: 'Alimentação', icon: 'coffee' },
      date: '13/04/2020',
    },
    {
      id: '3',
      type: 'negative',
      title: 'Aluguel',
      amount: 'R$ 2.000,00',
      category: { name: 'Casa', icon: 'shopping-bag' },
      date: '13/04/2020',
    },
  ];

  return (
    <Container>
      <Header>
        <UserWrapper>
          <UserInfo>
            <Photo
              source={{
                uri: 'https://avatars.githubusercontent.com/u/22116665?v=4',
              }}
            />

            <User>
              <UserGreeting>Olá,</UserGreeting>
              <UserName>Julio!</UserName>
            </User>
          </UserInfo>
          <Icon name="power" />
        </UserWrapper>
      </Header>

      <HighlightCards>
        <HighlightCard
          title={'Entradas'}
          amount={'R$ 17.400,00'}
          lastTransaction={'Última entrada dia 13 de abril'}
          type={'up'}
        />
        <HighlightCard
          title={'Saídas'}
          amount={'R$ 1.259,00'}
          lastTransaction={'Última saída dia 03 de abril'}
          type={'down'}
        />
        <HighlightCard
          title={'Total'}
          amount={'R$ 16.141,00'}
          lastTransaction={'01 à 16 de abril'}
          type={'total'}
        />
      </HighlightCards>

      <Transactions>
        <Title>Listagem</Title>

        <TransactionsList
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionCard data={item} />}
        />
      </Transactions>
    </Container>
  );
};

export default Dashboard;