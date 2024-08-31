"use client";

import SearchBar from "@/components/common/searchbar";
import CenteredMessage from "@/components/utils/message/CenteredMessage";
import { useAuth } from "@/hooks";
import { ModuleRegistered, ModuleRegistereds } from "@/types";
import {
  Button,
  Center,
  Container,
  HStack,
  Icon,
  Spinner,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { BsPlusLg } from "react-icons/bs";

const Page = () => {
  const router = useRouter();
  const toast = useToast();
  const { address, isSignedIn } = useAuth();
  const loadMoreRef = useRef(null);
  const [modules, setModules] = useState<ModuleRegistered[]>([]);

  const queryModules = useCallback(
    async ({ pageParam }: { pageParam: any }): Promise<ModuleRegistereds> => {
      const response = await axios.get<ModuleRegistereds>("/api/modules/list", {
        params: {
          page: pageParam,
        },
      });

      if (response.status !== 200) {
        const message = (response.data as any).message || "An error occurred";
        throw new Error(message);
      }

      return response.data;
    },
    []
  );

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery<ModuleRegistereds, Error>({
      queryKey: ["modules"],
      queryFn: queryModules,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        // stop fetching when there are no more paymasters
        if (lastPage.moduleRegistereds.length === 0) {
          return undefined;
        }

        return allPages.length + 1;
      },
      enabled: isSignedIn && !!address, // only fetch paymasters if user is signed in
      refetchOnMount: true,
    });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 1,
      }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    if (data) {
      setModules((prev) => {
        return data.pages.reduce((acc, page) => {
          const modules = page.moduleRegistereds.filter(
            (module) => !acc.some((m) => m.id === module.id)
          );
          return [...acc, ...modules];
        }, prev);
      });
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      const message =
        error instanceof Error ? error.message : "An error occurred";
      toast({
        title: "Error",
        description: message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [isError]);

  if (!isSignedIn) {
    return <CenteredMessage message="Please sign in to view modules" />;
  }

  return (
    <Container maxW={"6xl"} px="1.6rem" display="flex" flexDirection="column">
      <VStack spacing={8} py={12} flex="1">
        <HStack
          justifyContent={{ base: "center", md: "space-between" }}
          w="full"
          spacing={4}
        >
          <SearchBar
            placeholder="Search"
            value=""
            onChange={() => {}}
            size="md"
            width="auto"
            isDisabled={true}
          />
          <Button
            leftIcon={<Icon as={BsPlusLg} />}
            colorScheme="blue"
            _hover={{ bg: "blue.600" }}
            onClick={() => router.push("/modules/register")}
          >
            Register Module
          </Button>
        </HStack>
        {/* <PaymasterList paymasters={paymasters} isLoading={isLoading} /> */}
        <Center ref={loadMoreRef}>
          {data?.pages.length && isLoading && <Spinner size="lg" />}
        </Center>
      </VStack>
    </Container>
  );
};

export default Page;
