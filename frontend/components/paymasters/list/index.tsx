import {
  Container,
  Button,
  InputGroup,
  InputLeftElement,
  Input,
  Icon,
  HStack,
  VStack,
  useToast,
  Center,
  Text,
  Box,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { Search2Icon } from "@chakra-ui/icons";
import { BsPlusLg } from "react-icons/bs";
import { PaymasterCreated, PaymasterCreateds } from "@/types";
import { useAuth } from "@/hooks";
import { useEffect, useRef, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import PaymasterList from "./PaymasterList";
import SignInRequired from "@/components/auth/SignInRequired";

const Paymasters = () => {
  const router = useRouter();
  const toast = useToast();
  const { address, isSignedIn } = useAuth();
  const loadMoreRef = useRef(null);
  const [paymasters, setPaymasters] = useState<PaymasterCreated[]>([]);

  const queryPaymasters = async ({
    pageParam,
  }: {
    pageParam: any;
  }): Promise<PaymasterCreateds> => {
    const response = await axios.get<PaymasterCreateds>("api/paymasters/list", {
      params: {
        page: pageParam,
      },
    });

    if (response.status !== 200) {
      const message = (response.data as any).message || "An error occurred";
      throw new Error(message);
    }

    return response.data;
  };

  const { data, fetchNextPage, hasNextPage, isLoading, isError, error } =
    useInfiniteQuery<PaymasterCreateds, Error>({
      queryKey: ["paymasters", address],
      queryFn: queryPaymasters,
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.paymasterCreateds.length === 0) {
          return undefined;
        }

        return allPages.length + 1;
      },
      enabled: isSignedIn,
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
      // remove duplicates
      const newPaymasters = data.pages.reduce((acc, page) => {
        const paymasters = page.paymasterCreateds.filter(
          (paymaster) => !acc.some((p) => p.id === paymaster.id)
        );
        return [...acc, ...paymasters];
      }, paymasters);

      setPaymasters(newPaymasters);
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
    return <SignInRequired message="Please sign in to manage paymasters" />;
  }

  return (
    <Container maxW={"6xl"} px="1.6rem" display="flex" flexDirection="column">
      <VStack spacing={8} py={12} flex="1">
        <HStack
          justifyContent={{ base: "center", md: "space-between" }}
          w="full"
          spacing={4}
        >
          <InputGroup size="md" w={"auto"}>
            <InputLeftElement pointerEvents="none">
              <Search2Icon color="gray.500" />
            </InputLeftElement>
            <Input type="text" placeholder="Search" />
          </InputGroup>
          <Button
            leftIcon={<Icon as={BsPlusLg} />}
            colorScheme="blue"
            _hover={{ bg: "blue.600" }}
            onClick={() => router.push("/paymasters/create")}
          >
            New Paymaster
          </Button>
        </HStack>
        <PaymasterList paymasters={paymasters} />
        <Center ref={loadMoreRef}>
          {hasNextPage && (
            <Text
              textAlign="center"
              fontSize="lg"
              color="gray.500"
              fontWeight="semibold"
            >
              Load More
            </Text>
          )}
        </Center>
      </VStack>
    </Container>
  );
};

export default Paymasters;
