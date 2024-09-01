"use client";

import {
  Container,
  Button,
  Icon,
  HStack,
  VStack,
  useToast,
  Center,
  Spinner,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { BsPlusLg } from "react-icons/bs";
import { PaymasterCreated, PaymasterCreateds } from "@/types";
import { useAuth } from "@/hooks";
import { useCallback, useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import PaymasterList from "@/components/paymasters/list";
import SearchBar from "@/components/common/searchbar";
import CenteredMessage from "@/components/utils/message/CenteredMessage";

// TODO: Implement search functionality, improve infinite scroll
const Page = () => {
  const router = useRouter();
  const toast = useToast();
  const { address, isSignedIn } = useAuth();
  const loadMoreRef = useRef(null);
  const [paymasters, setPaymasters] = useState<PaymasterCreated[]>([]);

  const queryPaymasters = useCallback(
    async ({ pageParam }: { pageParam: any }): Promise<PaymasterCreateds> => {
      const response = await axios.get<PaymasterCreateds>(
        "/api/paymasters/list",
        {
          params: {
            page: pageParam,
          },
        }
      );

      if (response.status !== 200) {
        const message = (response.data as any).message || "An error occurred";
        throw new Error(message);
      }

      return response.data;
    },
    []
  );

  // fetch paymasters from server and cache them
  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery<PaymasterCreateds, Error>({
      queryKey: ["paymasters", address],
      queryFn: queryPaymasters,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        // stop fetching when there are no more paymasters
        if (lastPage.paymasterCreateds.length === 0) {
          return undefined;
        }

        return allPages.length + 1;
      },
      enabled: isSignedIn && !!address, // only fetch paymasters if user is signed in
      refetchOnMount: true,
    });

  // fetch next page when user scrolls to the bottom
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

  // populate paymasters from data
  useEffect(() => {
    if (data) {
      // remove duplicates
      setPaymasters((prev) => {
        return data.pages.reduce((acc, page) => {
          const paymasters = page.paymasterCreateds.filter(
            (paymaster) => !acc.some((p) => p.id === paymaster.id)
          );
          return [...acc, ...paymasters];
        }, prev);
      });
    }
  }, [data]);

  // show error toast when fetching paymasters fails
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

  // show sign in required message if user is not signed in
  if (!isSignedIn) {
    return <CenteredMessage message="Please sign in to view paymasters" />;
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
            size="lg"
            width="auto"
            isDisabled={true}
          />
          <Button
            size="lg"
            leftIcon={<Icon as={BsPlusLg} />}
            colorScheme="blue"
            _hover={{ bg: "blue.600" }}
            onClick={() => router.push("/paymasters/create")}
          >
            New Paymaster
          </Button>
        </HStack>
        <PaymasterList paymasters={paymasters} isLoading={isLoading} />
        <Center ref={loadMoreRef}>
          {/* Show spinner when loading more paymasters (not when loading the first page) */}
          {data?.pages.length && isLoading && <Spinner size="lg" />}
        </Center>
      </VStack>
    </Container>
  );
};

export default Page;
