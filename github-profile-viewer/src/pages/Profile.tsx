import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Text, Image, Link, Spinner, HStack, VStack, Separator } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../axiosInstance'; // Importa a instância
import { z } from 'zod';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';  // Importando a localidade em português
import InfiniteScroll from 'react-infinite-scroll-component'; // Importando o Infinite Scroll
import Header from '../components/Header'; // Importando o Header
import RepoList from '../components/RepoList.js'; // Importando o Header
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error    
import FollowersIcon from '../icons/followers';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error 
import Twitter from '../icons/twitter'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error 
import Site from '../icons/site'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error 
import Company from '../icons/company'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error 
import Heart from '../icons/heart'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error 
import Loc from '../icons/location'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error 
import Email from '../icons/email'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-expect-error 
import StarIcon from '../icons/star.jsx'


// Defina o modelo Zod para o usuário e os repositórios
const userSchema = z.object({
  login: z.string(),
  avatar_url: z.string(),
  name: z.string(),
  bio: z.string().nullable(),
  blog: z.string().nullable(),
  twitter_username: z.string().nullable(),
  followers: z.number(),
  following: z.number(),
  company: z.string().nullable(),
  location: z.string().nullable(),
  email: z.string().nullable(),
});

const repoSchema = z.object({
  name: z.string(),
  html_url: z.string(),
  stargazers_count: z.number(),  // Mudado para o campo correto
  updated_at: z.string(),
  description: z.string().nullable().optional(),
});

type User = z.infer<typeof userSchema>;
type Repo = z.infer<typeof repoSchema>;

const Profile = () => {
  const { username } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { t } = useTranslation();

  // Função para buscar os dados do usuário e repositórios
  // Função para buscar os dados do usuário e repositórios
  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const userResponse = await axiosInstance.get(`/users/${username}`);

      // Verificar se o usuário realmente existe (erro 404)
      if (userResponse.status === 404) {
        setError(t("error.userNotFound"));
        setLoading(false);
        return; // Parar a execução se o usuário não for encontrado
      }

      const repoResponse = await axiosInstance.get(`/users/${username}/repos?per_page=10&page=${page}`);

      // Validação com Zod
      const userValidated = userSchema.parse(userResponse.data);
      const reposValidated = repoResponse.data.map((repo: unknown) => repoSchema.parse(repo));

      if (!userValidated.email) {
        console.warn("E-mail não disponível para o usuário:", username);
      }

      setUserData(userValidated);
      setRepos((prevRepos) => {
        const newRepos = [...prevRepos, ...reposValidated];
        return Array.from(new Set(newRepos.map(repo => repo.name)))  // Garantindo que o nome do repositório seja único
          .map(name => newRepos.find(repo => repo.name === name));  // Extrai os objetos únicos baseados no nome
      });
      setLoading(false);

      if (reposValidated.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true); // Garantir que a flag continue verdadeira se ainda houver mais repositórios
      }

    } catch (err) {
      console.error(err);
      setError(t("Usuário não possui repositórios publicados até o momento")); // Tratamento para erro genérico
      setLoading(false);
    }
  };


  useEffect(() => {
    if (username) {
      setUserData(null);
      setRepos([]);
      setError(null);
      setPage(1);
      setHasMore(true);
      setLoading(true);
      fetchData(1);
    }
  }, [username]);

  const fetchMoreRepos = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchData(nextPage); // Chama a função para buscar os repositórios da próxima página
        return nextPage;  // Atualiza o estado da página
      });
    }
  };

  if (error) return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      position="absolute"
      top="0"
      left="0"
      right="0"
      bottom="0"
      backgroundColor="white"
      zIndex={999}
    >
      <Box
        backgroundColor="red.500"
        color="white"
        padding="16px"
        borderRadius="8px"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="90%"
        maxWidth="500px"
      >
        <Text fontSize="lg" fontWeight="bold">
          {error && (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              backgroundColor="rgba(0, 0, 0, 0.5)"
              zIndex={999}
            >
              <Box
                backgroundColor="red.500"
                color="white"
                padding="16px"
                borderRadius="8px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                width="90%"
                maxWidth="500px"
              >
                <Text fontSize="lg" fontWeight="bold">
                  {error}
                </Text>
                <Button
                  onClick={() => setError(null)} // Fechar a mensagem de erro
                  backgroundColor="transparent"
                  border="none"
                  color="white"
                  fontSize="xl"
                >
                  ×
                </Button>
              </Box>
            </Box>
          )}
        </Text>
      </Box>
    </Box>
  );
  return (
    <Box backgroundColor={'#FCFCFC'}>
      <Header />

      <HStack
        paddingBlock={'80px'}
        paddingInline={'112px'}
        display={'flex'}
        justifyContent={'flex-start'}  // Ajustando para garantir que as colunas comecem do topo
        alignItems={'flex-start'}  // Alinha ambas as colunas ao topo
      >
        {/* Primeira Coluna */}
        <VStack
          align="flex-start"
          marginBottom={4}  // Ajusta o espaçamento entre os itens dentro da coluna
          borderRadius={'4px'}
          marginRight={"32px"}
        >
          <HStack align="flex-start" display={'flex'} flexDirection={'column'} backgroundColor={'#FFFFFF'} paddingBlock={'24px'}
            paddingInline={'16px'}>

            {/* Div para Imagem, Nome e @username lado a lado */}
            <HStack gap={4}>
              {/* Coluna para a Imagem */}
              <Image
                src={userData?.avatar_url}
                alt={userData?.name}
                borderRadius="full"
                boxSize="48px"
              />

              {/* Coluna para o Nome e o @username */}
              <VStack align="flex-start" >
                <Text fontSize="20px" fontWeight="bold" color="black" marginBottom={'4px'}>
                  {userData?.name}
                </Text>
                <Text color='#A0AEC0' fontSize={'14px'} fontWeight={'normal'}>
                  @{userData?.login}
                </Text>
              </VStack>
            </HStack>

            {/* Bio */}
            {userData?.bio && (
              <Text color="#4A5568" marginBottom={'24px'} maxWidth={'380px'} fontSize={'16px'} marginTop={'16px'}>
                {userData?.bio}
              </Text>
            )}

            {/* Informações de seguidores e seguindo */}
            <HStack>
              <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} >
                <FollowersIcon width="24px" height="24px" />
                <Text fontSize="lg" color="#4A5568" marginLeft={'8px'}>
                  {userData?.followers} {t("profile.followers")}
                </Text>
              </Box>
            </HStack>
            <HStack>
              <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                <Heart width="24px" height="24px" />
                <Text fontSize="lg" color="#4A5568" marginLeft={'8px'}>
                  {userData?.following} {t("profile.following")}
                </Text>
              </Box>
            </HStack>

            {/* Informações adicionais */}
            <VStack align="flex-start" marginTop={'24px'}>
              {userData?.company &&
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Company width="24px" height="24px" />
                  <Text color="#4A5568" marginLeft={'8px'}>{userData.company}</Text>
                </Box>}
              {userData?.location &&
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Loc width="24px" height="24px" />
                  <Text color="#4A5568" marginLeft={'8px'}> {userData.location}</Text>
                </Box>}
              {userData?.email ? (
                <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                  <Email width="24px" height="24px" />
                  <Text color="#4A5568" marginLeft={'8px'}>{userData.email}</Text>
                </Box>
              ) : (
                <Text color="#A0AEC0" fontStyle="italic">
                  {t("profile.emailNotAvailable")}
                </Text>
              )}
              {userData?.blog && (
                <Link href={userData.blog} >
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Site width="24px" height="24px" />
                    <Button
                      margin={'0px'}
                      padding={'0px 0px'}
                      color={'#4A5568'}
                      title={userData.blog}
                      marginLeft={'8px'}
                    >
                      {userData.blog}
                    </Button>
                  </Box>
                </Link>
              )}
              {userData?.twitter_username && (
                <Link href={`https://twitter.com/${userData?.twitter_username}`} >
                  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                    <Twitter width="24px" height="24px" />
                    <Button colorScheme="twitter" color={'#4A5568'} padding={'0px 0px'} marginLeft={'8px'}>
                      {userData.twitter_username}
                    </Button>
                  </Box>
                </Link>
              )}
            </VStack>

          </HStack>
         {/* Botão de Contato */}
