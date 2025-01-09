import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Text, Image, Stack, Link, Spinner } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../axiosInstance'; // Importa a instância
import { z } from 'zod';
import { format } from 'date-fns'; // Para formatar a data
import InfiniteScroll from 'react-infinite-scroll-component'; // Importando o Infinite Scroll
import Header from '../components/Header'; // Importando o Header

// Defina o modelo Zod para o usuário e os repositórios
const userSchema = z.object({
  login: z.string(),
  avatar_url: z.string(),
  name: z.string(),
  bio: z.string().nullable(),
  blog: z.string().nullable(),
  twitter_username: z.string().nullable(),
});

const repoSchema = z.object({
  name: z.string(),
  html_url: z.string(),
  stargazers_count: z.number(),  // Mudado para o campo correto
  created_at: z.string(),
});

type User = z.infer<typeof userSchema>;
type Repo = z.infer<typeof repoSchema>;

const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState<User | null>(null); // Tipagem correta para userData
  const [repos, setRepos] = useState<Repo[]>([]); // Tipagem correta para repos
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1); // Adicionando o estado da página
  const [hasMore, setHasMore] = useState(true); // Verifica se ainda há mais repositórios
  const { t } = useTranslation();

  // Função para buscar os dados do usuário e repositórios
  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const userResponse = await axiosInstance.get(`/users/${username}`);
      const repoResponse = await axiosInstance.get(`/users/${username}/repos?per_page=10&page=${page}`);

      // Validação com Zod
      const userValidated = userSchema.parse(userResponse.data);
      const reposValidated = repoResponse.data.map((repo: unknown) => repoSchema.parse(repo));

      // Atualiza o estado com os dados validados
      setUserData(userValidated);
      setRepos((prevRepos) => [...prevRepos, ...reposValidated]); // Adicionando os novos repositórios
      setLoading(false);

      // Se não houver mais repositórios, definimos hasMore como false
      if (reposValidated.length < 10) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err); // Logando o erro
      setError(t("error.userNotFound"));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      fetchData(page); // Carregar dados na primeira renderização
    }
  }, [username, page]);

  const fetchMoreRepos = () => {
    setPage(prevPage => prevPage + 1); // Incrementar a página
  };

  if (loading && page === 1) return <Spinner size="xl" />;
  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box backgroundColor={'#FCFCFC'} >
      {/* Cabeçalho com a logo e a SearchBar */}
      <Header />

      {/* Informações do Usuário */}
      <Stack marginTop={8}>
        <Image src={userData?.avatar_url} alt={userData?.name} borderRadius="full" boxSize="150px" />
        <Text fontSize="2xl">{userData?.name}</Text>
        <Text>{userData?.bio}</Text>
        {userData?.blog && (
          <Link href={userData?.blog}>
            <Button colorScheme="teal">{t("profile.visitWebsite")}</Button>
          </Link>
        )}
        {userData?.twitter_username && (
          <Link href={`https://twitter.com/${userData?.twitter_username}`}>
            <Button colorScheme="twitter">{t("profile.visitTwitter")}</Button>
          </Link>
        )}
      </Stack>

      {/* Repositórios */}
      <Box marginTop={8}>
        <Text fontSize="lg" fontWeight="bold">{t("profile.repositories")}</Text>
        <InfiniteScroll
          dataLength={repos.length} // Tamanho dos repositórios já carregados
          next={fetchMoreRepos} // Função para carregar mais
          hasMore={hasMore} // Condição de quando há mais repositórios
          loader={<Spinner size="xl" />}
          endMessage={<Text>{t("profile.noMoreRepos")}</Text>} // Mensagem quando não há mais repositórios
        >
          <Stack>
            {repos.map((repo, index) => (
              <Box key={index} p={4} borderWidth={1} borderRadius="md">
                <Link href={repo.html_url}>
                  <Text fontWeight="bold">{repo.name}</Text>
                </Link>
                <Text>{t("profile.stars")}: {repo.stargazers_count}</Text>
                <Text>{t("profile.created")}: {format(new Date(repo.created_at), 'dd/MM/yyyy')}</Text>
              </Box>
            ))}
          </Stack>
        </InfiniteScroll>
      </Box>
    </Box>
  );
};

export default Profile;
