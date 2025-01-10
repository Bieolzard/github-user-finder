import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, Text, Image, Link, Spinner, HStack, VStack, Separator } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import axiosInstance from '../axiosInstance';
import { z } from 'zod';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import InfiniteScroll from 'react-infinite-scroll-component';
import Header from '../components/Header';
import RepoList from '../components/RepoList.js';
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
  stargazers_count: z.number(),
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

  const fetchData = async (page: number) => {
    try {
      setLoading(true);
      const userResponse = await axiosInstance.get(`/users/${username}`);

      if (userResponse.status === 404) {
        setError(t("error.userNotFound"));
        setLoading(false);
        return;
      }

      const repoResponse = await axiosInstance.get(`/users/${username}/repos?per_page=10&page=${page}`);
      const userValidated = userSchema.parse(userResponse.data);
      const reposValidated = repoResponse.data.map((repo: unknown) => repoSchema.parse(repo));

      if (!userValidated.email) {
        console.warn("E-mail não disponível para o usuário:", username);
      }
      setUserData(userValidated);
      setRepos((prevRepos) => {
        const newRepos = [...prevRepos, ...reposValidated];
        return Array.from(new Set(newRepos.map(repo => repo.name)))
          .map(name => newRepos.find(repo => repo.name === name));
      });
      setLoading(false);

      if (reposValidated.length < 10) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }

    } catch (err) {
      console.error(err);
      setError(t("Usuário não possui repositórios publicados até o momento"));
      setLoading(false);
    }
  };

  useEffect(() => {
    if (username) {
      setLoading(true);
      setError(null);
      fetchData(1);
    }
  }, [username]);


  const fetchMoreRepos = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => {
        const nextPage = prevPage + 1;
        fetchData(nextPage);
        return nextPage;
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
                  onClick={() => setError(null)}
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
        paddingBlock={['0', '0', '80px']}
        paddingInline={['0', '0', '112px']}
        display={'flex'}
        justifyContent={'flex-start'}
        alignItems={'flex-start'}
        flexDirection={['column', 'column', 'row']}
      >

        <VStack
          align="flex-start"
          marginBottom={4}
          borderRadius={'4px'}
          marginRight={['0', '0', '32px']}
          width={['100%', '100%', 'auto']}
          backgroundColor={['#EADDFF', '#EADDFF', '#FFFFFF']}
          padding={['16px', '16px', '0']}
        >

          <HStack
            align="center"
            display={'flex'}
            flexDirection={['row', 'row', 'row']}
            backgroundColor={'inherit'}
            paddingBlock={'24px'}
            paddingInline={'16px'}
            width="100%"
            gap={4}
          >
            <Image
              src={userData?.avatar_url}
              alt={userData?.name}
              borderRadius="full"
              boxSize={['40px', '48px', '60px']}
            />
            <VStack align={['flex-start', 'flex-start', 'flex-start']} marginTop={['16px', '0']} flexDirection={['column', 'column', 'column']} gap={4}>
              <Text fontSize={['16px', '18px', '20px']} fontWeight="bold" color="black" marginBottom={'4px'}>
                {userData?.name}
              </Text>
              <Text color='#A0AEC0' fontSize={['12px', '14px', '16px']} fontWeight={'normal'}>
                @{userData?.login}
              </Text>
            </VStack>
          </HStack>

          <HStack gap={4} marginTop={4}>
            <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
              <FollowersIcon width="24px" height="24px" />
              <Text fontSize="lg" color="#4A5568" marginLeft={'8px'}>
                {userData?.followers} {t("profile.followers")}
              </Text>
            </Box>
            <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
              <Heart width="24px" height="24px" />
              <Text fontSize="lg" color="#4A5568" marginLeft={'8px'}>
                {userData?.following} {t("profile.following")}
              </Text>
            </Box>
          </HStack>

          {userData?.bio && (
            <Text color="#4A5568" marginBottom={'24px'} maxWidth={'380px'} fontSize={'16px'} marginTop={'16px'}>
              {userData?.bio}
            </Text>
          )}

          <VStack align="flex-start" marginTop={'24px'}>
            {userData?.company && (
              <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                <Company width="24px" height="24px" />
                <Text color="#4A5568" marginLeft={'8px'}>{userData.company}</Text>
              </Box>
            )}
            {userData?.location && (
              <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                <Loc width="24px" height="24px" />
                <Text color="#4A5568" marginLeft={'8px'}>{userData.location}</Text>
              </Box>
            )}
            {userData?.email ? (
              <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                <Email width="24px" height="24px" />
                <Text color="#4A5568" marginLeft={'8px'}>{userData.email}</Text>
              </Box>
            ) : (
              <Text color="#A0AEC0" fontStyle="italic">
                {t("profile.emailNotAvailable")}
              </Text>
            )}
            {userData?.blog && (
              <Link href={userData.blog}>
                <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                  <Site width="24px" height="24px" />
                  <Button
                    margin={'0px'}
                    padding={'0px 0px'}
                    color={'#4A5568'}
                    title={userData.blog}
                    marginLeft={'8px'}
                    background={'transparent'}
                  >
                    {userData.blog}
                  </Button>
                </Box>
              </Link>
            )}
            {userData?.twitter_username && (
              <Link href={`https://twitter.com/${userData?.twitter_username}`}>
                <Box display={'flex'} justifyContent={'flex-start'} alignItems={'center'}>
                  <Twitter width="24px" height="24px" />
                  <Button colorScheme="twitter" color={'#4A5568'} padding={'0px 0px'} marginLeft={'8px'}>
                    {userData.twitter_username}
                  </Button>
                </Box>
              </Link>
            )}
          </VStack>

          <Button
            display={['none', 'none', 'block']} // Botão visível apenas em desktop
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

        <VStack
          id="scrollable"
          align="flex-start"
          flex="1"
          maxHeight="calc(100vh - 80px)"
          overflow="auto"
          backgroundColor={'#FFFFFF'}
          borderRadius={'4px'}
          padding={['0', '0', '24px']}
          className="scrollable"
          maxWidth={'856px'}
          width="100%"
          marginTop={['24px', '0']}
        >
          {username && <RepoList username={username} setRepos={setRepos} />}
          <InfiniteScroll
            dataLength={repos.length}
            next={fetchMoreRepos}
            hasMore={hasMore}
            loader={<Spinner size="xl" />}
            scrollableTarget="scrollable"
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