<Button
  color={'white'}
  backgroundColor={'#8C19D2'}
  _hover={{
    backgroundColor: "#7A14C2",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
  }}
  transition="all 0.3s ease-in-out"
  width="full"
  marginTop={4}
  onClick={() => {
    if (userData?.email) {
      window.location.href = `mailto:${userData.email}`;
    } else if (userData?.twitter_username) {
      window.location.href = `https://twitter.com/${userData.twitter_username}`;
    } else if (userData?.blog) {
      window.location.href = userData.blog;
    }
  }}
>
  {t("profile.contact")}
</Button>



        </VStack>

        {/* Segunda Coluna (Repositórios) */}
        <VStack
          id="scrollable"
          align="flex-start"
          flex="1"
          maxHeight="calc(100vh - 80px)" // Altura dinâmica
          overflow="auto" // Scroll gerenciado aqui
          backgroundColor={'#FFFFFF'}
          borderRadius={'4px'}
          padding={'24px'}
          className="scrollable" // Aplicando a classe CSS
          maxWidth={'856px'}
        >
          {username && <RepoList username={username} setRepos={setRepos} />}
          <InfiniteScroll
            dataLength={repos.length}
            next={fetchMoreRepos}
            hasMore={hasMore}
            loader={<Spinner size="xl" />}
            scrollableTarget="scrollable" // Indica que o scroll deve ser gerenciado pelo `VStack`
            endMessage={<Text color="black">{t("profile.noMoreRepos")}</Text>}
          >
            {repos.map((repo, index) => (
              <React.Fragment key={index}>
                <Box
                  key={index}
                  p={4}
                  borderRadius="md"
                  width="full"
                  marginBottom={4}
                  _hover={{ backgroundColor: "#FCFCFC", cursor: "pointer" }}
                >
                  <Link href={repo.html_url}>
                    <Text fontWeight="bold" fontSize="lg" color="#171923">
                      {repo.name}
                    </Text>
                  </Link>

                  <Text color="#4A5568" fontSize="16px" marginTop={2}>
                    {repo.description || t("profile.noDescription")}
                  </Text>

                  <HStack gap={"8px"} marginTop={4} color="#4A5568" justify="flex-start">
                    <HStack>
                      <StarIcon width="24px" height="24px" color="#F6AD55" />
                      <Text color={'#4A5568'} fontSize={'14px'}>{repo.stargazers_count}</Text>
                    </HStack>
                    {/* Separador */}
                    <Text color={'#4A5568'} fontSize={'14px'}>•</Text>
                    <HStack>
                      <Text color={'#4A5568'} fontSize={'14px'}>{`${t("profile.updated")} ${formatDistanceToNow(new Date(repo.updated_at), { locale: ptBR })}`}</Text>
                    </HStack>
                  </HStack>
                </Box>
                {index < repos.length - 1 && <Separator borderColor="gray.200" my={'16px'} />}
              </React.Fragment>
            ))}
          </InfiniteScroll>
        </VStack>
      </HStack>
    </Box>
  );
};

export default Profile;
