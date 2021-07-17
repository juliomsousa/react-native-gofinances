import React, { useState, useEffect, useCallback } from 'react';
import { HighlightCard } from '../../components/HighlightCard';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import { useTheme } from 'styled-components';
import {
  TransactionCard,
  TransactionCardProps,
} from '../../components/TransactionCard';
import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserWrapper,
  UserGreeting,
  UserName,
  LogoutButton,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LoadContainer,
} from './styles';

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HighlightProps {
  amount: string;
  lastTransaction: string;
}
interface HighlightData {
  entries: HighlightProps;
  expenses: HighlightProps;
  total: HighlightProps;
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>(
    {} as HighlightData
  );

  const theme = useTheme();

  const getLastTransactionDate = (
    collection: DataListProps[],
    type: 'positive' | 'negative'
  ) => {
    const col = collection
      .filter((transaction) => transaction.type === type)
      .map((transaction) => new Date(transaction.date).getTime());

    const lastTransaction = new Date(Math.max.apply(Math, col));

    if (col.length === 0) {
      return null;
    }

    return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
      'pt-BR',
      {
        month: 'long',
      }
    )}`;
  };

  const loadTransactions = async () => {
    let entriesSum = 0;
    let expensesSum = 0;

    const dataKey = '@gofinances:transactions';

    const response = await AsyncStorage.getItem(dataKey);

    const parsedData = response ? JSON.parse(response!) : [];

    const transactionsFormatted: DataListProps[] = parsedData.map(
      (item: DataListProps) => {
        if ((item.type === 'positive')) {
          entriesSum += Number(item.amount);
        } else {
          expensesSum += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        });

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date: item.date,
        };
      }
    );

    setTransactions(transactionsFormatted);

    const lastTransactionsEntry = getLastTransactionDate(
      transactionsFormatted,
      'positive'
    );
    const lastTransactionsExpense = getLastTransactionDate(
      transactionsFormatted,
      'negative'
    );
    const totalInterval =
      lastTransactionsEntry || lastTransactionsExpense
        ? `01 a ${lastTransactionsExpense || lastTransactionsEntry}`
        : 'Sem transações';

    const total = entriesSum - expensesSum;

    setHighlightData({
      entries: {
        amount: entriesSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTransactionsEntry
          ? `Última entrada dia ${lastTransactionsEntry}`
          : 'Sem entradas',
      },
      expenses: {
        amount: expensesSum.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: lastTransactionsExpense
          ? `Última saída dia ${lastTransactionsExpense}`
          : 'Sem saídas',
      },
      total: {
        amount: total.toLocaleString('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }),
        lastTransaction: totalInterval,
      },
    });
    console.log(transactionsFormatted);
    setIsLoading(false);
  };

  useEffect(() => {
    loadTransactions();
    // AsyncStorage.clear()
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );

  return (
    <Container>
      {isLoading ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size={'large'} />
        </LoadContainer>
      ) : (
        <>
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

              <LogoutButton onPress={() => {}}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighlightCards>
            <HighlightCard
              title={'Entradas'}
              amount={highlightData.entries.amount}
              lastTransaction={highlightData.entries.lastTransaction}
              type={'up'}
            />
            <HighlightCard
              title={'Saídas'}
              amount={highlightData.expenses.amount}
              lastTransaction={highlightData.expenses.lastTransaction}
              type={'down'}
            />
            <HighlightCard
              title={'Total'}
              amount={highlightData.total.amount}
              lastTransaction={highlightData.total.lastTransaction}
              type={'total'}
            />
          </HighlightCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionsList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
};

export { Dashboard };
